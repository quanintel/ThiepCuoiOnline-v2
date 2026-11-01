import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { buildIcs, googleCalendarUrl } from '@/lib/calendar'
import type { Ceremony } from '@/types'

export function AddToCalendar({ ceremony }: { ceremony: Ceremony }) {
  const [download, setDownload] = useState<'idle' | 'attempted' | 'error'>('idle')

  function downloadIcs() {
    try {
      const blob = new Blob([buildIcs(ceremony)], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      // Để trình duyệt nhận tệp trước khi thu hồi URL, kể cả khi click bị chặn.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      const link = document.createElement('a')
      link.href = url
      link.download = `${ceremony.id}.ics`
      document.body.append(link)
      try { link.click() } finally { link.remove() }
      setDownload('attempted')
    } catch {
      setDownload('error')
    }
  }

  return (
    <div className="space-y-3 text-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button type="button" className="min-h-11">Thêm vào lịch</Button></DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem asChild>
            <a href={googleCalendarUrl(ceremony)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={downloadIcs}>Tải .ics</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {download !== 'idle' && (
        <p role={download === 'error' ? 'alert' : 'status'} className="text-sm text-muted-foreground">
          Hãy mở thiệp bằng trình duyệt hoặc dùng Google Calendar
        </p>
      )}
    </div>
  )
}
