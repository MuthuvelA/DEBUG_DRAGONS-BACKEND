const extract = require('../services/expenseExtract');

exports.extractBillConroller = async(req,res)=>{
    const {image64} = req.body;
    
    try{
    const response = await extract.extractExpenceImage(image64,req.user.user_id);
    res.json({status : 200, message : response});
    }catch(err){
        res.json({status : 500 , message : "Image is not processed"});
    }
}

exports.extractStatementController = async (req,res)=>{
    const pdf=req.file.buffer;
    const response = await extract.extractBankStatement(pdf,req.user.user_id);
    console.log(response);
    res.json(response);
};