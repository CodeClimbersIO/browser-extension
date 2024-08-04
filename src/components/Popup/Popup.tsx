import React from 'react'
import { Paper } from '@mui/material'
import { PopupContent } from './PopupContent'
import { PopupHeader } from './PopupHeader'
import { useSyncConfigStore } from '@src/stores/configStore'

export function Popup(): JSX.Element {
  useSyncConfigStore()

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, pt: 4, display: 'flex', flexDirection: 'column', width: 300 }}
    >
      <PopupHeader />
      <PopupContent />
    </Paper>
  )
}
