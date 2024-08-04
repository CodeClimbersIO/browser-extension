import { CODE_CLIMBER_API_URL } from '@src/utils/constants'
import type { CodeClimbers } from '@src/types/codeclimbers'

export const getEnv = () =>
  ({
    currentUserApiEndPoint:
      process.env.CURRENT_USER_API_URL ?? '/users/current',
    heartbeatApiEndPoint:
      process.env.HEARTBEAT_API_URL ?? '/users/current/heartbeats',
    summariesApiEndPoint:
      process.env.SUMMARIES_API_URL ?? '/users/current/summaries',
    apiUrl: process.env.API_URL ?? CODE_CLIMBER_API_URL,

    version: browser.runtime.getManifest()
      .version as CodeClimbers.Core['version'],
  }) as const
