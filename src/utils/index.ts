import { SITES, SUPPORTED_BROWSER } from '@src/constants'
import type { CodeClimbers } from '@src/types/codeclimbers'

export const isEdge = () => navigator.userAgent.includes('Edg')
export const isFireFox = () => navigator.userAgent.includes('Firefox')
export const isChrome = () => !isEdge() && !isFireFox()

export const getBrowser = (): CodeClimbers.Core['supportedBrowser'] => {
  if (isEdge()) {
    return SUPPORTED_BROWSER.EDGE
  }

  if (isFireFox()) {
    return SUPPORTED_BROWSER.FIREFOX
  }

  return SUPPORTED_BROWSER.CHROME
}

export const IS_EDGE = navigator.userAgent.includes('Edg')
export const IS_FIREFOX = navigator.userAgent.includes('Firefox')
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false

export const generateProjectFromDevSites = (url: string): string | null => {
  for (const githubUrl of SITES.GITHUB) {
    if (url.startsWith(githubUrl)) {
      const newUrl = url.replace(githubUrl, '')
      return newUrl.split('/')[1] || null
    }
  }
  return null
}
