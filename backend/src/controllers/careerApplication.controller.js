import CareerApplication from "../models/careerApplication.model.js";

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const driveFileIdPattern = /^[\w-]{10,}$/;

const isGoogleDriveLink = (value) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(url.hostname)) {
      return false;
    }

    const fileId =
      url.pathname.match(/\/(?:file|document|spreadsheets|presentation)\/d\/([\w-]+)/)?.[1] ||
      url.searchParams.get("id");

    return Boolean(fileId && driveFileIdPattern.test(fileId));
  } catch {
    return false;
  }
};

export const createCareerApplication = async (req, res) => {
  const { name, email, phone, resumeUrl } = req.body ?? {};

  if ([name, email, phone, resumeUrl].some((value) => typeof value !== "string")) {
    return res.status(400).json({
      success: false,
      message: "Name, email, phone and resumeUrl are required",
    });
  }

  const applicationName = name.trim();
  const applicationEmail = email.trim();
  const applicationPhone = phone.trim();
  const applicationResumeUrl = resumeUrl.trim();

  if (!applicationName || !applicationEmail || !applicationPhone || !applicationResumeUrl) {
    return res.status(400).json({
      success: false,
      message: "Name, email, phone and resumeUrl are required",
    });
  }

  if (!isEmail(applicationEmail)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required",
    });
  }

  if (
    applicationName.length > 120 ||
    applicationEmail.length > 254 ||
    applicationPhone.length > 40 ||
    applicationResumeUrl.length > 2048
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more form fields exceed the allowed length",
    });
  }

  if (!isGoogleDriveLink(applicationResumeUrl)) {
    return res.status(400).json({
      success: false,
      message: "Resume must be a valid Google Drive share link",
    });
  }

  try {
    const application = await CareerApplication.create({
      name: applicationName,
      email: applicationEmail,
      phone: applicationPhone,
      resumeUrl: applicationResumeUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        _id: application._id,
        name: application.name,
        email: application.email,
        phone: application.phone,
        resumeUrl: application.resumeUrl,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to save career application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit your application",
    });
  }
};

export const getCareerApplications = async (_req, res) => {
  try {
    const applications = await CareerApplication.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Failed to load career applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
};
