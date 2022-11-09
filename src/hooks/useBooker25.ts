import { useMemo } from 'react'
import Booker25, { Environment } from '@booker25/sdk'

export default function useBooker25 (): Booker25 {
  return useMemo(() => (
    new Booker25(
      process.env.REACT_APP_API_KEY as string,
      Environment[(process.env.REACT_APP_ENVIRONMENT ?? '') as keyof typeof Environment]
    )
  ), [])
}
