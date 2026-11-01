import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { openZalo, ZALO_APP_URL } from './zalo'

describe('openZalo', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  })

  it('điều hướng tới địa chỉ mở ứng dụng Zalo', () => {
    const navigate = vi.fn()
    void openZalo({ navigate })
    expect(navigate).toHaveBeenCalledWith(ZALO_APP_URL)
  })

  it('trả true khi trang bị ẩn đi (Zalo đã mở) trước hạn chờ', async () => {
    const result = openZalo({ navigate: vi.fn(), wait: 1500 })
    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    await expect(result).resolves.toBe(true)
  })

  it('trả false khi hết hạn chờ mà trang vẫn hiện (Zalo không mở)', async () => {
    const result = openZalo({ navigate: vi.fn(), wait: 1500 })
    await vi.advanceTimersByTimeAsync(1600)
    await expect(result).resolves.toBe(false)
  })

  it('không ném lỗi khi điều hướng thất bại', async () => {
    const result = openZalo({
      navigate: () => {
        throw new Error('blocked')
      },
      wait: 100,
    })
    await expect(result).resolves.toBe(false)
  })
})
