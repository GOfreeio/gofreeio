import ContactInquiry from "../models/contactInquiry.model.js";

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const createContactInquiry = async (req, res) => {
  const { name, email, phone = "", subject = "", message } = req.body ?? {};

  const fields = { name, email, phone, subject, message };
  if (Object.values(fields).some((value) => typeof value !== "string")) {
    return res.status(400).json({
      success: false,
      message: "All form fields must be strings",
    });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required",
    });
  }

  if (!isEmail(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: "A valid email address is required",
    });
  }

  if (
    trimmedName.length > 120 ||
    trimmedEmail.length > 254 ||
    phone.trim().length > 40 ||
    subject.trim().length > 200 ||
    trimmedMessage.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more form fields exceed the allowed length",
    });
  }

  try {
    const inquiry = await ContactInquiry.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: phone.trim(),
      subject: subject.trim(),
      message: trimmedMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Failed to save contact inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit your message",
    });
  }
};

export const getContactInquiries = async (_req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("Failed to load contact inquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load contact inquiries",
    });
  }
};
