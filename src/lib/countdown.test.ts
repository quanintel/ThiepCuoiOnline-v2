/// <reference types="node" />
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { expect, it } from 'vitest'
import { getRemaining } from '@/lib/countdown'

const target = new Date('2026-11-24T13:00:00+07:00')

it('tách chính xác ngày, giờ, phút và giây', () => {
  expect(getRemaining(target, new Date(target.getTime() - 93_784_000))).toEqual({
    days: 1, hours: 2, minutes: 3, seconds: 4, done: false,
  })
})

it.each([0, 1, 60_000])('không có số âm tại hoặc sau giờ lễ (%i ms)', (offset) => {
  expect(getRemaining(target, new Date(target.getTime() + offset))).toEqual({
    days: 0, hours: 0, minutes: 0, seconds: 0, done: true,
  })
})

it('không kết thúc sớm khi còn dưới một giây', () => {
  expect(getRemaining(target, new Date(target.getTime() - 500)).done).toBe(false)
})

it('giữ cùng kết quả trong các tiến trình có TZ khác nhau', () => {
  const code = `import { getRemaining } from './src/lib/countdown.ts';
    console.log(JSON.stringify(getRemaining(new Date('2026-11-24T13:00:00+07:00'), new Date('2026-11-23T10:56:56+07:00'))))`
  const results = ['UTC', 'America/Los_Angeles', 'Asia/Ho_Chi_Minh'].map((TZ) =>
    JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', code], {
      env: { ...process.env, TZ }, encoding: 'utf8',
    })),
  )
  results.forEach((result) => expect(result).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4, done: false }))
})
