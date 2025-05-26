const express = require("express");
const path= require("path");
const morgan=require("morgan")
const dotenv = require("dotenv");
const CustomError=require("./utils/CustomError.js")
dotenv.config({path: "./config.env"})

require("./helpers/mongoose_init.js");

const phoneRoutes=require("./routes/phoneRoutes.js")

const {getPhoneStats}=require("./controllers/phoneController.js");

const globalErrorHandler=require("./utils/globalErrorHandler.js")

const app = express();

const port = process.env.PORT || 8000;

process.on("unhandleRejection",function(){
    console.log("UnhandleRejection Occuring...")
    server.close(()=>process.exit(1))
});

if(process.env.MODE=== "development"){
    app.use(morgan("dev"))
}

app.use(express.json())
app.use(express.static("./public"));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/Templates/index.html"))
})

app.get("/api/v1", (req, res)=> {
    res.status(200).send("Hi! Welcome@back")
})

app.get("/api/v1/phone-stats",getPhoneStats)

app.use("/api/v1/phones",phoneRoutes)

app.all('/{*any}',(req,res,next)=>{
    
    const error=new CustomError(`Route "${req.originalUrl} is not found`, 404)
    next(error)
})

//GLOBAL ERROR HANDLING
app.use(globalErrorHandler);

const server=app.listen(port, ()=> {
    console.log(`Your server is running on port ${port}`);
})