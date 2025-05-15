const express = require("express");
const {
    getPhones,
    postPhones
} = require("../controllers/phoneController.js")

const route = express.Router();

route.get("/", getPhones)

route.post("/", postPhones)

module.exports = route;