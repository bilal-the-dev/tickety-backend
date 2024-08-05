const mongoose = require("mongoose");

const reqString = { type: String, required: true };

const userSchema = new mongoose.Schema({
  userId: reqString,
  accessToken: reqString,
  refreshToken: reqString,
});

module.exports = mongoose.model("User", userSchema);
