# SDD: Digitable Chat identity and resilient connectivity

## Problem

The inherited interface did not express the Digitable identity, presented too many equally weighted actions, and depended on WebTorrent trackers for room discovery. Tracker blocking or outages could therefore prevent text, audio, and video rooms from forming. TURN credentials were hardcoded, long-lived, and operationally fragile.

## Product outcome

The primary journey is one calm action: create or open a room and share its link. Network details remain available as human-readable status, but do not dominate the interface.

The visual language follows Digitable tokens:

- near-black engineering canvas with restrained grid/radial texture;
- cyan as the primary action and focus color;
- yellow, purple, green, and red only for semantic accents;
- thin borders, moderate radii, and limited shadows;
- compact technical labels paired with plain-language explanations.

## Connection design

```text
Browser A ── secure WebSocket ── MQTT signaling relay ── secure WebSocket ── Browser B
    │                                                                       │
    └──────────────────── encrypted WebRTC data/media ──────────────────────┘
                                  │
                         TURN relay when required
```

Room signaling uses `trystero/mqtt`. It is independent from file-transfer WebTorrent trackers. The client can connect to multiple signaling relays concurrently for redundancy.

The ICE configuration is assembled at startup from:

1. safe public STUN defaults;
2. optional static self-hosted TURN environment variables;
3. a preferred runtime HTTPS endpoint returning short-lived TURN credentials.

If the runtime endpoint fails, startup continues with the remaining ICE configuration and reports the fallback in the console.

## Security and data

- No TURN credentials are committed to source control.
- The preferred TURN model uses short-lived credentials returned by a server-side endpoint.
- Message content remains in browser memory and encrypted WebRTC channels.
- Signaling and TURN infrastructure can observe connection metadata.
- Link-access room names are capabilities; long random names are the default.
- Existing local profile storage retains its legacy database name to preserve user verification keys during the rebrand.

## Delivery

The app builds as static assets and deploys to `/www/wwwroot/chat.digitable.life`. GitHub Actions receives only the ICE endpoint URL; TURN credentials are fetched by each client at runtime.

## Acceptance criteria

- Home has one dominant room-opening CTA and works at mobile, tablet, and desktop widths.
- Chat/call room discovery does not import Trystero's torrent strategy.
- File transfer tracker failure cannot block room signaling.
- No static TURN credential or legacy TURN IP exists in the repository.
- The application starts when the runtime ICE endpoint is unavailable.
- Connection status distinguishes signaling, direct ICE, and TURN availability in text.
- Unit tests and production builds pass.

## Rollback

The previous signaling behavior can be restored by switching `PeerRoom` and connection diagnostics back to Trystero's default import and reintroducing tracker configuration for room discovery. The UI and runtime TURN endpoint are independent and can remain during that rollback.
