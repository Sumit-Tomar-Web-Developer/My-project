import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import CustomTag from '../Common/CustomTag';
import { APP_NAME, USER_MENU_LINKS } from '../../Utils/Constants';
import { navStyle, flexCenter, loginAvatar } from '../../Assets/Styles/CommonStyles';
import { Badge, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ThemeSwitch from '../Common/ThemeSwitch';
import CpmmLogo from '../../cpmmLogo.png';
import UserDropDownMenu from './UserDropDownMenu';
import MobileSubMenu from './MobileSubMenu';

export default function MobileMenuBar(props) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsMenuOpen(open);
  };

  const menuListDetails = (menu) => {
    if (menu.subMenu && menu.subMenu.length > 0) {
      return (
        // <ListItem key={menu.urlLink} disablePadding>
        <MobileSubMenu
          menu={menu}
          subMenuLinks={menu.subMenu}
          closeDrawer={() => setIsMenuOpen(false)}
          handleCreateNewTender={props.handleCreateNewTender}
        />
        // </ListItem>
      );
    }
    else if (menu.urlLink === '/create_new_tender') {
      return (
        <ListItem key={menu.urlLink} disablePadding>
          <ListItemButton onClick={() => {
            setIsMenuOpen(false);
            props.handleCreateNewTender();
          }}>
            <ListItemIcon>
              <CustomTag color="primary" tagName={menu.logo} />
            </ListItemIcon>
            <ListItemText slotProps={{ primary: { fontSize: '0.9rem' } }} primary={menu.title} />
          </ListItemButton>
        </ListItem>
      )
    }
    else if (menu.urlLink === '/worklist') {
      return (
        <ListItem key={menu.urlLink} disablePadding>
          <ListItemButton onClick={() => {
            setIsMenuOpen(false);
            navigate(menu.urlLink);
          }
          }>
            <Badge color="secondary" badgeContent={props.workListCount} max={999} >
              <ListItemIcon>
                <CustomTag color="primary" tagName={menu.logo} />
              </ListItemIcon>
              <ListItemText slotProps={{ primary: { fontSize: '0.9rem' } }} primary={menu.title} />
            </Badge>
          </ListItemButton>
        </ListItem>
      )
    }
    else {
      return (
        <ListItem key={menu.urlLink} disablePadding>
          <ListItemButton onClick={() => {
            setIsMenuOpen(false);
            navigate(menu.urlLink);
          }}>
            <ListItemIcon>
              <CustomTag color="primary" tagName={menu.logo} />
            </ListItemIcon>
            <ListItemText slotProps={{ primary: { fontSize: '0.9rem' } }} primary={menu.title} />
          </ListItemButton>
        </ListItem>
      )
    }
  }

  const menuList = () => {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        // onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {props.navBarLinks.map((menu) => menuListDetails(menu))}
        </List>
      </Box>
    );
  };

  return (
    <Toolbar disableGutters sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

      <IconButton
        size="large"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={toggleDrawer(true)}
        color="inherit"
      >
        <Badge color="secondary" variant="dot" invisible={props.workListCount == 0}>
          <MenuIcon />
        </Badge>
      </IconButton>

      <NavLink style={navStyle} to="/dashboard">
        <img
          alt={APP_NAME}
          src={CpmmLogo}
          style={{ width: 85 }}
        />
      </NavLink>

      <SwipeableDrawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {menuList()}
      </SwipeableDrawer>
      <Box sx={{ flex: 1 }}>
        <span style={{ ...flexCenter, ...loginAvatar }}>
          <ThemeSwitch />
          <UserDropDownMenu userName={props.userData.name}
            userRole={props.userData.role}
            userID={props.userData.userID}
            userDepartment={props.userData.departmentName}
            subMenuLinks={USER_MENU_LINKS} />
        </span>
      </Box>
    </Toolbar>
  );
}

MobileMenuBar.prototype = {
  userData: PropTypes.object.isRequired,
  navBarLinks: PropTypes.array.isRequired
}