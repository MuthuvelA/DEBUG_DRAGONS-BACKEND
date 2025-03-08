const chatbotController = require('../controllers/chatbotController');
const router = require('express').Router();

router.post('/botQuery',chatbotController.chatbotController);

module.exports = router;