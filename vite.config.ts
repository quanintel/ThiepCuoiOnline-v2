import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const variables = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (variables.VITE_SITE_URL || 'https://thiep.example.com').replace(/\/$/, '')
  const base = variables.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [react(), tailwindcss(), {
      name: 'invitation-meta',
      transformIndexHtml: (html) => html
        .replaceAll('%SITE_URL%', new URL(base, `${siteUrl}/`).href)
        .replaceAll('%OG_IMAGE_URL%', new URL(`${base.replace(/\/$/, '')}/og-image.jpg`, `${siteUrl}/`).href),
    }],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    test: { include: ['src/**/*.test.{ts,tsx}'], environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], css: false },
  }
})
