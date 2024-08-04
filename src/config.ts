import browser from 'webextension-polyfill'
import { CODE_CLIMBER_API_URL, SITES } from './constants'
import type { CodeClimbers } from './types/codeclimbers'

export interface Config {
  /**
   * API key use to query code climbers  api
   */
  apiUrl: string
  /**
   * Url from which to detect if the user is logged in
   */
  currentUserApiEndPoint: string

  /**
   * Url to which to send the heartbeat
   */
  heartbeatApiEndPoint: string

  /**
   * Is logging enabled
   */
  loggingEnabled: boolean
  loggingStyle: CodeClimbers.Logging['style']
  loggingType: CodeClimbers.Logging['type']
  socialMediaSites: string[]
  summariesApiEndPoint: string
  theme: CodeClimbers.Style['theme']
  trackSocialMedia: boolean
  version: CodeClimbers.Core['version']
}

const config: Config = {
  apiUrl: process.env.API_URL ?? CODE_CLIMBER_API_URL,
  currentUserApiEndPoint: process.env.CURRENT_USER_API_URL ?? '/users/current',
  heartbeatApiEndPoint:
    process.env.HEARTBEAT_API_URL ?? '/users/current/heartbeats',
  summariesApiEndPoint:
    process.env.SUMMARIES_API_URL ?? '/users/current/summaries',

  loggingEnabled: true,
  loggingStyle: 'blacklist',
  loggingType: 'domain',
  theme: 'light',
  trackSocialMedia: true,

  socialMediaSites: [...SITES.SOCIAL_MEDIA],

  version: browser.runtime.getManifest()
    .version as CodeClimbers.Core['version'],
}

export default config
