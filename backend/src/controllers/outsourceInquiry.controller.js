import OutsourceInquiry from "../models/outsourceInquiry.model.js";
import User from "../models/user.model.js";

export const createOutsourceInquiry = async (req, res) => {
  try {
    const requiredFields = [
      "companyName",
      "clientEmail",
      "projectTitle",
      "category",
      "projectDetails",
      "payment",
      "duration",
      "deadline",
    ];
    const missingField = requiredFields.find((field) => !req.body[field]?.trim());

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const accountUser = req.user
      ? await User.findById(req.user.userId).select("name email")
      : null;

    const inquiry = await OutsourceInquiry.create({
      clientUser: accountUser?._id || null,
      companyName: req.body.companyName,
      clientName: accountUser?.name || req.body.clientName || "",
      clientEmail: accountUser?.email || req.body.clientEmail,
      clientPhone: req.body.clientPhone || "",
      projectTitle: req.body.projectTitle,
      category: req.body.category,
      projectDetails: req.body.projectDetails,
      payment: req.body.payment,
      duration: req.body.duration,
      deadline: req.body.deadline,
      attachmentUrl: req.body.attachmentUrl || "",
    });

    return res.status(201).json({
      success: true,
      message: "Outsource inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit outsource inquiry",
      error: error.message,
    });
  }
};

export const getOutsourceInquiries = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      const user = await User.findById(req.user.userId).select("email");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      filter = { clientUser: user._id };
    }

    const inquiries = await OutsourceInquiry.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load outsource inquiries",
      error: error.message,
    });
  }
};