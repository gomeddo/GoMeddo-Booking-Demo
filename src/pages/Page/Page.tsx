import classnames from 'classnames'
import { PropsWithChildren } from 'react'

import style from './Page.module.scss'

interface PageProps {
  active?: boolean
  className?: string
  activeClassName?: string
}

export default function Page ({ children, active = false, className, activeClassName }: PropsWithChildren<PageProps>): JSX.Element {
  return (
    <div
      className={classnames(style.page, className, {
        [activeClassName as string]: active && activeClassName !== undefined
      })}
    >
      {children}
    </div>
  )
}
