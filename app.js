const express = require("express");
const path= require("path");
const morgan=require("morgan")
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

require("./helpers/mongoose_init.js");

const phoneRoutes=require("./routes/phoneRoutes")

const app = express();

const port = process.env.PORT || 8000;

if(process.env.MODE=== "development"){
    app.use(morgan("dev"))
}

app.use(express.json())
app.use(express.static("./public"))

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/Templates/index.html"))
})

app.get("/api/v1", (req, res)=> {
    res.status(200).send("Hi! Welcome@back")
})

app.use("/api/v1/phones",phoneRoutes)

app.listen(port, ()=> {
    console.log(`Your server is running on port ${port}`);
})