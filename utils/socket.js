const socketIo = require('socket.io');

// Create a Socket.io server instance
const createSocketIoServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      // Store the notification in the database
      // db.saveNotification(notification);
      // Broadcast the notification to all clients
      io.emit('newNotification', notification);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io; // Return the Socket.io instance
};

module.exports = createSocketIoServer;
