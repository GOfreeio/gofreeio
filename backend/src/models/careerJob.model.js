import mongoose from "mongoose";

const careerJobPriceSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, match: /^[A-Z]{3}$/ },
    payPeriod: {
      type: String,
      required: true,
      enum: ["Hourly", "Daily", "Weekly", "Monthly", "Yearly"],
    },
  },
  { _id: false }
);

const careerJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    employmentType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    requirements: { type: String, trim: true, maxlength: 5000, default: "" },
    price: { type: careerJobPriceSchema, required: true },
  },
  { timestamps: true }
);

const CareerJob = mongoose.model("CareerJob", careerJobSchema);

export default CareerJob;
