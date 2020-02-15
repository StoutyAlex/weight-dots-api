const app = require('./app');
const { DB_URI, PORT } = require('./app/config');
const mongoose = require('mongoose');
mongoose.connect(DB_URI);

app.listen(PORT, () => {
  console.log('running weight-dots-api on port', PORT);
  console.log('--------------------');
});
