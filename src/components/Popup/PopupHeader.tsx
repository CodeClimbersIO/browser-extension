import React, { useState } from "react";
import {
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  BugReport,
  Dashboard,
  ExpandLess,
  ExpandMore,
  GitHub,
  Info,
  Settings,
  SettingsInputComponent,
} from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import { CODE_CLIMBER_URL, GITHUB_EXTENSION_URL } from "@src/utils/constants";

export const PopupHeader = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openInfo, setOpenInfo] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
    setOpenInfo(false);
  };

  const open = Boolean(anchorEl);

  return (
    <nav role="navigation">
      <Grid2
        container
        justifyContent="space-between"
        alignItems="center"
        pb={2}
      >
        <Grid2 pr={2}>
          <Typography
            variant="h6"
            component="a"
            target="_blank"
            href={CODE_CLIMBER_URL}
            rel="noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "text.primary",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <img src="/images/codeclimbers-38.png" />
            Code Climbers
          </Typography>
        </Grid2>

        <IconButton
          sx={{ height: 40, width: 40 }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Settings />
        </IconButton>
      </Grid2>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem
          component="a"
          target="_blank"
          href={`${CODE_CLIMBER_URL}/settings/rules`}
          rel="noreferrer"
        >
          <ListItemIcon>
            <SettingsInputComponent />
          </ListItemIcon>
          <ListItemText primary="Custom Rules" />
        </MenuItem>
        <MenuItem
          component="a"
          target="_blank"
          href={`${CODE_CLIMBER_URL}/dashboard`}
          rel="noreferrer"
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </MenuItem>
        <MenuItem onClick={() => setOpenInfo((o) => !o)}>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="About" />
          {openInfo ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>
        <Collapse in={openInfo}>
          <MenuList>
            <MenuItem
              component="a"
              target="_blank"
              href={`${GITHUB_EXTENSION_URL}/issues`}
              rel="noreferrer"
            >
              <ListItemIcon>
                <BugReport />
              </ListItemIcon>
              <ListItemText primary="Report an Issue" />
            </MenuItem>
            <MenuItem
              component="a"
              target="_blank"
              href={`${GITHUB_EXTENSION_URL}`}
              rel="noreferrer"
            >
              <ListItemIcon>
                <GitHub />
              </ListItemIcon>
              <ListItemText primary="Github" />
            </MenuItem>
          </MenuList>
        </Collapse>
      </Menu>
    </nav>
  );
};
