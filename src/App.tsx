import React from 'react'
import CalendarPage from './pages/CalendarPage/CalendarPage'
import ContactForm from './pages/ContactForm/ContactForm'
import AppointmentProvider from './context/AppointmentProvider'

import style from './App.module.scss'

function App (): JSX.Element {
  return (
    <main className={style.app}>
      <AppointmentProvider>
        <CalendarPage />
        <ContactForm />
      </AppointmentProvider>
    </main>
  )
}
export default App
