import { AvailabilitySlotType, AvailabilityTimeSlot } from '@booker25/sdk/dist/cjs/time-slots/availability-time-slot'
import dayjs, { Dayjs } from 'dayjs'

export interface Timeslot {
  start: Dayjs
  end: Dayjs
}

export function calcTimeslots (slots?: AvailabilityTimeSlot[]): Timeslot[] {
  if (slots === undefined) {
    return []
  }

  const endTimeslot = (start: Dayjs): Dayjs => (
    start.clone().add(parseInt(process.env.REACT_APP_TIMESLOT_LENGTH ?? '30'), 'minutes')
  )

  return slots
    .filter(({ type }) => type === AvailabilitySlotType.OPEN)
    .reduce<Timeslot[]>((slots, { startOfSlot, endOfSlot }) => {
    const additionalSlots: Timeslot[] = []
    for (let pointer = dayjs(startOfSlot); pointer.isBefore(dayjs(endOfSlot)); pointer = endTimeslot(pointer)) {
      additionalSlots.push({
        start: pointer.clone(),
        end: endTimeslot(pointer)
      })
    }

    return [
      ...slots,
      ...additionalSlots
    ]
  }, [])
}
