const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app');
require('dotenv').config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('Korisnik povezan:', socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.chatId).emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('Korisnik odvojen:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));