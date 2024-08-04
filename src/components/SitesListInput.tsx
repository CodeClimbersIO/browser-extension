import { TextField } from '@mui/material';
import React from 'react';

type SitesListInputProps = {
  handleChange: (sites: string) => void;
  helpText: string;
  label: string;
  placeholder?: string;
  rows?: number;
  sites: string;
};

export default function SitesListInput({
  handleChange,
  label,
  placeholder,
  rows,
  sites,
  helpText,
}: SitesListInputProps): JSX.Element {
  return (
    <TextField
      minRows={rows ?? 3}
      multiline
      fullWidth
      label={label}
      id={`${label}-siteList`}
      onChange={(e) => handleChange(e.currentTarget.value)}
      value={sites}
      placeholder={placeholder ?? 'http://google.com'}
      helperText={helpText}
    />
  );
}
