import mongoose, { set } from "mongoose";

const CredentialSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["User", "Provider", "Admin"],
      required: true,
    },
    otherDetails: {
      type: String,
    },
    fcmToken: {
      type: Array,
      unique:true
    },
  },
  { timestamps: true }
);
const Credentials = mongoose.model("Credentials", CredentialSchema);
export default Credentials;
