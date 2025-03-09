const expenseController = require('../controllers/expenseController.js');
const router = require('express').Router();
const auth = require('../authendication/auth.js')

router.get('/getExpense',auth,expenseController.getExpense);
router.delete('/deleteExpense/:id',auth,expenseController.deleteExpense);
router.put('/updateExpense/:id',auth,expenseController.updateExpense);
router.post('/addExpense',auth,expenseController.addExpense);
router.get('/getPrevYear',auth,expenseController.getLastyearData);

module.exports = router;