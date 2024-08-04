import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grow,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { NoReduxThemeProvider } from '../stores/ThemeProvider';
import config, { SuccessOrFailType } from '../config/config';
import apiKeyInvalid from '../utils/apiKey';
import { logUserIn } from '../utils/user';
import { CODE_CLIMBER_API_URL } from '../constants';
import SitesListInput from './SitesListInput';

interface State {
  alertText: string;
  alertType: SuccessOrFailType;
  apiKey: string;
  apiUrl: string;
  blacklist: string;
  hostname: string;
  loading: boolean;
  loggingStyle: string;
  loggingType: string;
  socialMediaSites: string[];
  theme: 'light' | 'dark';
  trackSocialMedia: boolean;
  whitelist: string;
}

const FormDivider = () => (
  <Grid2>
    <Divider flexItem sx={{ borderWidth: 1, my: 2 }} />
  </Grid2>
);

export default function Options(): JSX.Element {
  const [showAlert, setShowAlert] = useState(false);
  const [state, setState] = useState<State>({
    alertText: config.alert.success.text,
    alertType: config.alert.success.type,
    apiKey: '',
    apiUrl: config.apiUrl,
    blacklist: '',
    hostname: '',
    loading: false,
    loggingStyle: config.loggingStyle,
    loggingType: config.loggingType,
    socialMediaSites: config.socialMediaSites,
    theme: config.theme,
    trackSocialMedia: config.trackSocialMedia,
    whitelist: '',
  });

  const restoreSettings = async (): Promise<void> => {
    const items = await browser.storage.sync.get({
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      blacklist: '',
      hostname: config.hostname,
      loggingStyle: config.loggingStyle,
      loggingType: config.loggingType,
      socialMediaSites: config.socialMediaSites,
      theme: config.theme,
      trackSocialMedia: true,
      whitelist: '',
    });

    // Handle prod accounts with old social media stored as string
    if (typeof items.socialMediaSites === 'string') {
      await browser.storage.sync.set({
        socialMediaSites: items.socialMediaSites.split('\n'),
      });
      items.socialMediaSites = items.socialMediaSites.split('\n');
    }

    setState({
      ...state,
      apiKey: items.apiKey as string,
      apiUrl: items.apiUrl as string,
      blacklist: items.blacklist as string,
      hostname: items.hostname as string,
      loggingStyle: items.loggingStyle as string,
      loggingType: items.loggingType as string,
      socialMediaSites: items.socialMediaSites as string[],
      theme: items.theme as typeof config.theme,
      trackSocialMedia: items.trackSocialMedia as boolean,
      whitelist: items.whitelist as string,
    });
  };

  useEffect(() => {
    void restoreSettings();
  }, []);

  const handleSubmit = async () => {
    if (state.loading) return;
    setState({ ...state, loading: true });

    const apiKey = state.apiKey;
    const theme = state.theme;
    const hostname = state.hostname;
    const loggingType = state.loggingType;
    const loggingStyle = state.loggingStyle;
    const trackSocialMedia = state.trackSocialMedia;
    const socialMediaSites = state.socialMediaSites;
    // Trimming blacklist and whitelist removes blank lines and spaces.
    const blacklist = state.blacklist.trim();
    const whitelist = state.whitelist.trim();
    let apiUrl = state.apiUrl;

    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }

    await browser.storage.sync.set({
      apiKey,
      apiUrl,
      blacklist,
      hostname,
      loggingStyle,
      loggingType,
      socialMediaSites,
      theme,
      trackSocialMedia,
      whitelist,
    });

    setState((s) => ({
      ...s,
      blacklist,
      whitelist,
      apiUrl,
    }));
    setShowAlert(true);
    await logUserIn(state.apiKey);
  };

  const updateBlacklistState = (sites: string) => {
    setState({
      ...state,
      blacklist: sites,
    });
  };

  const updateWhitelistState = (sites: string) => {
    setState({
      ...state,
      whitelist: sites,
    });
  };

  // const toggleSocialMedia = () => {
  //   setState({ ...state, trackSocialMedia: !state.trackSocialMedia });
  // };

  const isApiKeyValid = apiKeyInvalid(state.apiKey) === '';

  const updateState = <Key extends keyof typeof state>(key: Key, value: (typeof state)[Key]) =>
    setState({ ...state, [key]: value });

  return (
    <NoReduxThemeProvider theme={state.theme}>
      <Paper sx={{ p: 2 }}>
        <Grid2
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          container
          flexDirection="column"
          flexWrap="nowrap"
          sx={{ maxHeight: 590, overflow: 'hidden', overflowY: 'scroll' }}
        >
          <Grid2 container>
            <Grid2 xs={12} sm={4}>
              <FormControl>
                <FormLabel id="logging-style-group-label">Logging Style</FormLabel>
                <RadioGroup
                  aria-labelledby="logging-style-group-label"
                  name="radio-buttons-group"
                  value={state.loggingStyle}
                  onChange={(e) => updateState('loggingStyle', e.currentTarget.value)}
                  id="logging-style"
                >
                  <FormControlLabel
                    value="blacklist"
                    control={<Radio />}
                    label="All except blacklisted sites"
                    sx={{ mb: -1 }}
                  />
                  <FormControlLabel
                    value="whitelist"
                    control={<Radio />}
                    label="Only whitelisted sites"
                  />
                </RadioGroup>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} sm={4}>
              <FormControl>
                <FormLabel id="logging-type-group-label">Logging Type</FormLabel>
                <RadioGroup
                  aria-labelledby="logging-type-group-label"
                  name="radio-buttons-group"
                  value={state.loggingType}
                  onChange={(e) => updateState('loggingType', e.currentTarget.value)}
                  id="logging-type"
                >
                  <FormControlLabel
                    value="domain"
                    control={<Radio />}
                    label="Only the domain"
                    sx={{ mb: -1 }}
                  />
                  <FormControlLabel value="url" control={<Radio />} label="Entire URL" />
                </RadioGroup>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} sm={4}>
              <FormControl>
                <FormLabel id="theme-group-label">Theme</FormLabel>
                <RadioGroup
                  aria-labelledby="theme-group-label"
                  name="radio-buttons-group"
                  value={state.theme}
                  onChange={(e) =>
                    updateState('theme', e.currentTarget.value as typeof config.theme)
                  }
                  id="theme"
                >
                  <FormControlLabel value="dark" control={<Radio />} label="Dark" sx={{ mb: -1 }} />
                  <FormControlLabel value="light" control={<Radio />} label="Light" />
                </RadioGroup>
              </FormControl>
            </Grid2>
          </Grid2>
          <FormDivider />
          <Grid2 container flexDirection="column" spacing={2}>
            <Grid2>
              <TextField
                autoFocus
                id="apiKey"
                label="API Key"
                value={state.apiKey}
                onChange={(e) => updateState('apiKey', e.currentTarget.value)}
                error={!isApiKeyValid}
                fullWidth
              />
            </Grid2>
            <Grid2>
              <TextField
                fullWidth
                label="API URL"
                id="api-url"
                onChange={(e) => updateState('apiUrl', e.currentTarget.value)}
                value={state.apiUrl}
                placeholder={CODE_CLIMBER_API_URL}
                helperText={CODE_CLIMBER_API_URL}
              />
            </Grid2>
          </Grid2>
          <FormDivider />
          <Grid2>
            {state.loggingStyle === 'blacklist' ? (
              <SitesListInput
                handleChange={updateBlacklistState}
                label="Blacklist"
                sites={state.blacklist}
                helpText="Sites that you don't want to show in your reports."
              />
            ) : (
              <SitesListInput
                handleChange={updateWhitelistState}
                label="Whitelist"
                sites={state.whitelist}
                placeholder="http://google.com&#10;http://myproject.com/MyProject"
                helpText="Sites that you want to show in your reports. You can assign URL to project by adding @@YourProject at the end of line."
              />
            )}
          </Grid2>
          <FormDivider />
          <Grid2>
            <TextField
              fullWidth
              label="Hostname"
              id="hostname"
              onChange={(e) => updateState('hostname', e.currentTarget.value)}
              value={state.hostname}
              helperText="Optional name of local machine. By default 'Unknown Hostname'."
            />
          </Grid2>
          <FormDivider />

          {/* <div className="form-group row mb-4">
            <div className="col-lg-10 col-lg-offset-2 space-between align-items-center">
              <div>
                <input
                  type="checkbox"
                  className="me-2"
                  checked={state.trackSocialMedia}
                  onChange={toggleSocialMedia}
                />
                <span onClick={toggleSocialMedia}>Track social media sites</span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#socialSitesModal"
              >
                Sites
              </button>
              <div
                className="modal fade"
                id="socialSitesModal"
                role="dialog"
                aria-labelledby="socialSitesModalLabel"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title fs-5" id="socialSitesModalLabel">
                        Social Media Sites
                      </h4>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <SitesListInput
                        handleChange={(sites: string) => {
                          setState({
                            ...state,
                            socialMediaSites: sites.split('\n'),
                          });
                        }}
                        label="Social"
                        sites={state.socialMediaSites.join('\n')}
                        helpText="Sites that you don't want to show in your reports."
                        rows={5}
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <Grow in={showAlert}>
            <Alert
              sx={{ my: 2 }}
              severity={state.alertType ?? 'success'}
              onClose={() => setShowAlert(false)}
            >
              {state.alertText}
            </Alert>
          </Grow>
          <Grid2 display="flex" justifyContent="flex-end" sx={{ mt: !showAlert ? -10 : 0 }}>
            <Button
              startIcon={state.loading ? <CircularProgress /> : <Save />}
              type="submit"
              disabled={state.loading}
              variant="contained"
            >
              Save
            </Button>
          </Grid2>
        </Grid2>
      </Paper>
    </NoReduxThemeProvider>
  );
}
