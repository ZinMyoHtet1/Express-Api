const express = require("express");
const {
  getAllPhones,
  postNewPhone,
  getPhoneById,
  updatePhoneById,
  deletePhoneById,
} = require("../controllers/phoneController.js");

const { authRoute, restrict } = require("../controllers/authController.js");

const route = express.Router();

//route.param("id",checkId)
route.get("/", authRoute, getAllPhones);

route.post("/", authRoute, postNewPhone);

route.get("/:id", getPhoneById);

route.patch("/:id", updatePhoneById);

route.delete("/:id", authRoute, restrict("admin"), deletePhoneById);

module.exports = route;
