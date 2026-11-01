import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Section } from '@/components/Section'

it('gắn nhãn section bằng tiêu đề và giữ nội dung', () => {
  render(<Section id="rsvp" title="Xác nhận tham dự"><p>Nội dung form</p></Section>)
  expect(screen.getByRole('region', { name: 'Xác nhận tham dự' })).toHaveAttribute('id', 'rsvp')
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Xác nhận tham dự')
  expect(screen.getByText('Nội dung form')).toBeInTheDocument()
})

it('cho phép section không có tiêu đề', () => {
  const { container } = render(<Section id="closing">Lời kết</Section>)
  expect(container.querySelector('#closing')).toHaveTextContent('Lời kết')
  expect(screen.queryByRole('heading')).not.toBeInTheDocument()
})
