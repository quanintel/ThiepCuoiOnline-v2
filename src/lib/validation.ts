import { z } from 'zod'

const name = z.string({ error: 'Vui lòng nhập họ tên.' }).trim()
  .min(1, 'Vui lòng nhập họ tên.').max(60, 'Họ tên tối đa 60 ký tự.')

export const rsvpSchema = z.object({
  name,
  attendance: z.enum(['vuquy', 'thanhhon', 'both', 'none'], { error: 'Vui lòng chọn lễ tham dự.' }),
  guests: z.number({ error: 'Số người phải là số nguyên từ 1 đến 10.' })
    .int('Số người phải là số nguyên.').min(1, 'Số người ít nhất là 1.').max(10, 'Số người tối đa là 10.'),
  note: z.string().trim().max(300, 'Lời nhắn tối đa 300 ký tự.').optional(),
  hp: z.string().optional(),
})

export const wishSchema = z.object({
  name,
  message: z.string({ error: 'Vui lòng nhập lời chúc.' }).trim()
    .min(1, 'Vui lòng nhập lời chúc.').max(300, 'Lời chúc tối đa 300 ký tự.'),
  hp: z.string().optional(),
})
