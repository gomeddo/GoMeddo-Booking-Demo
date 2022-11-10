import React, { useContext } from 'react'
import CalendarPage from './pages/CalendarPage/CalendarPage'
import ContactForm from './pages/ContactForm/ContactForm'
import AppointmentProvider from './context/AppointmentProvider'

import style from './App.module.scss'
import { ConfigContext } from './context/ConfigProvider'

function App (): JSX.Element {
  const { apiKey } = useContext(ConfigContext)

  return (
    <main className={style.app}>
      {
        apiKey !== undefined && apiKey !== ''
          ? (
            <AppointmentProvider>
              <CalendarPage />
              <ContactForm />
            </AppointmentProvider>
          )
          : <p>Please configure an API Key</p>
      }
    </main>
  )
}
export default App
