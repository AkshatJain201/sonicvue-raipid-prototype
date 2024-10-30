import React, { useState, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  LinearProgress, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Paper,
  Snackbar,
  Card, 
  CardContent, 
  CardActions, 
  Grid,
  Tooltip,
  IconButton,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, CloudDownload as CloudDownloadIcon, AudioFile as AudioFileIcon, Description as DescriptionIcon, GetApp as GetAppIcon, Close as CloseIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [transcripts, setTranscripts] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<string>('');

  const showTranscript = (transcript: string) => {
    setSelectedTranscript(transcript);
    setOpenTranscriptDialog(true);
  };

  // const downloadTranscriptAsPdf = async (transcript: string, filename: string) => {
  //   const element = document.createElement("a");
  //   const file = new Blob([transcript], {type: 'text/plain'});
  //   element.href = URL.createObjectURL(file);
  //   element.download = `${filename.split('.')[0]}_transcript.txt`;
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };
  
  const downloadTranscriptAsPdf = async (transcript: string, filename: string) => {
    const doc = new jsPDF();
    
    // Split text into lines to fit page width
    const lines = doc.splitTextToSize(transcript, 180);
    
    doc.text(lines, 15, 15);
    doc.save(`${filename.split('.')[0]}_transcript.pdf`);
  };

  const downloadAllTranscripts = async (transcripts: any[]) => {
    transcripts.forEach(item => {
      downloadTranscriptAsPdf(item.transcript, item.filename);
    });
  };
  // Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > 5) {
      setError('You can only upload up to 5 files at a time.');
      return;
    }
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
    },
    maxFiles: 5,
  });

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(prevProgress => ({
              ...prevProgress,
              [files[0].name]: Math.round(progress),
            }));
          }
        },
      });
      setTranscripts(response.data);
      setError(null);
    } catch (err) {
      setError('An error occurred while uploading the files. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        bgcolor: 'purple', 
        color: 'white', 
        p: 2, 
        borderRadius: 1, 
        mb: 4
      }}>
        <CloudUploadIcon sx={{ mr: 1 }} />
        Upload Files
      </Typography>

      <Paper {...getRootProps()} sx={{ 
        p: 3, 
        textAlign: 'center', 
        cursor: 'pointer', 
        mb: 3,
        border: '2px dashed #ccc',
        '&:hover': { borderColor: 'purple' }
      }}>
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'purple', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the files here' : 'Drag and drop file here'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          or
        </Typography>
        <Button variant="contained" color="primary">
          Browse Files
        </Button>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Max file size of 25MB - File format .MP3
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Files (add up to 5 files)
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <AudioFileIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={file.name} 
                  secondary={
                    uploading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={uploadProgress[file.name] || 0} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{`${uploadProgress[file.name] || 0}%`}</Typography>
                        </Box>
                      </Box>
                    ) : 'Ready to upload'
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Box> */}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          // startIcon={<CloudUploadIcon />}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
        
        {transcripts.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => downloadAllTranscripts(transcripts)}
            startIcon={<CloudDownloadIcon />}
          >
            Download All Transcripts
          </Button>
        )}
      </Box>

      {transcripts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'purple' }}>
            Generated Transcripts
          </Typography>
          <Grid container spacing={3}>
            {transcripts.map((item: any) => (
              <Grid item xs={12} sm={6} md={4} key={item.filename}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': { boxShadow: 6 }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.filename}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.transcript.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>

                    <Tooltip title="View Transcript">
                      <IconButton 
                        color="primary" 
                        onClick={() => showTranscript(item.transcript)}
                      >
                        <DescriptionIcon />
                      </IconButton>
                    </Tooltip>
                  
                    <Dialog 
                      open={openTranscriptDialog} 
                      onClose={() => setOpenTranscriptDialog(false)}
                      maxWidth="md"
                      fullWidth
                    >
                      <DialogTitle sx={{ m: 0, p: 2 }}>
                        Transcript
                        <IconButton
                          aria-label="close"
                          onClick={() => setOpenTranscriptDialog(false)}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </DialogTitle>
                      <DialogContent dividers>
                        <Typography>
                          {selectedTranscript}
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenTranscriptDialog(false)}>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Tooltip title="Download Transcript">
                      <IconButton 
                        color="secondary"
                        onClick={() => downloadTranscriptAsPdf(item.transcript, item.filename)}
                      >
                        <GetAppIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
      onClose={() => setError(null)}/* q1`q`aw   */
        message={error}
      />
    </Box>
  );
};

export default UploadPage;