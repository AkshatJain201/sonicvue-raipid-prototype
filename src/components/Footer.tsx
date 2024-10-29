import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { LinkedIn, Facebook, Twitter, YouTube } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f0f0f0', p: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © 2024 C5i, All Rights Reserved.
      </Typography>
      <Box sx={{ mt: 1 }}>
        <IconButton color="primary" href="#" target="_blank">
          <LinkedIn />
        </IconButton>
        <IconButton color="primary" href="#" target="_blank">
          <Facebook />
        </IconButton>
        <IconButton color="primary" href="#" target="_blank">
          <Twitter />
        </IconButton>
        <IconButton color="primary" href="#" target="_blank">
          <YouTube />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;