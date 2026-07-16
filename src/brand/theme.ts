import { alpha, createTheme } from '@mui/material/styles'

import { ColorMode } from 'models/settings'

const colors = {
  cyan: '#00e5e5',
  cyanSoft: '#00d8ff',
  yellow: '#ffc247',
  purple: '#b65cff',
  green: '#7cff6b',
  red: '#ff5b5b',
  dark: {
    canvas: '#05080d',
    surface: '#071018',
    surfaceStrong: '#0b111a',
    text: '#f5f7fa',
    muted: '#9baab8',
    border: '#15566a',
  },
  light: {
    canvas: '#f7f4eb',
    surface: '#fffdf7',
    surfaceStrong: '#eef5f3',
    text: '#111923',
    muted: '#64717e',
    border: '#168595',
  },
}

export const createDigitableTheme = (mode: ColorMode) => {
  const isDark = mode === ColorMode.DARK
  const palette = isDark ? colors.dark : colors.light

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.cyan,
        light: colors.cyanSoft,
        dark: '#00aeb8',
        contrastText: '#041012',
      },
      secondary: {
        main: isDark ? '#152630' : '#dcebed',
        contrastText: palette.text,
      },
      success: {
        main: isDark ? colors.green : '#278446',
      },
      warning: {
        main: isDark ? colors.yellow : '#a86800',
      },
      error: {
        main: isDark ? colors.red : '#c43f48',
      },
      background: {
        default: palette.canvas,
        paper: palette.surface,
      },
      text: {
        primary: palette.text,
        secondary: palette.muted,
      },
      divider: alpha(palette.border, isDark ? 0.72 : 0.44),
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily:
        "'Public Sans', 'Inter', 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h1: {
        fontWeight: 850,
        letterSpacing: '-0.05em',
      },
      h2: {
        fontWeight: 800,
        letterSpacing: '-0.035em',
      },
      h3: {
        fontWeight: 750,
        letterSpacing: '-0.025em',
      },
      button: {
        fontWeight: 750,
        letterSpacing: '-0.01em',
        textTransform: 'none',
      },
      caption: {
        color: palette.muted,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.canvas,
          },
          a: {
            color: 'inherit',
          },
          '*:focus-visible': {
            outline: `3px solid ${alpha(colors.cyan, 0.34)}`,
            outlineOffset: 3,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            color: palette.text,
            background: alpha(
              isDark ? colors.dark.canvas : colors.light.surface,
              0.88
            ),
            backgroundImage: 'none',
            borderBottom: `1px solid ${alpha(palette.border, 0.56)}`,
            boxShadow: 'none',
            backdropFilter: 'blur(18px)',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: 64,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            color: palette.text,
            background: alpha(palette.surface, 0.96),
            backgroundImage: 'none',
            borderColor: alpha(palette.border, 0.56),
            backdropFilter: 'blur(18px)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderColor: alpha(palette.border, 0.52),
          },
          elevation1: {
            border: `1px solid ${alpha(palette.border, 0.52)}`,
            boxShadow: 'none',
          },
          elevation3: {
            border: `1px solid ${alpha(palette.border, 0.52)}`,
            boxShadow: isDark
              ? '0 22px 58px rgb(0 0 0 / 32%)'
              : '0 22px 58px rgb(39 47 55 / 14%)',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 42,
            borderRadius: 8,
            paddingInline: 18,
          },
          containedPrimary: {
            backgroundColor: colors.cyan,
            color: '#041012',
            '&:hover': {
              backgroundColor: colors.cyanSoft,
            },
          },
          outlined: {
            borderColor: alpha(palette.border, 0.82),
            '&:hover': {
              borderColor: colors.cyan,
              backgroundColor: alpha(colors.cyan, 0.08),
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover': {
              backgroundColor: alpha(colors.cyan, 0.1),
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: alpha(
              isDark ? colors.dark.canvas : colors.light.surface,
              0.72
            ),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(palette.border, 0.72),
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(colors.cyan, 0.72),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.cyan,
              borderWidth: 1,
              boxShadow: `0 0 0 3px ${alpha(colors.cyan, 0.12)}`,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              color: colors.cyan,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: `1px solid ${alpha(palette.border, 0.72)}`,
            borderRadius: 12,
            backgroundColor: palette.surface,
            boxShadow: isDark
              ? '0 28px 84px rgb(0 0 0 / 52%)'
              : '0 28px 84px rgb(39 47 55 / 20%)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            padding: '8px 10px',
            border: `1px solid ${alpha(palette.border, 0.68)}`,
            borderRadius: 6,
            backgroundColor: isDark ? '#071018' : '#ffffff',
            color: palette.text,
            fontSize: 12,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            margin: '2px 8px',
            borderRadius: 8,
            '&:hover': {
              backgroundColor: alpha(colors.cyan, 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(colors.cyan, 0.12),
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            color: palette.muted,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: alpha(palette.border, 0.52),
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: colors.cyan,
            textUnderlineOffset: 3,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: colors.cyan,
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: colors.cyan,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            border: `1px solid ${alpha(palette.border, 0.6)}`,
            borderRadius: 8,
          },
        },
      },
    },
  })
}
