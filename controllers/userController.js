const userService = require('../services/userService');


exports.login = async(req,res)=>{
    try {
        const userData = req.user;
        const user = await userService.findUser({user_id : userData.user_id});
        if(!user){
            userService.addUser(req.user);
            res.json({status : 200});
        }else res.json({status : 400 , message : "Already registred"});
    } catch (error) {
        res.json({status : 500 , message : error.message});
    }
};