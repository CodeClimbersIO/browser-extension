import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Card, Paper } from '@mui/material';
import config from '../config/config';
import { ApiKeyReducer, ReduxSelector } from '../types/store';
import apiKeyInvalid from '../utils/apiKey';
import { fetchUserData } from '../utils/user';
import MainList from './MainList';
import NavBar from './NavBar';

export default function CodeClimbers(): JSX.Element {
  const dispatch = useDispatch();
  const [extensionState, setExtensionState] = useState('');

  const {
    apiKey: apiKeyFromRedux,
    loggingEnabled,
    totalTimeLoggedToday,
    theme,
  }: ApiKeyReducer = useSelector((selector: ReduxSelector) => selector.config);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(apiKeyFromRedux, dispatch);
      const items = await browser.storage.sync.get({ extensionState: '' });
      setExtensionState(items.extensionState as string);
    };
    void fetchData();
  }, []);

  const isApiKeyValid = apiKeyInvalid(apiKeyFromRedux) === '';

  return (
    <Paper elevation={0} sx={{ p: 2, pt: 4, display: 'flex', flexDirection: 'column', width: 300 }}>
      <NavBar />
      {theme} - {String(loggingEnabled)}
      {isApiKeyValid && extensionState === 'notSignedIn' && (
        <Alert
          severity={config.alert.failure.type}
          onClick={() => browser.runtime.openOptionsPage()}
          style={{ cursor: 'pointer' }}
        >
          Invalid API key or API url
        </Alert>
      )}
      {!isApiKeyValid && (
        <Alert
          severity={config.alert.failure.type}
          onClick={() => browser.runtime.openOptionsPage()}
          style={{ cursor: 'pointer' }}
        >
          Please update your api key
        </Alert>
      )}
      <MainList loggingEnabled={loggingEnabled} totalTimeLoggedToday={totalTimeLoggedToday} />
    </Paper>
  );
}
