import { Player } from '@lottiefiles/react-lottie-player'
import { CSSProperties } from 'react'

interface LoaderProps {
  style?: CSSProperties
}

export default function Loader ({ style }: LoaderProps): JSX.Element {
  return (
    <Player
      autoplay
      loop
      src='https://assets5.lottiefiles.com/packages/lf20_sueuqtme.json'
      style={style ?? {
        width: '10rem',
        height: '10rem'
      }}
    />
  )
}
