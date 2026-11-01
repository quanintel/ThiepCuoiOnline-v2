import { afterEach, expect, it, vi } from 'vitest'
import { ceremonies } from '@/config/content'
import { buildIcs, googleCalendarUrl } from '@/lib/calendar'

afterEach(() => vi.useRealTimers())

it.each([
  [0, '20261124T130000/20261124T160000'],
  [1, '20261124T170000/20261124T200000'],
] as const)('link Google Calendar giữ giờ VN và thời lượng 3 giờ cho lễ %i', (index, dates) => {
  const ceremony = ceremonies[index]
  const url = new URL(googleCalendarUrl(ceremony))
  expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render')
  expect(url.searchParams.get('action')).toBe('TEMPLATE')
  expect(url.searchParams.get('text')).toBe(ceremony.title)
  expect(url.searchParams.get('location')).toContain(ceremony.address)
  expect(url.searchParams.get('dates')).toBe(dates)
  expect(url.searchParams.get('ctz')).toBe('Asia/Ho_Chi_Minh')
})

it('ICS có timezone, UID, DTSTAMP, giờ bắt đầu/kết thúc và dòng CRLF', () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-01T10:00:00Z'))
  const ics = buildIcs(ceremonies[0])
  const unfolded = ics.replace(/\r\n /g, '')
  expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
  expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
  expect(ics.replaceAll('\r\n', '')).not.toMatch(/[\r\n]/)
  expect(unfolded).toContain('BEGIN:VTIMEZONE\r\nTZID:Asia/Ho_Chi_Minh')
  expect(unfolded).toContain('DTSTART;TZID=Asia/Ho_Chi_Minh:20261124T130000')
  expect(unfolded).toContain('DTEND;TZID=Asia/Ho_Chi_Minh:20261124T160000')
  expect(unfolded).toContain('SUMMARY:Lễ Vu Quy')
  expect(unfolded).toContain('LOCATION:Tại Tư Gia\\, Thôn Phú Cường\\, Ngọc Thiện\\, Bắc Ninh')
  expect(unfolded).toMatch(/\r\nUID:[^\r\n]+/)
  expect(unfolded).toContain('DTSTAMP:20261101T100000Z')
})

it('escape dấu câu và xuống dòng, gấp dòng theo byte mà không cắt ký tự tiếng Việt', () => {
  const title = 'Lễ, cưới; \\ Đôi bạn\nBEGIN:VEVENT'
  const address = 'Đường Nguyễn Thị Minh Khai '.repeat(8)
  const ics = buildIcs({ ...ceremonies[0], title, address })
  expect(ics.replace(/\r\n /g, '')).toContain('SUMMARY:Lễ\\, cưới\\; \\\\ Đôi bạn\\nBEGIN:VEVENT')
  expect(ics.replace(/\r\n /g, '')).toContain(address)
  for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
  expect(ics).not.toContain('\uFFFD')
})

it('kết thúc đúng ngày hôm sau khi lễ bắt đầu muộn', () => {
  const ceremony = { ...ceremonies[0], startsAt: '2026-11-24T23:00:00+07:00' }
  expect(new URL(googleCalendarUrl(ceremony)).searchParams.get('dates')).toBe('20261124T230000/20261125T020000')
})
