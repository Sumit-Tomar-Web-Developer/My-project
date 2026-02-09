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

export default function UserDropDownMenu(props) {

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
            <Grid2 container className="nav-item" style={navStyle} key={props.title}
                onClick={handleMenuClick}
            >
                <Grid2 sx={{ xs: 11 }}>
                    <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Typography component="h2" variant="body1">
                            {"Hello " + props.userName}
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <Typography component="span" variant="body2" color="text.secondary" fontSize="0.7rem" >
                            Emp ID: {props.userID}
                        </Typography>
                    </Stack>
                </Grid2>
                <Grid2 sx={{ xs: 1 }}>
                    {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
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
                <MenuItem divider="true" disableRipple="true"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        '&.Mui-focusVisible': {
                            backgroundColor: 'transparent !important',
                        },
                        cursor: 'default'
                    }}
                >
                    <Grid2 sx={{ xs: 11 }}>
                        <Stack direction={"row"}>
                            <Typography align="left" component="h3" color="primary">
                                Role:
                            </Typography>
                            <Typography align='left' component="h3" color="text.secondary">
                                {getUserRoleName(props.userRole)}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"}>
                            <Typography align="left" component="h3" color="primary">
                                Department:
                            </Typography>
                            <Typography align='left' component="h3" color="text.secondary">
                                {props.userDepartment}
                            </Typography>
                        </Stack>
                    </Grid2>

                </MenuItem>

                {props.subMenuLinks.map((submenu) => {
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
                })
                }
            </Menu>
        </Fragment>
    )
}

UserDropDownMenu.prototype = {
    userName: PropTypes.string.isRequired,
    subMenuLinks: PropTypes.array.isRequired
}