import type { AnyAction, Dispatch } from '@reduxjs/toolkit'
import {
  setLoggingEnabled,
  setTotalTimeLoggedToday,
  setTheme,
} from '../reducers/configReducer'
import config from '../config'
import CodeClimbersCore from '../CodeClimbersCore'

export const fetchUserData = async (
  dispatch: Dispatch<AnyAction>,
): Promise<void> => {
  try {
    const [totalTimeLoggedTodayResponse, items] = await Promise.all([
      CodeClimbersCore.getTotalTimeLoggedToday(),
      browser.storage.sync.get({
        loggingEnabled: config.loggingEnabled,
        theme: config.theme,
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
