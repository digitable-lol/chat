# ADR 0001: MQTT signaling and runtime TURN credentials

- Status: accepted
- Date: 2026-07-16

## Context

The inherited application used Trystero's BitTorrent strategy for room signaling. Public trackers are commonly filtered and are not a suitable single operational dependency for a general-purpose chat product. The same implementation also embedded static TURN credentials in the client bundle.

## Decision

Use Trystero's MQTT strategy for peer discovery:

- signaling is carried over secure WebSocket connections;
- relay URLs and redundancy are configurable at build time;
- Trystero's public MQTT relay set remains a zero-configuration fallback;
- WebTorrent remains isolated to optional file transfer.

Load TURN servers at runtime from `VITE_ICE_SERVERS_URL`. The endpoint returns `RTCIceServer` values with short-lived credentials. Public STUN and optional self-hosted static TURN values are retained as fallback.

## Consequences

Room discovery no longer depends on BitTorrent trackers, so common tracker filtering does not block chat, audio, or video setup.

MQTT relays and TURN services remain availability dependencies and can observe connection metadata. Redundant signaling relays and multiple TURN transports should be configured in production.

The application needs a small server-side credential endpoint for production-grade TURN. This endpoint does not store or proxy message content.

## Alternatives considered

- Keep public WebTorrent trackers: rejected because it preserves the reported failure mode.
- Operate a custom WebSocket signaling application server: viable later, but larger in scope and introduces a proprietary protocol/service.
- Commit static TURN credentials: rejected because browser bundles are public and credentials cannot remain secret.

## Rollback

Switch imports from `trystero/mqtt` to `trystero`, restore room tracker configuration, and keep the runtime ICE loader. This rollback changes only discovery; WebRTC and the product UI do not require reversal.
