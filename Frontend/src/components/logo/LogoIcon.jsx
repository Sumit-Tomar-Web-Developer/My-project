// material-ui
import { useTheme } from '@mui/material/styles';
import logoIcon from 'assets/images/logo-icon.png';
import logoIconDark from 'assets/images/logo-icon.png';
import { ThemeMode } from 'config';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     *
     */
    <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Mantis" width="60" />
  );
};

export default LogoIcon;
