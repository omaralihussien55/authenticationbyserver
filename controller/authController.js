const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const register  = async (req,res)=>{
    const {first_name,last_name,email,password} = req.body;

    if(!first_name || !last_name || !email || !password){
        return res.status(400).json({message:"all field are required"})
    }

    const foundUser = await User.findOne({email}).exec();

    if(foundUser){
        return res.status(400).json({message:"user found in database"})
    }

    const hashPasword = await bcrypt.hash(password,10);
    const user = await User.create({
        first_name,
        last_name,
        email,
        password:hashPasword
    });
    const accessToken =jwt.sign({
        UserInfo:{
            id:user._id
        }
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
 
    const refreshToken =jwt.sign({
        UserInfo:{
            id:user._id
        }
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

res.cookie("jwt",refreshToken,{
    httpOnly:true,
    secure:true, //https
    sameSite:"None",
    maxAge: 7 * 24 * 60 * 60 * 1000
})

res.json({accessToken,email:user.email,first_name:user.first_name,last_name:user.last_name})
}



const login  = async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"all field are required"})
    }

    const foundUser = await User.findOne({email}).exec();

    if(!foundUser){
        return res.status(400).json({message:"EMAIL NOT found in database"})
    }

    const mach = await bcrypt.compare(password,foundUser.password);
    if(!mach) return res.status(400).json({message:"password wrong"});

   
    const accessToken =jwt.sign({
        UserInfo:{
            id:foundUser._id
        }
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
 
    const refreshToken =jwt.sign({
        UserInfo:{
            id:foundUser._id
        }
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

res.cookie("jwt",refreshToken,{
    httpOnly:true,
    secure:true, //https
    sameSite:"None",
    maxAge: 7 * 24 * 60 * 60 * 1000
})

res.json({accessToken,email:foundUser.email,first_name:foundUser.first_name,last_name:foundUser.last_name})
}

const refresh = (req,res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).json({message:"un authoriezed"});
    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, async (err,decoded)=>{
        if(err)  return res.status(403).json({message:"Forbidden"});
        const foundUser = await User.findById(decoded.UserInfo.id).exec();

        if(!foundUser) return res.status(401).json({message:"un authoriezed"});
    const accessToken =jwt.sign({
        UserInfo:{
            id:foundUser._id
        }
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});

       res.json({accessToken});
    })
}

const logout  = (req,res)=>{
  const cookie = req.cookies
  if(!cookie?.jwt) return  res.sendStatus(204) ;// no content;

  res.clearCookie("jwt",{
    httpOnly:true,
    sameSite:"None",
    secure:true
  });
  res.json({message:"cookie clear"})
}
module.exports = {
    register,
    login,
    refresh,
    logout
}