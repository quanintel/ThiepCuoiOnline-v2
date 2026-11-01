import type { ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface SectionProps {
  id: string
  title?: string
  children: ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  const { ref, visible } = useReveal()
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={title ? `${id}-title` : undefined}
      className="reveal px-6 py-16"
      data-visible={visible}
    >
      {title && <h2 id={`${id}-title`} className="mb-8 text-center font-script text-4xl text-primary">{title}</h2>}
      {children}
    </section>
  )
}
