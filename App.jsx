import React, { useEffect, useState, useRef } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Stack } from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState(null);
  const [username, setUsername] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on('message', (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        id: socketId,
        username: username,
        text: message,
      };
      socket.emit("message", messageData);
      setMessage("");
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsNameSet(true);
    }
  };

  if (!isNameSet) {
    return (
      <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Enter Your Name
          </Typography>
          <Box component="form" onSubmit={handleUsernameSubmit} sx={{ mt: 1 }}>
            <TextField
              required
              fullWidth
              autoFocus
              id="username-input"
              label="Your Name"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Start Chatting
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
    }}>
      <Box sx={{
        py: 2,
        px: 3,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderBottom: '1px solid #ccc',
        textAlign: 'center',
      }}>
        <Typography variant="h5" component="h1">
          Real-time Chat
        </Typography>
      </Box>

      <Stack
        spacing={2}
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => {
          const isMyMessage = msg.id === socketId;
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: '70%',
                  bgcolor: isMyMessage ? 'primary.light' : 'background.paper',
                  color: 'text.primary',
                }}
              >
                <Typography variant="caption" sx={{
                  display: 'block',
                  mb: 0.5,
                  color: isMyMessage ? 'text.secondary' : 'text.secondary',
                  textAlign: isMyMessage ? 'right' : 'left',
                }}>
                  {msg.username}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>{msg.text}</Typography>
              </Paper>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Stack>

      <Paper
        component="form"
        onSubmit={handleMessageSubmit}
        sx={{
          display: 'flex',
          p: 2,
          borderTop: '1px solid #e0e0e0',
          position: 'sticky',
          bottom: 0,
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Paper>
    </Container>
  );
};

export default App;