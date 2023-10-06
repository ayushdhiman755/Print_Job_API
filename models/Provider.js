import mongoose from "mongoose";
const ProviderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    firmName: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
      default: "https://ucarecdn.com/65c1476b-7939-4802-a0be-67bf017a57f5/",
    },
    printTypes: {
      type: Array,
      default: [],
    },
    paperSize: {
      type: Array,
      default: [],
    },
    jobsAssigned: {
      type: Array,
      default: [],
    },
    jobsCompleted: {
      type: Array,
      default: [],
    },
    jobsProposed: {
      type: Array,
      default: [],
    },
    location: {
      type: Object,
      require: true,
    },
    verificationDocumentType: {
      type: String,
      // enum: [],
    },
    documentName: {
      type: String,
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    Phone: {
      type: String,
      require: true,
      unique: true,
    },
    City: {
      type: String,
    },
    State: {
      type: String,
    },
    Country: {
      type: String,
      default: "India",
    },
    PostalCode: {
      type: String,
    },
  },
  { timestamps: true }
);
const Provider = mongoose.model("Provider", ProviderSchema);
export default Provider;
