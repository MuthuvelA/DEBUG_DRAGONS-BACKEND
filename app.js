const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');


// router part 
const chatbotRouter = require('./routers/chatbotrouter.js');
const expenseRouter = require('./routers/extractImageRouter.js');

const app = express();

app.use(cors());
app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/',expenseRouter);
app.use('/',chatbotRouter);


module.exports = app;