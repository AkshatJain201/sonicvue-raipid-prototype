/*import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { CloudUpload, CloudUploadOutlined, InsertChartOutlined, ContactSupportOutlined, BarChart, QuestionAnswer } from '@mui/icons-material';


const Sidebar: React.FC = () => {
  return (
    <Box sx={{ width: '150px', backgroundColor: '#1a1a2e', color: 'white', height: '100%' }}>
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon sx={{ fontSize: '20px', minWidth: '30px', color: 'white' }}>
            <CloudUploadOutlined sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText
            primary="Upload File"
            primaryTypographyProps={{ sx: { fontSize: '14px' } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon sx={{ fontSize: '20px', minWidth: '30px', color: 'white' }}>
            <InsertChartOutlined sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText
            primary="Call Analysis"
            primaryTypographyProps={{ sx: { fontSize: '14px' } }}
          />
        </ListItemButton>
        <ListItemButton component={Link} to="/chatbot">
          <ListItemIcon sx={{ fontSize: '20px', minWidth: '30px', color: 'white' }}>
            <ContactSupportOutlined sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText
            primary="Support"
            primaryTypographyProps={{ sx: { fontSize: '14px' } }}
          />
        </ListItemButton>
      </List>

    </Box>
  );
};

export default Sidebar;*/

import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { CloudUploadOutlined, InsertChartOutlined, ContactSupportOutlined } from '@mui/icons-material';

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  return (
    <Box
      sx={{
        width: expanded ? '200px' : '60px', // Sidebar width changes on hover
        backgroundColor: '#1a1a2e',
        color: 'white',
        height: '100%',
        transition: 'width 0.3s', // Smooth transition for expanding/collapsing
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <List>
        <ListItemButton sx={{ height: '50px' }} component={Link} to="/">
          <ListItemIcon sx={{ fontSize: '20px', minWidth: '30px', color: 'white' }}>
            <CloudUploadOutlined sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          {expanded && (
            <ListItemText sx={{minWidth:'150px'}} primary="Upload File" primaryTypographyProps={{ sx: { fontSize: '14px' } }} />
          )}
        </ListItemButton>
        <ListItemButton sx={{ height: '50px' }} component={Link} to="/dashboard">
          <ListItemIcon sx={{ fontSize: '20px', minWidth: '30px', color: 'white' }}>
            <InsertChartOutlined sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          {expanded && (
            <ListItemText sx={{minWidth:'150px'}} primary="Call Analysis" primaryTypographyProps={{ sx: { fontSize: '14px' } }} />
          )}
        </ListItemButton>
        <ListItemButton sx={{ height: '50px' }} component={Link} to="/chatbot">
          <ListItemIcon sx={{ fontSize: '20px', minWidth: '30px', color: 'white' }}>
            <ContactSupportOutlined sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          {expanded && (
            <ListItemText sx={{minWidth:'150px'}} primary="Support" primaryTypographyProps={{ sx: { fontSize: '14px' } }} />
          )}
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;


