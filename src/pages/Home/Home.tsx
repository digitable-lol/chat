import { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import AltRouteRounded from '@mui/icons-material/AltRouteRounded'
import CachedRounded from '@mui/icons-material/CachedRounded'
import DevicesRounded from '@mui/icons-material/DevicesRounded'
import HubRounded from '@mui/icons-material/HubRounded'
import LinkRounded from '@mui/icons-material/LinkRounded'
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
  const { hash } = useLocation()
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

  useEffect(() => {
    const target =
      hash === '#how-it-connects'
        ? document.getElementById('how-it-connects')
        : document.querySelector('.dt-chat-home-grid')

    target?.scrollIntoView?.({
      block: 'start',
    })
  }, [hash])

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
            <div className="dt-chat-language-summary">
              <article lang="en">
                <span>EN</span>
                <p>
                  Create a room and share its link. Your browsers find each
                  other, then open an encrypted connection for messages, calls,
                  screen sharing, and files.
                </p>
              </article>
              <article lang="ru">
                <span>RU</span>
                <p>
                  Создайте комнату и отправьте ссылку. Браузеры найдут друг
                  друга и откроют зашифрованное соединение для сообщений,
                  звонков, экрана и файлов.
                </p>
              </article>
            </div>

            <div className="dt-chat-flow" aria-label="Connection flow">
              <div className="dt-chat-flow-step">
                <span>01 / Find · Найти</span>
                <strong>MQTT + STUN introduce the browsers</strong>
              </div>
              <div className="dt-chat-flow-step">
                <span>02 / Connect · Связать</span>
                <strong>WebRTC connects devices directly</strong>
              </div>
              <div className="dt-chat-flow-step">
                <span>03 / Fallback · Запасной путь</span>
                <strong>TURN helps only when direct access is blocked</strong>
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

        <section
          className="dt-chat-connection-guide"
          id="how-it-connects"
          aria-labelledby="connection-guide-title"
        >
          <header className="dt-chat-connection-guide-header">
            <div>
              <p className="dt-chat-section-label">
                Connection, in plain language / Простыми словами
              </p>
              <h2 id="connection-guide-title">
                How the connection works
                <span>Как работает подключение</span>
              </h2>
            </div>
            <div className="dt-chat-connection-intro">
              <p lang="en">
                Relays help two browsers meet. The conversation itself uses an
                encrypted WebRTC connection and is not stored by Digitable.
              </p>
              <p lang="ru">
                Ретрансляторы помогают двум браузерам встретиться. Сам разговор
                идёт по зашифрованному WebRTC-соединению и не хранится у
                Digitable.
              </p>
            </div>
          </header>

          <div className="dt-chat-connection-steps">
            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <LinkRounded />
              </div>
              <span className="dt-chat-connection-step-number">01</span>
              <h3>Share a link · Отправьте ссылку</h3>
              <p lang="en">
                The room name is created in your browser. A public room opens
                for anyone with its link; a private room also asks for the same
                password.
              </p>
              <p lang="ru">
                Имя комнаты создаётся в вашем браузере. В публичную комнату
                входит любой со ссылкой, а приватная дополнительно просит общий
                пароль.
              </p>
            </article>

            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <HubRounded />
              </div>
              <span className="dt-chat-connection-step-number">02</span>
              <h3>Find each other · Найдите друг друга</h3>
              <p lang="en">
                An MQTT relay exchanges the technical introduction. STUN helps
                each browser learn how it can be reached. Neither carries your
                chat history.
              </p>
              <p lang="ru">
                MQTT-ретранслятор передаёт техническое знакомство, а STUN
                помогает понять доступный сетевой адрес. История переписки через
                них не передаётся.
              </p>
            </article>

            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <DevicesRounded />
              </div>
              <span className="dt-chat-connection-step-number">03</span>
              <h3>Connect directly · Соединитесь напрямую</h3>
              <p lang="en">
                WebRTC sends messages and media through an encrypted connection
                between participants. There is no central server keeping a copy
                of the conversation.
              </p>
              <p lang="ru">
                WebRTC передаёт сообщения и медиа по зашифрованному соединению
                между участниками. Центрального сервера с копией разговора нет.
              </p>
            </article>

            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <AltRouteRounded />
              </div>
              <span className="dt-chat-connection-step-number">04</span>
              <h3>Use TURN if needed · TURN, если иначе нельзя</h3>
              <p lang="en">
                Some office, mobile, or public networks block a direct path.
                TURN then forwards the encrypted WebRTC traffic without reading
                the message content.
              </p>
              <p lang="ru">
                Офисная, мобильная или публичная сеть может блокировать прямой
                путь. Тогда TURN пересылает зашифрованный WebRTC-трафик, не
                читая содержимое сообщений.
              </p>
            </article>
          </div>

          <div className="dt-chat-connection-status-guide">
            <strong>What the status means / Что означает статус</strong>
            <div>
              <span>
                <i className="is-direct" />
                Direct — device to device / напрямую
              </span>
              <span>
                <i className="is-relay" />
                Relay — encrypted through TURN / через TURN
              </span>
              <span>
                <i className="is-searching" />
                Searching — waiting for a peer / ждём участника
              </span>
            </div>
            <p>
              Open the participants panel inside a room to see the connection
              type for each person. / В комнате откройте панель участников — там
              виден тип соединения с каждым человеком.
            </p>
          </div>
        </section>

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
