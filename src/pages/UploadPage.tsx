import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  // IconButton,
} from '@mui/material';
import {
  CloudUpload,
  AudioFile,
  Check,
  Download,
  FileUpload,
  Close,
  Description as DescriptionIcon,
  Close as CloseIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import DialogContentComponent from '../components/DialogContent';

interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'processing';
} 

interface TranscriptResponse {
  filename: string;
  transcript: string | null;
  transcript_file: string;
  status: 'processing' | 'completed' | 'error';
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [transcripts, setTranscripts] = useState<TranscriptResponse[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showTranscripts, setShowTranscripts] = useState(false);
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState('');
  const [loadingTranscripts, setLoadingTranscripts] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const showTranscript = (transcript: string) => {
    setSelectedTranscript(transcript);
    setOpenTranscriptDialog(true);
  };

  const downloadTranscriptAsPdf = (transcript: string, filename: string) => {
    const blob = new Blob([transcript], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
  };

  const handleBrowseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // setAnchorEl(event.currentTarget);
    handleOpen();
  };

  const handleClose = () => {
    // setAnchorEl(null);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSingleUpload = () => {
    handleClose();
    fileInputRef.current?.click();
  };

  const handleBatchUpload = () => {
    handleClose();
    batchFileInputRef.current?.click();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > 5) {
      setAlert({
        show: true,
        message: 'You can only upload up to 5 files at a time.',
        type: 'error'
      });
      return;
    }
    
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    },
    maxFiles: 5,
    noClick: true,
  });

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const fileUpload of pendingFiles) {
      const formData = new FormData();
      formData.append('files', fileUpload.file);

      try {
        setFiles(prev => prev.map(f =>
          f.file === fileUpload.file
            ? { ...f, status: 'uploading' }
            : f
        ));

        const response = await axios.post('http://localhost:8000/upload', formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = (progressEvent.loaded / progressEvent.total) * 100;
              setFiles(prev => prev.map(f => 
                f.file === fileUpload.file 
                  ? { ...f, progress: Math.round(progress) }
                  : f
              ));
            }
          },
        });

        setFiles(prev => prev.map(f =>
          f.file === fileUpload.file
            ? { ...f, status: 'success' }
            : f
        ));

        setAlert({
          show: true,
          message: 'File uploaded successfully!',
          type: 'success'
        });
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.file === fileUpload.file
            ? { ...f, status: 'error' }
            : f
        ));

        setAlert({
          show: true,
          message: 'Error uploading file. Please try again.',
          type: 'error'
        });
      }
    }
  };

  const handleGenerateTranscripts = async () => {
    try {
      const uploadedFiles = files.filter(f => f.status === 'success').map(f => f.file.name);
      setLoadingTranscripts(true);
      const response = await axios.get('http://localhost:8000/generate_transcripts', {
        params: {
          files: uploadedFiles.join(',')
        }
      });
      
      setTranscripts(response.data);
      setShowTranscripts(true);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error generating transcripts. Please try again.',
        type: 'error'
      });
    } finally {
      setLoadingTranscripts(false);
    }
  };

  const isGenerateButtonDisabled = files.some(file => file.status === 'uploading' || file.status === 'processing');

  const removeFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        bgcolor: '#8C51E1', 
        color: 'white', 
        p: 2, 
        borderRadius: 1, 
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CloudUpload />
        Upload Files
      </Typography>

      {/* {files.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Files (add up to 5 files)
          </Typography>
          <List>
            {files.map((fileUpload, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <AudioFile sx = {{color: '#007AFF'}}/>
                </ListItemIcon>
                <ListItemText 
                  primary={fileUpload.file.name}
                  secondary={
                    fileUpload.status === 'uploading' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={fileUpload.progress} 
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2">
                          {`${fileUpload.progress}%`}
                        </Typography>
                      </Box>
                    ) : fileUpload.status === 'success' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <Check sx={{ mr: 0.5 }} />
                        Uploaded successfully!
                      </Box>
                    ) : fileUpload.status
                  }
                />
                <IconButton onClick={() => removeFile(fileUpload.file)}>
                  <Close />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )} */}

      {files.length > 0 && (
      <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
            Files (add up to 5 files)
      </Typography>
      <List>
            {files.map((fileUpload, index) => (
      <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  mb: 2,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
                }}
      >
      <ListItemIcon sx={{ minWidth: 40 }}>
      <AudioFile sx={{ color: '#007AFF', fontSize: '24px' }} />
      </ListItemIcon>
      <ListItemText
                  primary={
      <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                      {fileUpload.file.name}
      </Typography>
                  }
                  secondary={
                    fileUpload.status === 'uploading' ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      <LinearProgress
                          variant="determinate"
                          value={fileUpload.progress}
                          sx={{
                            flexGrow: 1,
                            height: 8,
                            borderRadius: '4px',
                            backgroundColor: '#F0F0F0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#007AFF'
                            }
                          }}
                        />
      <Typography variant="body2" sx={{ color: '#333', minWidth: '45px' }}>
                          {`${fileUpload.progress}%`}
      </Typography>
      </Box>
                    ) : fileUpload.status === 'success' ? (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: '#4CAF50' }}>
      <Check sx={{ mr: 0.5 }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Uploaded successfully!
      </Typography>
      </Box>
                    ) : fileUpload.status
                  }
                />
      <IconButton onClick={() => removeFile(fileUpload.file)} sx={{ color: '#888' }}>
      <Close />
      </IconButton>
      </ListItem>
            ))}
      </List>
      </Box>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed #ccc',
          borderRadius: 2,
          '&:hover': { borderColor: 'purple' }
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: '#6800E0', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the files here' : 'Drag and drop file here'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          or
        </Typography>
        <Button
          variant="contained"
          onClick={handleBrowseClick}
          sx={{ mt: 2 , backgroundColor: '#6800E0'}}
        >
          Browse Files
        </Button>
        <Dialog open={open} onClose={handleClose} >
          <DialogTitle>Upload Files</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6}>
                <IconButton
                  onClick={handleSingleUpload}
                  sx={{border: '1px solid #6800E0',
                  width:'100%',
                  borderRadius: 2,                   
                  display: 'flex',                   
                  flexDirection: 'column',                   
                  alignItems: 'center',                   
                  padding:2, 
                  }} 
                >
                  <FileUpload sx={{ fontSize: 40, color: '#6800E0' }} />
                  <Typography color="#6800E0" noWrap>Single Upload</Typography>
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                <IconButton
                  onClick={handleBatchUpload}
                  sx={{border: '1px solid #6800E0',
                  borderRadius: 2,                   
                  display: 'flex',                   
                  flexDirection: 'column',                   
                  alignItems: 'center',                   
                  padding:2, 
                  }} 
                >
                  <FileUpload sx={{ fontSize: 40, color: '#6800E0' }} />
                  <Typography color="#6800E0">Batch Upload</Typography>
                </IconButton>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Typography variant="caption" color="textSecondary" sx={{ mx: 'auto' }}>
              Upload - Max 5 Files
            </Typography>
          </DialogActions>
        </Dialog>
              
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
          accept=".mp3,.wav"
        />
        <input
          type="file"
          ref={batchFileInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
          accept=".mp3,.wav"
        />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Max file size of 25MB - File format .MP3
        </Typography>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!files.some(f => f.status === 'pending' || f.status==='uploading')}
          sx = {{backgroundColor: '#6800E0'}}
        >
          Upload Files
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerateTranscripts}
          disabled={files.some(f => f.status === 'uploading' || f.status === 'processing') || loadingTranscripts} // Disable while generating
          sx = {{backgroundColor: '#6800E0'}}
        >
          {loadingTranscripts ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Generate Transcripts'}
        </Button>
      </Box>
      
      {transcripts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#6800E0' , flexGrow : 1}}>
              Generated Transcripts
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, ml : 'auto' }}>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                onClick={() => {
                  transcripts.forEach(transcript => {
                    if (transcript.status === 'completed' && transcript.transcript) {
                      downloadTranscriptAsPdf(transcript.transcript, transcript.filename);
                    }
                  });
                }}
                sx={{ backgroundColor: '#6800E0' }}
              >
                Download All
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => setTranscripts([])}
                sx={{ 
                  borderColor: '#6800E0', 
                  color: '#6800E0',
                  '&:hover': {
                    borderColor: '#6800E0',
                    backgroundColor: 'rgba(104, 0, 224, 0.04)'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {transcripts.map((item) => (
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
                      {item.transcript?.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="View Transcript">
                      <IconButton 
                        color="primary" 
                        onClick={() => item.transcript && showTranscript(item.transcript)}
                      >
                        <DescriptionIcon sx = {{color: '#8C51E1'}}/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Transcript">
                      <IconButton 
                        color="secondary"
                        onClick={() => item.transcript && downloadTranscriptAsPdf(item.transcript, item.filename)}
                      >
                        <GetAppIcon sx = {{color: '#8C51E1'}}/>
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog 
            open={openTranscriptDialog} 
            onClose={() => setOpenTranscriptDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              Transcript
              <IconButton
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
              {/* <Typography>
                {selectedTranscript}
              </Typography> */}
              {/* <Typography
                component="div"
                dangerouslySetInnerHTML={{
                  __html: selectedTranscript.replace(/\n/g, '<br />'),
                }}
              /> */}
              <DialogContentComponent selectedTranscript={selectedTranscript}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenTranscriptDialog(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      <Snackbar
        open={alert.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, show: false })}
      >
        <Alert severity={alert.type} onClose={() => setAlert({ ...alert, show: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}