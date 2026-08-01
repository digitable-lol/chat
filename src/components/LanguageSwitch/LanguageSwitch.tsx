import { FocusEvent, useState } from 'react'

import './LanguageSwitch.css'

export interface LanguageSwitchOption<TValue extends string = string> {
  label: string
  value: TValue
}

export interface LanguageSwitchProps<TValue extends string = string> {
  ariaLabel?: string
  className?: string
  options: Array<LanguageSwitchOption<TValue>>
  value: TValue
  onChange: (value: TValue) => void
}

export function LanguageSwitch<TValue extends string = string>({
  ariaLabel = 'Language',
  className,
  options,
  value,
  onChange,
}: LanguageSwitchProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption =
    options.find(option => option.value === value) ?? options[0]

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false)
    }
  }

  return (
    <div
      className={`dt-language-switch${className ? ` ${className}` : ''}`}
      onBlur={handleBlur}
    >
      <button
        className="dt-language-switch__trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        data-testid="language-switch-trigger"
        onClick={() => setIsOpen(open => !open)}
      >
        <span>{selectedOption?.label ?? value.toUpperCase()}</span>
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {isOpen ? (
        <div
          className="dt-language-switch__menu"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map(option => {
            const isActive = option.value === value

            return (
              <button
                key={option.value}
                className={`dt-language-switch__option${
                  isActive ? ' dt-language-switch__option--active' : ''
                }`}
                type="button"
                role="option"
                aria-selected={isActive}
                data-testid={`language-switch-option-${option.value}`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
