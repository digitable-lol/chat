import { PropsWithChildren, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'

import AltRouteRounded from '@mui/icons-material/AltRouteRounded'
import Brightness4Rounded from '@mui/icons-material/Brightness4Rounded'
import Brightness7Rounded from '@mui/icons-material/Brightness7Rounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import HubRounded from '@mui/icons-material/HubRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import PolicyRounded from '@mui/icons-material/PolicyRounded'
import SettingsRounded from '@mui/icons-material/SettingsRounded'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiDrawer from '@mui/material/Drawer'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import GitInfo from 'react-git-info/macro'

import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'
import { routes } from 'config/routes'
import { SettingsContext } from 'contexts/SettingsContext'
import { ColorMode } from 'models/settings'

const { commit } = GitInfo()

export const drawerWidth = 304

export interface DrawerProps extends PropsWithChildren {
  isDrawerOpen: boolean
  onDrawerClose: () => void
}

export const Drawer = ({ isDrawerOpen, onDrawerClose }: DrawerProps) => {
  const theme = useTheme()
  const location = useLocation()
  const settingsContext = useContext(SettingsContext)
  const colorMode = settingsContext.getUserSettings().colorMode

  const handleColorModeToggleClick = () => {
    const newMode =
      colorMode === ColorMode.LIGHT ? ColorMode.DARK : ColorMode.LIGHT

    settingsContext.updateUserSettings({ colorMode: newMode })
  }

  const navigationItems = [
    {
      to: routes.ROOT,
      label: 'Home / Главная',
      description: 'Start or join a room',
      icon: <HomeRounded />,
      selected: location.pathname === routes.ROOT && !location.hash,
    },
    {
      to: `${routes.ROOT}#how-it-connects`,
      label: 'Connection / Подключение',
      description: 'MQTT, WebRTC, and TURN',
      icon: <HubRounded />,
      selected:
        location.pathname === routes.ROOT &&
        location.hash === '#how-it-connects',
    },
    {
      to: routes.SETTINGS,
      label: 'Settings / Настройки',
      description: 'Privacy, sound, and network',
      icon: <SettingsRounded />,
      selected: location.pathname === routes.SETTINGS,
    },
    {
      to: routes.ABOUT,
      label: 'About / О проекте',
      description: 'What Digitable Chat is',
      icon: <InfoRounded />,
      selected: location.pathname === routes.ABOUT,
    },
    {
      to: routes.DISCLAIMER,
      label: 'Legal / Условия',
      description: 'Use and responsibility',
      icon: <PolicyRounded />,
      selected: location.pathname === routes.DISCLAIMER,
    },
  ]

  return (
    <MuiDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.07
          )}, transparent 180px), ${theme.palette.background.paper}`,
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
    >
      <Box
        sx={{
          minHeight: 88,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <Box
          component={Link}
          to={routes.ROOT}
          onClick={onDrawerClose}
          aria-label="Digitable Chat home"
          sx={{
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            mr: 'auto',
            color: 'text.primary',
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src={ChatMark}
            alt=""
            sx={{ width: 42, height: 42, flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 850,
                letterSpacing: '0.05em',
                lineHeight: 1.15,
                textTransform: 'uppercase',
              }}
            >
              Digitable Chat
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: 'primary.main',
                fontFamily: 'var(--digitable-font-mono)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Private P2P rooms
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onDrawerClose}
          aria-label="Close menu"
          sx={{
            width: 38,
            height: 38,
            border: 1,
            borderColor: 'divider',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <Box
        component="nav"
        aria-label="Navigation menu"
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, py: 2 }}
      >
        <Typography
          sx={{
            px: 2.25,
            color: 'text.secondary',
            fontFamily: 'var(--digitable-font-mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          Navigate / Навигация
        </Typography>

        <List sx={{ px: 1, pt: 1.25 }}>
          {navigationItems.map(item => (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={item.selected}
                onClick={onDrawerClose}
                sx={{
                  minHeight: 64,
                  mx: 0,
                  px: 1.25,
                  py: 1,
                  border: '1px solid',
                  borderColor: item.selected
                    ? alpha(theme.palette.primary.main, 0.52)
                    : 'transparent',
                  borderRadius: 1.5,
                  backgroundColor: item.selected
                    ? alpha(theme.palette.primary.main, 0.09)
                    : 'transparent',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.32),
                    backgroundColor: alpha(theme.palette.primary.main, 0.07),
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 52 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'grid',
                      placeItems: 'center',
                      border: '1px solid',
                      borderColor: item.selected
                        ? alpha(theme.palette.primary.main, 0.66)
                        : 'divider',
                      borderRadius: 1.25,
                      backgroundColor: item.selected
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.text.primary, 0.025),
                      color: item.selected ? 'primary.main' : 'text.secondary',
                      '& svg': { fontSize: 21 },
                    }}
                  >
                    {item.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: item.selected ? 760 : 680,
                    lineHeight: 1.25,
                  }}
                  secondaryTypographyProps={{
                    mt: 0.45,
                    color: 'text.secondary',
                    fontSize: 10.5,
                    lineHeight: 1.25,
                  }}
                />
                <ChevronRightRounded
                  sx={{
                    ml: 0.5,
                    color: item.selected ? 'primary.main' : 'text.secondary',
                    fontSize: 18,
                    opacity: item.selected ? 1 : 0.55,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ px: 2, mt: 0.5 }}>
          <Box
            sx={{
              p: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.035),
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary',
                fontFamily: 'var(--digitable-font-mono)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Connection path
            </Typography>
            <Box
              aria-label="MQTT to WebRTC with TURN fallback"
              sx={{
                mt: 1.25,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                color: 'text.secondary',
              }}
            >
              <HubRounded sx={{ color: 'primary.main', fontSize: 19 }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 700 }}>
                MQTT
              </Typography>
              <ChevronRightRounded sx={{ fontSize: 15, opacity: 0.5 }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 700 }}>
                WebRTC
              </Typography>
              <AltRouteRounded sx={{ color: 'warning.main', fontSize: 18 }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 700 }}>
                TURN
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', px: 1, pt: 2 }}>
          <Divider sx={{ mb: 1.25 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleColorModeToggleClick}
              aria-label="Change theme"
              sx={{
                minHeight: 58,
                mx: 0,
                px: 1.25,
                border: '1px solid',
                borderColor: 'transparent',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 46 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'grid',
                    placeItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.25,
                    color: 'primary.main',
                  }}
                >
                  {theme.palette.mode === 'dark' ? (
                    <Brightness7Rounded fontSize="small" />
                  ) : (
                    <Brightness4Rounded fontSize="small" />
                  )}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  theme.palette.mode === 'dark'
                    ? 'Light mode / Светлая'
                    : 'Dark mode / Тёмная'
                }
                secondary="Change appearance"
                primaryTypographyProps={{ fontSize: 12.5, fontWeight: 700 }}
                secondaryTypographyProps={{ fontSize: 10.5 }}
              />
            </ListItemButton>
          </ListItem>

          <Typography
            component="div"
            sx={{
              px: 1.25,
              pt: 1.25,
              color: 'text.secondary',
              fontSize: 10,
            }}
          >
            Build{' '}
            <MuiLink
              target="_blank"
              rel="noopener"
              href={`${import.meta.env.VITE_GITHUB_REPO}/commit/${commit.hash}`}
              sx={{
                fontFamily: 'var(--digitable-font-mono)',
                fontSize: 'inherit',
                fontWeight: 700,
              }}
            >
              {commit.shortHash}
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </MuiDrawer>
  )
}
