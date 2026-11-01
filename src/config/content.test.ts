import { describe, expect, it } from 'vitest'
import { content } from '@/config/content'

describe('nội dung thiệp theo BA-05', () => {
  it('giữ đúng giờ Việt Nam cho hai lễ', () => {
    expect(content.ceremonies.map(({ id, startsAt }) => [id, startsAt])).toEqual([
      ['vuquy', '2026-11-24T13:00:00+07:00'],
      ['thanhhon', '2026-11-24T17:00:00+07:00'],
    ])
  })

  it('chỉ Vu Quy có địa chỉ cũ', () => {
    expect(content.ceremonies[0].oldAddress).toBe('Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang')
    expect(content.ceremonies[1]).not.toHaveProperty('oldAddress')
  })

  it('không dùng địa điểm đã bỏ', () => {
    expect(JSON.stringify(content)).not.toContain('Sân bóng')
  })

  it('không có chữ "Chúng tôi" trong nội dung', () => {
    expect(JSON.stringify(content)).not.toContain('Chúng tôi')
  })

  it('giữ nguyên tên cặp đôi và gia đình', () => {
    expect(content.couple.map(({ name }) => name)).toEqual(['Kiều Anh Quân', 'Tôn Mai Hương'])
    expect(content.families).toEqual([
      { side: 'groom', father: 'Kiều Văn Nghĩa', mother: 'Nguyễn Thị Phương Lan' },
      { side: 'bride', father: 'Đào Duy Hồng', mother: 'Dương Thị Hải' },
    ])
  })
})
