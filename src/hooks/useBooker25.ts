import { useContext, useMemo } from 'react'
import Booker25 from '@booker25/sdk'
import { ConfigContext } from '../context/ConfigProvider'

export default function useBooker25 (): Booker25 {
  const { apiKey, environment } = useContext(ConfigContext)
  return useMemo(() => new Booker25(apiKey, environment), [])
}
