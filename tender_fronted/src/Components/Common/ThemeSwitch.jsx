import React from 'react';
import { Switch } from '@mui/material';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import { useColorMode } from '../../Providers/CustomThemeProvider';
import Tooltip from '@mui/material/Tooltip';
export default function ThemeSwitch() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Tooltip title={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}>
    <Switch
      checked={mode === 'dark'}
      onChange={toggleColorMode}
      color="primary"
      icon={<Brightness7 fontSize="small" />}
      checkedIcon={<Brightness4 fontSize="small" />}
      sx={{ ml: 1 }}
    />
  </Tooltip>
  );
}