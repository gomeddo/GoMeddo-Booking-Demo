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
      src={require('./Loader.json')}
      style={style ?? {
        width: '8rem',
        height: '8rem'
      }}
    />
  )
}
