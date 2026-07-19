# Digitable Chat

![Digitable Chat](./public/logo/logo.svg)

Digitable Chat is a static, open-source app for ephemeral text, file, audio, and video rooms. It applies the Digitable identity and product principles to the Chitchatter foundation while separating room discovery from WebTorrent.

Production: [chat.digitable.life](https://chat.digitable.life)

## Connection model

1. MQTT brokers over secure WebSockets help peers discover each other.
2. WebRTC creates encrypted peer-to-peer data and media channels.
3. STUN discovers reachable network addresses.
4. TURN relays encrypted WebRTC packets when direct connectivity is blocked.
5. File transfer keeps an independent, optional WebTorrent tracker path.

The signaling service is not a message store. Conversation content is kept in browser memory and WebRTC channels; it is not persisted by a Digitable Chat application server.

## Local development

Use the Node and npm versions declared in `package.json`.

```bash
npm ci
npm start
```

Open [http://localhost:3000](http://localhost:3000).

To run the app with a local file-transfer tracker and StreamSaver helper:

```bash
npm run dev
```

Checks:

```bash
npm run check:types
npm test -- --run
npm run build
npm run lint
```

## Runtime configuration

Copy `.env.example` to `.env.local` for local overrides.

| Variable                                      | Purpose                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `VITE_RTC_CONFIG_ENDPOINT`                    | HTTPS endpoint that returns short-lived `iceServers` credentials.          |
| `VITE_TURN_URLS`                              | Optional comma-separated static TURN URLs for controlled environments.     |
| `VITE_TURN_USERNAME` / `VITE_TURN_CREDENTIAL` | Optional static TURN credentials; never commit real values.                |
| `VITE_ICE_TRANSPORT_POLICY`                   | `all` by default; use `relay` only for diagnostics or policy requirements. |
| `VITE_SIGNALING_RELAY_URLS`                   | Comma-separated MQTT-over-WebSocket relay URLs.                            |
| `VITE_SIGNALING_RELAY_REDUNDANCY`             | Number of signaling relays to use concurrently; defaults to `3`.           |
| `VITE_FILE_TRACKER_URLS`                      | Optional WebTorrent trackers used only for file transfer.                  |

The ICE endpoint may return one `RTCIceServer`, an array, or an object with an `iceServers` array. When the endpoint is unavailable, the client continues with its configured STUN and optional static TURN fallback.

## SDK

Build `dist/sdk.js`:

```bash
npm run build:sdk
```

Embed a room:

```html
<script src="https://chat.digitable.life/sdk.js"></script>
<chat-room room="project-room" width="800" height="800"></chat-room>
```

## Delivery and architecture

- Deployment runbook: [`DEPLOY.md`](./DEPLOY.md)
- Product/network design: [`docs/SDD-digitable-chat.md`](./docs/SDD-digitable-chat.md)
- Signaling decision: [`docs/adr/0001-mqtt-signaling-and-runtime-turn.md`](./docs/adr/0001-mqtt-signaling-and-runtime-turn.md)

Reusable Digitable Chat visual assets are maintained in the Digitable components monorepo and mirrored locally for the app build.

## Foundation and license

Digitable Chat is based on [Chitchatter](https://github.com/jeremyckahn/chitchatter), [Trystero](https://github.com/dmotz/trystero), and [`secure-file-transfer`](https://github.com/jeremyckahn/secure-file-transfer). See [`LICENSE`](./LICENSE) for licensing terms.
