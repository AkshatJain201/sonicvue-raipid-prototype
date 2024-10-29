import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e24aa', // Purple color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" Component={UploadPage} />
            <Route path="/dashboard" Component={DashboardPage} />
            <Route path="/chatbot" Component={ChatbotPage} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;