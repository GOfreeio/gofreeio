import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    resumeUrl: { type: String, required: true, trim: true, maxlength: 2048 },
  },
  { timestamps: true }
);

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);

export default CareerApplication;
