import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors';

const app = express();
const port = 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send("Hyy");
});

io.on('connection', (socket) => {
  console.log("user connected", socket.id);

  // The server listens for an object with 'id', 'username', and 'text'
  socket.on('message', (msg) => {
    console.log("message received:", msg);
    // Emits the entire message object to all clients
    io.emit("message", msg);
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log("server is running on port 3000");
});