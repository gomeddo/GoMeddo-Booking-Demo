import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query'

import dayjs from 'dayjs'

import 'dayjs/locale/en-gb'
import 'dayjs/locale/en'
import 'dayjs/locale/nl'
import 'dayjs/locale/de'
import 'dayjs/locale/fr'

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(isSameOrBefore)
dayjs.extend(localizedFormat)

const root = ReactDOM.createRoot(
  document.getElementById('sales-appointment') as HTMLElement
)

const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
