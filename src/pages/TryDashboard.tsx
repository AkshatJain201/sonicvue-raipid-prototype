import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Download, CloudUploadOutlined, InsertChartOutlined, PhoneInTalkOutlined, VerifiedUserOutlined, CheckCircleOutlined, ContactSupportOutlined } from '@mui/icons-material';
import axios from 'axios';

const COLORS = ['#3457D5', '#1877F2', '#00308F', '#FF8042'];
const colors = ["#1877F2", "#3457D5", "#00308F"];



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
  complexity: {
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

  root_cause_analysis: {
    hold_time: number;
    resolution_time: number;
    route_time: number;
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


  const renderKPI = (title: string, value: number, unit: string = '', icon: React.ReactNode) => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '28px' }}>
        {icon}
        <Typography sx={{ fontSize: '20px' }} variant="h6">
          {value.toFixed(0)}{unit}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '10px' }} variant="body2">
        {title}
      </Typography>
    </Paper>
  );


  const callComplexityData = [
    { name: 'Easy', value: dashboardData.complexity.easy },
    { name: 'Medium', value: dashboardData.complexity.medium },
    { name: 'Difficult', value: dashboardData.complexity.difficult },
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

  const rootCauseAnalysis = [
    {
      category: 'Root Cause Analysis',
      HoldTime: dashboardData.root_cause_analysis.hold_time,
      ResolutionTime: dashboardData.root_cause_analysis.resolution_time,
      RouteTime: dashboardData.root_cause_analysis.route_time,
    },
  ];


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{
        bgcolor: '#6800E0',
        height: '40px',
        color: 'white',
        fontSize: '16px',
        p: 2,
        marginBottom: '10px',
        marginTop: '-15px',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <InsertChartOutlined />
        Call Analysis Dashboard
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {/* Labels Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, }}>
            <Typography sx={{ minWidth: 120, textAlign: 'start', fontSize: '12px', color: '#b0b0b0' }}>Category</Typography>
            {/* <Typography sx={{ minWidth: 120, textAlign: 'start', fontSize: '12px', color: '#b0b0b0' }}>Clinical/Technical</Typography> */}
            <Typography sx={{ minWidth: 120, textAlign: 'start', fontSize: '12px', color: '#b0b0b0' }}>Complexity</Typography>
            <Typography sx={{ minWidth: 120, textAlign: 'start', fontSize: '12px', color: '#b0b0b0' }}>Event Type</Typography>
          </Box>

          {/* Dropdowns Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                sx={{ height: '30px', fontSize: '12px' }} // Reduced font size for Select component
                value={modality}
                onChange={(e) => setModality(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em style={{ fontSize: '12px' }}>Select</em> {/* Reduced font size for placeholder */}
                </MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="All">All</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="CT">Ultrasound</MenuItem>
                {/* <MenuItem sx={{ fontSize: '12px' }} value="MR">MR</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="IGT">IGT</MenuItem> */}
              </Select>
            </FormControl>
            {/* <FormControl sx={{ minWidth: 120 }}>
              <Select
                sx={{ height: '30px', fontSize: '12px' }}
                value={clinicalTechnical}
                onChange={(e) => setClinicalTechnical(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em style={{ fontSize: '12px' }}>Select</em>
                </MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="All">All</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="Clinical">Clinical</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="Technical">Technical</MenuItem>
              </Select>
            </FormControl> */}
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                sx={{ height: '30px', fontSize: '12px' }}
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em style={{ fontSize: '12px' }}>Select</em>
                </MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="All">All</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="Easy">Easy</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="Medium">Medium</MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="Difficult">Difficult</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                sx={{ height: '30px', fontSize: '12px' }}
                value={eventType}
                onChange={(e) => setEventType(e.target.value as string)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em style={{ fontSize: '12px' }}>Select</em>
                </MenuItem>
                <MenuItem sx={{ fontSize: '12px' }} value="All">All</MenuItem>
                {Object.keys(dashboardData.event_type).map((type) => (
                  <MenuItem key={type} sx={{ fontSize: '12px' }} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Button sx={{ height: '30px', bgcolor: '#0c0c0c', fontSize: '10px' }} variant="contained" ><Download sx={{ height: '15px' }} />
          Table View
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ justifyContent: 'space-between', flexWrap: 'nowrap', overflow: 'hidden', padding: '5px' }}>
        <Grid item sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '170px' }}>
          {renderKPI('Total Calls', dashboardData.summary.total_calls, '', <CloudUploadOutlined sx={{ fontSize: 20, color: '#6800e0' }} />)}
        </Grid>

        <Grid item sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '170px' }}>
          {renderKPI('Call Routing Accuracy', dashboardData.summary.call_routing_accuracy, '%', <InsertChartOutlined sx={{ fontSize: 20, color: '#6800e0' }} />)}
        </Grid>
        <Grid item sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '170px' }}>
          {renderKPI('Multiple Agents Invited', dashboardData.summary.multiple_agents, '%', <PhoneInTalkOutlined sx={{ fontSize: 20, color: '#6800e0' }} />)}
        </Grid>

        <Grid item sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '170px' }} >
          {renderKPI('Call Hold', dashboardData.summary.call_hold_percentage, '%', <VerifiedUserOutlined sx={{ fontSize: 20, color: '#6800e0' }} />)}
        </Grid>

        <Grid item sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '170px' }}>
          {renderKPI('Escalated Calls', dashboardData.summary.escalated_calls, '%', <CheckCircleOutlined sx={{ fontSize: 20, color: '#6800e0' }} />)}
        </Grid>

        <Grid item sx={{ flex: '1 1 auto', textAlign: 'center', minWidth: '170px' }}>
          {renderKPI('Resolution Confirmation', dashboardData.summary.resolution_confirmation, '%', <ContactSupportOutlined sx={{ fontSize: 20, color: '#6800e0' }} />)}
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {[
          { title: "Calls Complexity", data: callComplexityData, color: "#1877F2" },
          { title: "Call Hygiene", data: callHygieneData, color: "#979FDE" },
          { title: "Tone of Conversation", data: toneConversationData, chartType: "Pie", colors: COLORS },
          { title: "Event Type", data: eventTypeData, color: "#5F81CE" },
          { title: "Customer Service", data: customerServiceData, color: "#8884d8" },
          {
            title: "Root Cause Analysis", data: rootCauseAnalysis,
            chartType: "StackedBar",
            colors: ["#00308F", "#5F81CE", "#95D7FF"]
          },
        ].map((chart, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={{ p: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontSize: "14px", textAlign: "center", mb: 1 }}>
                {chart.title}
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                {chart.chartType === "Pie" ? (
                  <PieChart>
                    <Pie
                      data={chart.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill={chart.color}
                      dataKey="value"
                      label={({ name, percent, x, y, index }) => (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{
                            fontSize: '12px',
                            fill: chart.colors[index % chart.colors.length],
                            pointerEvents: 'none',
                            transform: `translateX(${x < 80 ? -20 : 20}px)`,
                          }}
                        >
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      )}
                    >
                      {chart.data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={chart.colors[idx % chart.colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : chart.chartType === "StackedBar" ? (
                  <BarChart
                    width={500}
                    height={300}
                    data={rootCauseAnalysis}
                    layout="vertical"
                    barSize={40}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="HoldTime" stackId="a" fill={'#1877F2'} />
                    <Bar dataKey="ResolutionTime" stackId="a" fill={'#3457D5'} />
                    <Bar dataKey="RouteTime" stackId="a" fill={'#00308F'} />
                  </BarChart>
                ) : (
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Bar dataKey="value" barSize={40}>
                      {chart.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>

                  </BarChart>
                )}
              </ResponsiveContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>




    </Box>
  );
};

export default Dashboard;
