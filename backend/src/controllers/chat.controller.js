import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Helper to ensure a platform admin exists
export const getOrCreateDefaultAdmin = async () => {
  let admin = await User.findOne({ role: "admin" });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    admin = await User.create({
      name: "Freeio Project Desk",
      email: "admin@freeio.com",
      password: hashedPassword,
      role: "admin",
      avatar: "",
      bio: "Official Freeio Project Desk & Quality Assurance Management",
      location: "Freeio Global HQ",
    });
    console.log("Default Freeio Admin account seeded: admin@freeio.com / admin123");
  }

  return admin;
};

// 1. GET OR CREATE USER CONVERSATION (Client or Freelancer)
export const getOrCreateMyConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Admins don't have a single "my-conversation", they use getAdminConversations
    if (userRole === "admin") {
      return res.status(200).json({
        success: true,
        isAdmin: true,
        message: "Logged in as Admin. Use admin conversations endpoint.",
      });
    }

    const admin = await getOrCreateDefaultAdmin();

    let conversation = await Conversation.findOne({
      user: userId,
      admin: admin._id,
    })
      .populate("admin", "name email role avatar bio")
      .populate("user", "name email role avatar location");

    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        admin: admin._id,
        userRole: userRole === "client" ? "client" : "freelancer",
        lastMessage: "Conversation initialized with Freeio Project Desk.",
        lastMessageAt: new Date(),
      });

      // Post initial welcome message from Project Desk
      const welcomeText =
        userRole === "client"
          ? "Hello! Welcome to Freeio Project Desk. I am your dedicated Project Manager. How can we assist you with your translation, localization, or dubbing requirements today?"
          : "Hello! Welcome to the Freeio Talent Desk. This is your direct channel with our management team for task briefings, linguistic queries, and milestone submissions.";

      await Message.create({
        conversation: conversation._id,
        sender: admin._id,
        receiver: userId,
        text: welcomeText,
      });

      conversation.lastMessage = welcomeText;
      conversation.unreadCountUser = 1;
      await conversation.save();

      conversation = await Conversation.findById(conversation._id)
        .populate("admin", "name email role avatar bio")
        .populate("user", "name email role avatar location");
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("getOrCreateMyConversation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load conversation",
      error: error.message,
    });
  }
};

// 2. GET ADMIN CONVERSATIONS (Admin lists all client & freelancer threads)
export const getAdminConversations = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Freeio Admin can access the management inbox.",
      });
    }

    const { role } = req.query;
    const filter = {};

    if (role && (role === "client" || role === "freelancer")) {
      filter.userRole = role;
    }

    const conversations = await Conversation.find(filter)
      .populate("user", "name email role avatar location isVerified")
      .populate("admin", "name email role")
      .sort({ lastMessageAt: -1 });

    return res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

// 3. GET MESSAGES FOR A CONVERSATION
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Security check: Must be the user, the admin, or an admin role
    const isParticipant =
      conversation.user.toString() === userId.toString() ||
      conversation.admin.toString() === userId.toString() ||
      userRole === "admin";

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this conversation.",
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email role avatar")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// 4. SEND MESSAGE (With strict direct client-to-freelancer prohibition)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.userId;
    const senderRole = req.user.role;

    if (!conversationId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and message text are required.",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // STRICT MEDIATED POLICY CHECK:
    // Clients and Freelancers can ONLY message the Admin.
    // If a non-admin is trying to send to another non-admin, block immediately.
    const isSenderUser = conversation.user.toString() === senderId.toString();
    const isSenderAdmin =
      conversation.admin.toString() === senderId.toString() || senderRole === "admin";

    if (!isSenderUser && !isSenderAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation.",
      });
    }

    // Determine receiver
    let receiverId;
    if (isSenderUser) {
      // User is sending to Admin
      receiverId = conversation.admin;
    } else {
      // Admin is sending to User
      receiverId = conversation.user;
    }

    // Final security check: verify receiver is not an unauthorized non-admin cross-message
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Direct client-freelancer check
    if (
      (senderRole === "client" && receiver.role === "freelancer") ||
      (senderRole === "freelancer" && receiver.role === "client")
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Direct client-to-freelancer messaging is not permitted. All communications must go through Freeio Project Desk.",
      });
    }

    // Create Message
    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
    });

    // Update conversation metadata
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();

    if (isSenderUser) {
      conversation.unreadCountAdmin += 1;
    } else {
      conversation.unreadCountUser += 1;
    }

    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role avatar");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("sendMessage Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// 5. MARK MESSAGES AS READ
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Mark messages where receiver is current user
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    // Reset unread counters
    if (userRole === "admin" || conversation.admin.toString() === userId.toString()) {
      conversation.unreadCountAdmin = 0;
    } else {
      conversation.unreadCountUser = 0;
    }

    await conversation.save();

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};
