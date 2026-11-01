import { existsSync, globSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const expected = chromium.executablePath()
const cache = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'ms-playwright') : undefined
const installed = process.platform === 'win32' && cache
  ? globSync('chromium-*/chrome-win64/chrome.exe', { cwd: cache }).sort().map((file) => join(cache, file)).at(-1)
  : undefined

export const executablePath = process.env.CHROME_PATH || (existsSync(expected) ? expected : installed || expected)
