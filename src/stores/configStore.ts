import { DEFAULT_CONFIG } from "@src/utils/constants";
import type { CodeClimbers } from "@src/types/codeclimbers";
import { getEnv } from "@src/utils/getEnv";
import { Store } from "@tanstack/store";
import { useEffect } from "react";

export type ConfigStore = {
  theme: CodeClimbers.Style["theme"];
  loggingStyle: CodeClimbers.Logging["style"];
  loggingEnabled: boolean;
  loggingType: CodeClimbers.Logging["type"];

  apiUrl: string;

  trackSocialMedia: boolean;
  socialMediaSites: string[];
  whitelist: string | null;
  blacklist: string | null;
};

export const configStore = new Store<ConfigStore>({
  theme: "light" as CodeClimbers.Style["theme"],
  loggingStyle: DEFAULT_CONFIG.loggingStyle,
  loggingEnabled: DEFAULT_CONFIG.loggingEnabled,
  loggingType: DEFAULT_CONFIG.loggingType,

  apiUrl: getEnv().apiUrl,

  trackSocialMedia: true,
  socialMediaSites: [...DEFAULT_CONFIG.socialMediaSites],
  whitelist: null as string | null,
  blacklist: null as string | null,
});

export const updateConfig = async (newConfig: Partial<ConfigStore>) => {
  const newState: ConfigStore = {
    ...configStore.state,
    ...newConfig,
  };

  configStore.setState(() => newState);
  await browser.storage.sync.set(newState);
};

export const useSyncConfigStore = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      syncConfigStore();
    }, 15_000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};

export const getStorageConfig = async () => {
  const items = await browser.storage.sync.get({
    theme: DEFAULT_CONFIG.theme,
    loggingStyle: DEFAULT_CONFIG.loggingStyle,
    loggingEnabled: DEFAULT_CONFIG.loggingEnabled,
    loggingType: DEFAULT_CONFIG.loggingType,

    apiUrl: getEnv().apiUrl,

    trackSocialMedia: true,
    socialMediaSites: DEFAULT_CONFIG.socialMediaSites,
    blacklist: "",
    whitelist: "",
  });

  return items as ConfigStore;
};

export const syncConfigStore = async () => {
  const storageConfig = await getStorageConfig();

  configStore.setState(() => storageConfig);
};
