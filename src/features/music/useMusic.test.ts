import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMusic } from './useMusic'

describe('useMusic Hook', () => {
  let playMock: ReturnType<typeof vi.fn>
  let pauseMock: ReturnType<typeof vi.fn>
  let addEventListenerMock: ReturnType<typeof vi.fn>
  let removeEventListenerMock: ReturnType<typeof vi.fn>
  let audio: { preload: string; src: string }

  beforeEach(() => {
    playMock = vi.fn().mockResolvedValue(undefined)
    pauseMock = vi.fn()
    addEventListenerMock = vi.fn()
    removeEventListenerMock = vi.fn()

    class MockAudio {
      play = playMock
      pause = pauseMock
      addEventListener = addEventListenerMock
      removeEventListener = removeEventListenerMock
      loop = false
      preload = ''
      src = ''

      constructor(src?: string) {
        audio = this
        if (src) this.src = src
      }
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('không preload tệp nhạc trước thao tác mở thiệp', () => {
    renderHook(() => useMusic('/mp3/music.mp3'))
    expect(audio.preload).toBe('none')
    expect(audio.src).toBe('/mp3/music.mp3')
    expect(playMock).not.toHaveBeenCalled()
  })

  it('play() thành công thì playing = true và available = true', async () => {
    const { result } = renderHook(() => useMusic('/audio/test.mp3'))

    expect(result.current.playing).toBe(false)
    expect(result.current.available).toBe(true)

    await act(async () => {
      await result.current.play()
    })

    expect(playMock).toHaveBeenCalled()
    expect(result.current.playing).toBe(true)
    expect(result.current.available).toBe(true)
  })

  it('play() bị từ chối (lỗi hoặc chặn autoplay) thì playing = false, available = false và không ném lỗi', async () => {
    playMock.mockRejectedValueOnce(new Error('NotAllowedError'))

    const { result } = renderHook(() => useMusic('/audio/test.mp3'))

    await act(async () => {
      await expect(result.current.play()).resolves.toBeUndefined()
    })

    expect(result.current.playing).toBe(false)
    expect(result.current.available).toBe(false)
  })

  it('toggle() đổi trạng thái qua lại giữa phát và dừng', async () => {
    const { result } = renderHook(() => useMusic('/audio/test.mp3'))

    // Lần 1: Bật nhạc
    await act(async () => {
      result.current.toggle()
    })
    expect(result.current.playing).toBe(true)
    expect(playMock).toHaveBeenCalledTimes(1)

    // Lần 2: Tắt nhạc
    act(() => {
      result.current.toggle()
    })
    expect(result.current.playing).toBe(false)
    expect(pauseMock).toHaveBeenCalledTimes(1)
  })

  it('khi trang bị ẩn (document.hidden = true) thì gọi pause', async () => {
    const { result } = renderHook(() => useMusic('/audio/test.mp3'))

    await act(async () => {
      await result.current.play()
    })
    expect(result.current.playing).toBe(true)

    // Giả lập chuyển tab / ẩn trang
    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(pauseMock).toHaveBeenCalled()
  })

  it('nếu không truyền src thì available = false', () => {
    const { result } = renderHook(() => useMusic(null))
    expect(result.current.available).toBe(false)
    expect(result.current.playing).toBe(false)
  })
})
