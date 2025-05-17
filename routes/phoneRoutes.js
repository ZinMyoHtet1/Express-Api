const express = require("express");
const {
    getAllPhones,
    postNewPhone,
    getPhoneById,
    updatePhoneById,
    deletePhoneById,
    getPhones,
    postPhones,
    checkId
} = require("../controllers/phoneController.js")

const route = express.Router();

route.param("id",checkId)

route.get("/",getAllPhones)

route.post("/", postNewPhone)

route.get("/:id",getPhoneById)

route.patch("/:id",updatePhoneById)

route.delete("/:id",deletePhoneById)

route.get("/", getPhones)

route.post("/", postPhones)

module.exports = route;