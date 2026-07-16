import { useEffect, useState } from 'react'

import { sleep } from 'lib/sleep'
import {
  ConnectionTest,
  ConnectionTestEvent,
  ConnectionTestEvents,
  SignalingConnection,
} from 'lib/ConnectionTest'

export interface ConnectionTestResults {
  hasHost: boolean
  hasRelay: boolean
  signalingConnection: SignalingConnection
}

const rtcPollInterval = 20 * 1000
const signalingPollInterval = 5 * 1000

export const useConnectionTest = () => {
  const [hasHost, setHasHost] = useState(false)
  const [hasRelay, setHasRelay] = useState(false)
  const [signalingConnection, setSignalingConnection] = useState(
    SignalingConnection.SEARCHING
  )

  useEffect(() => {
    let active = true
    let currentRtcTest: ConnectionTest | undefined

    const checkRtcConnection = async () => {
      const connectionTest = new ConnectionTest()
      currentRtcTest = connectionTest

      const handleHasHostChanged = ((event: ConnectionTestEvent) => {
        if (active) setHasHost(event.detail.hasHost)

        connectionTest.removeEventListener(
          ConnectionTestEvents.HAS_HOST_CHANGED,
          handleHasHostChanged
        )
      }) as EventListener

      connectionTest.addEventListener(
        ConnectionTestEvents.HAS_HOST_CHANGED,
        handleHasHostChanged
      )

      const handleHasRelayChanged = ((event: ConnectionTestEvent) => {
        if (active) setHasRelay(event.detail.hasRelay)

        connectionTest.removeEventListener(
          ConnectionTestEvents.HAS_RELAY_CHANGED,
          handleHasRelayChanged
        )
      }) as EventListener

      connectionTest.addEventListener(
        ConnectionTestEvents.HAS_RELAY_CHANGED,
        handleHasRelayChanged
      )

      window.setTimeout(() => {
        connectionTest.removeEventListener(
          ConnectionTestEvents.HAS_HOST_CHANGED,
          handleHasHostChanged
        )
        connectionTest.removeEventListener(
          ConnectionTestEvents.HAS_RELAY_CHANGED,
          handleHasRelayChanged
        )
      }, rtcPollInterval)

      try {
        await connectionTest.initRtcPeerConnectionTest()
      } catch (error) {
        if (active) {
          setHasHost(false)
          setHasRelay(false)
        }
        console.error(error)
      }

      return connectionTest
    }

    const pollRtc = async () => {
      while (active) {
        const connectionTest = await checkRtcConnection()
        await sleep(rtcPollInterval)
        connectionTest.destroyRtcPeerConnectionTest()
      }
    }

    const pollSignaling = async () => {
      while (active) {
        try {
          const result = new ConnectionTest().testSignalingConnection()
          if (active) setSignalingConnection(result)
        } catch (error) {
          if (active) setSignalingConnection(SignalingConnection.FAILED)
        }

        await sleep(signalingPollInterval)
      }
    }

    void pollRtc()
    void pollSignaling()

    return () => {
      active = false
      currentRtcTest?.destroyRtcPeerConnectionTest()
    }
  }, [])

  return {
    connectionTestResults: { hasHost, hasRelay, signalingConnection },
  }
}
