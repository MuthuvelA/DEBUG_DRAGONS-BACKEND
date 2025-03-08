const extractImageController = require('../controllers/expenseIncomeController.js');
const router = require('express').Router();


router.post('/addExpenseByBill',extractImageController.extractBillConroller);

module.exports = router;