import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

it('chuyển ref đến DOM trên React 18 để form và dialog quản lý focus', () => {
  const button = createRef<HTMLButtonElement>()
  const input = createRef<HTMLInputElement>()
  const textarea = createRef<HTMLTextAreaElement>()
  const label = createRef<HTMLLabelElement>()
  render(<>
    <Button ref={button}>Gửi</Button>
    <Label ref={label} htmlFor="name">Họ tên</Label>
    <Input ref={input} id="name" />
    <Textarea ref={textarea} aria-label="Lời nhắn" />
  </>)
  expect(button.current).toBe(screen.getByRole('button', { name: 'Gửi' }))
  expect(input.current).toBe(screen.getByRole('textbox', { name: 'Họ tên' }))
  expect(textarea.current).toBe(screen.getByRole('textbox', { name: 'Lời nhắn' }))
  expect(label.current).toBe(screen.getByText('Họ tên'))
  input.current?.focus()
  expect(input.current).toHaveFocus()
})
