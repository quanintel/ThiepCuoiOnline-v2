import { useId, useRef, useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitWish } from '@/lib/api'
import { canSubmit, markSubmitted } from '@/lib/throttle'
import { wishSchema } from '@/lib/validation'
import type { Wish, WishInput } from '@/types'

const successMessage = 'Đã nhận lời chúc, đang chờ duyệt'
const failureMessage = 'Gửi chưa được, bạn thử lại giúp mình nhé. Nội dung của bạn vẫn còn đó.'

export function WishForm({ addPending }: { addPending: (wish: Wish) => void }) {
  const id = useId()
  const busy = useRef(false)
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null)
  const form = useForm<WishInput>({
    resolver: zodResolver(wishSchema), mode: 'onBlur',
    defaultValues: { name: '', message: '', hp: '' },
  })
  const count = form.watch('message').length
  const disabled = sending || form.formState.isSubmitting

  function succeed() {
    form.reset()
    setFeedback({ message: successMessage, error: false })
    toast.success(successMessage)
  }

  async function send(input: WishInput) {
    if (busy.current) return
    if (!canSubmit('wish')) {
      const message = 'Vui lòng đợi 30 giây trước khi gửi lại.'
      setFeedback({ message, error: true })
      toast.error(message)
      return
    }
    busy.current = true
    setSending(true)
    setFeedback(null)
    try {
      const { id } = await submitWish(input)
      markSubmitted('wish')
      addPending({ id, name: input.name, message: input.message, createdAt: new Date().toISOString() })
      succeed()
    } catch {
      setFeedback({ message: failureMessage, error: true })
      toast.error(failureMessage)
    } finally {
      busy.current = false
      setSending(false)
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (busy.current) { event.preventDefault(); return }
    if (form.getValues('hp')) { event.preventDefault(); succeed(); return }
    void form.handleSubmit(send)(event)
  }

  return (
    <Form {...form}>
      <form aria-label="Gửi lời chúc" noValidate onSubmit={onSubmit} className="relative space-y-6">
        <fieldset disabled={disabled} className="space-y-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl><Input {...field} autoComplete="name" className="min-h-11" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem>
              <FormLabel>Lời chúc</FormLabel>
              <FormControl><Textarea {...field} rows={4} /></FormControl>
              <FormDescription className="text-right">{count}/300</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <div aria-hidden="true" className="absolute -left-[10000px] top-0 size-px overflow-hidden">
            <Label htmlFor={`${id}-website`}>Website</Label>
            <Input id={`${id}-website`} tabIndex={-1} autoComplete="off" {...form.register('hp')} />
          </div>
          <Button type="submit" disabled={disabled} className="min-h-11 w-full">
            {disabled ? 'Đang gửi…' : 'Gửi lời chúc'}
          </Button>
        </fieldset>
        {feedback && <p role={feedback.error ? 'alert' : 'status'} className="text-sm">{feedback.message}</p>}
      </form>
    </Form>
  )
}
