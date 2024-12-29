const jwt =require("jsonwebtoken");

const verifyJwt = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization ;
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"unauthorized"})
    }

    const token = authHeader.split(" ")[1];
    console.log("token",token)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err) return res.status(403).json({message:"Forbidden"});
           req.user = decoded.UserInfo.id

           next()

    });

}

module.exports = verifyJwt