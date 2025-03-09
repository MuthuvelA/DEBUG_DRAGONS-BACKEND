const db = require('../dbConfig/db');
const { Schema }  = require('mongoose');


const userSchema = new Schema({
    user_id : {
        type : String,
        required : true,
        unique : true
    },
    userName : {
        type : String,
        default : "userName",
    },
    email : {
        type : String,
        required : true
    },
    fcmToken : {
        type : String
    }
});

module.exports = db.model("users",userSchema);