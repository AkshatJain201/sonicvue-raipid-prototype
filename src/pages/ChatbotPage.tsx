import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', { message: input });
      const botMessage: Message = { text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        bgcolor: 'purple', 
        color: 'white', 
        p: 2, 
        borderRadius: 1, 
        mb: 4
      }}>
        AI Support Chatbot
      </Typography>

      <Paper elevation={3} sx={{ flex: 1, mb: 2, p: 2, overflowY: 'auto' }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                {message.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: 'purple', mr: 1 }}>AI</Avatar>
                )}
                <Paper elevation={1} sx={{ p: 2, bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper' }}>
                  <ListItemText primary={message.text} />
                </Paper>
                {message.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'primary.main', ml: 1 }}>U</Avatar>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          onClick={handleSend}
          disabled={isLoading}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatbotPage;