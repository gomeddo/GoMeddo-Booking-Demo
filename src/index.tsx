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
import ConfigProvider, { Config } from './context/ConfigProvider'
import { Environment } from '@gomeddo/sdk'

function render (rootElement: HTMLElement | ShadowRoot, config: Partial<Config> = {}): ReactDOM.Root {
  dayjs.extend(isSameOrBefore)
  dayjs.extend(localizedFormat)

  const root = ReactDOM.createRoot(rootElement)

  const queryClient = new QueryClient()

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider {...config}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )

  return root
}

if (process.env.REACT_APP_CUSTOM_ELEMENT === '1') {
  class SalesAppointment extends HTMLElement {
    private readonly loadingPromise: Promise<void>

    constructor () {
      super()

      const assetManifestUrl = `${process.env.PUBLIC_URL ?? ''}/asset-manifest.json`

      this.loadingPromise = fetch(assetManifestUrl)
        .then(async response => await response.json())
        .then(({ files }) => {
          const stylesheet = document.createElement('link')
          stylesheet.rel = 'stylesheet'
          stylesheet.href = files['main.css']

          const shadowRoot = this.attachShadow({ mode: 'closed' })
          render(shadowRoot)

          shadowRoot.prepend(stylesheet)
        })
    }
  }

  window.customElements.define('sales-appointment', SalesAppointment)
} else {
  const root = document.getElementById('sales-appointment')
  let reactRoot: ReactDOM.Root | undefined

  const mutationObserver = new MutationObserver(([{ target }]) => {
    const element = target as HTMLElement

    const apiKey = element.getAttribute('data-api-key')
    const environment = element.getAttribute('data-environment')
    const resources = element.getAttribute('data-resources')
    const timeslotLength = element.getAttribute('data-timeslot-length')

    reactRoot?.unmount()
    reactRoot = render(element, {
      apiKey: apiKey ?? undefined,
      environment: environment !== null ? Environment[(environment) as keyof typeof Environment] : undefined,
      resources: resources?.split(';') ?? undefined,
      timeslotLength: timeslotLength !== null ? parseInt(timeslotLength) : undefined
    })
  })

  if (root !== null) {
    reactRoot = render(root)
    mutationObserver.observe(root, {
      attributeFilter: [
        'data-environment',
        'data-api-key',
        'data-resources',
        'data-timeslot-length'
      ]
    })
  }
}
