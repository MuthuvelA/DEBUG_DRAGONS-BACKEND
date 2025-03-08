const extractImageController = require('../controllers/expenseIncomeController.js');
const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/addExpenseByBill',extractImageController.extractBillConroller);
router.post('/addBankStatement',upload.single('file'),extractImageController.extractStatementController);

module.exports = router;