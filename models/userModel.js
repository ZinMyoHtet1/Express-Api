const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ["user", "admin", "guest"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    picture: {
      type: String,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: String,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified(this.password)) next();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  this.confirmPassword = undefined;
  next();
});

userSchema.pre("find", async function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pswdChangeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < pswdChangeTimestamp;
  }
  return false;
};

userSchema.methods.correctPassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = new mongoose.model("User", userSchema);
