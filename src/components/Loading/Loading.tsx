import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import ChatMark from 'brand/assets/digitable-chat-project-icon.svg'

interface WholePageLoadingProps extends BoxProps {}

export const WholePageLoading = ({
  sx = [],
  ...props
}: WholePageLoadingProps) => {
  return (
    <Box
      className="dt-chat-loading"
      sx={[
        {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <img src={ChatMark} alt="" />
      <CircularProgress size={24} thickness={3} />
      <span>Preparing secure room</span>
    </Box>
  )
}
