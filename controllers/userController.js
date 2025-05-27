const asyncErrorHandler = require("./../utils/asyncErrorHandler.js");
const User = require("./../models/userModel.js");
const CustomError = require("./../utils/CustomError.js");

exports.getAllUsers = asyncErrorHandler(async function (req, res, next) {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.userLogin = asyncErrorHandler(async function (req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new CustomError("Password is wrong", 400);
    next(error);
    return;
  }

  const correctPassword = await user.correctPassword(password, user.password);

  console.log(correctPassword);

  if (!correctPassword) {
    const error = new CustomError("Password is wrong", 400);
    next(error);
    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.userRegister = asyncErrorHandler(async function (req, res) {
  const user = await User.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
