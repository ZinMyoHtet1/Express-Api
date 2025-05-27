const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "This email had already registered"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "The mininum number of password is 8"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm your password"],
    validate: [
      function (value) {
        return this.password === value;
      },
      "Password is not match",
    ],
  },
  picture: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified(this.password)) next();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = (password, hashedPassword) =>bcrypt.compare(password, hashedPassword);
module.exports = new mongoose.model("User", userSchema);
