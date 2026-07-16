import { getRelaySockets } from 'trystero/mqtt'
import { rtcConfig } from 'config/rtcConfig'
import { parseCandidate } from 'sdp'

export enum ConnectionTestEvents {
  HAS_HOST_CHANGED = 'HAS_HOST_CHANGED',
  HAS_RELAY_CHANGED = 'HAS_RELAY_CHANGED',
}

export enum SignalingConnection {
  SEARCHING = 'SEARCHING',
  CONNECTED = 'CONNECTED',
  FAILED = 'FAILED',
}

export type ConnectionTestEvent = CustomEvent<ConnectionTest>

const checkExpirationTime = 10 * 1000

export class ConnectionTest extends EventTarget {
  signalingConnection = SignalingConnection.SEARCHING
  hasHost = false
  hasRelay = false

  rtcPeerConnection?: RTCPeerConnection

  private rtcCheckTimeouts: number[] = []

  async initRtcPeerConnectionTest() {
    if (typeof RTCPeerConnection === 'undefined') return

    this.rtcPeerConnection = new RTCPeerConnection(rtcConfig)

    const hasHostCheckTimeout = window.setTimeout(() => {
      this.hasHost = false

      this.dispatchEvent(
        new CustomEvent(ConnectionTestEvents.HAS_HOST_CHANGED, {
          detail: this,
        })
      )
    }, checkExpirationTime)

    const hasRelayCheckTimeout = window.setTimeout(() => {
      this.hasRelay = false

      this.dispatchEvent(
        new CustomEvent(ConnectionTestEvents.HAS_RELAY_CHANGED, {
          detail: this,
        })
      )
    }, checkExpirationTime)

    this.rtcCheckTimeouts = [hasHostCheckTimeout, hasRelayCheckTimeout]

    this.rtcPeerConnection.addEventListener('icecandidate', event => {
      if (event.candidate?.candidate.length) {
        const parsedCandidate = parseCandidate(event.candidate.candidate)
        let eventType: ConnectionTestEvents | undefined

        switch (parsedCandidate.type) {
          case 'host':
            clearTimeout(hasHostCheckTimeout)
            this.hasHost = window.navigator.onLine
            eventType = ConnectionTestEvents.HAS_HOST_CHANGED
            break

          case 'relay':
            clearTimeout(hasRelayCheckTimeout)
            this.hasRelay = window.navigator.onLine
            eventType = ConnectionTestEvents.HAS_RELAY_CHANGED
            break
        }

        if (typeof eventType !== 'undefined') {
          this.dispatchEvent(
            new CustomEvent(eventType, {
              detail: this,
            })
          )
        }
      }
    })

    try {
      const rtcSessionDescription = await this.rtcPeerConnection.createOffer({
        offerToReceiveAudio: true,
      })

      await this.rtcPeerConnection.setLocalDescription(rtcSessionDescription)
    } catch (error) {
      console.warn('WebRTC connectivity test could not create an offer.', error)
    }
  }

  destroyRtcPeerConnectionTest() {
    this.rtcCheckTimeouts.forEach(timeout => window.clearTimeout(timeout))
    this.rtcCheckTimeouts = []
    this.rtcPeerConnection?.close()
  }

  testSignalingConnection() {
    const relaySockets = Object.values(getRelaySockets()).filter(Boolean)

    if (relaySockets.length === 0) {
      this.signalingConnection = SignalingConnection.SEARCHING
      return this.signalingConnection
    }

    const readyStates = relaySockets.map(({ readyState }) => readyState)

    if (readyStates.every(readyState => readyState === WebSocket.CLOSED)) {
      this.signalingConnection = SignalingConnection.FAILED
      throw new Error('Could not connect to an MQTT signaling relay')
    }

    this.signalingConnection = readyStates.some(
      readyState => readyState === WebSocket.OPEN
    )
      ? SignalingConnection.CONNECTED
      : SignalingConnection.SEARCHING

    return this.signalingConnection
  }
}
