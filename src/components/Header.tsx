import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar } from '@mui/material';
import { Notifications as NotificationsIcon, Menu as MenuIcon } from '@mui/icons-material';
import logo from '../images/c5i_2.png'

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <img src={logo} alt="C5i Logo" style={{ height: '30px', marginRight: '10px' }} />
        | Sonic VUE
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: 'purple' }}>AK</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;