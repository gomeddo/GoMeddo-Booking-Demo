import { AvailabilitySlotType } from '@booker25/sdk/dist/cjs/time-slots/availability-time-slot'
import dayjs, { Dayjs } from 'dayjs'
import Resource from '@booker25/sdk/dist/cjs/s-objects/resource'

export interface Timeslot {
  id: string
  start: Dayjs
  end: Dayjs
  resource: Resource
}

export function calcTimeslots (resource?: Resource, timeslotLength?: number): Timeslot[] {
  if (resource === undefined) {
    return []
  }

  const endTimeslot = (start: Dayjs): Dayjs => (
    start.clone().add(timeslotLength ?? 30, 'minutes')
  )

  return resource
    .getTimeSlots()
    .filter(({ type }) => type === AvailabilitySlotType.OPEN)
    .reduce<Timeslot[]>((slots, { startOfSlot, endOfSlot }) => {
    const additionalSlots: Timeslot[] = []
    for (let pointer = dayjs(startOfSlot); endTimeslot(pointer).isBefore(dayjs(endOfSlot)); pointer = endTimeslot(pointer)) {
      const end = endTimeslot(pointer)

      additionalSlots.push({
        id: `${resource.id}-${pointer.unix()}-${end.unix()}`,
        start: pointer.clone(),
        end: endTimeslot(pointer),
        resource
      })
    }

    return [
      ...slots,
      ...additionalSlots
    ]
  }, [])
}
