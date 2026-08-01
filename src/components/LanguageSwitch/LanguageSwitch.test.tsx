import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { LanguageSwitch } from './LanguageSwitch'

const options = [
  { label: 'RU', value: 'ru' as const },
  { label: 'EN', value: 'en' as const },
]

test('shows the current language and selects another option', async () => {
  const onChange = vi.fn()
  const user = userEvent.setup()

  render(
    <LanguageSwitch
      ariaLabel="Language"
      options={options}
      value="en"
      onChange={onChange}
    />
  )

  const trigger = screen.getByRole('button', { name: 'Language' })

  expect(trigger).toHaveTextContent('EN')
  expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await user.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('option', { name: 'EN' })).toHaveAttribute(
    'aria-selected',
    'true'
  )

  await user.click(screen.getByRole('option', { name: 'RU' }))

  expect(onChange).toHaveBeenCalledWith('ru')
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})
