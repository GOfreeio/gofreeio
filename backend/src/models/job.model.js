import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    budgetType: {
      type: String,
      enum: ["fixed", "hourly"],
      default: "fixed",
    },

    deadline: {
      type: Date,
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "completed",
        "closed",
        "cancelled",
      ],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;