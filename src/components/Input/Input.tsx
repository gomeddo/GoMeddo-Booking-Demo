import React, { InputHTMLAttributes, useId } from 'react'

import style from './Input.module.scss'
import classnames from 'classnames'

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  className?: string
  onChange?: (value: string) => void
  label?: string
}

export function Input ({ onChange, id, label, className, ...inputElementProps }: InputFieldProps): JSX.Element {
  const generatedId = useId()

  return (
    <input
      className={classnames(style.input, className)}
      id={id ?? generatedId}
      placeholder={label}
      onChange={({ target }) => onChange?.(target.value)}
      {...inputElementProps}
    />
  )
}
