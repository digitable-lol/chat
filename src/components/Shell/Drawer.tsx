import { PropsWithChildren, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Home from '@mui/icons-material/Home'
import SettingsApplications from '@mui/icons-material/SettingsRounded'
import QuestionMark from '@mui/icons-material/QuestionMark'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import ReportIcon from '@mui/icons-material/Report'
import GitInfo from 'react-git-info/macro'

import { routes } from 'config/routes'
import { SettingsContext } from 'contexts/SettingsContext'
import { ColorMode } from 'models/settings'
import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'

const { commit } = GitInfo()

export const drawerWidth = 264

export interface DrawerProps extends PropsWithChildren {
  isDrawerOpen: boolean
  onDrawerClose: () => void
  theme: Theme
}

export const Drawer = ({ isDrawerOpen, onDrawerClose, theme }: DrawerProps) => {
  const settingsContext = useContext(SettingsContext)
  const colorMode = settingsContext.getUserSettings().colorMode

  const handleColorModeToggleClick = () => {
    const newMode =
      colorMode === ColorMode.LIGHT ? ColorMode.DARK : ColorMode.LIGHT
    settingsContext.updateUserSettings({ colorMode: newMode })
  }

  return (
    <MuiDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
    >
      <Box
        sx={theme => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: theme.spacing(0, 1.5),
          // necessary for drawer content to be pushed below app bar
          ...theme.mixins.toolbar,
          justifyContent: 'space-between',
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={ChatMark}
            alt=""
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 850,
                letterSpacing: '0.05em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              Digitable Chat
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontFamily: 'var(--digitable-font-mono)',
                fontSize: 9,
              }}
            >
              encrypted rooms
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onDrawerClose} aria-label="Close menu">
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </Box>
      <Divider />
      <List role="navigation" aria-label="Navigation menu">
        <Link
          to={routes.ROOT}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="New room" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to={routes.SETTINGS}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsApplications />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to={routes.ABOUT}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <QuestionMark />
              </ListItemIcon>
              <ListItemText primary="About Digitable Chat" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          to={routes.DISCLAIMER}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Disclaimer" />
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem disablePadding>
          <ListItemButton onClick={handleColorModeToggleClick}>
            <ListItemIcon>
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                theme.palette.mode === 'dark'
                  ? 'Use light theme'
                  : 'Use dark theme'
              }
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <Typography variant="subtitle2">
            Build signature:{' '}
            <Typography
              sx={{
                fontFamily: 'monospace',
                display: 'inline',
              }}
            >
              <MuiLink
                target="_blank"
                rel="noopener"
                href={`${import.meta.env.VITE_GITHUB_REPO}/commit/${
                  commit.hash
                }`}
              >
                {commit.shortHash}
              </MuiLink>
            </Typography>
          </Typography>
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto', p: 2, color: 'text.secondary' }}>
        <Typography sx={{ fontSize: 11, lineHeight: 1.55 }}>
          Signaling uses standard WebSocket relays. Room traffic stays
          peer-to-peer and encrypted.
        </Typography>
      </Box>
    </MuiDrawer>
  )
}
