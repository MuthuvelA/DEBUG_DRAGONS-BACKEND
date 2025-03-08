const extract = require('../services/expenseExtract');

exports.extractBillConroller = async(req,res)=>{
    const {image64} = req.body;
    
    try{
    const response = await extract.extractExpenceImage(image64);
    res.json({status : 200, message : response});
    }catch(err){
        res.json({status : 500 , message : "Image is not processed"});
    }
}

exports.extractStatementController = async (req,res)=>{
    const pdf=req.body;
    const response = await extract.extractBankStatement(pdf);
    // res.json(respone);
};