import dayjs from 'dayjs'
import Reservation from '@booker25/sdk/dist/cjs/s-objects/reservation'
import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Lead from '@booker25/sdk/dist/cjs/s-objects/lead'
import useBooker25 from '../../hooks/useBooker25'
import { Input } from '../../components/Input/Input'
import { AppointmentContext } from '../../context/AppointmentProvider'
import Page from '../Page/Page'

import style from './ContactForm.module.scss'

export default function ContactForm (): JSX.Element {
  const { reservation, setReservation } = useContext(AppointmentContext)

  const b25 = useBooker25()

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [company, setCompany] = useState<string>('')

  const queryClient = useQueryClient()
  const reservationMutation = useMutation(async (data: Reservation) => {
    return await b25.saveReservation(data)
  }, {
    onSuccess: async (data) => {
      const date = dayjs(data.getStartDatetime())
      await queryClient.invalidateQueries(['resources', date?.format('YYYY-MM-DD')])
    }
  })

  return (
    <Page
      active={reservation !== undefined}
      className={style.contactForm}
      activeClassName={style.contactFormActive}
    >
      <h3>Your Reservation</h3>
      <p>{reservation?.getResource()?.name}</p>
      <p>
        {`${dayjs(reservation?.getStartDatetime()).format('HH:mm')} - ${dayjs(reservation?.getEndDatetime()).format('HH:mm')}`}
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          if (reservation !== undefined) {
            const lead = new Lead(firstName, lastName, email)
            lead.setCustomProperty('Company', company)
            reservation?.setLead(lead)
            await reservationMutation.mutateAsync(reservation)
            setReservation(undefined)
          }
        }}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
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
    </Page>
  )
}
