import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CustomTag from '../Common/CustomTag';
import { useNavigate } from 'react-router-dom';

export default function MobileSubMenu({ menu, subMenuLinks, closeDrawer, handleCreateNewTender }) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <CustomTag color="primary" tagName={menu.logo} />
                    </ListItemIcon>
                    <ListItemText primary={menu.title} />
                    {open ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {subMenuLinks.map((subMenu) => {
                        if (subMenu.urlLink === '/create_new_tender') {
                            return (
                                <ListItem key={subMenu.urlLink} disablePadding sx={{ pl: 2 }}>
                                    <ListItemButton onClick={() => {
                                        closeDrawer();
                                        handleCreateNewTender();
                                    }}>
                                        <ListItemIcon>
                                            <CustomTag color="primary" tagName={subMenu.logo} />
                                        </ListItemIcon>
                                        <ListItemText slotProps={{ primary: { fontSize: '0.9rem' } }}
                                            primary={subMenu.title} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                        else {
                            return (
                                <ListItem key={subMenu.urlLink} disablePadding sx={{ pl: 2 }}>
                                    <ListItemButton onClick={() => {
                                        closeDrawer();
                                        navigate(subMenu.urlLink);
                                    }
                                    }>
                                        <ListItemIcon>
                                            <CustomTag color="primary" tagName={subMenu.logo} />
                                        </ListItemIcon>
                                        <ListItemText slotProps={{ primary: { fontSize: '0.9rem' } }}
                                            primary={subMenu.title} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    }
                    )}
                </List>
            </Collapse>
        </>
    );
}

MobileSubMenu.propTypes = {
    menu: PropTypes.object.isRequired,
    subMenuLinks: PropTypes.array.isRequired,
};
