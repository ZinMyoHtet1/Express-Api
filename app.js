const express = require("express");
<<<<<<< HEAD
const path= require("path")
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

=======
>>>>>>> 866c3af16ef1658ebc5b001ca4fe7fa9114d9bf6
const phoneRoutes=require("./routes/phoneRoutes")

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json())
<<<<<<< HEAD
app.use(express.static("./public"))

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/Templates/index.html"))
})
=======
>>>>>>> 866c3af16ef1658ebc5b001ca4fe7fa9114d9bf6

app.get("/api/v1", (req, res)=> {
    res.status(200).send("Hi! Welcome@back")
})

app.use("/api/v1/phones",phoneRoutes)

app.listen(port, ()=> {
    console.log(`Your server is running on port ${port}`);
})