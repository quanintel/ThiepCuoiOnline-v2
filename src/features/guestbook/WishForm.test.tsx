import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { ApiError, submitWish } from '@/lib/api'
import { canSubmit, markSubmitted } from '@/lib/throttle'
import { WishForm } from '@/features/guestbook/WishForm'

vi.mock('@/lib/api', async (original) => ({ ...await original<typeof import('@/lib/api')>(), submitWish: vi.fn() }))
vi.mock('@/lib/throttle', () => ({ canSubmit: vi.fn(), markSubmitted: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const addPending = vi.fn()
const success = 'Đã nhận lời chúc, đang chờ duyệt'
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(canSubmit).mockReturnValue(true)
  vi.mocked(submitWish).mockResolvedValue({ id: 'w_1' })
})

function fill() {
  fireEvent.change(screen.getByRole('textbox', { name: 'Họ tên' }), { target: { value: ' Nguyễn A ' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'Lời chúc' }), { target: { value: ' Chúc mừng! ' } })
}

it('không nhập thì hiện lỗi, focus họ tên và không gửi', async () => {
  render(<WishForm addPending={addPending} />)
  fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
  expect(await screen.findByText('Vui lòng nhập họ tên.')).toBeInTheDocument()
  expect(screen.getByText('Vui lòng nhập lời chúc.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveFocus())
  expect(submitWish).not.toHaveBeenCalled()
})

it('kiểm tra khi rời ô lời chúc', async () => {
  render(<WishForm addPending={addPending} />)
  fireEvent.blur(screen.getByRole('textbox', { name: 'Lời chúc' }))
  expect(await screen.findByText('Vui lòng nhập lời chúc.')).toBeInTheDocument()
})

it('bộ đếm theo nội dung nhập; lời chúc 301 ký tự bị chặn', async () => {
  render(<WishForm addPending={addPending} />)
  expect(screen.getByText('0/300')).toBeInTheDocument()
  fill()
  fireEvent.change(screen.getByRole('textbox', { name: 'Lời chúc' }), { target: { value: 'a'.repeat(301) } })
  expect(screen.getByText('301/300')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
  expect(await screen.findByText('Lời chúc tối đa 300 ký tự.')).toBeInTheDocument()
  expect(submitWish).not.toHaveBeenCalled()
})

it('gửi dữ liệu trim, thêm pending đúng id/time và reset sau thành công', async () => {
  render(<WishForm addPending={addPending} />)
  fill()
  const before = Date.now()
  fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
  expect(await screen.findByRole('status')).toHaveTextContent(success)
  expect(submitWish).toHaveBeenCalledWith({ name: 'Nguyễn A', message: 'Chúc mừng!', hp: '' })
  expect(addPending).toHaveBeenCalledWith({ id: 'w_1', name: 'Nguyễn A', message: 'Chúc mừng!', createdAt: expect.any(String) })
  expect(Date.parse(addPending.mock.calls[0][0].createdAt)).toBeGreaterThanOrEqual(before)
  expect(canSubmit).toHaveBeenCalledWith('wish')
  expect(markSubmitted).toHaveBeenCalledWith('wish')
  expect(toast.success).toHaveBeenCalledWith(success)
  expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveValue('')
  expect(screen.getByText('0/300')).toBeInTheDocument()
})

it('API lỗi giữ nội dung, không thêm pending hay ghi giãn cách', async () => {
  vi.mocked(submitWish).mockRejectedValue(new ApiError('network', 'offline'))
  render(<WishForm addPending={addPending} />)
  fill()
  fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Gửi chưa được, bạn thử lại giúp mình nhé. Nội dung của bạn vẫn còn đó.')
  expect(screen.getByRole('textbox', { name: 'Lời chúc' })).toHaveValue(' Chúc mừng! ')
  expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveValue(' Nguyễn A ')
  expect(addPending).not.toHaveBeenCalled()
  expect(markSubmitted).not.toHaveBeenCalled()
  expect(toast.error).toHaveBeenCalled()
})

it('honeypot ẩn với a11y/tab và giả thành công mà không gửi hay thêm pending', async () => {
  const { container } = render(<WishForm addPending={addPending} />)
  const hp = container.querySelector<HTMLInputElement>('input[name="hp"]')!
  expect(hp).toHaveAttribute('tabindex', '-1')
  expect(hp).toHaveAttribute('autocomplete', 'off')
  expect(hp.closest('[aria-hidden="true"]')).toHaveClass('absolute')
  expect(screen.queryByRole('textbox', { name: 'Website' })).not.toBeInTheDocument()
  fireEvent.change(hp, { target: { value: 'bot' } })
  fireEvent.submit(screen.getByRole('form', { name: 'Gửi lời chúc' }))
  expect(await screen.findByRole('status')).toHaveTextContent(success)
  expect(submitWish).not.toHaveBeenCalled()
  expect(addPending).not.toHaveBeenCalled()
})

it('hai submit cùng tick chỉ gửi một lần, nút bị khóa trong lúc chờ', async () => {
  let resolve!: (value: { id: string }) => void
  vi.mocked(submitWish).mockReturnValue(new Promise((done) => { resolve = done }))
  render(<WishForm addPending={addPending} />)
  fill()
  const form = screen.getByRole('form', { name: 'Gửi lời chúc' })
  fireEvent.submit(form); fireEvent.submit(form)
  await waitFor(() => expect(submitWish).toHaveBeenCalledTimes(1))
  expect(screen.getByRole('button', { name: 'Đang gửi…' })).toBeDisabled()
  await act(async () => resolve({ id: 'w_1' }))
  expect(addPending).toHaveBeenCalledTimes(1)
  expect(markSubmitted).toHaveBeenCalledTimes(1)
})

it('giãn cách 30 giây không gọi API, giữ lời đang soạn', async () => {
  vi.mocked(canSubmit).mockReturnValue(false)
  render(<WishForm addPending={addPending} />)
  fill()
  fireEvent.click(screen.getByRole('button', { name: 'Gửi lời chúc' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Vui lòng đợi 30 giây trước khi gửi lại.')
  expect(submitWish).not.toHaveBeenCalled()
  expect(screen.getByRole('textbox', { name: 'Lời chúc' })).toHaveValue(' Chúc mừng! ')
})
