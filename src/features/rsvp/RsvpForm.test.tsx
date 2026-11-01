import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { ApiError, submitRsvp } from '@/lib/api'
import { canSubmit, markSubmitted } from '@/lib/throttle'
import { RsvpForm } from '@/features/rsvp/RsvpForm'

vi.mock('@/lib/api', async (original) => ({ ...await original<typeof import('@/lib/api')>(), submitRsvp: vi.fn() }))
vi.mock('@/lib/throttle', () => ({ canSubmit: vi.fn(), markSubmitted: vi.fn() }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const success = 'Cảm ơn bạn! Chúng mình đã nhận được xác nhận.'
const failure = 'Gửi chưa được, bạn thử lại giúp mình nhé. Nội dung của bạn vẫn còn đó.'
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(canSubmit).mockReturnValue(true)
  vi.mocked(submitRsvp).mockResolvedValue({ id: 'r_1' })
})

function fill() {
  fireEvent.change(screen.getByRole('textbox', { name: 'Họ tên' }), { target: { value: ' Nguyễn A ' } })
  fireEvent.click(screen.getByRole('radio', { name: 'Cả hai lễ' }))
}

it('không nhập thì hiện lỗi, focus ô lỗi đầu và không gọi API', async () => {
  render(<RsvpForm />)
  fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }))
  expect(await screen.findByText('Vui lòng nhập họ tên.')).toBeInTheDocument()
  expect(screen.getByText('Vui lòng chọn lễ tham dự.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveFocus())
  expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveAttribute('aria-invalid', 'true')
  expect(submitRsvp).not.toHaveBeenCalled()
})

it('kiểm tra khi rời ô', async () => {
  render(<RsvpForm />)
  fireEvent.blur(screen.getByRole('textbox', { name: 'Họ tên' }))
  expect(await screen.findByText('Vui lòng nhập họ tên.')).toBeInTheDocument()
})

it('focus lựa chọn đầu tiên khi đã nhập tên nhưng chưa chọn lễ', async () => {
  render(<RsvpForm />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Họ tên' }), { target: { value: 'Nguyễn A' } })
  fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }))
  expect(await screen.findByText('Vui lòng chọn lễ tham dự.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('radio', { name: 'Lễ Vu Quy' })).toHaveFocus())
  expect(submitRsvp).not.toHaveBeenCalled()
})

it('gửi dữ liệu đã trim, ghi giãn cách sau thành công và xóa nội dung form', async () => {
  render(<RsvpForm />)
  fill()
  expect(screen.getByRole('spinbutton', { name: 'Số người' })).toHaveValue(1)
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Số người' }), { target: { value: '2' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'Lời nhắn' }), { target: { value: ' Hẹn gặp! ' } })
  fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }))
  expect(await screen.findByRole('status')).toHaveTextContent(success)
  expect(submitRsvp).toHaveBeenCalledWith({ name: 'Nguyễn A', attendance: 'both', guests: 2, note: 'Hẹn gặp!', hp: '' })
  expect(canSubmit).toHaveBeenCalledWith('rsvp')
  expect(markSubmitted).toHaveBeenCalledWith('rsvp')
  expect(toast.success).toHaveBeenCalledWith(success)
  expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveValue('')
})

it('chọn không tham dự bỏ qua số người đang nhập sai và gửi 1', async () => {
  render(<RsvpForm />)
  fill()
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Số người' }), { target: { value: '11' } })
  fireEvent.click(screen.getByRole('radio', { name: 'Không tham dự' }))
  expect(screen.getByRole('spinbutton', { name: 'Số người' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }))
  await waitFor(() => expect(submitRsvp).toHaveBeenCalledWith(expect.objectContaining({ attendance: 'none', guests: 1 })))
})

it.each(['network', 'server', 'validation'] as const)('lỗi %s giữ nội dung và không ghi giãn cách', async (kind) => {
  vi.mocked(submitRsvp).mockRejectedValue(new ApiError(kind, 'Lỗi API'))
  render(<RsvpForm />)
  fill()
  fireEvent.change(screen.getByRole('textbox', { name: 'Lời nhắn' }), { target: { value: 'Hẹn gặp!' } })
  fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }))
  expect(await screen.findByRole('alert')).toHaveTextContent(failure)
  expect(toast.error).toHaveBeenCalledWith(failure)
  expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveValue(' Nguyễn A ')
  expect(screen.getByRole('textbox', { name: 'Lời nhắn' })).toHaveValue('Hẹn gặp!')
  expect(markSubmitted).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Gửi xác nhận' })).toBeEnabled()
})

it('honeypot nằm ngoài màn hình, ngoài a11y/tab; có giá trị thì giả thành công', async () => {
  const { container } = render(<RsvpForm />)
  const hp = container.querySelector<HTMLInputElement>('input[name="hp"]')!
  expect(hp).toHaveAttribute('tabindex', '-1')
  expect(hp).toHaveAttribute('autocomplete', 'off')
  expect(hp.closest('[aria-hidden="true"]')).not.toBeNull()
  expect(hp.closest('[aria-hidden="true"]')).toHaveClass('absolute')
  expect(screen.queryByRole('textbox', { name: 'Website' })).not.toBeInTheDocument()
  fireEvent.change(hp, { target: { value: 'bot' } })
  fireEvent.submit(screen.getByRole('form', { name: 'Xác nhận tham dự' }))
  expect(await screen.findByRole('status')).toHaveTextContent(success)
  expect(submitRsvp).not.toHaveBeenCalled()
  expect(markSubmitted).not.toHaveBeenCalled()
})

it('hai submit liên tiếp trong cùng tick chỉ gọi API một lần và khóa nút khi chờ', async () => {
  let resolve!: (value: { id: string }) => void
  vi.mocked(submitRsvp).mockReturnValue(new Promise((done) => { resolve = done }))
  render(<RsvpForm />)
  fill()
  const form = screen.getByRole('form', { name: 'Xác nhận tham dự' })
  fireEvent.submit(form); fireEvent.submit(form)
  await waitFor(() => expect(submitRsvp).toHaveBeenCalledTimes(1))
  expect(screen.getByRole('button', { name: 'Đang gửi…' })).toBeDisabled()
  await act(async () => resolve({ id: 'r_1' }))
  expect(screen.getByRole('status')).toHaveTextContent(success)
  expect(markSubmitted).toHaveBeenCalledTimes(1)
})

it('chặn gửi trong 30 giây và giữ nội dung', async () => {
  vi.mocked(canSubmit).mockReturnValue(false)
  render(<RsvpForm />)
  fill()
  fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Vui lòng đợi 30 giây trước khi gửi lại.')
  expect(submitRsvp).not.toHaveBeenCalled()
  expect(screen.getByRole('textbox', { name: 'Họ tên' })).toHaveValue(' Nguyễn A ')
})
