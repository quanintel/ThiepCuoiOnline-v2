import { test as base, expect, type Page } from '@playwright/test'

export const test = base.extend<{ checkConsole: void }>({
  checkConsole: [async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    await use()
    expect(errors, 'Không có lỗi JavaScript trong trình duyệt').toEqual([])
  }, { auto: true }],
})

export { expect }

export async function openInvitation(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Mở thiệp', exact: true }).click()
  await expect(page.locator('#cover-overlay')).toBeHidden()
}
