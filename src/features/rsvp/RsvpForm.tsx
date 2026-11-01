import { useId, useRef, useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { submitRsvp } from '@/lib/api'
import { canSubmit, markSubmitted } from '@/lib/throttle'
import { rsvpSchema } from '@/lib/validation'
import type { RsvpInput } from '@/types'

const successMessage = 'Cảm ơn bạn! Chúng mình đã nhận được xác nhận.'
const failureMessage = 'Gửi chưa được, bạn thử lại giúp mình nhé. Nội dung của bạn vẫn còn đó.'

export function RsvpForm() {
  const id = useId()
  const busy = useRef(false)
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null)
  const form = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema), mode: 'onBlur',
    defaultValues: { name: '', guests: 1, note: '', hp: '' },
  })
  const absent = form.watch('attendance') === 'none'
  const disabled = sending || form.formState.isSubmitting

  function succeed() {
    form.reset()
    setFeedback({ message: successMessage, error: false })
    toast.success(successMessage)
  }

  async function send(input: RsvpInput) {
    if (busy.current) return
    if (!canSubmit('rsvp')) {
      const message = 'Vui lòng đợi 30 giây trước khi gửi lại.'
      setFeedback({ message, error: true })
      toast.error(message)
      return
    }
    busy.current = true
    setSending(true)
    setFeedback(null)
    try {
      await submitRsvp({ ...input, guests: input.attendance === 'none' ? 1 : input.guests })
      markSubmitted('rsvp')
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
      <form aria-label="Xác nhận tham dự" noValidate onSubmit={onSubmit} className="relative space-y-6">
        <fieldset disabled={disabled} className="space-y-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl><Input {...field} autoComplete="name" className="min-h-11" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="attendance" render={({ field }) => (
            <FormItem>
              <FormLabel id={`${id}-attendance`}>Tham dự lễ nào?</FormLabel>
              <FormControl>
                <RadioGroup
                  orientation="vertical"
                  value={field.value ?? ''} name={field.name} onBlur={field.onBlur}
                  aria-labelledby={`${id}-attendance`}
                  onValueChange={(value) => {
                    field.onChange(value)
                    if (value === 'none') form.setValue('guests', 1, { shouldValidate: true })
                  }}
                >
                  {([
                    ['vuquy', 'Lễ Vu Quy'], ['thanhhon', 'Lễ Thành Hôn'],
                    ['both', 'Cả hai lễ'], ['none', 'Không tham dự'],
                  ] as const).map(([value, label]) => (
                    <div key={value} className="flex min-h-11 items-center gap-3">
                      <RadioGroupItem ref={value === 'vuquy' ? field.ref : undefined} value={value} id={`${id}-${value}`} />
                      <Label htmlFor={`${id}-${value}`} className="flex min-h-11 flex-1 items-center">{label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="guests" render={({ field }) => (
            <FormItem>
              <FormLabel>Số người</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} max={10} step={1} disabled={absent}
                  onChange={(event) => field.onChange(Number(event.target.value))} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="note" render={({ field }) => (
            <FormItem>
              <FormLabel>Lời nhắn</FormLabel>
              <FormControl><Textarea {...field} rows={3} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div aria-hidden="true" className="absolute -left-[10000px] top-0 size-px overflow-hidden">
            <Label htmlFor={`${id}-website`}>Website</Label>
            <Input id={`${id}-website`} tabIndex={-1} autoComplete="off" {...form.register('hp')} />
          </div>
          <Button type="submit" disabled={disabled} className="min-h-11 w-full">
            {disabled ? 'Đang gửi…' : 'Gửi xác nhận'}
          </Button>
        </fieldset>
        {feedback && <p role={feedback.error ? 'alert' : 'status'} className="text-sm">{feedback.message}</p>}
      </form>
    </Form>
  )
}
