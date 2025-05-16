const express = require("express");
const {
<<<<<<< HEAD
    getAllPhones,
    postNewPhone,
    getPhoneById,
    updatePhoneById,
    deletePhoneById
=======
    getPhones,
    postPhones
>>>>>>> 866c3af16ef1658ebc5b001ca4fe7fa9114d9bf6
} = require("../controllers/phoneController.js")

const route = express.Router();

<<<<<<< HEAD
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
=======
route.get("/", getPhones)

route.post("/", postPhones)
>>>>>>> 866c3af16ef1658ebc5b001ca4fe7fa9114d9bf6

module.exports = route;