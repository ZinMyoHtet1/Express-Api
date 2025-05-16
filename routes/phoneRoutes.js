const express = require("express");
const {
    getAllPhones,
    postNewPhone,
    getPhoneById,
    updatePhoneById,
    deletePhoneById
} = require("../controllers/phoneController.js")

const route = express.Router();

function logger(req,res,next){
    console.log("Middleware passing...")
    req.requestTime=new Date().toISOString();
    next()
}

route.get("/", logger,getAllPhones)

route.post("/", postNewPhone)

route.get("/:id", getPhoneById)

route.patch("/:id", updatePhoneById)

route.delete("/:id", deletePhoneById)

module.exports = route;