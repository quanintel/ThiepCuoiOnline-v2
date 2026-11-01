import { Music, VolumeX } from 'lucide-react'

export interface MusicButtonProps {
  playing: boolean
  available: boolean
  onToggle: () => void
}

export function MusicButton({ playing, available, onToggle }: MusicButtonProps) {
  if (!available) {
    return null
  }

  const label = playing ? 'Tắt nhạc' : 'Bật nhạc'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={playing}
      title={label}
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-accent/40 bg-background/90 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 ${
        playing ? 'text-primary ring-2 ring-primary/20' : 'text-muted-foreground opacity-80'
      }`}
    >
      {playing ? (
        <Music className="h-5 w-5 animate-[spin_4s_linear_infinite]" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </button>
  )
}
