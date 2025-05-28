class OTPstorage {
  constructor() {
    this.storage = new Map();
  }

  set(email, otp) {
    this.storage.set(email, +otp);
    setTimeout(() => this.delete(email), 1000 * 60 * 5);
  }
  get(email) {
    return this.storage.get(email);
  }
  verify(email, otp) {
    return this.storage.get(email) === +otp;
  }
  delete(email) {
    this.storage.delete(email);
  }
}

module.exports = OTPstorage;
