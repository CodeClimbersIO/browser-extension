import React from 'react'
import { useDispatch } from 'react-redux'
import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material'
import { Print, PrintDisabled, SettingsApplications } from '@mui/icons-material'

import { setLoggingEnabled } from '@src/reducers/configReducer'

export interface MainListProps {
  loggingEnabled: boolean
  totalTimeLoggedToday?: string
}
const openOptionsPage = async (): Promise<void> => {
  await browser.runtime.openOptionsPage()
}

export const PopupContent = ({
  loggingEnabled,
  totalTimeLoggedToday,
}: MainListProps) => {
  const dispatch = useDispatch()

  const enableLogging = async (): Promise<void> => {
    dispatch(setLoggingEnabled(true))
    await browser.storage.sync.set({ loggingEnabled: true })
  }

  const disableLogging = async (): Promise<void> => {
    dispatch(setLoggingEnabled(false))
    await browser.storage.sync.set({ loggingEnabled: false })
  }

  return (
    <>
      <Alert severity="info">
        <strong>{totalTimeLoggedToday}</strong> total time logged today
      </Alert>
      <MenuList>
        {loggingEnabled && (
          <MenuItem onClick={disableLogging}>
            <ListItemIcon>
              <PrintDisabled />
            </ListItemIcon>
            <ListItemText primary="Disable Logging" />
          </MenuItem>
        )}
        {!loggingEnabled && (
          <MenuItem onClick={enableLogging}>
            <ListItemIcon>
              <Print />
            </ListItemIcon>
            <ListItemText primary="Enable Logging" />
          </MenuItem>
        )}
        <MenuItem onClick={openOptionsPage}>
          <ListItemIcon>
            <SettingsApplications />
          </ListItemIcon>
          <ListItemText primary="Extension Preferences" />
        </MenuItem>
      </MenuList>
    </>
  )
}
