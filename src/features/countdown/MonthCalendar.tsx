import { buildMonth } from '@/lib/month'

export function MonthCalendar({ year, month, highlight }: { year: number; month: number; highlight: number }) {
  return (
    <table className="w-full table-fixed text-center text-sm">
      <caption className="mb-6 font-serif text-2xl text-primary">Tháng {month}/{year}</caption>
      <thead>
        <tr>{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((label) => (
          <th key={label} scope="col" className="pb-3 font-medium text-muted-foreground">{label}</th>
        ))}</tr>
      </thead>
      <tbody>
        {buildMonth(year, month).map((week, index) => (
          <tr key={index}>{week.map((day, column) => (
            <td key={column} className="py-1">
              {day === highlight ? (
                <mark aria-label={`Ngày ${day}, ngày cưới`} className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">
                  {day}
                </mark>
              ) : <span className="inline-flex size-10 items-center justify-center">{day}</span>}
            </td>
          ))}</tr>
        ))}
      </tbody>
    </table>
  )
}
