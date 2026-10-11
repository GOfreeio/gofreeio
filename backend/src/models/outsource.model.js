import mongoose from "mongoose";

const outsourceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      default: "",
    },
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Translation",
    },
    projectDetails: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      required: true, // e.g. $2,500 or 50,000 INR
    },
    duration: {
      type: String,
      required: true, // e.g. 2-3 weeks, 1 month
    },
    deadline: {
      type: String,
      required: true, // e.g. 2026-11-15
    },
    attachmentUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["submitted", "in_review", "assigned", "in_progress", "completed"],
      default: "submitted",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    assignedFreelancers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Outsource = mongoose.model("Outsource", outsourceSchema);

export default Outsource;
