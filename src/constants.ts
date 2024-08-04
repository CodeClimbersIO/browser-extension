import type { CodeClimbers } from "./types/codeclimbers"
import { getEnv } from "./utils/getEnv"

export const CODE_CLIMBER_URL = 'http://localhost:14400' as const
export const CODE_CLIMBER_API_URL =
  `${CODE_CLIMBER_URL}/api/v1/wakatime` as const
export const GITHUB_EXTENSION_URL =
  'https://github.com/CodeClimbersIO/browser-extension' as const

export const IDLE_DETECTION_INTERVAL = 60

export const SITES = {
  DEV: [
    'codepen.io',
    'codewars.com',
    'dev.to',
    'github.com',
    'hackerrank.com',
    'leetcode.com',
    'developer.mozilla.org',
    'stackoverflow.com',
    'udemy.com',
    'w3schools.com',
  ],
  NON_TRACKABLE: ['chrome://', 'about:'],
  SOCIAL_MEDIA: [
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'pinterest.com',
    'reddit.com',
    'snapchat.com',
    'tiktok.com',
    'twitter.com',
    'whatsapp.com',
    'youtube.com',
  ],
  GITHUB: [
    'https://github.com/',
    'https://gist.github.com/',
    'https://github.dev/',
  ],
} as const

export const SUPPORTED_BROWSER = {
  EDGE: 'edge',
  FIREFOX: 'firefox',
  CHROME: 'chrome',
} as const

export const DEFAULT_CONFIG = {
  apiUrl: getEnv().apiUrl,

  loggingEnabled: true,
  trackSocialMedia: true,

  loggingStyle: 'blacklist' as CodeClimbers.Logging['style'],
  loggingType: 'domain' as CodeClimbers.Logging['type'],
  theme: 'light' as CodeClimbers.Style['theme'],

  socialMediaSites: SITES.SOCIAL_MEDIA,
  } as const
