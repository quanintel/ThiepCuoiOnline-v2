export const env = {
  apiUrl: import.meta.env.VITE_API_URL?.trim() || '',
  useMock: import.meta.env.VITE_USE_MOCK !== 'false',
  siteUrl: import.meta.env.VITE_SITE_URL?.trim() || 'https://thiep.example.com',
}

if (!env.useMock && !env.apiUrl) {
  throw new Error('Thiếu VITE_API_URL: hãy cung cấp URL Apps Script hoặc bật VITE_USE_MOCK=true.')
}
