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
    console.log("batch 1");
    
    const pdf=req.file.buffer;
    console.log("pdf : ",pdf);
    
    const response = await extract.extractBankStatement(pdf);
    console.log(response);
    res.json(response);
};