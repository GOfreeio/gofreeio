import express from "express";
import {
  getOrCreateMyConversation,
  getAdminConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Client / Freelancer retrieves their dedicated Freeio Project Desk conversation
router.get("/my-conversation", protect, getOrCreateMyConversation);

// Admin ("we") lists all client and freelancer chat channels
router.get("/admin/conversations", protect, getAdminConversations);

// Fetch messages for a specific conversation
router.get("/messages/:conversationId", protect, getMessages);

// Send message (strictly mediated through Admin)
router.post("/messages", protect, sendMessage);

// Mark conversation messages as read
router.patch("/messages/:conversationId/read", protect, markAsRead);

export default router;
