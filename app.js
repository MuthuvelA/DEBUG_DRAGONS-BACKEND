const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());



module.exports = app;