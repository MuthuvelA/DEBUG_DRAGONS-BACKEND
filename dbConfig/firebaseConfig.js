const admin = require("firebase-admin");
const serviceAccount = require('../google-services.json'); // Download from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL : "https://finnfloww.firebaseio.com"
});

module.exports = admin;
