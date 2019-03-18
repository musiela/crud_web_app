const express = require('express');
const cors = require('cors');
const mongoOp = require('./models/mongo');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./_config');
require('dotenv/config');

mongoose.Promise = global.Promise;
const router = express.Router();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.mongoURI[app.settings.env], (err,data) => {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

app.use((req, res, next) => {
  req.context = {
    mongoOp
  };
  next();
});

app.use('/display', routes.display);
app.use('/write', routes.write);

const server = app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`),
);

module.exports = server;