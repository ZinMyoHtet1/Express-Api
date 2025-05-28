const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("./../utils/asyncErrorHandler.js");
const User = require("./../models/userModel.js");
const CustomError = require("./../utils/CustomError.js");
const Nodemailer = require("./../utils/Nodemailer.js");
const OTPstorage = require("./../utils/OTPstorage.js");
const crypto = require("crypto");

const otpStorage = new OTPstorage();
const mail = new Nodemailer();

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

function createSendResponse(user, statusCode, res) {
  const token = signToken({ id: user._id, email: user.email });

  res.status(statusCode).json({
    status: "success",
    token,
  });
}

exports.getAllUsers = asyncErrorHandler(async function (req, res, next) {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
});

exports.userLogin = asyncErrorHandler(async function (req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new CustomError("This email is not registered yet", 400);
    next(error);
    return;
  }

  const correctPassword = await user.correctPassword(password, user.password);

  if (!correctPassword) {
    const error = new CustomError("Password is wrong", 400);
    next(error);
    return;
  }

  //Check Email Verification
  if (!user.isVerified) {
    //Send Email Verification OTP
    const otp = crypto.randomInt(100000, 999999);
    otpStorage.set(user.email, otp);
    await mail.sendVerificationOTP(user.email, otp);

    res.status(200).json({
      status: "success",
      message:
        "Your email is not verified yet. Please verify your email. We have sent Verification OTP to your email.",
    });
  }

  createSendResponse(user, 200, res);
});

exports.userRegister = asyncErrorHandler(async function (req, res) {
  const user = await User.create(req.body);

  //Send Email Verification OTP
  const otp = crypto.randomInt(100000, 999999);
  otpStorage.set(user.email, otp);
  await mail.sendVerificationOTP(user.email, otp);

  // const token = signToken({ id: user._id, email: user.email });

  res.status(200).json({
    status: "success",
    message: "We have sent Verification OTP to your email.",
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

  const user = await User.findOne({ _id: decodedToken.id }).select("+password");

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

exports.restrict = function (...role) {
  return function (req, res, next) {
    if (!role.includes(req.user.role)) {
      const error = new CustomError(
        "You don't have permission to perform this action",
        403
      );
      next(error);
    }

    next();
  };
};

exports.verifyEmail = asyncErrorHandler(async function (req, res, next) {
  const otp = req.body.otp;
  const email = req.body.email;
  if (!otp || !email) {
    next(new CustomError("Otp or Email is missing!", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = new CustomError("The user with this email is not found", 404);
    next(error);
    return;
  }

  //Veify OTP
  const isVerified = otpStorage.verify(email, otp);
  if (!isVerified) {
    next(
      new CustomError("Email Verification Failed! Please try agian later", 401)
    );
  }

  //Update user
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  createSendResponse(user, 201, res);
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

  createSendResponse(user, 200, res);
});
