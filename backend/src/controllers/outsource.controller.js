import Outsource from "../models/outsource.model.js";

// 1. Create a new outsource request
export const createOutsourceRequest = async (req, res) => {
  try {
    const {
      companyName,
      clientName,
      clientEmail,
      clientPhone,
      projectTitle,
      category,
      projectDetails,
      payment,
      duration,
      deadline,
      attachmentUrl,
    } = req.body;

    if (!companyName || !projectTitle || !projectDetails || !payment || !duration || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Company name, project title, details, payment, duration, and deadline are required.",
      });
    }

    const outsource = await Outsource.create({
      companyName,
      clientName: clientName || (req.user ? req.user.name : "Client"),
      clientEmail: clientEmail || (req.user ? req.user.email : ""),
      clientPhone: clientPhone || "",
      projectTitle,
      category: category || "Translation",
      projectDetails,
      payment,
      duration,
      deadline,
      attachmentUrl: attachmentUrl || "",
      clientId: req.user ? req.user._id : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Outsource project request submitted successfully.",
      data: outsource,
    });
  } catch (error) {
    console.error("createOutsourceRequest Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit outsource request",
      error: error.message,
    });
  }
};

// 2. Get all outsource requests (Admin or client's own)
export const getOutsourceRequests = async (req, res) => {
  try {
    const filter = {};

    // If client, return their requests; if admin, return all
    if (req.user && req.user.role === "client") {
      filter.$or = [{ clientId: req.user._id }, { clientEmail: req.user.email }];
    }

    const requests = await Outsource.find(filter)
      .populate("assignedFreelancers", "name email avatar skills")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch outsource requests",
      error: error.message,
    });
  }
};

// 3. Get single outsource request by ID
export const getOutsourceById = async (req, res) => {
  try {
    const request = await Outsource.findById(req.params.id).populate(
      "assignedFreelancers",
      "name email avatar skills"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Outsource request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch outsource request",
      error: error.message,
    });
  }
};
