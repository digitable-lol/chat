const parseUrls = (value?: string) =>
  value
    ?.split(',')
    .map(url => url.trim())
    .filter(Boolean) ?? []

const configuredUrls = [
  ...parseUrls(import.meta.env.VITE_FILE_TRACKER_URLS),
  ...parseUrls(import.meta.env.VITE_FILE_TRACKER_URL),
  // Backwards compatibility for existing local environments.
  ...parseUrls(import.meta.env.VITE_TRACKER_URL),
]

// File sharing still uses secure-file-transfer/WebTorrent. This configuration
// is intentionally separate from room signaling so a tracker outage cannot
// prevent chat, audio, or video from connecting.
export const fileTrackerUrls = configuredUrls.length
  ? Array.from(new Set(configuredUrls))
  : undefined
