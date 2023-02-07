import { ButtonHTMLAttributes } from 'react'

import style from './ArrowButton.module.scss'
import classnames from 'classnames'
import { ReactComponent as ArrowWhite } from '../../icons/arrow-white.svg'

interface ArrowButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  direction: 'left' | 'right'
}

export default function ArrowButton ({ className, direction, ...props }: ArrowButtonProps): JSX.Element {
  return (
    <button
      className={classnames(className, style.button, {
        [style.buttonLeft]: direction === 'left',
        [style.buttonRight]: direction === 'right'
      })} {...props}
    >
      <ArrowWhite className='' />
    </button>
  )
}
