const chatbotservice= require('../services/chatbotqn');

exports.chatbotController = async(req,res)=>{
    const {botquery}=req.body;
    try{
        const response = await chatbotservice.getAIResponse(botquery);
        res.json({status : 200, message : response});
    }catch(err){
        res.json({status : 500, message : "Query process Error"});
    }
};