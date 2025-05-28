const express = require("express");
const route = express.Router();

const {
  updateMe,
  changePassword,
  deleteUser,
} = require("./../controllers/userController.js");
const { authRoute } = require("./../controllers/authController.js");

// route.get("/", getAllUsers);
route.patch("/changePassword", authRoute, changePassword);
route.patch("/updateMe", authRoute, updateMe);
route.patch("/deleteUser", authRoute, deleteUser);

module.exports = route;
