import { SettingsContext } from 'contexts/SettingsContext'
import { useContext, useMemo } from 'react'
import { createDigitableTheme } from 'brand/theme'

export const useShellTheme = () => {
  const { getUserSettings } = useContext(SettingsContext)
  const { colorMode } = getUserSettings()

  const theme = useMemo(() => createDigitableTheme(colorMode), [colorMode])

  return theme
}
