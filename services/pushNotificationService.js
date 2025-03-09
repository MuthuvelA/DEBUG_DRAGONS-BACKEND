const admin = require('../dbConfig/firebaseConfig');

const sendPushNotification = async (fcmToken, title, body) => {
    const message = {
        token: fcmToken,
        notification: { 
            title: title,
            body: body,
        },
        data: { click_action: "FLUTTER_NOTIFICATION_CLICK" }
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent notification:", response);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

module.exports = { sendPushNotification };
