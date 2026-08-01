import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { LocaleProvider, useLocale } from './LocaleContext'

const storageKey = 'digitable:chat-locale'

function LocaleProbe() {
  const { locale, setLocale, t } = useLocale()

  return (
    <>
      <span>{locale}</span>
      <span>{t('home')}</span>
      <button type="button" onClick={() => setLocale('ru')}>
        RU
      </button>
    </>
  )
}

describe('LocaleProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.lang = ''
  })

  test('uses the browser language when there is no saved preference', async () => {
    render(
      <LocaleProvider>
        <LocaleProbe />
      </LocaleProvider>
    )

    expect(screen.getByText('en')).toBeVisible()
    expect(screen.getByText('Home')).toBeVisible()
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
  })

  test('switches locale and saves it for the next visit', async () => {
    const user = userEvent.setup()

    render(
      <LocaleProvider>
        <LocaleProbe />
      </LocaleProvider>
    )

    await user.click(screen.getByRole('button', { name: 'RU' }))

    expect(screen.getByText('ru')).toBeVisible()
    expect(screen.getByText('Главная')).toBeVisible()
    expect(window.localStorage.getItem(storageKey)).toBe('ru')
    expect(document.documentElement.lang).toBe('ru')
  })

  test('restores a saved locale', () => {
    window.localStorage.setItem(storageKey, 'ru')

    render(
      <LocaleProvider>
        <LocaleProbe />
      </LocaleProvider>
    )

    expect(screen.getByText('ru')).toBeVisible()
    expect(screen.getByText('Главная')).toBeVisible()
  })
})
