const storageKey = (key: string) => `thiep-cuoi:submitted:${key}`

export function canSubmit(key: string, now = Date.now()): boolean {
  try {
    const stored = localStorage.getItem(storageKey(key))
    if (stored === null || stored.trim() === '') return true
    const previous = Number(stored)
    return !Number.isFinite(previous) || now < previous || now - previous >= 30_000
  } catch {
    return true
  }
}

export function markSubmitted(key: string, now = Date.now()): void {
  try {
    localStorage.setItem(storageKey(key), String(now))
  } catch {
    // Storage có thể bị chặn; chống spam phía server vẫn là lớp bảo vệ bắt buộc.
  }
}
