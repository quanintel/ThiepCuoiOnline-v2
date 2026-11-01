import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { test, expect, openInvitation } from './fixtures'

test('axe: không còn serious/critical sau khi mở thiệp', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openInvitation(page)
  for (const id of ['album', 'rsvp', 'guestbook', 'gift']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
  }
  await expect(page.getByRole('form', { name: 'Gửi lời chúc' })).toBeAttached()
  async function scan(name: string) {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    await testInfo.attach(name, { body: JSON.stringify(result.violations, null, 2), contentType: 'application/json' })
    expect(result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([])
  }
  await scan('axe-opened')
  await page.getByRole('button', { name: 'Mừng cưới chú rể - Nhấn để mở' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await scan('axe-qr')
  await page.keyboard.press('Escape')
  await page.locator('#album').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /Xem ảnh lớn:/ }).first().click()
  await expect(page.getByRole('dialog', { name: 'Xem ảnh phóng to' })).toBeVisible()
  await scan('axe-lightbox')
})

test('bàn phím: RSVP, mở/đóng QR và lightbox, trả focus về nút mở', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Mở thiệp', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#cover-overlay')).toBeHidden()
  await page.locator('#rsvp').scrollIntoViewIfNeeded()
  const form = page.getByRole('form', { name: 'Xác nhận tham dự' })
  const name = form.getByRole('textbox', { name: 'Họ tên' })
  await name.focus()
  await page.keyboard.type('Khách dùng bàn phím')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Space')
  await expect(form.getByRole('radio', { name: 'Lễ Vu Quy' })).toBeChecked()
  await page.keyboard.down('ArrowDown')
  await expect(form.getByRole('radio', { name: 'Lễ Thành Hôn' })).toBeFocused()
  await page.keyboard.up('ArrowDown')
  await expect(form.getByRole('radio', { name: 'Lễ Thành Hôn' })).toBeChecked()
  await page.keyboard.press('Tab')
  await expect(form.getByRole('spinbutton', { name: 'Số người' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(form.getByRole('textbox', { name: 'Lời nhắn' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(form.getByRole('button', { name: 'Gửi xác nhận' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(form.getByRole('status')).toContainText('Cảm ơn bạn!')

  await page.locator('#gift').scrollIntoViewIfNeeded()
  const gift = page.getByRole('button', { name: 'Mừng cưới chú rể - Nhấn để mở' })
  await gift.focus()
  await page.keyboard.press('Enter')
  const qr = page.getByRole('dialog', { name: 'Mừng cưới chú rể' })
  await expect(qr).toBeVisible()
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab')
    expect(await qr.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(qr).toBeHidden()
  await expect(gift).toBeFocused()

  await page.locator('#album').scrollIntoViewIfNeeded()
  const photo = page.getByRole('button', { name: /Xem ảnh lớn:/ }).first()
  await photo.focus()
  await page.keyboard.press('Enter')
  const lightbox = page.getByRole('dialog', { name: 'Xem ảnh phóng to' })
  await expect(lightbox).toBeVisible()
  for (let index = 0; index < 5; index++) {
    await page.keyboard.press('Tab')
    expect(await lightbox.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(lightbox).toBeHidden()
  await expect(photo).toBeFocused()
})

test('JS tải ban đầu ≤ 120 KB gzip, phần dưới chưa tải; giảm chuyển động vẫn đọc được', async ({ page }, testInfo) => {
  const scripts = new Set<string>()
  const mediaRequests: string[] = []
  page.on('request', (request) => { if (request.resourceType() === 'media') mediaRequests.push(request.url()) })
  page.on('response', (response) => {
    if (response.request().resourceType() === 'script') scripts.add(new URL(response.url()).pathname)
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  let bytes = 0
  for (const path of scripts) bytes += gzipSync(await readFile(`dist${path}`)).length
  await testInfo.attach('initial-js', { body: JSON.stringify({ gzipBytes: bytes, scripts: [...scripts] }), contentType: 'application/json' })
  expect(bytes).toBeLessThanOrEqual(120_000)
  expect(mediaRequests, 'Nhạc chỉ tải sau thao tác mở thiệp').toEqual([])
  expect([...scripts].some((path) => /QrDialog|RsvpForm|Guestbook|Album/.test(path))).toBe(false)
  await page.getByRole('button', { name: 'Mở thiệp', exact: true }).click()
  await expect(page.locator('#cover-overlay')).toBeHidden()
  await expect(page.locator('#hero')).toHaveCSS('opacity', '1')
  expect(await page.locator('#hero').evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s')
})
