import { FileTransfer, setStreamSaverMitm } from 'secure-file-transfer'

import { fileTrackerUrls } from 'config/fileTrackerUrls'
import { streamSaverUrl } from 'config/streamSaverUrl'
import { rtcConfig } from 'config/rtcConfig'

setStreamSaverMitm(streamSaverUrl)

export const fileTransfer = new FileTransfer({
  torrentOpts: {
    announce: fileTrackerUrls,
  },
  webtorrentInstanceOpts: {
    tracker: {
      rtcConfig,
    },
  },
})
