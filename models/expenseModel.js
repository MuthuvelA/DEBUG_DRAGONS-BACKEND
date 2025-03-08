const db = require('../dbConfig/db');
const { Schema }  = require('mongoose');
const uuid = require('uuid').v4;

const itemSchema = new Schema({
    amount_spent:{
        type : Number,
        default  : 0
    },
    title : {
        type : String,
        default : "No Title"
    }
},{_id : false});

const expenseSchema = new Schema({
    uuid : {
        type : String,
        default : uuid(),
        unique : true
    },
    expense_title:{
        type : String,
        default : "No Title"
    },
    items : [itemSchema],

    category: {
        type : String,
        default : "No Category"
    },
    date_time: {
        type : String,
        default : "No date"
    },
    payment_method: {
        type : String,
        default : "No payment method"
    },
    merchant_name: {
        type : String,
        default : "No Merchant Name"
    },
    amount_spent: {
        type : Number,
        default : 0
    },
});


module.exports = db.model("expense",expenseSchema);