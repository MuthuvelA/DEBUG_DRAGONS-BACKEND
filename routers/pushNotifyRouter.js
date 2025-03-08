const pushNotifyController = require('../controllers/pushNotificationController');
const router = require('express').Router();


router.post('/pushNotify',pushNotifyController.pushNotify);

module.exports = router;