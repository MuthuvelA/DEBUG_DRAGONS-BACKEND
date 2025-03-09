const userModel = require('../models/userModel');


class userService{
    static async addUser(user){
        try {
            const newUser = new userModel({user_id : user.user_id,email : user.email,userName : user.name});
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    static async findUser(user_id){
        return await userModel.findOne(user_id);
    }
}

module.exports = userService;