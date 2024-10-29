import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { CloudUpload, BarChart, QuestionAnswer } from '@mui/icons-material';


const Sidebar: React.FC = () => {
  return (
    <Box sx={{ width: 200, backgroundColor: '#1a1a2e', color: 'white', height: '100%' }}>
      <List>
        <ListItemButton component={Link} to="/">
            <ListItemIcon>
                <CloudUpload sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Upload File" />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
                <CloudUpload sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Call Analysis" />
        </ListItemButton>
        <ListItemButton component={Link} to="/chatbot">
            <ListItemIcon>
                <CloudUpload sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Support" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;