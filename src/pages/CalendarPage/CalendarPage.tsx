import useBooker25 from '../../hooks/useBooker25'
import { Ref, useContext, useEffect, useMemo, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useQuery } from 'react-query'
import { calcTimeslots, Timeslot } from '../../utils'
import { AppointmentContext } from '../../context/AppointmentProvider'
import Reservation from '@booker25/sdk/dist/cjs/s-objects/reservation'
import Page from '../Page/Page'
import style from './CalendarPage.module.scss'
import Calendar, { CalendarApi } from '../../components/Calendar/Calendar'
import classnames from 'classnames'
import Loader from '../../components/Loader/Loader'

export default function CalendarPage (): JSX.Element {
  const b25 = useBooker25()

  const { setReservation, reservation } = useContext(AppointmentContext)

  const calendarStart = useMemo(() => dayjs().add(1, 'day').startOf('day'), [])
  const calendarEnd = useMemo(() => calendarStart.add(1, 'month').startOf('day'), [calendarStart])

  const [date, setDate] = useState<Dayjs>()
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot>()

  const { isLoading, data } = useQuery(
    ['resources', calendarStart?.format('YYYY-MM-DD'), calendarEnd.format('YYYY-MM-DD')],
    async () => {
      return await b25
        .buildResourceRequest()
        .includeAllResourcesAt(...(process.env.REACT_APP_B25_RESOURCES ?? '').split(';'))
        .withAvailableSlotsBetween(
          calendarStart.toDate(),
          calendarEnd.endOf('day').toDate()
        )
        .getResults()
    }
  )

  const timeslots = useMemo(() => (
    data
      ?.getResourceIds()
      .map<Timeslot[]>((id) => {
      const resource = data?.getResource(id)
      return calcTimeslots(resource)
    })
      .flatMap<Timeslot>(slot => slot)
      .sort(({ start: startA }, { start: startB }) => (
        startA.unix() - startB.unix()
      )) ?? []
  ), [data])

  useEffect(() => {
    if (timeslots.length > 0 && date === undefined) {
      setDate(timeslots[0].start.startOf('day'))
    }
  }, [date, timeslots])

  const timeslotsByDate = useMemo(() => (
    timeslots?.reduce<Record<string, Timeslot[]>>((byDay, timeslot) => {
      const date = timeslot.start.startOf('day').format('YYYY-MM-DD')

      if (byDay[date] === undefined) {
        byDay[date] = []
      }

      byDay[date].push(timeslot)

      return byDay
    }, {}) ?? {}
  ), [timeslots])

  const calendarRef = useRef<CalendarApi>()

  return (
    <Page
      active={reservation == null}
      className={style.calendar}
      activeClassName={style.calendarActive}
    >
      <div className={style.calendarWrapper}>
        <Calendar
          ref={calendarRef as Ref<CalendarApi>}
          start={calendarStart}
          end={calendarEnd}
          initialMonth={calendarStart}
          dateSelected={(_date) => date !== undefined && _date.isSame(date, 'day')}
          dateDisabled={(_date) => {
            const _timeslots = timeslotsByDate?.[_date.format('YYYY-MM-DD')] ?? []
            return _timeslots.length === 0
          }}
          onDateSelect={(_date) => {
            setSelectedTimeslot(undefined)
            setDate(_date.startOf('day'))
          }}
        />
      </div>
      <div className={style.firstSlotFinder}>
        <span>Search fist available time slot</span>
        <button
          onClick={() => {
            if (timeslots.length > 0) {
              setSelectedTimeslot(timeslots[0])
              setDate(timeslots[0].start.startOf('day'))
              calendarRef.current?.setCalendarMonth(timeslots[0].start)
            }
          }}
        >
          Search
        </button>
      </div>
      <div className={style.timeslotsHeader}>
        Select Time
      </div>
      <div className={style.timeslots}>

        {
          isLoading
            ? (
              <div className={style.timeslotsLoading}>
                <Loader />
              </div>
            )
            : (
              <ol>
                {
                  (timeslotsByDate[date?.format('YYYY-MM-DD') ?? ''] ?? []).map((timeslot) => (
                    <li key={timeslot.id}>
                      <button
                        className={
                          classnames(style.timeslotsTimeslot, {
                            [style.timeslotsTimeslotSelected]: selectedTimeslot?.id === timeslot.id
                          })
                        }
                        onClick={() => setSelectedTimeslot(timeslot)}
                      >
                        {timeslot.start.format('LT')}
                      </button>
                    </li>
                  ))
                }
              </ol>
            )
        }
      </div>
      <div className={style.selectedTimeslot}>
        <div className={style.selectedTimeslotDateTime}>
          {
            selectedTimeslot !== undefined ? (
              <>
                {selectedTimeslot?.start?.format('L')}
                {' - '}
                {selectedTimeslot?.start?.format('LT')}
                {' - '}
                {selectedTimeslot?.end?.format('LT')}
              </>
            )
              : (
                date?.format('L') ?? 'Loading...'
              )
          }
        </div>
        <button
          disabled={selectedTimeslot === undefined}
          onClick={() => setReservation(() => {
            if (selectedTimeslot !== undefined) {
              const reservation = new Reservation()

              reservation.setResource(selectedTimeslot.resource)
              reservation.setStartDatetime(selectedTimeslot.start.toDate())
              reservation.setEndDatetime(selectedTimeslot.end.toDate())

              return reservation
            }
          })}
        >
          Next ---&gt;
        </button>
      </div>
    </Page>
  )
}
