import { useContext } from 'react'
import { Link } from 'react-router-dom'

import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import CachedRounded from '@mui/icons-material/CachedRounded'
import LockRounded from '@mui/icons-material/LockRounded'
import PublicRounded from '@mui/icons-material/PublicRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'

import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'
import { EnhancedConnectivityControl } from 'components/EnhancedConnectivityControl'
import { Main } from 'components/Elements'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import { isEnhancedConnectivityAvailable } from 'config/enhancedConnectivity'
import { routes } from 'config/routes'
import { SettingsContext } from 'contexts/SettingsContext'
import { RoomNameType } from 'lib/RoomNameGenerator'

import { CommunityRoomSelector } from './CommunityRoomSelector'
import { EmbedCodeDialog } from './EmbedCodeDialog'
import { useHome } from './useHome'

export interface HomeProps {
  userId: string
}

export function Home({ userId }: HomeProps) {
  const { updateUserSettings, getUserSettings } = useContext(SettingsContext)
  const { isEnhancedConnectivityEnabled } = getUserSettings()
  const {
    roomName,
    roomNameType,
    showEmbedCode,
    handleRoomNameChange,
    handleRoomNameTypeChange,
    regenerateRoomName,
    handleFormSubmit,
    handleJoinPublicRoomClick,
    handleJoinPrivateRoomClick,
    handleGetEmbedCodeClick,
    handleEmbedCodeWindowClose,
    isRoomNameValid,
  } = useHome()

  return (
    <Box className="Home dt-chat-home">
      <Main>
        <div className="dt-chat-home-grid">
          <section>
            <Link className="dt-chat-brand-lockup" to={routes.ABOUT}>
              <img src={ChatMark} alt="" />
              <div>
                <strong>Digitable Chat</strong>
                <span>Private rooms</span>
              </div>
            </Link>

            <p className="dt-chat-eyebrow">Encrypted peer-to-peer rooms</p>
            <h1 className="dt-chat-title">Talk without leaving a trail.</h1>
            <p className="dt-chat-lead">
              Create a room, share one link, and talk directly between devices.
              WebSocket relays only help peers find each other; messages, calls,
              and media stay inside the encrypted WebRTC connection.
            </p>

            <div className="dt-chat-flow" aria-label="Connection flow">
              <div className="dt-chat-flow-step">
                <span>01 / Discover</span>
                <strong>MQTT signaling over standard WebSockets</strong>
              </div>
              <div className="dt-chat-flow-step">
                <span>02 / Connect</span>
                <strong>Direct encrypted WebRTC whenever possible</strong>
              </div>
              <div className="dt-chat-flow-step">
                <span>03 / Recover</span>
                <strong>TURN relay fallback for restrictive networks</strong>
              </div>
            </div>
          </section>

          <form className="dt-chat-setup" onSubmit={handleFormSubmit}>
            <header className="dt-chat-setup-header">
              <span>New conversation</span>
              <h2>Open a room</h2>
            </header>

            <div className="dt-chat-identity">
              Your username:{' '}
              <strong>
                <PeerNameDisplay paragraph={false}>{userId}</PeerNameDisplay>
              </strong>
            </div>

            <FormControl fullWidth>
              <TextField
                label="Room name (generated on your device)"
                value={roomName}
                onChange={handleRoomNameChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Generate a new room name">
                      <IconButton
                        aria-label="Regenerate room id"
                        onClick={regenerateRoomName}
                        size="small"
                      >
                        <CachedRounded />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </FormControl>

            <ToggleButtonGroup
              value={roomNameType}
              exclusive
              onChange={handleRoomNameTypeChange}
              aria-label="Room name type"
              size="small"
              fullWidth
              sx={{ mt: 2 }}
            >
              <ToggleButton value={RoomNameType.UUID} aria-label="UUID">
                UUID
              </ToggleButton>
              <ToggleButton
                value={RoomNameType.PASSPHRASE}
                aria-label="Passphrase"
              >
                Passphrase
              </ToggleButton>
            </ToggleButtonGroup>

            <div className="dt-chat-room-options">
              <Button
                type="button"
                variant="contained"
                disabled={!isRoomNameValid}
                startIcon={<PublicRounded />}
                endIcon={<ArrowForwardRounded />}
                onClick={handleJoinPublicRoomClick}
              >
                Join public room
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={!isRoomNameValid}
                startIcon={<LockRounded />}
                onClick={handleJoinPrivateRoomClick}
              >
                Join private room
              </Button>
            </div>

            <Button
              type="button"
              variant="text"
              size="small"
              fullWidth
              disabled={!isRoomNameValid}
              onClick={handleGetEmbedCodeClick}
            >
              Get embed code
            </Button>

            {isEnhancedConnectivityAvailable && (
              <EnhancedConnectivityControl
                isEnabled={isEnhancedConnectivityEnabled}
                onChange={(_event, enabled) =>
                  updateUserSettings({
                    isEnhancedConnectivityEnabled: enabled,
                  })
                }
                elevation={0}
                sx={{ p: 1.5, mt: 1.5, mb: 0 }}
              />
            )}

            <footer className="dt-chat-setup-footer">
              No account. No conversation history on a server. Built by{' '}
              <a href="https://digitable.life" target="_blank" rel="noreferrer">
                Digitable
              </a>{' '}
              on the open-source Chitchatter foundation.
            </footer>
          </form>
        </div>

        <Box sx={{ maxWidth: 720, mx: 'auto', mt: 4, px: 2 }}>
          <CommunityRoomSelector />
        </Box>
      </Main>

      <EmbedCodeDialog
        showEmbedCode={showEmbedCode}
        handleEmbedCodeWindowClose={handleEmbedCodeWindowClose}
        roomName={roomName}
      />
    </Box>
  )
}
