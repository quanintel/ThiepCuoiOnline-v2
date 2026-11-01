import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { executablePath } from '../chromium.ts'

const label = process.argv[2]
assert(['before', 'after'].includes(label), 'Usage: node tests/performance/lighthouse.mjs before|after')
const origin = process.env.AUDIT_URL || 'http://127.0.0.1:4173'
const directory = resolve('test-results/lighthouse')
await mkdir(directory, { recursive: true })
const runs = []
let metadata
for (let index = 1; index <= 3; index++) {
  const output = resolve(directory, `${label}-${index}`)
  await promisify(execFile)(process.execPath, [
    'node_modules/lighthouse/cli/index.js', origin,
    '--chrome-flags=--headless=new --no-sandbox', '--only-categories=performance',
    '--output=json', '--output=html', `--output-path=${output}`, '--quiet',
  ], { env: { ...process.env, CHROME_PATH: executablePath } })
  const report = JSON.parse(await readFile(`${output}.report.json`, 'utf8'))
  metadata = { lighthouseVersion: report.lighthouseVersion, userAgent: report.userAgent, throttling: report.configSettings.throttling }
  assert(!report.runtimeError, JSON.stringify(report.runtimeError))
  const scripts = report.audits['network-requests'].details.items
    .filter((item) => item.resourceType === 'Script' && item.url.startsWith(origin))
  let initialJsGzipBytes = 0
  for (const url of new Set(scripts.map((item) => item.url))) {
    initialJsGzipBytes += gzipSync(await readFile(resolve('dist', `.${new URL(url).pathname}`))).length
  }
  const metrics = {
    performance: Math.round(report.categories.performance.score * 100),
    lcpMs: report.audits['largest-contentful-paint'].numericValue,
    cls: report.audits['cumulative-layout-shift'].numericValue,
    tbtMs: report.audits['total-blocking-time'].numericValue,
    initialJsGzipBytes,
  }
  assert(Number.isFinite(metrics.lcpMs) && metrics.initialJsGzipBytes > 0)
  runs.push(metrics)
  console.log(label, index, JSON.stringify(metrics))
}
const median = (key) => runs.map((run) => run[key]).sort((a, b) => a - b)[1]
const summary = {
  measuredAt: new Date().toISOString(), url: origin,
  ...metadata,
  conditions: 'Lighthouse mobile defaults, simulated slow 4G, cold navigation, Vite preview',
  note: 'Navigation measures the cover. Opened-page interaction/accessibility is checked by Playwright.',
  runs, median: Object.fromEntries(Object.keys(runs[0]).map((key) => [key, median(key)])),
}
await writeFile(resolve('tests/performance', `${label}.json`), `${JSON.stringify(summary, null, 2)}\n`)
console.log('median', JSON.stringify(summary.median))
