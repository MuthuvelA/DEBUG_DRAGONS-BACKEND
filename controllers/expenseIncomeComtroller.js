const extract = require('../services/expenseExtract');


exports.extractBillConroller = async(req,res)=>{
    const {image64} = req.body;
    const response = await extract.extractExpenceImage(image64);
    res.json(response);
};

