const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      min: 3,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "https://ucarecdn.com/65c1476b-7939-4802-a0be-67bf017a57f5/",
    },
  },
  { timestamps: true }
);
module.exports=mongoose.model("User",UserSchema)