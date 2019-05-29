import AppBar from '@material-ui/core/AppBar';
import { IconButton, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import { APP_NAME } from '../../constants';
import { useStyles } from './styles';



function Header(props) {
    const { isAuthenticated, onLogout, currentUser } = props;
    const classes = useStyles();
    const { showDrawer } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    function handleProfileMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMobileMenuClose() {
        setMobileMoreAnchorEl(null);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    function handleMobileMenuOpen(event) {
        setMobileMoreAnchorEl(event.currentTarget);
    }


    let Menus = [];
    let Sidebar = [];
    let renderMenu = [];
    let renderMobileMenu = [];
    if (isAuthenticated) {
        Menus = [
            <IconButton
                edge="end"
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
        ];
        Sidebar = [
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="Open Sidebar"
                onClick={showDrawer}
            >
                <MenuIcon />
            </IconButton>
        ];
        renderMenu = [
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem><Link to={`/users/${currentUser.username}`}>Profile</Link></MenuItem>
                {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
                <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
        ];
        renderMobileMenu = [
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <MenuItem onClick={handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>
        ];
    } else {
        Menus = [
            <Button color="inherit"><Link to="/login">Login</Link></Button>
        ];
        renderMobileMenu = [
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <MenuItem><Link to="/login">Login</Link></MenuItem>
            </Menu>
        ];
    }

    console.log(currentUser)

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    {Sidebar}
                    <Typography className={classes.title} variant="h6" noWrap>
                        {APP_NAME}
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>

                        {Menus}
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMenu}
            {renderMobileMenu}
        </div>
    );
}

export default Header;