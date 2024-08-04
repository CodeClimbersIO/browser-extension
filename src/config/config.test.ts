import { CODE_CLIMBER_API_URL, CODE_CLIMBER_URL } from '../constants';
import config from './config';

jest.mock('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => {
        return { version: 'test-version' };
      },
    },
  };
});

describe('codeclimber config', () => {
  it('snapshot of config', () => {
    // eslint-disable-next-line
    expect(config).toMatchInlineSnapshot(`
      {
        "alert": {
          "failure": {
            "text": "There was an error while saving the options!",
            "type": "error",
          },
          "success": {
            "text": "Options have been saved!",
            "type": "success",
          },
        },
        "apiUrl": "${CODE_CLIMBER_API_URL}",
        "colors": {
          "allGood": "",
          "lightTheme": "white",
          "notLogging": "gray",
          "notSignedIn": "red",
        },
        "currentUserApiEndPoint": "/users/current",
        "detectionIntervalInSeconds": 60,
        "devSites": [
          "codepen.io",
          "codewars.com",
          "dev.to",
          "github.com",
          "hackerrank.com",
          "leetcode.com",
          "developer.mozilla.org",
          "stackoverflow.com",
          "udemy.com",
          "w3schools.com",
        ],
        "heartbeatApiEndPoint": "/users/current/heartbeats",
        "hostname": "",
        "loggingEnabled": true,
        "loggingStyle": "blacklist",
        "loggingType": "domain",
        "name": "Code Climbers",
        "nonTrackableSites": [
          "chrome://",
          "about:",
        ],
        "socialMediaSites": [
          "facebook.com",
          "instagram.com",
          "linkedin.com",
          "pinterest.com",
          "reddit.com",
          "snapchat.com",
          "tiktok.com",
          "twitter.com",
          "whatsapp.com",
          "youtube.com",
        ],
        "states": [
          "allGood",
          "notLogging",
          "notSignedIn",
          "blacklisted",
          "whitelisted",
        ],
        "summariesApiEndPoint": "/users/current/summaries",
        "theme": "light",
        "tooltips": {
          "allGood": "",
          "blacklisted": "This URL is blacklisted",
          "notLogging": "Not logging",
          "notSignedIn": "Not signed In",
          "whitelisted": "This URL is not on your whitelist",
        },
        "trackSocialMedia": true,
        "version": "test-version",
      }
    `);
  });
});
