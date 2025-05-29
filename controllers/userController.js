const asyncErrorHandler = require("./../utils/asyncErrorHandler.js");
const User = require("./../models/userModel.js");
const CustomError = require("./../utils/CustomError.js");
const jwt = require("jsonwebtoken");

function createSendResponse(user, statusCode, res) {
  const token = signToken({ id: user._id, email: user.email });

  res.status(statusCode).json({
    status: "success",
    token,
  });
}

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

exports.changePassword = asyncErrorHandler(async function (req, res, next) {
  const { password, confirmPassword, currentPassword } = req.body;

  if (!password || !confirmPassword || !currentPassword) {
    next(
      new CustomError(
        "Password or ConfirmPassword or currentPassword is missing",
        400
      )
    );
  }

  const user = req.user;
  //Check if currentPassword is true
  const isMatch = await user.correctPassword(currentPassword, user.password);

  console.log(isMatch, "isMatch");

  if (!isMatch) {
    next(new CustomError("Current Password is wrong", 403));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();
  createSendResponse(user, 200, res);
});

exports.updateMe = asyncErrorHandler(async function (req, res, next) {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    next(
      new CustomError("You can't update your password at this end point", 400)
    );
  }
  const fields = ["username", "picture"];
  const filterObj = {};
  Object.keys(req.body).forEach((opt) => {
    if (fields.includes(opt)) filterObj[opt] = req.body[opt];
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, {
    runValidators: true,
    new: true,
  });

  createSendResponse(updatedUser, 200, res);
});

exports.deleteUser = asyncErrorHandler(async function (req, res, next) {
  await User.findByIdAndUpdate(
    req.user._id,
    { isActive: false },
    { new: true, runValidators: true }
  );

  res.status(204).json({
    status: "success",
    data: null,
  });
});
