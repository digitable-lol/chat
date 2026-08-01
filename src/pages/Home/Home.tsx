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
import { useLocale } from 'contexts/LocaleContext'
import { RoomNameType } from 'lib/RoomNameGenerator'

import { CommunityRoomSelector } from './CommunityRoomSelector'
import { EmbedCodeDialog } from './EmbedCodeDialog'
import { useHome } from './useHome'

export interface HomeProps {
  userId: string
}

export function Home({ userId }: HomeProps) {
  const { hash } = useLocation()
  const { locale, t } = useLocale()
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
                <span>{t('privateRooms')}</span>
              </div>
            </Link>

            <p className="dt-chat-eyebrow">{t('eyebrow')}</p>
            <h1 className="dt-chat-title">{t('title')}</h1>
            <div className="dt-chat-language-summary">
              <article lang={locale}>
                <span>{locale.toUpperCase()}</span>
                <p>{t('summary')}</p>
              </article>
            </div>

            <div className="dt-chat-flow" aria-label={t('connectionFlow')}>
              <div className="dt-chat-flow-step">
                <span>01 / {t('flowFind')}</span>
                <strong>{t('flowFindDescription')}</strong>
              </div>
              <div className="dt-chat-flow-step">
                <span>02 / {t('flowConnect')}</span>
                <strong>{t('flowConnectDescription')}</strong>
              </div>
              <div className="dt-chat-flow-step">
                <span>03 / {t('flowFallback')}</span>
                <strong>{t('flowFallbackDescription')}</strong>
              </div>
            </div>
          </section>

          <form className="dt-chat-setup" onSubmit={handleFormSubmit}>
            <header className="dt-chat-setup-header">
              <span>{t('newConversation')}</span>
              <h2>{t('openRoom')}</h2>
            </header>

            <div className="dt-chat-identity">
              {t('username')}{' '}
              <strong>
                <PeerNameDisplay paragraph={false}>{userId}</PeerNameDisplay>
              </strong>
            </div>

            <FormControl fullWidth>
              <TextField
                label={t('roomName')}
                value={roomName}
                onChange={handleRoomNameChange}
                InputProps={{
                  endAdornment: (
                    <Tooltip title={t('generateRoomName')}>
                      <IconButton
                        aria-label={t('regenerateRoomId')}
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
              aria-label={t('roomNameType')}
              size="small"
              fullWidth
              sx={{ mt: 2 }}
            >
              <ToggleButton value={RoomNameType.UUID} aria-label="UUID">
                UUID
              </ToggleButton>
              <ToggleButton
                value={RoomNameType.PASSPHRASE}
                aria-label={t('passphrase')}
              >
                {t('passphrase')}
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
                {t('joinPublicRoom')}
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={!isRoomNameValid}
                startIcon={<LockRounded />}
                onClick={handleJoinPrivateRoomClick}
              >
                {t('joinPrivateRoom')}
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
              {t('getEmbedCode')}
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

            <footer className="dt-chat-setup-footer">{t('setupFooter')}</footer>
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
                {t('connectionPlainLanguage')}
              </p>
              <h2 id="connection-guide-title">{t('connectionTitle')}</h2>
            </div>
            <div className="dt-chat-connection-intro">
              <p lang={locale}>{t('connectionIntro')}</p>
            </div>
          </header>

          <div className="dt-chat-connection-steps">
            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <LinkRounded />
              </div>
              <span className="dt-chat-connection-step-number">01</span>
              <h3>{t('shareLink')}</h3>
              <p lang={locale}>{t('shareLinkDescription')}</p>
            </article>

            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <HubRounded />
              </div>
              <span className="dt-chat-connection-step-number">02</span>
              <h3>{t('findEachOther')}</h3>
              <p lang={locale}>{t('findEachOtherDescription')}</p>
            </article>

            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <DevicesRounded />
              </div>
              <span className="dt-chat-connection-step-number">03</span>
              <h3>{t('connectDirectly')}</h3>
              <p lang={locale}>{t('connectDirectlyDescription')}</p>
            </article>

            <article className="dt-chat-connection-step">
              <div className="dt-chat-connection-step-icon" aria-hidden="true">
                <AltRouteRounded />
              </div>
              <span className="dt-chat-connection-step-number">04</span>
              <h3>{t('useTurn')}</h3>
              <p lang={locale}>{t('useTurnDescription')}</p>
            </article>
          </div>

          <div className="dt-chat-connection-status-guide">
            <strong>{t('statusMeaning')}</strong>
            <div>
              <span>
                <i className="is-direct" />
                {t('statusDirect')}
              </span>
              <span>
                <i className="is-relay" />
                {t('statusRelay')}
              </span>
              <span>
                <i className="is-searching" />
                {t('statusSearching')}
              </span>
            </div>
            <p>{t('statusGuide')}</p>
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
