const db = require('../config/db');
const { Schema }  = require('mongoose');
const uuid = require('uuid').v4;

const itemSchema = new Schema({
    
})

const expenseSchema = new Schema({
    uuid : {
        type : String,
        default : uuid(),
        unique : true
    },

})