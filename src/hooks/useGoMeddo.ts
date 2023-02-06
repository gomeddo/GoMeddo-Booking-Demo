import { useContext, useMemo } from 'react'
import GoMeddo from '@gomeddo/sdk'
import { ConfigContext } from '../context/ConfigProvider'

export default function useGoMeddo (): GoMeddo {
  const { apiKey, environment } = useContext(ConfigContext)
  return useMemo(() => new GoMeddo(apiKey, environment), [apiKey, environment])
}
