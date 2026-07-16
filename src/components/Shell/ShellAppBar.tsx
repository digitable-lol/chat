import { styled, useTheme } from '@mui/material/styles'

import IconButton from '@mui/material/IconButton'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Fab from '@mui/material/Fab'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'
import Zoom from '@mui/material/Zoom'
import Divider from '@mui/material/Divider'

import ExpandMore from '@mui/icons-material/ExpandMore'
import Fullscreen from '@mui/icons-material/Fullscreen'
import FullscreenExit from '@mui/icons-material/FullscreenExit'
import Link from '@mui/icons-material/Link'
import Menu from '@mui/icons-material/Menu'
import QrCode2 from '@mui/icons-material/QrCode2'
import RoomPreferences from '@mui/icons-material/RoomPreferences'
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded'

import { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { ShellContext } from 'contexts/ShellContext'
import { routes } from 'config/routes'
import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'

import { drawerWidth } from './Drawer'
import { peerListWidth } from './PeerList'

interface AppBarProps extends MuiAppBarProps {
  isDrawerOpen?: boolean
  isPeerListOpen?: boolean
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop =>
    prop !== 'isDrawerOpen' && prop !== 'isPeerListOpen',
})<AppBarProps>(({ theme, isDrawerOpen, isPeerListOpen }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isDrawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  }),
  ...(isPeerListOpen && {
    width: `calc(100% - ${peerListWidth}px)`,
    marginRight: `${peerListWidth}px`,
  }),
  ...((isDrawerOpen || isPeerListOpen) && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(isDrawerOpen &&
    isPeerListOpen && {
      width: `calc(100% - ${drawerWidth}px - ${peerListWidth}px)`,
    }),
}))

interface ShellAppBarProps {
  onDrawerOpen: () => void
  onLinkButtonClick: () => Promise<void>
  isDrawerOpen: boolean
  isPeerListOpen: boolean
  title: string
  onPeerListClick: () => void
  onRoomControlsClick: () => void
  setIsQRCodeDialogOpen: (isOpen: boolean) => void
  showAppBar: boolean
  isFullscreen: boolean
  setIsFullscreen: (isFullscreen: boolean) => void
}

export const ShellAppBar = ({
  onDrawerOpen,
  onLinkButtonClick,
  isDrawerOpen,
  isPeerListOpen,
  setIsQRCodeDialogOpen,
  title,
  onPeerListClick,
  onRoomControlsClick,
  showAppBar,
  isFullscreen,
  setIsFullscreen,
}: ShellAppBarProps) => {
  const theme = useTheme()
  const { peerList, isEmbedded, showRoomControls, roomId } =
    useContext(ShellContext)
  const handleQRCodeClick = () => setIsQRCodeDialogOpen(true)
  const onClickFullscreen = () => setIsFullscreen(!isFullscreen)
  const hasActiveRoom = typeof roomId === 'string'

  return (
    <>
      <Slide appear={false} in={showAppBar} mountOnEnter unmountOnExit>
        <AppBar
          position="fixed"
          isDrawerOpen={isDrawerOpen}
          isPeerListOpen={isPeerListOpen}
        >
          <Toolbar
            variant="regular"
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            {!isEmbedded && (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="Open menu"
                  sx={{ ...(isDrawerOpen && { display: 'none' }) }}
                  onClick={onDrawerOpen}
                >
                  <Menu />
                </IconButton>
                <Box
                  component={RouterLink}
                  to={routes.ROOT}
                  aria-label="Digitable Chat home"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: 0,
                    mr: 'auto',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <Box
                    component="img"
                    src={ChatMark}
                    alt=""
                    sx={{ width: 34, height: 34, flexShrink: 0 }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 850,
                        letterSpacing: '0.06em',
                        lineHeight: 1.1,
                        textTransform: 'uppercase',
                      }}
                    >
                      Digitable Chat
                    </Typography>
                    <Tooltip title={title}>
                      <Typography
                        noWrap
                        sx={{
                          display: { xs: 'none', sm: 'block' },
                          maxWidth: { sm: 220, md: 420 },
                          color: 'text.secondary',
                          fontFamily: 'var(--digitable-font-mono)',
                          fontSize: 10,
                          lineHeight: 1.4,
                        }}
                      >
                        {title}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Box>
              </>
            )}

            {hasActiveRoom && !isEmbedded && (
              <>
                <Tooltip title="Copy room link">
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="Copy room link"
                    onClick={onLinkButtonClick}
                  >
                    <Link />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Show room QR code">
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="Show room QR code"
                    onClick={handleQRCodeClick}
                  >
                    <QrCode2 />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {hasActiveRoom && !isEmbedded ? (
              <Divider
                orientation="vertical"
                sx={{ height: theme.spacing(3.5), mx: theme.spacing(1) }}
              />
            ) : null}
            {hasActiveRoom && (
              <>
                <Tooltip
                  title={
                    showRoomControls
                      ? 'Hide room controls'
                      : 'Show room controls'
                  }
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="Show room controls"
                    onClick={onRoomControlsClick}
                  >
                    <RoomPreferences />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label="Fullscreen"
                    onClick={onClickFullscreen}
                  >
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Show participants and connection status">
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="Peer list"
                    onClick={onPeerListClick}
                    sx={{ ml: 0.5 }}
                  >
                    <Badge badgeContent={peerList.length + 1} color="primary">
                      <PeopleAltRounded />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
      <Zoom
        style={{ position: 'absolute', left: '16px', top: '16px' }}
        in={!showAppBar}
        unmountOnExit
      >
        <Tooltip title="Show room controls">
          <Fab
            size="small"
            aria-label="show room controls"
            color="primary"
            onClick={onRoomControlsClick}
          >
            <ExpandMore />
          </Fab>
        </Tooltip>
      </Zoom>
    </>
  )
}
