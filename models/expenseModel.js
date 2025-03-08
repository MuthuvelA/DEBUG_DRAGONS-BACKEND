const db = require('../dbConfig/db');
const { Schema }  = require('mongoose');
const uuid = require('uuid').v4;

const itemSchema = new Schema({
    amountSpent:{
        type : Number,
        default  : 0
    },
    title : {
        type : String,
        default : "No Title"
    }
})

const expenseSchema = new Schema({
    uuid : {
        type : String,
        default : uuid(),
        unique : true
    },
    expenseTitle:{
        type : String,
        default : "No Title"
    },
    products : [itemSchema],

    category: {
        type : String,
        default : "No Category"
    },
    date: {
        type : String,
        default : "No date"
    },
    paymentMethod: {
        type : String,
        default : "No payment method"
    },
    merchantName: {
        type : String,
        default : "No Merchant Name"
    },
    totalAmount: {
        type : Number,
        default : 0
    },
});


module.exports = db.model("expense",expenseSchema);