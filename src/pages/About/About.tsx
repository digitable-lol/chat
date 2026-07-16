import { useContext, useEffect } from 'react'
import MuiMarkdown from 'mui-markdown'
import Box from '@mui/material/Box'

import { ShellContext } from 'contexts/ShellContext'
import {
  messageTranscriptSizeLimit,
  messageCharacterSizeLimit,
} from 'config/messaging'

import './index.sass'

const messageTranscriptSizeLimitFormatted = Intl.NumberFormat().format(
  messageTranscriptSizeLimit
)

const messageCharacterSizeLimitFormatted = Intl.NumberFormat().format(
  messageCharacterSizeLimit
)

export const About = () => {
  const { setTitle } = useContext(ShellContext)

  useEffect(() => {
    setTitle('About')
  }, [setTitle])

  return (
    <Box className="About dt-chat-document">
      <MuiMarkdown>
        {`
### Digitable Chat

Digitable Chat creates short-lived rooms for text, files, audio, and video. The interface is hosted as a static site; conversation traffic is sent through encrypted WebRTC connections between participants.

#### How a connection is made

1. MQTT relays over standard secure WebSockets help browsers discover one another.
2. WebRTC attempts a direct encrypted connection.
3. When a network blocks direct peer-to-peer traffic, a configured TURN service relays the encrypted WebRTC packets.

Signaling relays can see connection metadata and room coordination messages, but not the content carried by the encrypted WebRTC data channels. File transfer has its own optional WebTorrent tracker path and does not control chat, audio, or video discovery.

#### Room access

Link-access rooms can be joined by **anyone with the full URL**. The default room name is randomly generated on your device; replacing it with a short or common name makes the room easier to guess.

Password-access rooms only connect peers that enter the same password. There is no central server that can compare passwords, so a mismatch looks like an empty room rather than a password error.

Share the room URL and, when applicable, the password through a trusted channel.

#### Peer verification

Digitable Chat generates public and private verification keys locally. Your private key stays on the device. Public keys are visible in the participant panel and can be compared through another trusted channel when identity matters.

#### Conversation lifetime

Conversation transcripts are held in browser memory and are removed when the page is closed or the room is left. Digitable Chat does not persist message content to its own server.

When a peer joins a **public** room with participants already in it, the new peer will automatically request the transcript of the conversation that has already taken place from the other peers. Once all peers leave the room, the conversation is completely erased. Peers joining a **private** room will not get the conversation transcript backfilled.

Chat transcript history is limited to ${messageTranscriptSizeLimitFormatted} messages for all rooms.

#### Writing messages

Chat messages support [GitHub-flavored Markdown](https://github.github.com/gfm/) with code syntax highlighting.

Press \`Enter\` to send a message. Press \`Shift + Enter\` to insert a line break. Message size is limited to ${messageCharacterSizeLimitFormatted} characters.

Digitable Chat is built by [Digitable](https://digitable.life) on the open-source [Chitchatter](https://github.com/jeremyckahn/chitchatter) foundation.
        `}
      </MuiMarkdown>
    </Box>
  )
}
