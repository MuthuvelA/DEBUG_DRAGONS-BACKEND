const expenseService = require('../services/expenseService');


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
        const response = await expenseService.addExpense(data);
        res.json({status : 200, message : response});
    }catch(err){
        res.json({status : 503, message : "Internal server Error"});
    }
};