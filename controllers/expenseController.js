const expenseService = require('../services/expenseService');
const { v4: uuidv4 } = require('uuid');

exports.getExpense = async(req,res)=>{
    try{
        const response =  await expenseService.getExpense();
        res.json({status : 200 , message : response});
    }catch(err){
        res.json({status : 500 , message : err.message});
    }
};

exports.deleteExpense = async(req,res)=>{
    const uuid = req.params.id;
    try{
        await expenseService.deleteExpense(uuid);
        res.json({status : 200});

    }catch(err){
        res.json({status : 500 , message : err.message});
    }
};

exports.updateExpense = async(req,res)=>{
    const uuid = req.params.id;
    try{
        await expenseService.updateExpense(uuid);
        res.json({status : 200});

    }catch(err){
        res.json({status : 500 , message : err.message});
    }
};

exports.addExpense = async(req,res)=>{
    const {data} = req.body;
    try{
        // await Promise.all(data.map(expense => {
        //     if (!expense.uuid) {
        //         expense.uuid = uuidv4(); // Generate new UUID
        //     }
        //     return expenseService.addExpense(expense);
        // }));
        const response = await expenseService.addExpense(data);
        res.json({status : 200, message : response});
    }catch(err){
        res.json({status : 503, message : err.message});
    }
};


exports.getLastyearData = async(req,res)=>{
    try {
        const response = await expenseService.getPrevData();
        res.json({status : 200 , message : response});
        
    } catch (error) {
        res.json({status : 404, message : error.message});
    }
}