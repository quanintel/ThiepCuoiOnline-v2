import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() })

it('mặc định dùng mock khi chưa có cấu hình', async () => {
  vi.stubEnv('VITE_USE_MOCK', undefined)
  vi.stubEnv('VITE_API_URL', undefined)
  vi.stubEnv('VITE_SITE_URL', undefined)
  const { env } = await import('@/config/env')
  expect(env).toEqual({ apiUrl: '', useMock: true, siteUrl: 'https://thiep.example.com' })
})

it('báo lỗi rõ khi tắt mock mà thiếu URL API', async () => {
  vi.stubEnv('VITE_USE_MOCK', 'false')
  vi.stubEnv('VITE_API_URL', '  ')
  await expect(import('@/config/env')).rejects.toThrow('VITE_API_URL')
})

it('đọc cấu hình thật khi đã cung cấp URL', async () => {
  vi.stubEnv('VITE_USE_MOCK', 'false')
  vi.stubEnv('VITE_API_URL', 'https://script.google.com/macros/s/example/exec')
  vi.stubEnv('VITE_SITE_URL', 'https://wedding.example.com')
  const { env } = await import('@/config/env')
  expect(env.useMock).toBe(false)
  expect(env.apiUrl).toBe('https://script.google.com/macros/s/example/exec')
  expect(env.siteUrl).toBe('https://wedding.example.com')
})
