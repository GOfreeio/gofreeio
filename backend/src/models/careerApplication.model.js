import mongoose from "mongoose";

export const PROJECT_TYPES = [
  "Data Collection",
  "Audio Recording",
  "Transcription",
  "Translation",
  "Localization",
  "Data Annotation",
  "AI/LLM Data Training",
  "Quality Assurance (QA)",
  "MTPE",
  "Other",
];

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
    location: { type: String, required: true, trim: true, maxlength: 200 },
    nativeLanguage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    otherLanguages: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    languageProficiency: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    hasAdditionalLanguageExpertise: { type: Boolean, required: true },
    additionalLanguageExpertise: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    projectTypes: {
      type: [{ type: String, enum: PROJECT_TYPES }],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Select at least one project type",
      },
    },
    professionalExpertise: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    hasRelevantExperience: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);

export default CareerApplication;
