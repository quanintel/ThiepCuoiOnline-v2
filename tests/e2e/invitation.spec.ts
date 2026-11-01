import { test, expect, openInvitation } from './fixtures'

test('Cover → Mở thiệp → Cô dâu chú rể đúng copy', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Anh Quân & Mai Hương')
  await page.getByRole('button', { name: 'Mở thiệp', exact: true }).click()
  await expect(page.locator('#cover-overlay')).toBeHidden()
  const couple = page.locator('#couple')
  await expect(couple.getByRole('heading', { name: 'Cô dâu & chú rể' })).toBeVisible()
  await expect(couple.getByText('Kiều Anh Quân')).toBeVisible()
  await expect(couple.getByText('Tôn Mai Hương')).toBeVisible()
  await expect(page.locator('main')).not.toContainText('Chúng tôi')
})

test('hai thẻ lễ giữ đúng giờ, địa điểm và địa chỉ cũ', async ({ page }) => {
  await openInvitation(page)
  const section = page.locator('#ceremonies')
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByRole('heading', { name: /^Lễ Vu Quy$/i })).toBeVisible()
  await expect(section.getByRole('heading', { name: /^Lễ Thành Hôn$/i })).toBeVisible()
  for (const text of ['13:00', '17:00', 'Tại Tư Gia', 'Minh Dương Palace',
    'Thôn Phú Cường, Ngọc Thiện, Bắc Ninh', 'Thôn An Lạc 1, Việt Ngọc, Tân Yên, Bắc Giang',
    'Số 98 Hồng Đô, Phú Đô, Từ Liêm, Hà Nội']) {
    await expect(section).toContainText(text)
  }
  await expect(section.getByText(/24\.11\.2026/)).toHaveCount(2)
  await expect(section).not.toContainText('Sân bóng')
})

test('gửi RSVP hợp lệ → lời cảm ơn', async ({ page }) => {
  await openInvitation(page)
  await page.locator('#rsvp').scrollIntoViewIfNeeded()
  const form = page.getByRole('form', { name: 'Xác nhận tham dự' })
  await form.getByRole('textbox', { name: 'Họ tên' }).fill('Khách kiểm thử')
  await form.getByRole('radio', { name: 'Cả hai lễ' }).check()
  await form.getByRole('spinbutton', { name: 'Số người' }).fill('2')
  await form.getByRole('button', { name: 'Gửi xác nhận' }).click()
  await expect(form.getByRole('status')).toHaveText('Cảm ơn bạn! Chúng mình đã nhận được xác nhận.')
})

test('gửi lời chúc → nhãn Đang chờ duyệt', async ({ page }) => {
  await openInvitation(page)
  await page.locator('#guestbook').scrollIntoViewIfNeeded()
  const form = page.getByRole('form', { name: 'Gửi lời chúc' })
  await form.getByRole('textbox', { name: 'Họ tên' }).fill('Người gửi kiểm thử')
  await form.getByRole('textbox', { name: 'Lời chúc' }).fill('Chúc hai bạn trăm năm hạnh phúc!')
  await form.getByRole('button', { name: 'Gửi lời chúc' }).click()
  const list = page.getByRole('list', { name: 'Lời chúc' })
  await expect(list.getByText('Đang chờ duyệt', { exact: true })).toBeVisible()
  await expect(list.getByText('Người gửi kiểm thử', { exact: true })).toBeVisible()
})

test('mở hai hộp quà → xem được QR của cả hai người', async ({ page }) => {
  await openInvitation(page)
  await page.locator('#gift').scrollIntoViewIfNeeded()
  for (const person of ['chú rể', 'cô dâu']) {
    await page.getByRole('button', { name: `Mừng cưới ${person} - Nhấn để mở` }).click()
    const dialog = page.getByRole('dialog', { name: `Mừng cưới ${person}` })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('img', { name: `Mã QR mừng cưới ${person}` })).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Lưu QR' })).toHaveAttribute('download')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  }
})
