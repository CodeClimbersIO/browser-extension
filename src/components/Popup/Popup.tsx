import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper } from '@mui/material';
import { ConfigReducer, ReduxSelector } from '../../types/store';
import { fetchUserData } from '../../utils/user';
import { PopupContent } from './PopupContent';
import { PopupHeader } from './PopupHeader';

export function Popup(): JSX.Element {
  const dispatch = useDispatch();

  const { loggingEnabled, totalTimeLoggedToday }: ConfigReducer = useSelector(
    (selector: ReduxSelector) => selector.config,
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(dispatch);
    };
    void fetchData();
  }, []);

  return (
    <Paper elevation={0} sx={{ p: 2, pt: 4, display: 'flex', flexDirection: 'column', width: 300 }}>
      <PopupHeader />
      <PopupContent loggingEnabled={loggingEnabled} totalTimeLoggedToday={totalTimeLoggedToday} />
    </Paper>
  );
}
