import { FileTransfer, setStreamSaverMitm } from 'secure-file-transfer'

import { fileTrackerUrls } from 'config/fileTrackerUrls'
import { streamSaverUrl } from 'config/streamSaverUrl'

setStreamSaverMitm(streamSaverUrl)

export class FileTransferService {
  fileTransfer: FileTransfer

  constructor(rtcConfig: RTCConfiguration) {
    this.fileTransfer = new FileTransfer({
      torrentOpts: {
        announce: fileTrackerUrls,
      },
      webtorrentInstanceOpts: {
        tracker: {
          rtcConfig,
        },
      },
    })
  }
}
