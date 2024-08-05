import React from "react";
import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  Print,
  PrintDisabled,
  SettingsApplications,
} from "@mui/icons-material";

import { configStore, updateConfig } from "@src/stores/configStore";
import { useStore } from "@tanstack/react-store";
import { useTotalTime } from "@src/api/summary.api";

const openOptionsPage = async () => {
  await browser.runtime.openOptionsPage();
};

const TotalTimeAlert = () => {
  const totalTime = useTotalTime();

  if (totalTime.isPending) {
    return <Alert severity="info">Loading total time...</Alert>;
  }

  if (totalTime.isError) {
    return (
      <Alert severity="error">
        {totalTime.error instanceof Error
          ? totalTime.error.message
          : "Error loading"}
      </Alert>
    );
  }
  return (
    <Alert severity="info">
      <strong>{totalTime.data!.text}</strong> total time logged today
    </Alert>
  );
};

export const PopupContent = () => {
  const loggingEnabled = useStore(configStore, (s) => s.loggingEnabled);

  const toggleLogging = async (): Promise<void> => {
    await updateConfig({
      loggingEnabled: !loggingEnabled,
    });
  };

  return (
    <>
      <TotalTimeAlert />
      <MenuList>
        <MenuItem onClick={toggleLogging}>
          <ListItemIcon>
            {loggingEnabled ? <PrintDisabled /> : <Print />}
          </ListItemIcon>
          <ListItemText
            primary={`${loggingEnabled ? "Disable" : "Enable"} Logging`}
          />
        </MenuItem>
        <MenuItem onClick={openOptionsPage}>
          <ListItemIcon>
            <SettingsApplications />
          </ListItemIcon>
          <ListItemText primary="Extension Preferences" />
        </MenuItem>
      </MenuList>
    </>
  );
};
