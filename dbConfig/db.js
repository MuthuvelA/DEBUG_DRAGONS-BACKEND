const mongoose = require('mongoose');

let connection;

function connect() {
    
    connection = mongoose.createConnection(`mongodb://localhost:27017/FinFlow`);

    connection.on('open', () => {
        console.log("MongoDB Connected");
    });

    connection.on('error', (err) => {
        console.log("MongoDB Connection error:", err.message);
        setTimeout(connect, 10);
    });
}

connect();

module.exports = connection;
