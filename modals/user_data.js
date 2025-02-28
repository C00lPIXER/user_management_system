const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwd: {
    type: String,
    required: true,
  },
  signUpDate: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model("User", userSchema);
