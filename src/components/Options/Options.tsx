import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import { Save } from '@mui/icons-material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'

import { NoReduxThemeProvider } from '@src/stores/ThemeProvider'
import { CODE_CLIMBER_API_URL, DEFAULT_CONFIG } from '@src/constants'
import type { CodeClimbers } from '@src/types/codeclimbers'
import { getEnv } from '@src/utils/getEnv'

interface State {
  apiUrl: string
  blacklist: string
  loading: boolean
  loggingStyle: CodeClimbers.Logging['style']
  loggingType: CodeClimbers.Logging['type']
  socialMediaSites: string[]
  theme: CodeClimbers.Style['theme']
  trackSocialMedia: boolean
  whitelist: string
}

const FormDivider = () => (
  <Grid2>
    <Divider flexItem sx={{ borderWidth: 1, my: 2 }} />
  </Grid2>
)

export const Options = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [state, setState] = useState<State>({
    apiUrl: getEnv().apiUrl,
    blacklist: '',
    loading: false,
    loggingStyle: DEFAULT_CONFIG.loggingStyle,
    loggingType: DEFAULT_CONFIG.loggingType,
    socialMediaSites: [...DEFAULT_CONFIG.socialMediaSites],
    theme: DEFAULT_CONFIG.theme,
    trackSocialMedia: DEFAULT_CONFIG.trackSocialMedia,
    whitelist: '',
  })

  const restoreSettings = async (): Promise<void> => {
    const items = await browser.storage.sync.get({
      apiUrl: DEFAULT_CONFIG.apiUrl,
      blacklist: '',
      loggingStyle: DEFAULT_CONFIG.loggingStyle,
      loggingType: DEFAULT_CONFIG.loggingType,
      socialMediaSites: DEFAULT_CONFIG.socialMediaSites,
      theme: DEFAULT_CONFIG.theme,
      trackSocialMedia: true,
      whitelist: '',
    })

    // Handle prod accounts with old social media stored as string
    if (typeof items.socialMediaSites === 'string') {
      await browser.storage.sync.set({
        socialMediaSites: items.socialMediaSites.split('\n'),
      })
      items.socialMediaSites = items.socialMediaSites.split('\n')
    }

    setState({
      ...state,
      apiUrl: items.apiUrl,
      loggingStyle: items.loggingStyle,
      loggingType: items.loggingType,
      socialMediaSites: items.socialMediaSites,
      theme: items.theme,
      trackSocialMedia: items.trackSocialMedia,

      blacklist: items.blacklist,
      whitelist: items.whitelist,
    })
  }

  useEffect(() => {
    void restoreSettings()
  }, [])

  const handleSubmit = async () => {
    if (state.loading) return
    setState({ ...state, loading: true })

    const theme = state.theme
    const loggingType = state.loggingType
    const loggingStyle = state.loggingStyle
    const trackSocialMedia = state.trackSocialMedia
    const socialMediaSites = state.socialMediaSites
    // Trimming blacklist and whitelist removes blank lines and spaces.
    const blacklist = state.blacklist.trim()
    const whitelist = state.whitelist.trim()
    let apiUrl = state.apiUrl

    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1)
    }

    await browser.storage.sync.set({
      apiUrl,
      blacklist,
      loggingStyle,
      loggingType,
      socialMediaSites,
      theme,
      trackSocialMedia,
      whitelist,
    })

    setState((s) => ({
      ...s,
      blacklist,
      whitelist,
      apiUrl,
      loading: false,
    }))
    setShowAlert(true)
  }

  // const toggleSocialMedia = () => {
  //   setState({ ...state, trackSocialMedia: !state.trackSocialMedia });
  // };

  const updateState = <Key extends keyof State>(key: Key, value: State[Key]) =>
    setState({ ...state, [key]: value })

  return (
    <NoReduxThemeProvider theme={state.theme}>
      <Paper sx={{ p: 2 }}>
        <Grid2
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          container
          flexDirection="column"
          flexWrap="nowrap"
          sx={{ maxHeight: 590, overflow: 'hidden', overflowY: 'scroll' }}
        >
          <Grid2 container>
            <Grid2 xs={12} sm={4}>
              <FormControl>
                <FormLabel id="logging-style-group-label">
                  Logging Style
                </FormLabel>
                <RadioGroup
                  aria-labelledby="logging-style-group-label"
                  name="radio-buttons-group"
                  value={state.loggingStyle}
                  onChange={(e) =>
                    updateState(
                      'loggingStyle',
                      e.currentTarget.value as CodeClimbers.Logging['style'],
                    )
                  }
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
                <FormLabel id="logging-type-group-label">
                  Logging Type
                </FormLabel>
                <RadioGroup
                  aria-labelledby="logging-type-group-label"
                  name="radio-buttons-group"
                  value={state.loggingType}
                  onChange={(e) =>
                    updateState(
                      'loggingType',
                      e.currentTarget.value as CodeClimbers.Logging['type'],
                    )
                  }
                  id="logging-type"
                >
                  <FormControlLabel
                    value="domain"
                    control={<Radio />}
                    label="Only the domain"
                    sx={{ mb: -1 }}
                  />
                  <FormControlLabel
                    value="url"
                    control={<Radio />}
                    label="Entire URL"
                  />
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
                    updateState(
                      'theme',
                      e.currentTarget.value as CodeClimbers.Style['theme'],
                    )
                  }
                  id="theme"
                >
                  <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label="Dark"
                    sx={{ mb: -1 }}
                  />
                  <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label="Light"
                  />
                </RadioGroup>
              </FormControl>
            </Grid2>
          </Grid2>
          <FormDivider />
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
          <FormDivider />
          <Grid2>
            <TextField
              minRows={3}
              multiline
              fullWidth
              label={
                state.loggingStyle.slice(0, 1).toUpperCase() +
                state.loggingStyle.slice(1)
              }
              id={`${state.loggingStyle}-siteList`}
              onChange={(e) =>
                updateState(state.loggingStyle, e.currentTarget.value)
              }
              value={state[state.loggingStyle]}
              placeholder="https://google.com"
              helperText={
                state.loggingStyle === 'blacklist'
                  ? "Sites that you don't want to show in your reports."
                  : 'Sites that you want to show in your reports. You can assign URL to project by adding @@YourProject at the end of line.'
              }
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
              severity={'success'}
              onClose={() => setShowAlert(false)}
            >
              Updated
            </Alert>
          </Grow>
          <Grid2
            display="flex"
            justifyContent="flex-end"
            sx={{ mt: !showAlert ? -10 : 0 }}
          >
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
  )
}
