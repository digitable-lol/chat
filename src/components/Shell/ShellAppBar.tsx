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
import MenuRounded from '@mui/icons-material/MenuRounded'
import QrCode2 from '@mui/icons-material/QrCode2'
import RoomPreferences from '@mui/icons-material/RoomPreferences'
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded'

import { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { ShellContext } from 'contexts/ShellContext'
import { useLocale } from 'contexts/LocaleContext'
import { routes } from 'config/routes'
import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'
import { LanguageSwitch } from 'components/LanguageSwitch/LanguageSwitch'

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

const languageOptions = [
  { label: 'RU', value: 'ru' as const },
  { label: 'EN', value: 'en' as const },
]

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
  const { locale, setLocale, t } = useLocale()
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
                  aria-label={t('openMenu')}
                  sx={{
                    width: 42,
                    height: 42,
                    border: 1,
                    borderColor: 'divider',
                    backgroundColor: 'rgba(0, 229, 229, 0.05)',
                    ...(isDrawerOpen && { display: 'none' }),
                  }}
                  onClick={onDrawerOpen}
                >
                  <MenuRounded />
                </IconButton>
                <Box
                  component={RouterLink}
                  to={routes.ROOT}
                  aria-label={t('homeLabel')}
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

            {!isEmbedded && (
              <LanguageSwitch
                ariaLabel={t('language')}
                options={languageOptions}
                value={locale}
                onChange={setLocale}
              />
            )}

            {hasActiveRoom && !isEmbedded && (
              <>
                <Tooltip title={t('copyRoomLink')}>
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label={t('copyRoomLink')}
                    onClick={onLinkButtonClick}
                  >
                    <Link />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('showRoomQr')}>
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label={t('showRoomQr')}
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
                      ? t('hideRoomControls')
                      : t('showRoomControls')
                  }
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label={t('showRoomControls')}
                    onClick={onRoomControlsClick}
                  >
                    <RoomPreferences />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    isFullscreen ? t('exitFullscreen') : t('enterFullscreen')
                  }
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    aria-label={
                      isFullscreen ? t('exitFullscreen') : t('enterFullscreen')
                    }
                    onClick={onClickFullscreen}
                  >
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('participants')}>
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label={t('peerList')}
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
        <Tooltip title={t('showRoomControls')}>
          <Fab
            size="small"
            aria-label={t('showRoomControls')}
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
