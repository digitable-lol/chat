const defaultStunServers: RTCIceServer[] = [
  {
    urls: [
      'stun:stun.cloudflare.com:3478',
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
    ],
  },
]

const parseUrls = (value?: string) =>
  value
    ?.split(',')
    .map(url => url.trim())
    .filter(Boolean) ?? []

const staticTurnUrls = parseUrls(import.meta.env.VITE_TURN_URLS)
const staticTurnUsername = import.meta.env.VITE_TURN_USERNAME?.trim()
const staticTurnCredential = import.meta.env.VITE_TURN_CREDENTIAL?.trim()

const staticTurnServers: RTCIceServer[] =
  staticTurnUrls.length && staticTurnUsername && staticTurnCredential
    ? [
        {
          urls: staticTurnUrls,
          username: staticTurnUsername,
          credential: staticTurnCredential,
        },
      ]
    : []

const configuredIceTransportPolicy =
  import.meta.env.VITE_ICE_TRANSPORT_POLICY === 'relay' ? 'relay' : 'all'

export const rtcConfig: RTCConfiguration = {
  iceServers: [...defaultStunServers, ...staticTurnServers],
  iceCandidatePoolSize: 4,
  iceTransportPolicy: configuredIceTransportPolicy,
}

const isIceServer = (value: unknown): value is RTCIceServer => {
  if (!value || typeof value !== 'object') return false

  const { urls } = value as RTCIceServer

  return (
    typeof urls === 'string' ||
    (Array.isArray(urls) &&
      urls.length > 0 &&
      urls.every(url => typeof url === 'string'))
  )
}

const getIceServersFromPayload = (payload: unknown) => {
  const candidates = Array.isArray(payload)
    ? payload
    : (payload as { iceServers?: unknown })?.iceServers

  if (!Array.isArray(candidates)) return []

  return candidates.filter(isIceServer)
}

// TURN credentials should be short-lived and delivered by a server-side
// endpoint. The endpoint may return either an `iceServers` array or an object
// with an `iceServers` property. Static VITE_TURN_* values are supported for
// self-hosted deployments, but no credentials live in this repository.
export const loadRtcConfig = async (
  fetchIceConfig: typeof fetch = fetch
): Promise<RTCConfiguration> => {
  const iceServersUrl = import.meta.env.VITE_ICE_SERVERS_URL?.trim()

  if (!iceServersUrl) return rtcConfig

  const abortController = new AbortController()
  const timeout = window.setTimeout(() => abortController.abort(), 5000)

  try {
    const response = await fetchIceConfig(iceServersUrl, {
      cache: 'no-store',
      signal: abortController.signal,
    })

    if (!response.ok) {
      throw new Error(`ICE configuration request failed: ${response.status}`)
    }

    const remoteIceServers = getIceServersFromPayload(await response.json())

    if (!remoteIceServers.length) {
      throw new Error('ICE configuration did not contain any valid servers')
    }

    rtcConfig.iceServers = [
      ...defaultStunServers,
      ...staticTurnServers,
      ...remoteIceServers,
    ]
  } catch (error) {
    console.warn(
      'Digitable Chat could not load remote TURN credentials; continuing with configured STUN/TURN fallback.',
      error
    )
  } finally {
    window.clearTimeout(timeout)
  }

  return rtcConfig
}
