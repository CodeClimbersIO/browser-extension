import type { AnyAction, Dispatch } from '@reduxjs/toolkit'
import {
  setLoggingEnabled,
  setTotalTimeLoggedToday,
  setTheme,
} from '../reducers/configReducer'
import CodeClimbersCore from '../CodeClimbersCore'
import { DEFAULT_CONFIG } from '@src/constants'

export const fetchUserData = async (
  dispatch: Dispatch<AnyAction>,
): Promise<void> => {
  try {
    const [totalTimeLoggedTodayResponse, items] = await Promise.all([
      CodeClimbersCore.getTotalTimeLoggedToday(),
      browser.storage.sync.get({
        loggingEnabled: DEFAULT_CONFIG.loggingEnabled,
        theme: DEFAULT_CONFIG.theme,
      }),
    ])

    if (items.loggingEnabled === true) {
      CodeClimbersCore.state = 'allGood'
    } else {
      CodeClimbersCore.state = 'notLogging'
    }

    dispatch(setLoggingEnabled(items.loggingEnabled as boolean))
    dispatch(setTheme(items.theme as 'dark' | 'light'))
    dispatch(setTotalTimeLoggedToday(totalTimeLoggedTodayResponse.text))

    await CodeClimbersCore.recordHeartbeat()
  } catch (err: unknown) {
    CodeClimbersCore.state = 'notSignedIn'
  }
}
