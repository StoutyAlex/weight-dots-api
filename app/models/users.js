const mongoose = require('mongoose');
const socket = require('../services/socket');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

// Maybe we don't need socket.io for users
UserSchema.post('save', (doc) => {
  socket.broadcastAll('users', doc);
});

UserSchema.post('remove', (doc) => {
  socket.broadcastAll('users', doc);
});

module.exports = mongoose.model('User', UserSchema);
