const io = require('socket.io');

let socket;

const setup = (server) => {
  socket = io(server, {
    transports: ['polling'],
  });

  socket.on('connect', (sock) => {
    console.log('connected client');
  });

  socket.adapter();
};

const close = (callback) => {
  if (socket) {
    socket.close(callback);
  }
};

const broadcast = (room, data) => {
  if (!room || !data) return;
  try {
    socket.to(room).emit(room, data);
  } catch (err) {
    console.error(`Socket broadcast failed room: ${room}`);
  }
};

module.exports = {
  setup,
  close,
  broadcast,
};
