import { createContext, PropsWithChildren, useMemo } from 'react'
import { Environment } from '@booker25/sdk'

export interface Config {
  apiKey: string
  environment: Environment
  resources: string[]
  timeslotLength: number
}

const defaultConfig: Config = {
  apiKey: process.env.REACT_APP_API_KEY as string,
  environment: Environment[(process.env.REACT_APP_ENVIRONMENT ?? '') as keyof typeof Environment] ?? Environment.PRODUCTION,
  resources: process.env.REACT_APP_B25_RESOURCES?.split(';') ?? [],
  timeslotLength: 30
}

export const ConfigContext = createContext<Config>(defaultConfig)

export default function ConfigProvider ({ children, ...providedConfig }: PropsWithChildren<Partial<Config>>): JSX.Element {
  const config = useMemo(() => ({
    ...defaultConfig,
    ...providedConfig
  }), [providedConfig])

  console.debug('Config', config)

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}
