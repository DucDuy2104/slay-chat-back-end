//email, mk, ten, anh, mang user khác
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  avatar: { type: String, default: "" },
  friends: { type: [String], default: [] },
});

module.exports = mongoose.models.user || mongoose.model("user", userSchema);
