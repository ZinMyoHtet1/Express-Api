const express = require("express");
const route = express.Router();

const {
  userRegister,
  getAllUsers,
  userLogin,
} = require("./../controllers/userController.js");

route.get("/", getAllUsers);
route.post("/register", userRegister);
route.post("/login", userLogin);

module.exports = route;
