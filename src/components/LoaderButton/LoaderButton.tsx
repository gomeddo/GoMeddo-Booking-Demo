import { ButtonHTMLAttributes } from 'react'
import Loader from '../Loader/Loader'

import style from './LoaderButton.module.scss'
import classnames from 'classnames'

interface LoaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export default function LoaderButton ({ loading = false, children, className, ...props }: LoaderButtonProps): JSX.Element {
  return (
    <button className={classnames(className, style.button)} {...props}>
      {loading ? <Loader className={style.buttonLoader} variant='white' /> : children}
    </button>
  )
}
