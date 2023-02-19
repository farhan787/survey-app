const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

require('./startup/handleAsyncErrors')();
require('./startup/routes')(app);

const server = app.listen(PORT, () =>
  console.info(`Server listening on port ${PORT}...`)
);

module.exports = server;
