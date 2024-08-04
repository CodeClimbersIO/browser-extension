export const getDateUTC = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset()

  return new Date(date.getTime() - offset * 60 * 1000)
}

/**
 * Returns date in YYYY-MM-DD Format
 */
export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0] as `${string}-${string}-${string}`
}
