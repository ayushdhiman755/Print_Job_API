import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    location: {
      type: Array,
      require: true,
      require: true,
    },
    jobs: {
      type: Array,
      default: [],
    },
    deliveredJobs: {
      type: Array,
      default: [],
    },
    city: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      default: "India",
    },
    state: {
      type: String,
      require: true,
    },
    PostalCode: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
      default: "https://ucarecdn.com/65c1476b-7939-4802-a0be-67bf017a57f5/",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
