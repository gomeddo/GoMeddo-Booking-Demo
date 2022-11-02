import React, { TextareaHTMLAttributes, useId } from 'react'

import style from './TextArea.module.scss'
import classnames from 'classnames'

interface InputFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  className?: string
  onChange?: (value: string) => void
  label?: string
}

export function TextArea ({ onChange, id, label, className, ...inputElementProps }: InputFieldProps): JSX.Element {
  const generatedId = useId()

  return (
    <textarea
      className={classnames(style.textArea, className)}
      id={id ?? generatedId}
      placeholder={label}
      onChange={({ target }) => onChange?.(target.value)}
      {...inputElementProps}
    />
  )
}
