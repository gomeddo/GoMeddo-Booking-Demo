import dayjs, { Dayjs } from 'dayjs'
import style from './Calendar.module.scss'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'
import useCalendar from '../../hooks/useCalendar'
import classnames from 'classnames'

import { ReactComponent as ChevronLeft } from '../../icons/chevron-left.svg'
import { ReactComponent as ChevronRight } from '../../icons/chevron-right.svg'

export interface CalendarApi {
  setCalendarMonth: (date: Dayjs) => void
}

interface CalendarProps {
  className?: string
  initialMonth?: Dayjs
  dateDisabled?: (day: Dayjs) => boolean
  dateSelected?: (day: Dayjs) => boolean
  onDateSelect?: (date: Dayjs) => void
  onHover?: (day: Dayjs | undefined) => void
  start?: Dayjs
  end?: Dayjs
}

const Calendar = forwardRef<CalendarApi, CalendarProps>(({ onDateSelect, className, dateDisabled, dateSelected = (day) => false, onHover, initialMonth, start, end }, ref): JSX.Element => {
  const [calendarDate, setCalendarDate] = useState(initialMonth ?? dayjs())

  useImperativeHandle(ref, () => ({
    setCalendarMonth: date => setCalendarDate(date.startOf('month'))
  }), [])

  const _dateDisabled = useCallback((date: Dayjs) => {
    let disabled = dateDisabled?.(date) ?? false

    if (start !== undefined) { disabled ||= date.isBefore(start, 'day') }

    if (end !== undefined) { disabled ||= date.isAfter(end, 'day') }

    return disabled
  }, [dateDisabled, start, end])

  const calendarDays = useCalendar(calendarDate, {
    startDay: 1
  })

  const prevMonth = useMemo(() => {
    const newDate = calendarDate.subtract(1, 'month')

    if (start !== undefined && newDate.endOf('month').isBefore(start.startOf('month'))) {
      return undefined
    }

    return newDate
  }, [calendarDate, start])

  const nextMonth = useMemo(() => {
    const newDate = calendarDate.add(1, 'month')

    if (end !== undefined && newDate.startOf('month').isAfter(end.endOf('month'))) {
      return undefined
    }

    return newDate
  }, [calendarDate, end])

  return (
    <div className={classnames(style.calendar, className)}>
      <span className={style.calendarTitle}>Select a Date</span>
      <div className={style.calendarControls}>
        <button
          onClick={() => prevMonth !== undefined && setCalendarDate(prevMonth)}
          disabled={prevMonth === undefined}
        >
          <ChevronLeft />
        </button>
        <div>
          {calendarDate.format('MMMM')}
          {' '}
          {!calendarDate.isSame(dayjs(), 'year') && calendarDate.format('YYYY')}
        </div>
        <button
          onClick={() => nextMonth !== undefined && setCalendarDate(nextMonth)}
          disabled={nextMonth === undefined}
        >
          <ChevronRight />
        </button>
      </div>
      <div className={style.calendarContent}>
        {
          calendarDays[0].map((day) => (
            <div className={style.calendarHeader} key={day.format('dd')}>
              {day.format('dd')}
            </div>
          ))
        }
        {calendarDays.map((week) => week.map((day) => (
          <button
            disabled={_dateDisabled(day)}
            onClick={() => onDateSelect?.(day)}
            key={day.format()}
            className={classnames(style.calendarDay, {
              [style.calendarDayOutsideOfMonth]: !calendarDate.isSame(day, 'month'),
              [style.calendarDaySelected]: dateSelected(day)
            })}
            onMouseEnter={() => {
              onHover?.(day)
            }}
            onMouseLeave={() => onHover?.(undefined)}
          >
            <div>
              {day.format('D')}
            </div>
          </button>
        )))}
      </div>
    </div>
  )
})

export default Calendar
