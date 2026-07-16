import { afterEach, describe, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('loadRtcConfig', () => {
  test('adds ICE servers returned by the runtime credential endpoint', async () => {
    vi.stubEnv(
      'VITE_ICE_SERVERS_URL',
      'https://chat.digitable.life/api/rtc/ice-servers'
    )

    const fetchIceConfig = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          iceServers: [
            {
              urls: ['turns:turn.example.com:5349?transport=tcp'],
              username: 'temporary-user',
              credential: 'temporary-secret',
            },
          ],
        }),
        { status: 200 }
      )
    )

    const { loadRtcConfig } = await import('./rtcConfig')
    const config = await loadRtcConfig(fetchIceConfig)

    expect(fetchIceConfig).toHaveBeenCalledWith(
      'https://chat.digitable.life/api/rtc/ice-servers',
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      })
    )
    expect(config.iceServers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          urls: ['turns:turn.example.com:5349?transport=tcp'],
          username: 'temporary-user',
          credential: 'temporary-secret',
        }),
      ])
    )
  })

  test('keeps the STUN fallback when the credential endpoint fails', async () => {
    vi.stubEnv(
      'VITE_ICE_SERVERS_URL',
      'https://chat.digitable.life/api/rtc/ice-servers'
    )
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const fetchIceConfig = vi.fn().mockResolvedValue(
      new Response('Unavailable', {
        status: 503,
        statusText: 'Unavailable',
      })
    )

    const { loadRtcConfig } = await import('./rtcConfig')
    const config = await loadRtcConfig(fetchIceConfig)

    expect(config.iceServers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          urls: expect.arrayContaining(['stun:stun.cloudflare.com:3478']),
        }),
      ])
    )
  })
})
