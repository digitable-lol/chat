import { useContext } from 'react'
import useTheme from '@mui/material/styles/useTheme'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import ReportIcon from '@mui/icons-material/Report'

import { ShellContext } from 'contexts/ShellContext'

export const ServerConnectionFailureDialog = () => {
  const theme = useTheme()
  const {
    isServerConnectionFailureDialogOpen,
    setIsServerConnectionFailureDialogOpen,
  } = useContext(ShellContext)

  const handleDialogClose = () => {
    setIsServerConnectionFailureDialogOpen(false)
  }

  return (
    <Dialog
      open={isServerConnectionFailureDialogOpen}
      onClose={handleDialogClose}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReportIcon
            fontSize="medium"
            sx={() => ({
              color: theme.palette.error.main,
              mr: theme.spacing(1),
            })}
          />
          Room service unavailable
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Digitable Chat could not reach any MQTT/WebSocket signaling relay.
          Your conversation data is not sent through those relays, but they are
          required for peers to discover each other. Try:
        </DialogContentText>
        <Typography
          component="ul"
          sx={{
            color: theme.palette.text.secondary,
            m: 1,
          }}
        >
          <li>Refreshing the page</li>
          <li>Disabling any adblockers</li>
          <li>Connecting to a different network</li>
          <li>Using a deployment with a custom signaling relay configured</li>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
