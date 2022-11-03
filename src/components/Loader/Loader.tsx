import { Player } from '@lottiefiles/react-lottie-player'
import classnames from 'classnames'

import style from './Loader.module.scss'

interface LoaderProps {
  className?: string
  variant?: 'black' | 'white'
}

export default function Loader ({ variant = 'black', className }: LoaderProps): JSX.Element {
  return (
    <Player
      className={classnames(className, style.loader)}
      autoplay
      loop
      src={require(`./Loader-${variant}.json`)}
    />
  )
}
