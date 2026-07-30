export const weekdaySessions = [
  { id: 'w1', label: '11:00–12:40' },
  { id: 'w2', label: '13:00–14:40' },
  { id: 'w3', label: '15:00–16:40' },
  { id: 'w4', label: '17:00–18:40' },
]

export const holidaySessions = [
  { id: 'h1', label: '10:00–11:40' },
  { id: 'h2', label: '12:00–13:40' },
  { id: 'h3', label: '14:00–15:40' },
  { id: 'h4', label: '16:00–17:40' },
  { id: 'h5', label: '18:00–19:40' },
]

export const seatDefs = [
  { id: 'A1', cap: 2 }, { id: 'A2', cap: 2 },
  { id: 'A3', cap: 4 }, { id: 'A4', cap: 4 },
  { id: 'A5', cap: 2 },
  { id: '吧檯1', cap: 1 }, { id: '吧檯2', cap: 1 },
  { id: '吧檯3', cap: 1 }, { id: '吧檯4', cap: 1 },
]

export const dateObj = value => {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const isClosed = value => dateObj(value).getDay() === 2
export const isHoliday = value => [5, 6, 0].includes(dateObj(value).getDay())
export const sessionsFor = value => isClosed(value) ? [] : isHoliday(value) ? holidaySessions : weekdaySessions
export const hoursFor = value => isClosed(value) ? '星期二固定公休' : isHoliday(value) ? '假日營業 10:00–20:00' : '平日營業 11:00–19:00'
export const todayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
