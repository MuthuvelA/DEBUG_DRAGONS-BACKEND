const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');


// router part 

const expenseRouter = require('./routers/extractImageRouter.js');
const expenseAllRouter = require('./routers/expenseRouter.js');

const app = express();

app.use(cors());
app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/',expenseRouter);
app.use('/',expenseAllRouter);



module.exports = app;