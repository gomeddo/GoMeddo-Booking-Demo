import React, { useEffect, useMemo, useState } from 'react'

import Booker25, { Environment } from '@booker25/sdk'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import dayjs, { Dayjs } from 'dayjs'
import Resource from '@booker25/sdk/dist/cjs/s-objects/resource'
import Reservation from '@booker25/sdk/dist/cjs/s-objects/reservation'
import Lead from '@booker25/sdk/dist/cjs/s-objects/lead'
import { Input } from './components/Input/Input'
import { calcTimeslots, Timeslot } from './utils'

interface ResourceSlots {
  resource: Resource
  timeslots: Timeslot[]
}

function App (): JSX.Element {
  const b25 = useMemo(() => (
    new Booker25(
      process.env.REACT_APP_API_KEY as string,
      Environment[(process.env.REACT_APP_ENVIRONMENT ?? '') as keyof typeof Environment]
    )
  ), [])

  const [date, setDate] = useState<Dayjs>()
  const { isLoading, data } = useQuery(
    ['resources', date?.format('YYYY-MM-DD')],
    async () => {
      if (date === undefined) { return }

      return await b25
        .buildResourceRequest()
        .includeAllResourcesAt(...(process.env.REACT_APP_B25_RESOURCES ?? '').split(';'))
        .withAvailableSlotsBetween(
          date?.toDate(),
          date?.clone().endOf('day').toDate()
        )
        .getResults()
    },
    {
      enabled: date !== undefined
    }
  )

  const availableResources = useMemo(() => (
    data?.getResourceIds().map<ResourceSlots>((id) => {
      const resource = data?.getResource(id)

      return {
        resource: resource as Resource,
        timeslots: calcTimeslots(resource?.getTimeSlots())
      }
    })
  ), [data])

  const [reservation, setReservation] = useState<Reservation>()
  useEffect(() => setReservation(undefined), [date])

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [company, setCompany] = useState<string>('')

  const queryClient = useQueryClient()
  const reservationMutation = useMutation(async (data: Reservation) => {
    return await b25.saveReservation(data)
  }, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['resources', date?.format('YYYY-MM-DD')])
    }
  })

  return (
    <>
      <header>
        <button
          onClick={() => setDate(() => date?.subtract(1, 'day'))}
          disabled={date === undefined}
        >
          &lt;
        </button>
        <Input
          value={date?.format('YYYY-MM-DD')}
          onChange={(dateString) => setDate(dayjs(dateString))}
          type='date'
        />
        <button
          onClick={() => setDate(() => date?.add(1, 'day'))}
          disabled={date === undefined}
        >
          &gt;
        </button>
      </header>
      <main>
        {
          isLoading
            ? <p>Loading...</p>
            : (
              <ul>
                {
                  availableResources?.map(({ resource, timeslots }) => (
                    <React.Fragment key={resource.id}>
                      <li>{resource?.name}</li>
                      {
                        timeslots.map(({ start, end }) => (
                          <button
                            key={`${resource.id}-${start.format()}-${end.format()}`}
                            onClick={() => setReservation(() => {
                              const reservation = new Reservation()

                              reservation.setResource(resource)
                              reservation.setStartDatetime(start.toDate())
                              reservation.setEndDatetime(end.toDate())

                              return reservation
                            })}
                          >
                            {start.format('HH:mm')}
                            -
                            {end.format('HH:mm')}
                          </button>
                        ))
                      }
                    </React.Fragment>
                  ))
                }
              </ul>
            )
        }
        {
          reservation !== undefined && (
            <div>
              <h3>Your Reservation</h3>
              <p>{reservation.getResource()?.name}</p>
              <p>
                {`${dayjs(reservation.getStartDatetime()).format('HH:mm')} - ${dayjs(reservation.getEndDatetime()).format('HH:mm')}`}
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()

                  const lead = new Lead(firstName, lastName, email)
                  lead.setCustomProperty('Company', company)
                  reservation?.setLead(lead)
                  await reservationMutation.mutateAsync(reservation)
                  setReservation(undefined)
                }}
              >
                <Input label='First Name' onChange={setFirstName} value={firstName} />
                <Input label='Last Name' onChange={setLastName} value={lastName} />
                <Input label='Email' onChange={setEmail} value={email} type='email' />
                <Input label='Company' onChange={setCompany} value={company} type='text' />
                <button
                  type='submit'
                >
                  Create appointment
                </button>
              </form>
            </div>
          )
        }
      </main>
    </>
  )
}
export default App
