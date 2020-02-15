const mongoose = require('mongoose');
const socket = require('./app/services/socket');

const app = require('./app');
const { DB_URI, PORT } = require('./app/config');

mongoose.connect(DB_URI);

const server = app.listen(PORT, () => {
  console.log('running weight-dots-api on port', PORT);
  console.log('--------------------');
  socket.setup(server);
});
