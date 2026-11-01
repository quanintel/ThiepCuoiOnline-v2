export function buildMonth(year: number, month: number): (number | null)[][] {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('Tháng phải là số nguyên từ 1 đến 12.')
  }
  const offset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const cells = Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1
    return day >= 1 && day <= count ? day : null
  })
  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7))
}
