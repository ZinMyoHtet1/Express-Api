const express = require("express");
const route = express.Router();

const {
  userRegister,
  userLogin,
  forgetPassword,
  resetPassword,
  verifyEmail,
  authRoute,
  restrict,
  getAllUsers,
} = require("./../controllers/authController.js");

route.get("/users", authRoute, restrict("admin"), getAllUsers);
route.post("/register", userRegister);
route.post("/login", userLogin);
route.post("/verifyEmail/", verifyEmail);
route.post("/forgetPassword", forgetPassword);
route.patch("/resetPassword/:token", resetPassword);
// route.delete("/resetPassword/:token", deleteUser);

module.exports = route;
