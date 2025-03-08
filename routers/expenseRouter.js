const expenseController = require('../controllers/expenseController.js');
const router = require('express').Router();

router.get('/getExpense',expenseController.getExpense);
router.delete('/deleteExpense/:id',expenseController.deleteExpense);
router.put('/updateExpense/:id',expenseController.updateExpense);

module.exports = router;