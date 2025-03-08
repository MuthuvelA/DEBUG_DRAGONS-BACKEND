const extract = require('../services/expenseExtract');

exports.extractBillConroller = async(req,res)=>{
    const {image64} = req.body;
    const response = await extract.extractExpenceImage(image64);
    res.json(response);
};

exports.extractStatementController = async (req,res)=>{
    const pdf=req.body;
    const response = await extract.extractBankStatement(pdf);
    res.json(respone);
};