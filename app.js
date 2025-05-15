const express = require("express");
const phoneRoutes=require("./routes/phoneRoutes")

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json())

app.get("/api/v1", (req, res)=> {
    res.status(200).send("Hi! Welcome@back")
})

app.use("/api/v1/phones",phoneRoutes)

app.listen(port, ()=> {
    console.log(`Your server is running on port ${port}`);
})