import CareerApplication, {
  PROJECT_TYPES,
} from "../models/careerApplication.model.js";

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
  const {
    name,
    email,
    phone,
    resumeUrl,
    location,
    nativeLanguage,
    otherLanguages,
    languageProficiency,
    hasAdditionalLanguageExpertise,
    additionalLanguageExpertise = "",
    projectTypes,
    professionalExpertise,
    hasRelevantExperience,
  } = req.body ?? {};

  const textFields = [
    name,
    email,
    phone,
    resumeUrl,
    location,
    nativeLanguage,
    otherLanguages,
    languageProficiency,
    additionalLanguageExpertise,
    professionalExpertise,
  ];

  if (
    textFields.some((value) => typeof value !== "string") ||
    typeof hasAdditionalLanguageExpertise !== "boolean" ||
    typeof hasRelevantExperience !== "boolean" ||
    !Array.isArray(projectTypes) ||
    projectTypes.some((type) => typeof type !== "string")
  ) {
    return res.status(400).json({
      success: false,
      message: "Application fields have invalid or missing values",
    });
  }

  const applicationName = name.trim();
  const applicationEmail = email.trim();
  const applicationPhone = phone.trim();
  const applicationResumeUrl = resumeUrl.trim();
  const applicationLocation = location.trim();
  const applicationNativeLanguage = nativeLanguage.trim();
  const applicationOtherLanguages = otherLanguages.trim();
  const applicationLanguageProficiency = languageProficiency.trim();
  const applicationAdditionalLanguageExpertise =
    additionalLanguageExpertise.trim();
  const applicationProfessionalExpertise = professionalExpertise.trim();

  if (
    !applicationName ||
    !applicationEmail ||
    !applicationPhone ||
    !applicationResumeUrl ||
    !applicationLocation ||
    !applicationNativeLanguage ||
    !applicationLanguageProficiency ||
    !applicationProfessionalExpertise ||
    projectTypes.length === 0 ||
    (hasAdditionalLanguageExpertise &&
      !applicationAdditionalLanguageExpertise)
  ) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required application fields",
    });
  }

  if (projectTypes.some((type) => !PROJECT_TYPES.includes(type))) {
    return res.status(400).json({
      success: false,
      message: "One or more selected project types are invalid",
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
    applicationResumeUrl.length > 2048 ||
    applicationLocation.length > 200 ||
    applicationNativeLanguage.length > 100 ||
    applicationOtherLanguages.length > 1000 ||
    applicationLanguageProficiency.length > 1000 ||
    applicationAdditionalLanguageExpertise.length > 1000 ||
    applicationProfessionalExpertise.length > 2000
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
      location: applicationLocation,
      nativeLanguage: applicationNativeLanguage,
      otherLanguages: applicationOtherLanguages,
      languageProficiency: applicationLanguageProficiency,
      hasAdditionalLanguageExpertise,
      additionalLanguageExpertise: hasAdditionalLanguageExpertise
        ? applicationAdditionalLanguageExpertise
        : "",
      projectTypes,
      professionalExpertise: applicationProfessionalExpertise,
      hasRelevantExperience,
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
        location: application.location,
        nativeLanguage: application.nativeLanguage,
        otherLanguages: application.otherLanguages,
        languageProficiency: application.languageProficiency,
        hasAdditionalLanguageExpertise:
          application.hasAdditionalLanguageExpertise,
        additionalLanguageExpertise:
          application.additionalLanguageExpertise,
        projectTypes: application.projectTypes,
        professionalExpertise: application.professionalExpertise,
        hasRelevantExperience: application.hasRelevantExperience,
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
