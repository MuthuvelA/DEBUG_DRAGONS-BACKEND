const expenseModel = require('../models/expenseModel');

class expenseService{
    static async addExpense(data){
        const expenseData = new expenseModel(data);
        return await expenseData.save();
    }
}

module.exports = expenseService;