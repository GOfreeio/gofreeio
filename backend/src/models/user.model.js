import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    education: [
      {
        degree: { type: String, default: "" },
        school: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" },
        startYear: { type: String, default: "" },
        endYear: { type: String, default: "" },
      },
    ],

    videoInstruction: {
      url: { type: String, default: "" },
      title: { type: String, default: "" },
    },

    certifications: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        issueYear: { type: String, default: "" },
        credentialUrl: { type: String, default: "" },
      },
    ],

    linkedinUrl: {
      type: String,
      default: "",
    },

    hoursPerWeek: {
      type: String,
      default: "",
    },

    govIdVerification: {
      idType: { type: String, enum: ["aadhaar", "pancard", ""], default: "" },
      idNumber: { type: String, default: "" },
      snapshot: { type: String, default: "" },
      status: { type: String, enum: ["unverified", "pending", "verified"], default: "unverified" },
      verifiedAt: { type: Date },
    },

    billingMethod: {
      status: { type: String, default: "in_progress" },
      methodType: { type: String, default: "" },
      accountDetails: { type: String, default: "" },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;