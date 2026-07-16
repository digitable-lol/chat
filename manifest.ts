import { ManifestOptions } from 'vite-plugin-pwa'

export const manifest: Partial<ManifestOptions> = {
  short_name: 'Digitable Chat',
  name: 'Digitable Chat — private peer-to-peer rooms',
  description:
    'Ephemeral encrypted rooms with WebSocket signaling and direct WebRTC communication.',
  icons: [
    {
      src: 'logo/digitable-chat.svg',
      type: 'image/svg+xml',
      sizes: 'any',
      purpose: 'any maskable',
    },
  ],
  start_url: './',
  display: 'standalone',
  theme_color: '#05080d',
  background_color: '#05080d',
  shortcuts: [
    {
      name: 'About',
      url: './about',
      icons: [
        {
          src: 'logo/digitable-chat.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    },
    {
      name: 'Disclaimer',
      url: './disclaimer',
      icons: [
        {
          src: 'logo/digitable-chat.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    },
  ],
}
