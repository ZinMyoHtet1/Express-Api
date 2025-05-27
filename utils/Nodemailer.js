const nodemailer = require("nodemailer");
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
}

module.exports = Nodemailer;
