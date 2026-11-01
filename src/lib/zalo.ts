/** Địa chỉ mở ứng dụng Zalo trên điện thoại. Zalo không công bố địa chỉ mở thẳng màn hình quét QR,
 * nên chỉ mở ứng dụng; người dùng bấm biểu tượng quét QR rồi chọn ảnh QR vừa lưu. */
export const ZALO_APP_URL = 'zalo://'

interface OpenZaloOptions {
  /** Cách điều hướng, tách ra để test. Mặc định đổi location của trình duyệt. */
  navigate?: (url: string) => void
  /** Thời gian chờ (ms) để xem Zalo có mở không. */
  wait?: number
}

/** Thử mở Zalo. Trả true nếu trang bị ẩn/mất focus (ứng dụng đã mở), false nếu không thấy dấu hiệu nào. */
export function openZalo({ navigate = (url) => { window.location.href = url }, wait = 1500 }: OpenZaloOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    let done = false
    const finish = (opened: boolean) => {
      if (done) return
      done = true
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('blur', onHide)
      window.clearTimeout(timer)
      resolve(opened)
    }
    const onVisibility = () => { if (document.hidden) finish(true) }
    const onHide = () => finish(true)

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onHide)
    window.addEventListener('blur', onHide)
    const timer = window.setTimeout(() => finish(false), wait)

    try {
      navigate(ZALO_APP_URL)
    } catch {
      finish(false)
    }
  })
}
