import React, { InputHTMLAttributes, ReactNode, useId } from 'react'

import style from './Checkbox.module.scss'
import classnames from 'classnames'

import { ReactComponent as Checkmark } from '../../icons/checkmark.svg'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  className?: string
  onChange?: (value: boolean) => void
  label?: string | ReactNode
}

export function Checkbox ({ onChange, id, label, className, checked = false, ...inputElementProps }: CheckboxProps): JSX.Element {
  const generatedId = useId()

  return (
    <div className={classnames(style.checkbox, className)}>
      <input
        checked={checked}
        type='checkbox'
        className={classnames(style.input, className)}
        id={id ?? generatedId}
        onChange={({ target }) => onChange?.(target.checked)}
        {...inputElementProps}
      />
      <div className={style.fauxCheckbox} onClick={() => onChange?.(!checked)}>
        {checked && <Checkmark />}
      </div>
      <label htmlFor={id ?? generatedId}>{label}</label>
    </div>
  )
}
