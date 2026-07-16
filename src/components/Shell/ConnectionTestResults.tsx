import { useContext } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Circle from '@mui/icons-material/FiberManualRecord'
import { Box } from '@mui/system'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import WifiTetheringRounded from '@mui/icons-material/WifiTetheringRounded'

import { SignalingConnection } from 'lib/ConnectionTest'
import { ShellContext } from 'contexts/ShellContext'

import { ConnectionTestResults as IConnectionTestResults } from './useConnectionTest'

interface ConnectionTestResultsProps {
  connectionTestResults: IConnectionTestResults
}
export const ConnectionTestResults = ({
  connectionTestResults: { hasHost, hasRelay, signalingConnection },
}: ConnectionTestResultsProps) => {
  const { setIsServerConnectionFailureDialogOpen } = useContext(ShellContext)

  const handleServerConnectionFailedMessageClick = () => {
    setIsServerConnectionFailureDialogOpen(true)
  }

  if (signalingConnection === SignalingConnection.FAILED) {
    return (
      <Typography
        variant="subtitle2"
        sx={{ cursor: 'pointer' }}
        onClick={handleServerConnectionFailedMessageClick}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <ReportIcon color="error" sx={{ mr: 1 }} />
          <span>Room service unavailable</span>
        </Box>
      </Typography>
    )
  }

  if (signalingConnection !== SignalingConnection.CONNECTED) {
    return (
      <Typography variant="subtitle2">
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <CircularProgress size={16} sx={{ mr: 1.5 }} />
          <span>Connecting to room service...</span>
        </Box>
      </Typography>
    )
  }

  if (hasHost && hasRelay) {
    return (
      <Tooltip title="Connections can be established with all peers that also have a full network connection.">
        <Typography variant="subtitle2">
          <CheckCircleRounded
            color="success"
            sx={{ mr: 0.75, fontSize: 18, verticalAlign: 'text-bottom' }}
          />
          Ready for restrictive networks
        </Typography>
      </Tooltip>
    )
  } else if (hasHost) {
    return (
      <Tooltip title="Relay server is unavailable. Connections can only be established when a relay server is not needed for either peer.">
        <Typography variant="subtitle2">
          <WifiTetheringRounded
            color="warning"
            sx={{ mr: 0.75, fontSize: 18, verticalAlign: 'text-bottom' }}
          />
          Direct connections ready
        </Typography>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="This browser could not gather a usable local WebRTC candidate. Check browser WebRTC support and network policy.">
        <Typography variant="subtitle2">
          <Circle
            color="error"
            sx={{ mr: 0.75, fontSize: 12, verticalAlign: 'text-bottom' }}
          />
          WebRTC connection blocked
        </Typography>
      </Tooltip>
    )
  }
}
