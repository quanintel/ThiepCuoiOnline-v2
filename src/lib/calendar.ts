import type { Ceremony } from '@/types'

const timezone = 'Asia/Ho_Chi_Minh'
const vietnamOffset = 7 * 60 * 60 * 1000
// Thời lượng mỗi lễ giả định 3 giờ (chủ thiệp không dùng lịch trình chi tiết).
const duration = 3 * 60 * 60 * 1000
const compact = (date: Date) => date.toISOString().replace(/[-:]/g, '').slice(0, 15)
const localTime = (time: number) => compact(new Date(time + vietnamOffset))
const location = (c: Ceremony) => `${c.placeLabel}, ${c.address}`

export function googleCalendarUrl(c: Ceremony): string {
  const start = new Date(c.startsAt).getTime()
  const params = new URLSearchParams({
    action: 'TEMPLATE', text: c.title, location: location(c),
    dates: `${localTime(start)}/${localTime(start + duration)}`, ctz: timezone,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/[,;]/g, '\\$&')
}

function foldLine(line: string): string {
  const encoder = new TextEncoder()
  let result = ''
  let bytes = 0
  for (const character of line) {
    const length = encoder.encode(character).length
    if (bytes + length > 75) { result += '\r\n '; bytes = 1 }
    result += character
    bytes += length
  }
  return result
}

export function buildIcs(c: Ceremony): string {
  const start = new Date(c.startsAt).getTime()
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thiep Cuoi Online//VI', 'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE', `TZID:${timezone}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0700', 'TZOFFSETTO:+0700', 'TZNAME:+07', 'END:STANDARD', 'END:VTIMEZONE',
    'BEGIN:VEVENT', `UID:${c.id}-${start}@thiep-cuoi-online`, `DTSTAMP:${compact(new Date())}Z`,
    `DTSTART;TZID=${timezone}:${localTime(start)}`, `DTEND;TZID=${timezone}:${localTime(start + duration)}`,
    `SUMMARY:${escapeText(c.title)}`, `LOCATION:${escapeText(location(c))}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].map(foldLine).join('\r\n')
}
