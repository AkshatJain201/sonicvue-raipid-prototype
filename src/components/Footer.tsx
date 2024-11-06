import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { LinkedIn, Facebook, Twitter, YouTube } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f0f0f0', p: 2, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary" sx={{ marginRight: 2 }}>
        © 2024 C5i, All Rights Reserved.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton color="primary" href="#" target="_blank">
          <LinkedIn sx={{ color: '#6800E0' }} />
        </IconButton>
        <IconButton color="primary" href="#" target="_blank">
          <Facebook sx={{ color: '#6800E0' }} />
        </IconButton>
        <IconButton color="primary" href="#" target="_blank">
          <Twitter sx={{ color: '#6800E0' }} />
        </IconButton>
        <IconButton color="primary" href="#" target="_blank">
          <YouTube sx={{ color: '#6800E0' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;