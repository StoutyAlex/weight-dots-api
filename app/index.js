require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', require('./controllers/users.controller'));

app.get('/', (req, res) => {
  res.json({ message: 'users' });
});

app.use(errorHandler);

module.exports = app;
