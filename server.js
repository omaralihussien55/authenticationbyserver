require("dotenv").config()
// console.log(process.env.NODE_ENV)
const express = require("express");
const app = express();
const connفDB = require("./config/dbconnect");
const mongoose = require("mongoose");
const  cookieParser = require("cookie-parser")
const cors = require("cors");
const path =  require("path");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 5000 ;

connفDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json())

app.use("/",express.static(path.join(__dirname,"puplic")))
app.use("/",require("./routes/route"))
app.use("/auth",require("./routes/authRoutes"))
app.use("/users",require("./routes/userRoutes"))

// app.all("*",(req,res)=>{
//     console.log("notfound")
// })
mongoose.connection.once("open",()=>{
    console.log("connect to mogo ..")
    app.listen(PORT,()=>{
        console.log("runing ..",PORT)
    })
    
});

mongoose.connection.on("error",(err)=>{
    console.log("errrr",err)
});