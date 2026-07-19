import { RelayConfig } from '@trystero-p2p/mqtt'

const parseUrls = (value?: string) =>
  value
    ?.split(',')
    .map(url => url.trim())
    .filter(Boolean)
    .filter(url => {
      try {
        return !new URL(url).hostname.endsWith('.example.com')
      } catch {
        return false
      }
    }) ?? []

const relayUrls = [
  ...parseUrls(import.meta.env.VITE_SIGNALING_RELAY_URLS),
  ...parseUrls(import.meta.env.VITE_SIGNALING_RELAY_URL),
]

const requestedRedundancy = Number(
  import.meta.env.VITE_SIGNALING_RELAY_REDUNDANCY ?? 3
)

export const signalingConfig: RelayConfig = {
  redundancy:
    Number.isFinite(requestedRedundancy) && requestedRedundancy > 0
      ? Math.floor(requestedRedundancy)
      : 3,
  ...(relayUrls.length
    ? {
        urls: Array.from(new Set(relayUrls)),
      }
    : {}),
}
