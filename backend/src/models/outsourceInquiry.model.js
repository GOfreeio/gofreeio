import mongoose from "mongoose";

const outsourceInquirySchema = new mongoose.Schema(
  {
    clientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    companyName: { type: String, required: true, trim: true },
    clientName: { type: String, default: "", trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true },
    clientPhone: { type: String, default: "", trim: true },
    projectTitle: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    projectDetails: { type: String, required: true, trim: true },
    payment: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    deadline: { type: String, required: true, trim: true },
    attachmentUrl: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "completed"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

const OutsourceInquiry = mongoose.model("OutsourceInquiry", outsourceInquirySchema);

export default OutsourceInquiry;
