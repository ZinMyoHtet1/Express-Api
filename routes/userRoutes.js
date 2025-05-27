const express = require("express");
const route = express.Router();

const {
  userRegister,
  // getAllUsers,
  userLogin,
  forgetPassword,
  resetPassword,
} = require("./../controllers/userController.js");

// route.get("/", getAllUsers);
route.post("/register", userRegister);
route.post("/login", userLogin);
route.post("/forgetPassword", forgetPassword);
route.patch("/resetPassword/:token", resetPassword);

module.exports = route;
