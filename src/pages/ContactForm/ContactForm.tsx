import dayjs from 'dayjs'
import Reservation from '@gomeddo/sdk/dist/cjs/s-objects/reservation'
import { PropsWithChildren, useContext, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import Lead from '@gomeddo/sdk/dist/cjs/s-objects/lead'
import useGoMeddo from '../../hooks/useGoMeddo'
import { Input } from '../../components/Input/Input'
import { AppointmentContext } from '../../context/AppointmentProvider'
import Page from '../Page/Page'

import { ReactComponent as Back } from '../../icons/arrow-back-round.svg'
import { ReactComponent as Error } from '../../icons/error.svg'
import { ReactComponent as Success } from '../../icons/success.svg'

import style from './ContactForm.module.scss'
import { TextArea } from '../../components/TextArea/TextArea'
import classnames from 'classnames'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import LoaderButton from '../../components/LoaderButton/LoaderButton'

interface ActionCompleteSuccess {
  variant: 'success'
  onBack?: undefined
}

interface ActionCompleteError {
  variant: 'error'
  onBack?: () => void
}

function ActionComplete ({ variant, onBack, children }: PropsWithChildren<ActionCompleteSuccess | ActionCompleteError>): JSX.Element {
  return (
    <div className={style.actionComplete}>
      {variant === 'success' && <Success className={style.actionCompleteIcon} />}
      {variant === 'error' && <Error className={style.actionCompleteIcon} />}

      {children}

      {onBack !== undefined && (
        <LoaderButton onClick={onBack}>
          Try Again
        </LoaderButton>
      )}
    </div>
  )
}

export default function ContactForm (): JSX.Element {
  const { reservation, setReservation } = useContext(AppointmentContext)

  const gm = useGoMeddo()

  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [company, setCompany] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [tos, setTos] = useState(false)

  const reservationMutation = useMutation(async (data: Reservation) => {
    return await gm.saveReservation(data)
  }, {
    onSuccess: async (data) => setShowSuccess(true),
    onError: async () => setShowError(true)
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
      {
        showSuccess && (
          <ActionComplete variant='success'>
            <span className={style.actionCompleteTitle}>
              Thank you for your demo request!
            </span>
            <span className={style.actionCompleteTime}>
              {start?.format('L')}
              {' - '}
              {start?.format('LT')}
              {' - '}
              {end?.format('LT')}
            </span>
            <p>
              Your request has been confirmed and a confirmation has been sent to your email.
            </p>
            <p>
              See you soon!
            </p>
          </ActionComplete>
        )
      }
      {
        showError && (
          <ActionComplete
            variant='error'
            onBack={() => setShowError(false)}
          >
            <span className={style.actionCompleteTitle}>
              Dear Visitor,
            </span>
            <p>
              Currently, we’re experiencing difficulties with our demo requests. Please contact us via info@gomeddo.com if you would like to make a reservation for a demo. You can also contact us by phone at +31 20 750 8350 or try again.
            </p>
            <p>
              Apologies for any inconvenience caused,
            </p>
            <p>
              Team GoMeddo
            </p>
          </ActionComplete>
        )
      }
    </Page>
  )
}
