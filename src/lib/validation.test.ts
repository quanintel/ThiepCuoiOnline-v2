import { expect, expectTypeOf, it } from 'vitest'
import type { z } from 'zod'
import { rsvpSchema, wishSchema } from '@/lib/validation'
import type { RsvpInput, WishInput } from '@/types'

const valid = { name: 'Nguyễn A', attendance: 'both', guests: 1 }

it.each(['', '   ', 'a'.repeat(61)])('cả hai schema từ chối tên không hợp lệ %j', (name) => {
  expect(rsvpSchema.safeParse({ ...valid, name }).success).toBe(false)
  expect(wishSchema.safeParse({ name, message: 'Chúc mừng!' }).success).toBe(false)
})

it('chấp nhận tên 60 ký tự và trim trước khi kiểm giới hạn', () => {
  const name = 'a'.repeat(60)
  expect(rsvpSchema.parse({ ...valid, name: ` ${name} ` }).name).toBe(name)
  expect(wishSchema.parse({ name, message: 'Chúc mừng!' }).name).toBe(name)
})

it.each([0, 11, 1.5, '2', NaN])('từ chối số khách %s', (guests) => {
  expect(rsvpSchema.safeParse({ ...valid, guests }).success).toBe(false)
})
it.each([1, 10])('chấp nhận số khách biên %i', (guests) => {
  expect(rsvpSchema.safeParse({ ...valid, guests }).success).toBe(true)
})
it.each(['vuquy', 'thanhhon', 'both', 'none'])('chấp nhận attendance %s', (attendance) => {
  expect(rsvpSchema.safeParse({ ...valid, attendance }).success).toBe(true)
})
it('từ chối attendance ngoài danh mục', () => {
  expect(rsvpSchema.safeParse({ ...valid, attendance: 'maybe' }).success).toBe(false)
})
it('lời nhắn RSVP không bắt buộc, tối đa 300 ký tự sau trim', () => {
  expect(rsvpSchema.safeParse(valid).success).toBe(true)
  expect(rsvpSchema.safeParse({ ...valid, note: '' }).success).toBe(true)
  expect(rsvpSchema.parse({ ...valid, note: ` ${'a'.repeat(300)} ` }).note).toHaveLength(300)
  expect(rsvpSchema.safeParse({ ...valid, note: 'a'.repeat(301) }).success).toBe(false)
})
it.each(['', '   ', 'a'.repeat(301)])('từ chối lời chúc ngoài giới hạn %j', (message) => {
  expect(wishSchema.safeParse({ name: 'A', message }).success).toBe(false)
})
it('chấp nhận lời chúc 1 và 300 ký tự, giữ văn bản thuần', () => {
  for (const message of ['a', 'a'.repeat(300), '<img src=x onerror=alert(1)>']) {
    expect(wishSchema.parse({ name: ' A ', message: ` ${message} ` })).toEqual({ name: 'A', message })
  }
})
it('trim tên, note; giữ honeypot để form nhận diện bot', () => {
  expect(rsvpSchema.parse({ ...valid, name: ' Nguyễn A ', note: ' Hẹn gặp ', hp: 'bot' })).toEqual({
    ...valid, note: 'Hẹn gặp', hp: 'bot',
  })
})
it('kiểu đầu ra khớp giao diện dùng chung', () => {
  expectTypeOf<z.infer<typeof rsvpSchema>>().toEqualTypeOf<RsvpInput>()
  expectTypeOf<z.infer<typeof wishSchema>>().toEqualTypeOf<WishInput>()
})
