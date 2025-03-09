const expenseModel = require('../models/expenseModel');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
var currentDate = new Date();
class expenseService{
    static async getRecurrent(){
        try {
            const last2MonthData = await this.getDataByValue({year : 0, month : 2});
        
            const prompt = `The data is ${last2MonthData} 
            find the frequently used expense give me only ${3} data based on the expense_title in array of json data which have the entire data execpt {uuid and _id,and user_id} of an redurrent data only as response dont add any other data or text`;

            const response = await axios.post(process.env.GEMINI_URL, { contents: [{ parts: [{ text: prompt }] }] },
                { headers: { "Content-Type": "application/json" } });
                let geminiOutput = response.data.candidates[0].content.parts[0].text;
                
                
                geminiOutput = geminiOutput.replace(/```json|```/g, "").trim();
        
                const structuredData = JSON.parse(geminiOutput);
                return structuredData;
            
        } catch (error) {
            throw error;
        }
    }



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

    static async getExpense(user_id){
        try{
        const response =  await expenseModel.find(user_id).sort({date : 1});
        const redurrentData = await this.getRecurrent();
        
        return {data : response , redurrent :redurrentData}
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

        static async getByID(id){
            try {
                return await expenseModel.findOne({uuid : id});
            } catch (error) {
                
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


            static async getDataByValue({year,month}){
                let startDate = new Date(currentDate);
                startDate.setMonth(startDate.getMonth() - month);
                startDate.setFullYear(startDate.getFullYear() - year);
                startDate.setDate(1);
                const transactions = await expenseModel.find();
                
            
                let filteredTransactions = transactions.filter(t => {
                    let transactionDate = new Date(t.date_time);
                    return transactionDate >= startDate && transactionDate <= currentDate;
                });


                return filteredTransactions;
            }
}

module.exports = expenseService;