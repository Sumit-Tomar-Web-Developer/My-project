import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { navStyle, appTitle, flexCenter, loginAvatar, navBadgeStyle } from '../../Assets/Styles/CommonStyles';
import { APP_NAME, USER_MENU_LINKS, TOOL_NAV_LINKS } from '../../Utils/Constants';
import { Badge } from '@mui/material';
import ThemeSwitch from '../Common/ThemeSwitch';
import CpmmLogo from '../../cpmmLogo.png';
import DropDownMenu from './DropDownMenu';
import UserDropDownMenu from './UserDropDownMenu';

// Helper to filter menu/submenu by role
const getRoleBasedNavLinks = (role) => {
    return TOOL_NAV_LINKS
        .filter(link => !link.requiredRoles || link.requiredRoles.includes(role))
        .map(link => ({
            ...link,
            subMenu: link.subMenu
                ? link.subMenu.filter(sub => !sub.requiredRoles || sub.requiredRoles.includes(role))
                : undefined
        }));
};

export default function DesktopMenu(props) {
    const navLinks = getRoleBasedNavLinks(props.userData.role);
    return (
        <Toolbar sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} disableGutters>
            <NavLink style={appTitle} to="/dashboard">
                <img
                    alt={APP_NAME}
                    src={CpmmLogo}
                    style={{ width: 80 }}
                />
            </NavLink>
            {navLinks.map((menu) => {
                if (menu.subMenu && menu.subMenu.length > 0) {
                    return (
                        <DropDownMenu
                            key={menu.urlLink}
                            menu={menu}
                            subMenuLinks={menu.subMenu}
                            handleCreateNewTender={props.handleCreateNewTender}
                        />
                    );
                }
                if (menu.urlLink === '/create_new_tender') {
                    return (
                        <NavLink className="nav-item" style={navStyle} onClick={props.handleCreateNewTender}
                            to="edit_tender_details"
                            key={menu.urlLink}>
                            {menu.title}
                        </NavLink>
                    )
                }
                else if (menu.urlLink === '/worklist') {
                    return (
                        <span style={{ paddingRight: "0.5rem" }} key={menu.urlLink}>
                            <Badge color="secondary" badgeContent={props.workListCount} max={999} >
                                <NavLink className="nav-item" style={navBadgeStyle} to={menu.urlLink} key={menu.urlLink}>
                                    {menu.title}
                                </NavLink>
                            </Badge>
                        </span>
                    )
                }
                else {
                    return (
                        <NavLink className="nav-item" style={navStyle} to={menu.urlLink} key={menu.urlLink}>
                            {menu.title}
                        </NavLink>
                    )
                }
            })}
            <Box sx={{ flex: 1 }}>
                <span style={{ ...flexCenter, ...loginAvatar }}>
                    <ThemeSwitch></ThemeSwitch>
                    <UserDropDownMenu
                        userName={props.userData.name}
                        userRole={props.userData.role}
                        userID={props.userData.userID}
                        userDepartment={props.userData.departmentName}
                        subMenuLinks={USER_MENU_LINKS} />
                </span>
            </Box>
        </Toolbar>
    );
}

DesktopMenu.prototype = {
    userData: PropTypes.object.isRequired
}
