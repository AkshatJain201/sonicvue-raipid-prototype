import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { Download as DownloadIcon, Dashboard as DashboardIcon, TableChart as TableChartIcon } from '@mui/icons-material';

// Mock data for charts
const callComplexityData = [
  { name: 'Easy', existingCase: 30, newCase: 40 },
  { name: 'Intermediate', existingCase: 20, newCase: 25 },
  { name: 'Difficult', existingCase: 10, newCase: 15 },
];

const callHygieneData = [
  { name: 'Greetings', value: 80 },
  { name: 'Customer Phone No', value: 95 },
  { name: 'Email ID', value: 75 },
];

const toneConversationData = [
  { name: 'Positive Tone', value: 75 },
  { name: 'Negative Tone', value: 25 },
];

const eventTypeData = [
  { name: 'Installation', newCase: 40, existingCase: 20 },
  { name: 'Proactive', newCase: 30, existingCase: 35 },
  { name: 'Reactive', newCase: 35, existingCase: 15 },
  { name: 'Incidents', newCase: 25, existingCase: 30 },
  { name: 'Scheduled', newCase: 20, existingCase: 10 },
];

const customerServiceData = [
  { name: 'Field Visits', value: 40 },
  { name: 'Parts Request', value: 30 },
  { name: 'Digital Services', value: 20 },
  { name: 'Parts Dispatch', value: 25 },
];

const issueTypeData = [
  { name: 'Assistance', value: 40 },
  { name: 'Software', value: 30 },
  { name: 'Maintenance', value: 30 },
];

// Mock data for table
const tableData = [
  { caseNo: '12345', callDuration: 3, holdTime: 10, routTime: 5, timeToResolve: 1, callType: 'Installation', fieldVisit: 'Yes', partRequest: 'No', digitalService: 'No', documentDisposition: 'No' },
  { caseNo: '12345', callDuration: 4, holdTime: 5, routTime: 8, timeToResolve: 3, callType: 'Proactive', fieldVisit: 'Yes', partRequest: 'Yes', digitalService: 'Yes', documentDisposition: 'No' },
  { caseNo: '12345', callDuration: 6, holdTime: 6, routTime: 9, timeToResolve: 5, callType: 'Scheduled', fieldVisit: 'No', partRequest: 'No', digitalService: 'No', documentDisposition: 'No' },
  { caseNo: '12345', callDuration: 8, holdTime: 3, routTime: 4, timeToResolve: 4, callType: 'Reactive', fieldVisit: 'Yes', partRequest: 'No', digitalService: 'No', documentDisposition: 'No' },
  { caseNo: '12345', callDuration: 3, holdTime: 7, routTime: 2, timeToResolve: 6, callType: 'Incidents', fieldVisit: 'No', partRequest: 'Yes', digitalService: 'Yes', documentDisposition: 'No' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DashboardPage: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'table'>('dashboard');

  const handleViewChange = (newView: 'dashboard' | 'table') => {
    setView(newView);
  };

  const renderKPI = (title: string, value: string | number) => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body2">{title}</Typography>
    </Paper>
  );

  const renderDashboardView = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {renderKPI('Total Calls', 180)}
        {renderKPI('Call Route Correct', '70%')}
        {renderKPI('Multiple Agents Invited', '60%')}
        {renderKPI('Average hold time', '45(s)')}
        {renderKPI('Escalated calls', '23%')}
        {renderKPI('Resolution Confirmation', '85%')}
        {renderKPI('Digital service Offered', '57%')}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Call by Complexity</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callComplexityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="existingCase" fill="#8884d8" />
                <Bar dataKey="newCase" fill="#82ca9d" />
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
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tone Conversation</Typography>
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
                >
                  {toneConversationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
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
                <Bar dataKey="newCase" fill="#8884d8" />
                <Bar dataKey="existingCase" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="case level details table">
        <TableHead>
          <TableRow>
            <TableCell>Case No.</TableCell>
            <TableCell align="right">Call Duration (Min.)</TableCell>
            <TableCell align="right">Hold Time (Sec.)</TableCell>
            <TableCell align="right">Rout Time (Sec.)</TableCell>
            <TableCell align="right">Time to Resolve (Mins)</TableCell>
            <TableCell>Call Type</TableCell>
            <TableCell>Field Visit</TableCell>
            <TableCell>Part Request</TableCell>
            <TableCell>Digital Service</TableCell>
            <TableCell>Document Disposition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">{row.caseNo}</TableCell>
              <TableCell align="right">{row.callDuration}</TableCell>
              <TableCell align="right">{row.holdTime}</TableCell>
              <TableCell align="right">{row.routTime}</TableCell>
              <TableCell align="right">{row.timeToResolve}</TableCell>
              <TableCell>{row.callType}</TableCell>
              <TableCell>{row.fieldVisit}</TableCell>
              <TableCell>{row.partRequest}</TableCell>
              <TableCell>{row.digitalService}</TableCell>
              <TableCell>{row.documentDisposition}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        bgcolor: 'purple', 
        color: 'white', 
        p: 2, 
        borderRadius: 1, 
        mb: 4
      }}>
        {view === 'dashboard' ? 'Call Analysis' : 'Case Level Details'}
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Modality</InputLabel>
            <Select label="Modality">
              <MenuItem value="select">Select</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Clinical/Technical</InputLabel>
            <Select label="Clinical/Technical">
              <MenuItem value="select">Select</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Complexity</InputLabel>
            <Select label="Complexity">
              <MenuItem value="select">Select</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Event Type</InputLabel>
            <Select label="Event Type">
              <MenuItem value="select">Select</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ mr: 1 }}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            startIcon={view === 'dashboard' ? <TableChartIcon /> : <DashboardIcon />}
            onClick={() => handleViewChange(view === 'dashboard' ? 'table' : 'dashboard')}
          >
            {view === 'dashboard' ? 'Table View' : 'Dashboard View'}
          </Button>
        </Box>
      </Box>

      {view === 'dashboard' ? renderDashboardView() : renderTableView()}
    </Box>
  );
};

export default DashboardPage;