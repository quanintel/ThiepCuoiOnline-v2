import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useOpenInvitation } from './useOpenInvitation'

describe('useOpenInvitation', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('khoá cuộn body khi chưa mở và mở cuộn khi open', () => {
    const { result } = renderHook(() => useOpenInvitation())

    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.overflow).toBe('hidden')

    act(() => {
      result.current.open()
    })

    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.overflow).toBe('')
  })

  it('open hai lần chỉ gọi onOpen đúng một lần', () => {
    const onOpen = vi.fn()
    const { result } = renderHook(() => useOpenInvitation(onOpen))

    act(() => {
      result.current.open()
    })
    act(() => {
      result.current.open()
    })

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('khôi phục thuộc tính cuộn khi unmount', () => {
    const { unmount } = renderHook(() => useOpenInvitation())
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
