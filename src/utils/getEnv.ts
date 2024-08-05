import { CODE_CLIMBER_API_URL } from "@src/utils/constants";
import browser from "webextension-polyfill";

import type { CodeClimbers } from "@src/types/codeclimbers";

export const getEnv = () =>
  ({
    heartbeatApiEndPoint:
      process.env.HEARTBEAT_API_URL ?? "/users/current/heartbeats",
    summariesApiEndPoint:
      process.env.SUMMARIES_API_URL ?? "/users/current/statusbar/today",
    apiUrl: process.env.API_URL ?? CODE_CLIMBER_API_URL,

    version: browser.runtime.getManifest()
      .version as CodeClimbers.Core["version"],
  }) as const;
