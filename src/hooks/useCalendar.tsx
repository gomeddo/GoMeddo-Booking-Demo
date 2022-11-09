import { Dayjs } from 'dayjs'
import { useMemo } from 'react'

interface UseCalendarOptions {
  /**
   * The index of the first day in a week. (Sunday: 0, Saturday: 6)
   */
  startDay?: number
}

const defaultOptions: UseCalendarOptions = {
  startDay: 1
}

function amountOfDaysBetweenDayIndexes (base: number, comparison: number, backwards = true): number {
  const value = base - comparison
  return (backwards ? 7 + value : 6 - value) % 7
}

/**
 * Passes in a date and returns an array of 7 day weeks
 * @param date
 * @param options
 */
export default function useCalendar (date: Dayjs, options: UseCalendarOptions = {}): Dayjs[][] {
  const parsedOptions: UseCalendarOptions = {
    ...defaultOptions,
    ...options
  }

  return useMemo(() => {
    const daysInMonth = date.daysInMonth()

    const startDay = date.clone().date(1)
    const endDay = date.clone().date(daysInMonth)

    const startOfCalendarMonth = startDay
      .clone()
      .subtract(
        amountOfDaysBetweenDayIndexes(startDay.day(), parsedOptions.startDay as number, true),
        'day'
      )
    const endOfCalendarMonth = endDay
      .clone()
      .add(
        amountOfDaysBetweenDayIndexes(endDay.day(), parsedOptions.startDay as number, false),
        'day'
      )

    const weeks = []
    let week = []

    let workingSample = startOfCalendarMonth.clone()
    while (!workingSample.isAfter(endOfCalendarMonth)) {
      week.push(workingSample)
      workingSample = workingSample.clone().add(1, 'day')

      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }

    return weeks
  }, [date, parsedOptions.startDay])
}
