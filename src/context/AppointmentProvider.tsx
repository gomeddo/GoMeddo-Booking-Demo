import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'
import Reservation from '@booker25/sdk/dist/cjs/s-objects/reservation'

interface AppointmentApi {
  reservation: Reservation | undefined
  setReservation: Dispatch<SetStateAction<Reservation | undefined>>
}

export const AppointmentContext = createContext<AppointmentApi>({
  reservation: undefined,
  setReservation: () => {}
})

export default function AppointmentProvider ({ children }: PropsWithChildren): JSX.Element {
  const [reservation, setReservation] = useState<Reservation>()

  return (
    <AppointmentContext.Provider value={{ reservation, setReservation }}>
      {children}
    </AppointmentContext.Provider>
  )
}
