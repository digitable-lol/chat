import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import CachedRounded from '@mui/icons-material/CachedRounded'
import LockRounded from '@mui/icons-material/LockRounded'
import PublicRounded from '@mui/icons-material/PublicRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'

import { v4 as uuid } from 'uuid'

import { routes } from 'config/routes'
import { ShellContext } from 'contexts/ShellContext'
import { PeerNameDisplay } from 'components/PeerNameDisplay'
import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'

import { EmbedCodeDialog } from './EmbedCodeDialog'

interface HomeProps {
  userId: string
}

type RoomPrivacy = 'public' | 'private'

export function Home({ userId }: HomeProps) {
  const { setTitle } = useContext(ShellContext)
  const [roomName, setRoomName] = useState(uuid())
  const [roomPrivacy, setRoomPrivacy] = useState<RoomPrivacy>('public')
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTitle('Digitable Chat')
  }, [setTitle])

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value)
  }

  const openRoom = () => {
    navigate(`/${roomPrivacy}/${roomName}`)
  }

  const handleFormSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (roomName.trim()) {
      openRoom()
    }
  }

  const isRoomNameValid = roomName.trim().length > 0

  return (
    <Box className="Home dt-chat-home">
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
            Your local identity:{' '}
            <strong>
              <PeerNameDisplay paragraph={false}>{userId}</PeerNameDisplay>
            </strong>
          </div>

          <FormControl fullWidth>
            <TextField
              label="Room name"
              value={roomName}
              onChange={handleRoomNameChange}
              helperText="Generated on this device. Keep it long if the room should be hard to guess."
              InputProps={{
                endAdornment: (
                  <Tooltip title="Generate a new room name">
                    <IconButton
                      aria-label="Generate a new room name"
                      onClick={() => setRoomName(uuid())}
                      size="small"
                    >
                      <CachedRounded />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </FormControl>

          <div
            className="dt-chat-room-options"
            role="group"
            aria-label="Room privacy"
          >
            <button
              className={`dt-chat-room-option ${
                roomPrivacy === 'public' ? 'is-selected' : ''
              }`}
              type="button"
              aria-pressed={roomPrivacy === 'public'}
              onClick={() => setRoomPrivacy('public')}
            >
              <strong>
                <PublicRounded
                  aria-hidden="true"
                  sx={{ mr: 0.75, fontSize: 17, verticalAlign: 'text-bottom' }}
                />
                Link access
              </strong>
              <span>Anyone with the room URL can join.</span>
            </button>
            <button
              className={`dt-chat-room-option ${
                roomPrivacy === 'private' ? 'is-selected' : ''
              }`}
              type="button"
              aria-pressed={roomPrivacy === 'private'}
              onClick={() => setRoomPrivacy('private')}
            >
              <strong>
                <LockRounded
                  aria-hidden="true"
                  sx={{ mr: 0.75, fontSize: 17, verticalAlign: 'text-bottom' }}
                />
                Password access
              </strong>
              <span>Peers must enter the same password.</span>
            </button>
          </div>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={!isRoomNameValid}
            endIcon={<ArrowForwardRounded />}
          >
            Open {roomPrivacy === 'private' ? 'private' : 'link'} room
          </Button>

          <Button
            type="button"
            variant="text"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
            disabled={!isRoomNameValid}
            onClick={() => setShowEmbedCode(true)}
          >
            Embed this room in another product
          </Button>

          <footer className="dt-chat-setup-footer">
            No account. No conversation history on a server. Built by{' '}
            <a href="https://digitable.life" target="_blank" rel="noreferrer">
              Digitable
            </a>{' '}
            on the open-source Chitchatter foundation.
          </footer>
        </form>
      </div>

      <EmbedCodeDialog
        showEmbedCode={showEmbedCode}
        handleEmbedCodeWindowClose={() => setShowEmbedCode(false)}
        roomName={roomName}
      />
    </Box>
  )
}
