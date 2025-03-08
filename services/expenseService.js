const expenseModel = require('../models/expenseModel');

class expenseService{
    static async addExpense(data){
       const expenseData = new expenseModel(data);
            try{
            return await expenseData.save();
            }catch(err){
                throw err;
            }
    }

    static async getExpense(){
        try{
        return await expenseModel.find();
        }catch(err){
            throw err;
        }
    };

    static async deleteExpense(id){
        try{
            return await expenseData.deleteOne({uuid:id});
        }catch(err){ throw err;}
    }

        static async updateExpense(id,data){
            try{
                return await expenseModel.updateOne({uuid : id},{$set : data})
            }catch(err){
                throw err;
            }
        }
}

module.exports = expenseService;