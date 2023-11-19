const mongoose = require("mongoose");

const User = mongoose.model("User", {
  pseudo: String,
  email: String,
  password: String,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
