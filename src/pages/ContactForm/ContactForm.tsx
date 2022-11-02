import dayjs from 'dayjs'
import Reservation from '@booker25/sdk/dist/cjs/s-objects/reservation'
import { useContext, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Lead from '@booker25/sdk/dist/cjs/s-objects/lead'
import useBooker25 from '../../hooks/useBooker25'
import { Input } from '../../components/Input/Input'
import { AppointmentContext } from '../../context/AppointmentProvider'
import Page from '../Page/Page'

import { ReactComponent as Back } from '../../icons/arrow-back-round.svg'

import style from './ContactForm.module.scss'
import { TextArea } from '../../components/TextArea/TextArea'

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

  const start = useMemo(() => dayjs(reservation?.getStartDatetime()), [reservation])
  const end = useMemo(() => dayjs(reservation?.getEndDatetime()), [reservation])

  return (
    <Page
      active={reservation !== undefined}
      className={style.contactForm}
      activeClassName={style.contactFormActive}
    >
      <div className={style.contactFormTitle}>Confirm your booking</div>
      <div className={style.contactFormControls}>
        <button onClick={() => setReservation(undefined)}>
          <Back />
        </button>
        <span>
          {start?.format('L')}
          {' - '}
          {start?.format('LT')}
          {' - '}
          {end?.format('LT')}
        </span>
      </div>

      <form
        className={style.contactFormInputs}
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
        <Input
          label='First Name'
          onChange={setFirstName}
          value={firstName}
        />
        <Input
          label='Last Name'
          onChange={setLastName}
          value={lastName}
        />
        <Input
          label='Email Address'
          onChange={setEmail}
          value={email}
          type='email'
        />
        <Input
          label='Mobile number'
          onChange={setEmail}
          value={email}
        />
        <Input
          className={style.span2}
          label='Company name'
          onChange={setCompany}
          value={company}
          type='text'
        />
        <TextArea
          className={style.span2}
          label='Your Message'
          onChange={setCompany}
          value={company}
        />
        <button type='submit'>
          Confirm
        </button>
      </form>
    </Page>
  )
}
