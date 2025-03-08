const expenseController = require('../controllers/expenseController.js');
const router = require('express').Router();

router.get('/getExpense',expenseController.getExpense);
router.delete('/deleteExpense/:id',expenseController.deleteExpense);
router.put('/updateExpense/:id',expenseController.updateExpense);
router.post('/addExpense',expenseController.addExpense);
router.get('/getPrevYear',expenseController.getLastyearData);

module.exports = router;