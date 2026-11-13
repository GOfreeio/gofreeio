import mongoose from "mongoose";
import CareerJob from "../models/careerJob.model.js";

const fields = ["title", "department", "location", "employmentType", "description"];
const maxLengths = {
  title: 120,
  department: 100,
  location: 120,
  description: 5000,
  requirements: 5000,
};
const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const payPeriods = ["Hourly", "Daily", "Weekly", "Monthly", "Yearly"];

const validateCareerJob = (body) => {
  for (const field of [...fields, "requirements"]) {
    if (body[field] !== undefined && typeof body[field] !== "string") {
      return `${field} must be a string`;
    }
  }

  for (const field of fields) {
    if (!body[field]?.trim()) {
      return `${field} is required`;
    }
  }

  if (!employmentTypes.includes(body.employmentType)) {
    return "employmentType must be Full-time, Part-time, Contract or Internship";
  }

  for (const [field, maxLength] of Object.entries(maxLengths)) {
    if ((body[field] || "").trim().length > maxLength) {
      return `${field} must be ${maxLength} characters or fewer`;
    }
  }

  const { price } = body;
  if (!price || typeof price !== "object" || Array.isArray(price)) {
    return "price is required";
  }
  if (
    typeof price.min !== "number" ||
    !Number.isFinite(price.min) ||
    typeof price.max !== "number" ||
    !Number.isFinite(price.max) ||
    price.min < 0 ||
    price.max < price.min
  ) {
    return "price must include valid min and max amounts, with max greater than or equal to min";
  }
  if (typeof price.currency !== "string" || !/^[A-Za-z]{3}$/.test(price.currency.trim())) {
    return "price.currency must be a three-letter currency code";
  }
  if (!payPeriods.includes(price.payPeriod)) {
    return "price.payPeriod must be Hourly, Daily, Weekly, Monthly or Yearly";
  }

  return null;
};

export const getCareerJobs = async (_req, res) => {
  try {
    const jobs = await CareerJob.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Failed to load career jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load career jobs",
    });
  }
};

export const createCareerJob = async (req, res) => {
  const validationError = validateCareerJob(req.body ?? {});
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const job = await CareerJob.create({
      title: req.body.title.trim(),
      department: req.body.department.trim(),
      location: req.body.location.trim(),
      employmentType: req.body.employmentType,
      description: req.body.description.trim(),
      requirements: (req.body.requirements || "").trim(),
      price: {
        min: req.body.price.min,
        max: req.body.price.max,
        currency: req.body.price.currency.trim().toUpperCase(),
        payPeriod: req.body.price.payPeriod,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Career job posted successfully",
      data: job,
    });
  } catch (error) {
    console.error("Failed to create career job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post career job",
    });
  }
};

export const deleteCareerJob = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid career job ID" });
  }

  try {
    const job = await CareerJob.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Career job not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Career job deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete career job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete career job",
    });
  }
};
