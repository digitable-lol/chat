import { RelayConfig } from 'trystero'

const parseUrls = (value?: string) =>
  value
    ?.split(',')
    .map(url => url.trim())
    .filter(Boolean) ?? []

const relayUrls = [
  ...parseUrls(import.meta.env.VITE_SIGNALING_RELAY_URLS),
  ...parseUrls(import.meta.env.VITE_SIGNALING_RELAY_URL),
]

const requestedRedundancy = Number(
  import.meta.env.VITE_SIGNALING_RELAY_REDUNDANCY ?? 3
)

export const signalingConfig: RelayConfig = {
  relayRedundancy:
    Number.isFinite(requestedRedundancy) && requestedRedundancy > 0
      ? Math.floor(requestedRedundancy)
      : 3,
  ...(relayUrls.length
    ? {
        relayUrls: Array.from(new Set(relayUrls)),
      }
    : {}),
}
