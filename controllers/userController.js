const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("./../utils/asyncErrorHandler.js");
const User = require("./../models/userModel.js");
const CustomError = require("./../utils/CustomError.js");
const Nodemailer = require("./../utils/Nodemailer.js");
const crypto = require("crypto");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

// exports.getAllUsers = asyncErrorHandler(async function (req, res, next) {
//   const users = await User.find({});

//   res.status(200).json({
//     status: "success",
//     data: {
//       users,
//     },
//   });
// });

exports.userLogin = asyncErrorHandler(async function (req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new CustomError("This email is not registered yet", 400);
    next(error);
    return;
  }

  const correctPassword = await user.correctPassword(password, user.password);

  // console.log(correctPassword);

  if (!correctPassword) {
    const error = new CustomError("Password is wrong", 400);
    next(error);
    return;
  }

  const token = signToken({ id: user._id, email: user.email });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.userRegister = asyncErrorHandler(async function (req, res) {
  const user = await User.create(req.body);

  const token = signToken({ id: user._id, email: user.email });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.authRoute = asyncErrorHandler(async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    const error = new CustomError(
      "There is no authorization token from client",
      400
    );
    next(error);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedToken) {
    const error = new CustomError("Invalid token", 400);
    next(error);
  }

  const user = await User.findOne({ _id: decodedToken.id });

  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);

  if (isPasswordChanged) {
    const error = new CustomError(
      "Password was changed recently. Please login again!",
      401
    );
    next(error);
  }

  req.user = user;
  next();
});

exports.forgetPassword = asyncErrorHandler(async function (req, res, next) {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new CustomError("We cannot find User with given email", 404);
    next(error);
  }
  const resetToken = await user.createResetToken();
  await user.save({ validateBeforeSave: false });

  //Create Mailer and send reset url
  const mail = new Nodemailer();
  const resetURL = `${req.protocol}://${req.host}/api/v1/resetPassword/${resetToken}`;
  const msg = `We have received forget password request. Use this url ${resetURL} for new password. This url is valid for 10 minutes.`;

  await mail.sendResetURL(user.email, msg);

  res.status(200).json({
    status: "success",
    message: "We have sent reset url to your email",
  });
});

exports.resetPassword = asyncErrorHandler(async function (req, res, next) {
  const resetToken = req.params.token;
  const { password, confirmPassword } = req.body;
  if (!resetToken) {
    const error = new CustomError("Reset Token was not sent from client!", 400);
    next(error);
  }

  if (!password || !confirmPassword) {
    const error = new CustomError(
      "Password or ConfirmPassword are missing!",
      400
    );
    next(error);
  }

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  if (!passwordResetToken) {
    const error = new CustomError(
      "Invalid or Wrong Reset TOken. Please try again later",
      400
    );
    next(error);
  }

  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new CustomError(
      "Reset Token was expired or invalid. Please try again later",
      400
    );

    next(error);
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();
  const token = signToken({ id: user._id, email: user.email });

  res.status(200).json({
    status: "success",
    token,
  });
});
