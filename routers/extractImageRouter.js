const extractImageController = require('../controllers/expenseIncomeController.js');
const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const auth = require('../authendication/auth.js')


router.post('/addExpenseByBill',auth,extractImageController.extractBillConroller);
router.post('/addBankStatement',auth,upload.single('file'),extractImageController.extractStatementController);

module.exports = router;