const chatbotController = require('../controllers/chatbotController');
const router = require('express').Router();

router.post('/botquery',chatbotController.chatbotController);

module.exports = router;