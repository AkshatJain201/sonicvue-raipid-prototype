import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar } from '@mui/material';
import { Notifications as NotificationsIcon, Menu as MenuIcon } from '@mui/icons-material';
import c5ilogo from '../images/c5i_logo.png'
import sonicvue from '../images/sonic_vue_logo.png'

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src={c5ilogo} alt="C5i Logo" style={{ height: '40px', marginRight: '10px' }} />
          <Typography variant="h6" component="span" sx={{ mx: 1 }}>|</Typography>
          <img src={sonicvue} alt="Sonicvue Logo" style={{ height: '30px', marginLeft: '10px' }} />
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: '#6800E0' }}>AK</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Header;