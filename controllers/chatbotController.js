const chatbotservice= require('../services/chatbotqn');

exports.chatbotController = async(req,res)=>{
    const {botQuery}=req.body;
    try{
        const response = await chatbotservice.getAIResponse(botQuery);
        console.log(response);

        if(response.status==400){
            res.json({status : 404, answer : response.answer});
        }else res.json({status : 200, answer : response.answer});
    }catch(err){
        res.json({status : 500, message : "Query process Error"});
    }
};