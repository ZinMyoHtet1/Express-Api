const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const otpEmailVeriHtml = fs.readFileSync(
  path.join(__dirname, "./../htmls/otpEmailVerificaiton.html"),
  {
    encoding: "utf8",
    flag: "r",
  }
);
class Nodemailer {
  constructor() {
    // super();
    this.options = {};
    this.transporter = nodemailer.createTransport({
      //   service: "gmail",
      host: "sandbox.smtp.mailtrap.io",
      port: 25,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  }

  sendResetURL = async function (email, text) {
    return this.transporter.sendMail({
      from: {
        address: process.env.EMAIL,
        name: "ZM HTET COMPANY",
      },
      to: email,
      subject: "Reset Account Password",
      text: text,
    });
  };

  sendVerificationOTP = async function (email, otp) {
    const html = otpEmailVeriHtml.replace("{{OTP_CODE}}", otp);
    return this.transporter.sendMail({
      from: {
        address: process.env.EMAIL,
        name: "ZM HTET COMPANY",
      },
      to: email,
      subject: "Email Verification OTP",
      html: html,
    });
  };
}

module.exports = Nodemailer;
