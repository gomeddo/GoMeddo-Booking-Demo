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
import classnames from 'classnames'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import LoaderButton from '../../components/LoaderButton/LoaderButton'

export default function ContactForm (): JSX.Element {
  const { reservation, setReservation } = useContext(AppointmentContext)

  const b25 = useBooker25()

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [company, setCompany] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [tos, setTos] = useState(false)

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
        <LoaderButton
          className={style.contactFormControlsBack}
          onClick={() => setReservation(undefined)}
        >
          <Back />
        </LoaderButton>
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
            lead.setCustomProperty('MobilePhone', phone)
            reservation?.setLead(lead)

            reservation.setCustomProperty('B25__Notes__c', notes)

            await reservationMutation.mutateAsync(reservation)

            setReservation(undefined)
          }
        }}
      >
        <Input
          required
          name='first_name'
          label='First Name'
          onChange={setFirstName}
          value={firstName}
        />
        <Input
          required
          name='last_name'
          label='Last Name'
          onChange={setLastName}
          value={lastName}
        />
        <Input
          required
          name='email'
          label='Email Address'
          onChange={setEmail}
          value={email}
          type='email'
        />
        <Input
          required
          name='phone'
          label='Mobile Number'
          onChange={setPhone}
          value={phone}
        />
        <Input
          required
          name='company'
          className={style.colSpan2}
          label='Company Name'
          onChange={setCompany}
          value={company}
          type='text'
        />
        <TextArea
          className={classnames(style.colSpan2, style.contactFormNotes)}
          name='notes'
          rows={5}
          label='Your Message'
          onChange={setNotes}
          value={notes}
        />
        <div className={classnames(style.colSpan2, style.contactFormSubmit)}>
          <Checkbox
            required
            className={style.contactFormCheckbox}
            checked={tos}
            onChange={setTos}
            label={
              <>
                I give permission to save the data I have entered here and use this data to contact me.
                <br />
                More information in our privacy statement.
              </>
            }
          />
          <LoaderButton
            loading={reservationMutation.isLoading}
            disabled={!tos || reservationMutation.isLoading}
            type='submit'
            className={style.contactFormConfirm}
          >
            Confirm
          </LoaderButton>
        </div>
      </form>
    </Page>
  )
}
