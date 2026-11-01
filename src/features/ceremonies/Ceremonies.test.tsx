import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Ceremonies } from './Ceremonies'

describe('Ceremonies Component', () => {
  it('hiển thị tiêu đề thông tin lễ cưới và tên cô dâu chú rể', () => {
    render(<Ceremonies />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Thông tin lễ cưới')
    expect(
      screen.getByText('Trưởng nam Kiều Anh Quân & Trưởng nữ Tôn Mai Hương')
    ).toBeInTheDocument()
  })

  it('hiển thị cả hai thẻ lễ Vu Quy và Thành Hôn', () => {
    render(<Ceremonies />)

    expect(screen.getByText('LỄ VU QUY')).toBeInTheDocument()
    expect(screen.getByText('LỄ THÀNH HÔN')).toBeInTheDocument()
  })

  it('thấy đủ bốn tên bố mẹ đúng chính tả', () => {
    render(<Ceremonies />)

    // Nhà trai
    expect(screen.getByText('Kiều Văn Nghĩa')).toBeInTheDocument()
    expect(screen.getByText('Nguyễn Thị Phương Lan')).toBeInTheDocument()

    // Nhà gái
    expect(screen.getByText('Đào Duy Hồng')).toBeInTheDocument()
    expect(screen.getByText('Dương Thị Hải')).toBeInTheDocument()
  })

  it('tuyệt đối không có "Lời cảm tạ"', () => {
    const { container } = render(<Ceremonies />)
    expect(container.textContent).not.toContain('Lời cảm tạ')
  })
})
