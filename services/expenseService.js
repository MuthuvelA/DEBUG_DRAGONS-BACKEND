const expenseModel = require('../models/expenseModel');
const { v4: uuidv4 } = require('uuid');
var currentDate = new Date();
class expenseService{
    static async addExpense(data){
       const expenseData = new expenseModel(data);
            try{
            return await expenseData.save();
            }catch(err){
                throw err;
            }
    }

    static async addAllExpense(data){
       await Promise.all(data.map(expense => {
        if(!expense.uuid) expense.uuid = uuidv4();
        const expenseData = new expenseModel(expense);
        try{
        return expenseData.save();
        }catch(err){
            throw err;
        }
        }));   
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
        
        static async getPrevData(){
                let startDate = new Date(currentDate);
                startDate.setFullYear(startDate.getFullYear() - 1);
                startDate.setDate(1);
                const transactions = await expenseModel.find();
                
            
                let filteredTransactions = transactions.filter(t => {
                    let transactionDate = new Date(t.date_time);
                    return transactionDate >= startDate && transactionDate <= currentDate;
                });

                filteredTransactions.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));

            
                let xList = Array.from({ length: 12 }, (_, i) => i);
                let yList = [];
                let weeklyData = {};
            
                for (let i = 0; i < 12; i++) {
                    let monthStart = new Date(currentDate);
                    monthStart.setMonth(currentDate.getMonth() - i);
                    monthStart.setDate(1);
            
                    let monthEnd = new Date(monthStart);
                    monthEnd.setMonth(monthStart.getMonth() + 1);
                    monthEnd.setDate(0); 
            
                    let monthTransactions = filteredTransactions.filter(t => {
                        let transactionDate = new Date(t.date_time);
                        return transactionDate >= monthStart && transactionDate <= monthEnd;
                    });
            
                    let totalExpense = monthTransactions.reduce((sum, t) => sum + t.amount_spent, 0);
                    yList.unshift(totalExpense);
            
                    weeklyData[i] = { weeks: [1, 2, 3, 4], expense: [], income: [], balance: [] };
            
                    for (let week = 0; week < 4; week++) {
                        let weekStart = new Date(monthStart);
                        weekStart.setDate(week * 7 + 1);
            
                        let weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekStart.getDate() + 6);
            
                        let weekTransactions = monthTransactions.filter(t => {
                            let transactionDate = new Date(t.date_time);
                            return transactionDate >= weekStart && transactionDate <= weekEnd;
                        });
            
                        let weekExpense = weekTransactions.reduce((sum, t) => sum + t.amount_spent, 0);
                        let weekIncome = 0; 
                        let weekBalance = weekIncome - weekExpense;
            
                        weeklyData[i].expense.push(weekExpense);
                        weeklyData[i].income.push(weekIncome);
                        weeklyData[i].balance.push(weekBalance);
                    }
                }
            
                return {
                    xList,
                    yList,
                    xTitle: "Months",
                    yTitle: "Expense Amount",
                    weeklyData,
                    selectedMonth:-1,
                };
            }
        
}

module.exports = expenseService;