export const getFirstDayOfCurrentMonth = (): string => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  firstDay.setHours(0, 0, 0, 0)

  const year = firstDay.getFullYear()
  const month = String(firstDay.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

export const getLastDayOfCurrentMonth = (): string => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  lastDay.setHours(0, 0, 0, 0)

  const year = lastDay.getFullYear()
  const month = String(lastDay.getMonth() + 1).padStart(2, '0')
  const date = String(lastDay.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

export const getFormattedDateDisplay = (date: string): string => {
  if (!date) return ''

  const dateObj = new Date(date)

  if (isNaN(dateObj.getTime())) return ''

  const year = dateObj.getFullYear()
  // Add 1 to month since getMonth() returns 0-11
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}
