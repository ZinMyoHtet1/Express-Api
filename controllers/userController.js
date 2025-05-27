const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("./../utils/asyncErrorHandler.js");
const User = require("./../models/userModel.js");
const CustomError = require("./../utils/CustomError.js");

const getToken = (payload) =>
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

  const token = getToken({ id: user._id, email: user.email });

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

  const token = getToken({ id: user._id, email: user.email });

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.authRoute = async function (req, res, next) {
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
};
