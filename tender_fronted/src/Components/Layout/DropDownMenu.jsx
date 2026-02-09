import { useState, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { navStyle, menuStyle } from '../../Assets/Styles/CommonStyles';
import CustomTag from '../Common/CustomTag';
import { Grid2, Stack, Typography } from '@mui/material';
import { getUserRoleName } from '../../Utils/UtilityFunctions';

export default function DropDownMenu(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <Grid2 container className="nav-item" style={navStyle} key={props.menu.title} onClick={handleMenuClick}>
                <Grid2 sx={{ xs: 11 }}>
                    <Typography component="h2" variant="body1">
                        {props.menu.title}
                    </Typography>
                </Grid2>
                <Grid2 sx={{ xs: 1 }}>
                    {open ? <ArrowDropUpIcon fontSize='small' /> : <ArrowDropDownIcon fontSize='small' />}
                </Grid2>
            </Grid2>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {props.subMenuLinks.map((submenu) => {
                    if (submenu.urlLink === '/create_new_tender') {
                        return (
                            <MenuItem onClick={handleClose} key={submenu.urlLink}>
                                <NavLink style={{ ...menuStyle, width: '100%' }}
                                    onClick={props.handleCreateNewTender}
                                    to="edit_tender_details"
                                    key={submenu.urlLink}>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <CustomTag color="primary" tagName={submenu.logo} />
                                        <Typography color="text.primary">
                                            {submenu.title}
                                        </Typography>
                                    </Stack>
                                </NavLink>
                            </MenuItem>
                        )
                    }
                    else {
                        return (
                            <MenuItem onClick={handleClose} key={submenu.urlLink}>
                                <NavLink style={{ ...menuStyle, width: '100%' }} to={submenu.urlLink}>
                                    <Stack direction={"row"} alignItems={"center"}>
                                        <CustomTag color="primary" tagName={submenu.logo} />
                                        <Typography color="text.primary">
                                            {submenu.title}
                                        </Typography>
                                    </Stack>
                                </NavLink>
                            </MenuItem>
                        )
                    }
                })
                }
            </Menu>
        </Fragment>
    )
}

DropDownMenu.prototype = {
    userName: PropTypes.string.isRequired,
    subMenuLinks: PropTypes.array.isRequired
}