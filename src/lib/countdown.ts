export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function getRemaining(target: Date, now: Date): Remaining {
  const milliseconds = target.getTime() - now.getTime()
  const total = Math.max(0, Math.floor(milliseconds / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
    done: milliseconds <= 0,
  }
}
