import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_CONFIG } from '@src/constants'
import type { ConfigReducer } from '@src/types/store'

interface SetLoggingEnabledAction {
  payload: boolean
  type: string
}

interface SetTotalTimeLoggedTodayAction {
  payload: string
  type: string
}

interface SetThemeAction {
  payload: 'light' | 'dark'
  type: string
}

export const initialConfigState: ConfigReducer = {
  loggingEnabled: DEFAULT_CONFIG.loggingEnabled,
  totalTimeLoggedToday: '0 minutes',
  theme: 'light',
}

const configSlice = createSlice({
  initialState: initialConfigState,
  name: 'configReducer',
  reducers: {
    setLoggingEnabled: (state, action: SetLoggingEnabledAction) => {
      state.loggingEnabled = action.payload
    },
    setTotalTimeLoggedToday: (state, action: SetTotalTimeLoggedTodayAction) => {
      state.totalTimeLoggedToday = action.payload
    },
    setTheme: (state, action: SetThemeAction) => {
      state.theme = action.payload
    },
  },
})

export const actions = configSlice.actions
export const { setLoggingEnabled, setTotalTimeLoggedToday, setTheme } =
  configSlice.actions
export default configSlice.reducer
