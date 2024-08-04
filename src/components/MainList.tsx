import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuList, MenuItem, ListItemIcon, ListItemText, Alert } from '@mui/material';
import { Login, Logout, Print, PrintDisabled, SettingsApplications } from '@mui/icons-material';

import { CODE_CLIMBER_URL } from '../constants';
import { configLogout, setLoggingEnabled } from '../reducers/configReducer';
import { userLogout } from '../reducers/currentUser';
import { ReduxSelector } from '../types/store';
import { User } from '../types/user';
import changeExtensionState from '../utils/changeExtensionState';

export interface MainListProps {
  loggingEnabled: boolean;
  totalTimeLoggedToday?: string;
}
const openOptionsPage = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};

export default function MainList({
  loggingEnabled,
  totalTimeLoggedToday,
}: MainListProps): JSX.Element {
  const dispatch = useDispatch();

  const user: User | undefined = useSelector(
    (selector: ReduxSelector) => selector.currentUser.user,
  );

  const logoutUser = async (): Promise<void> => {
    await browser.storage.sync.set({ apiKey: '' });
    dispatch(configLogout());
    dispatch(userLogout());
    await changeExtensionState('notSignedIn');
  };

  const enableLogging = async (): Promise<void> => {
    dispatch(setLoggingEnabled(true));
    await browser.storage.sync.set({ loggingEnabled: true });
    await changeExtensionState('allGood');
  };

  const disableLogging = async (): Promise<void> => {
    dispatch(setLoggingEnabled(false));
    await browser.storage.sync.set({ loggingEnabled: false });
    await changeExtensionState('notLogging');
  };

  return (
    <>
      {user && (
        <Alert severity="info">
          <strong>{totalTimeLoggedToday}</strong> TOTAL TIME LOGGED TODAY
        </Alert>
      )}
      <MenuList>
        {loggingEnabled && user && (
          <MenuItem onClick={disableLogging}>
            <ListItemIcon>
              <PrintDisabled />
            </ListItemIcon>
            <ListItemText primary="Disable Logging" />
          </MenuItem>
        )}
        {!loggingEnabled && user && (
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

        {user && (
          <MenuItem onClick={logoutUser}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        )}
        {!user && (
          <MenuItem
            component="a"
            target="_blank"
            href={`${CODE_CLIMBER_URL}/login`}
            rel="noreferrer"
          >
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </MenuItem>
        )}
      </MenuList>
    </>
  );
}
