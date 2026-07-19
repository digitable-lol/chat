const parseUrls = (value?: string) =>
  value
    ?.split(',')
    .map(url => url.trim())
    .filter(Boolean) ?? []

const defaultStunServers: RTCIceServer[] = [
  {
    urls: [
      'stun:stun.cloudflare.com:3478',
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
    ],
  },
]

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

export const rtcConfig: RTCConfiguration = {
  iceServers: [...defaultStunServers, ...staticTurnServers],
  iceCandidatePoolSize: 4,
  iceTransportPolicy:
    import.meta.env.VITE_ICE_TRANSPORT_POLICY === 'relay' ? 'relay' : 'all',
}
