const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      minlength: 4,
      maxlength: 30,
      unique: true,
    },
    password: { type: String, require: true, minlength: 4, maxlength: 1024 },
    nickname: {
      type: String,
      require: false,
      maxlength: 30,
      unique: false,
    },
    avatar: {
      type: String,
      require: false,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
