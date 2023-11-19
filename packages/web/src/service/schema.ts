const DATE_REG = /^\d{4}-\d{2}-\d{2}$/
export const isDateValid = (date: string) => {
  if (!DATE_REG.test(date)) {
    return false
  }
  const [year, month, day] = date.split('-')
  if (!year?.length || !month?.length || !day?.length) {
    return false
  }
  const isYearValid = Number(year) >= 2023
  const isMonthValid = Number(month) >= 1 && Number(month) <= 12
  const isDayValid = Number(day) >= 1 && Number(day) <= 31
  const isValid = isYearValid && isMonthValid && isDayValid
  return isValid
}

const LIST_REG = /^[0-9]+$/
export const isListValid = (list: string) => {
  if (!LIST_REG.test(list)) {
    return false
  }
  const listAsNum = Number(list)
  const isValid = listAsNum > 1 && !Number.isNaN(listAsNum)
  return isValid
}
