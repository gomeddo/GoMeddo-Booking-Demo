import React, { InputHTMLAttributes, useId } from 'react'

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void
  label?: string
}

export function Input ({ onChange, id, label, ...inputElementProps }: InputFieldProps): JSX.Element {
  const generatedId = useId()

  return (
    <div>
      {
        label !== undefined && <label htmlFor={id ?? generatedId}>{label}</label>
      }
      <input
        id={id ?? generatedId}
        onChange={({ target }) => {
          console.log(target.value)
          onChange?.(target.value)
        }}
        {...inputElementProps}
      />
    </div>
  )
}
