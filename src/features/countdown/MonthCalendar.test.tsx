import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MonthCalendar } from '@/features/countdown/MonthCalendar'

it('hiện lịch có nhãn cột và đánh dấu riêng ngày cưới 24', () => {
  const { container } = render(<MonthCalendar year={2026} month={11} highlight={24} />)
  expect(screen.getByRole('table', { name: 'Tháng 11/2026' })).toBeInTheDocument()
  expect(screen.getAllByRole('columnheader')).toHaveLength(7)
  expect(screen.getByText('24').closest('mark')).toHaveAccessibleName('Ngày 24, ngày cưới')
  expect(container.querySelectorAll('mark')).toHaveLength(1)
  expect(screen.getByText('24').closest('td')?.cellIndex).toBe(2)
})
