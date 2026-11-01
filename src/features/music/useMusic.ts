import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseMusicReturn {
  playing: boolean
  available: boolean
  play: () => Promise<void>
  toggle: () => void
}

export function useMusic(src?: string | null): UseMusicReturn {
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState<boolean>(Boolean(src))
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const userWantsPlayRef = useRef(false)

  useEffect(() => {
    if (!src || typeof window === 'undefined') {
      setAvailable(false)
      setPlaying(false)
      return
    }

    try {
      const audio = new Audio()
      audio.loop = true
      audio.preload = 'none'
      audio.src = src
      audioRef.current = audio
      setAvailable(true)

      const handleError = () => {
        setAvailable(false)
        setPlaying(false)
        userWantsPlayRef.current = false
      }

      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('error', handleError)
        audio.pause()
        audioRef.current = null
      }
    } catch {
      setAvailable(false)
      setPlaying(false)
    }
  }, [src])

  const play = useCallback(async () => {
    if (!audioRef.current || !available) {
      setPlaying(false)
      return
    }

    try {
      await audioRef.current.play()
      setPlaying(true)
      userWantsPlayRef.current = true
    } catch {
      // Autoplay bị chặn hoặc file không tồn tại
      setPlaying(false)
      setAvailable(false)
      userWantsPlayRef.current = false
    }
  }, [available])

  const pause = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause()
      } catch {
        // Dự phòng
      }
    }
    setPlaying(false)
    userWantsPlayRef.current = false
  }, [])

  const toggle = useCallback(() => {
    if (playing) {
      pause()
    } else {
      void play()
    }
  }, [playing, pause, play])

  // Xử lý tạm dừng khi tab bị ẩn và phát lại khi tab hiển thị
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof document === 'undefined') return

      if (document.hidden) {
        if (playing && audioRef.current) {
          try {
            audioRef.current.pause()
          } catch {}
        }
      } else {
        if (userWantsPlayRef.current && available && audioRef.current) {
          audioRef.current.play().catch(() => {
            // Không ném lỗi nếu trình duyệt chặn phát lại
          })
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [playing, available])

  return { playing, available, play, toggle }
}
