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
  Snackbar
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, AudioFile as AudioFileIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [transcripts, setTranscripts] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const showTranscript = (transcript : String) => {
    alert(transcript);
  };

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={files.length === 0}
        >
          Generate Transcript
        </Button>
      </Box>
      {/* <div> */}
        {/* {transcripts.map((item : any) => ( */}
          {/* <div key={item.filename}> */}
            {/* <p>{item.filename}</p> */}
            {/* <button onClick={() => showTranscript(item.transcript)}>Show Transcript</button> */}
            {/* <button onClick={() => uploadTranscript(item.transcript_file)}>Upload Transcript</button> */}
          {/* </div> */}
        {/* ))} */}
      {/* </div> */}

      <div>
        <h1>Uploaded Transcripts</h1>
        <div>
          {transcripts.map((item : any) => (
            <div key={item.filename}>
              <p>{item.filename}</p>
              <button onClick={() => showTranscript(item.transcript)}>Show Transcript</button>
            </div>
          ))}
        </div>
      </div>
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