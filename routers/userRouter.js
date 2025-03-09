const router = require('express').Router();
const  auth  = require('../authendication/auth');
const userController = require('../controllers/userController');

router.get("/login",auth,userController.login);
router.post('/fcm',auth,userController.update);

module.exports = router;