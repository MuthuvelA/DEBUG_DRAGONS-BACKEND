const chatbotController = require('../controllers/chatbotController');
const router = require('express').Router();
const auth = require('../authendication/auth')

router.post('/botQuery',auth,chatbotController.chatbotController);

module.exports = router;