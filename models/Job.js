import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
      require: true,
    },
    deliveryLocation: {
      type: Array,
      require: true,
    },
    documentName: {
      type: String,
      require: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    numberOfCopies: {
      type: Number,
      require: true,
    },
    documentSize: {
      type: Number,
      default: 1,
    },
    typeOfCopy: {
      type: String,
      require: true,
    },
    sizeOfPaper: {
      type: String,
      require: true,
    },
    additionalInstruction: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Assigned", "Pending", "Finished", "NotAssigned"],
      default: "NotAssigned",
    },
    potentialCandidates: {
      type: Array,
      default: [],
    },
    assignedTo: {
      type: String,
    },
    transferedTo: {
      type: String,
    },
    transferedFrom: {
      type: String,
    },
    userPrice: {
      type: Number,
    },
    providerPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);
const Job = mongoose.model("Job", JobSchema);
export default Job;
