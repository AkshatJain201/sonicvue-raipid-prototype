import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DashboardData {
  summary: {
    total_calls: number;
    call_routing_accuracy: number;
    multiple_agents: number;
    call_hold_percentage: number;
    escalated_calls: number;
    resolution_confirmation: number;
    cs_portal_recommended: number;
  };
  calls_complexity: {
    easy: number;
    medium: number;
    difficult: number;
  };
  call_hygiene: {
    greeting: number;
    phone_number: number;
    email: number;
  };
  tone_conversation: {
    positive: number;
    neutral: number;
    negative: number;
  };
  event_type: {
    [key: string]: number;
  };
  customer_service: {
    parts_request: number;
    digital_service: number;
    field_visits: number;
  };
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [modality, setModality] = useState('All');
  const [clinicalTechnical, setClinicalTechnical] = useState('All');
  const [complexity, setComplexity] = useState('All');
  const [eventType, setEventType] = useState('All');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/dashboard-data');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!dashboardData) {
    return <Typography>Loading...</Typography>;
  }

  const renderKPI = (title: string, value: number, unit: string = '') => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
      <Typography variant="h6">{value.toFixed(0)}{unit}</Typography>
      <Typography variant="body2">{title}</Typography>
    </Paper>
  );

  const callComplexityData = [
    { name: 'Easy', value: dashboardData.calls_complexity.easy },
    { name: 'Medium', value: dashboardData.calls_complexity.medium },
    { name: 'Difficult', value: dashboardData.calls_complexity.difficult },
  ];

  const callHygieneData = [
    { name: 'Greeting', value: dashboardData.call_hygiene.greeting },
    { name: 'Phone Number', value: dashboardData.call_hygiene.phone_number },
    { name: 'Email', value: dashboardData.call_hygiene.email },
  ];

  const toneConversationData = [
    { name: 'Positive', value: dashboardData.tone_conversation.positive },
    // { name: 'Neutral', value: dashboardData.tone_conversation.neutral },
    { name: 'Negative', value: dashboardData.tone_conversation.negative },
  ];

  const eventTypeData = Object.entries(dashboardData.event_type).map(([name, value]) => ({ name, value }));

  const customerServiceData = [
    { name: 'Parts Request', value: dashboardData.customer_service.parts_request },
    { name: 'Digital Service', value: dashboardData.customer_service.digital_service },
    { name: 'Field Visits', value: dashboardData.customer_service.field_visits },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ bgcolor: '#6800E0', color: 'white', p: 2, borderRadius: 1 }}>
        Call Analysis Dashboard
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Modality</InputLabel>
            <Select value={modality} onChange={(e) => setModality(e.target.value as string)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="CT">CT</MenuItem>
              <MenuItem value="MR">MR</MenuItem>
              <MenuItem value="IGT">IGT</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Clinical/Technical</InputLabel>
            <Select value={clinicalTechnical} onChange={(e) => setClinicalTechnical(e.target.value as string)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Clinical">Clinical</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Complexity</InputLabel>
            <Select value={complexity} onChange={(e) => setComplexity(e.target.value as string)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Difficult">Difficult</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Event Type</InputLabel>
            <Select value={eventType} onChange={(e) => setEventType(e.target.value as string)}>
              <MenuItem value="All">All</MenuItem>
              {Object.keys(dashboardData.event_type).map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* <Button variant="contained" color="primary">
          Glossary
        </Button> */}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          {renderKPI('Total Calls', dashboardData.summary.total_calls)}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderKPI('Call Routing Accuracy %', dashboardData.summary.call_routing_accuracy, '%')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderKPI('Multiple Agents Invited %', dashboardData.summary.multiple_agents, '%')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderKPI('Call Hold %', dashboardData.summary.call_hold_percentage, '%')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderKPI('Escalated Calls %', dashboardData.summary.escalated_calls, '%')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderKPI('Resolution Confirmation %', dashboardData.summary.resolution_confirmation, '%')}
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Calls Complexity</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callComplexityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Call Hygiene</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callHygieneData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tone of Conversation</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={toneConversationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {toneConversationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Event Type</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Customer Service</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;