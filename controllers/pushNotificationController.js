const {sendPushNotification} = require('../services/pushNotificationService');

exports.pushNotify = async(req, res) => {
    const { fcmToken, title, body } = req.body;

    if (!fcmToken) return res.status(400).json({ error: "FCM token is required" });

    try {
        await sendPushNotification(fcmToken, title, body);
        res.json({ success: true, message: "Notification sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send notification" });
    }
};