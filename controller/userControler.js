const User = require("../models/User")


const getAllUser = async(req,res)=>{
    const users = await User.find().select("-password").lean();
    if(!users.length){
      return res.status(400).json({message:"no users found"})
    }
    res.json(users)
}

module.exports ={
    getAllUser
}