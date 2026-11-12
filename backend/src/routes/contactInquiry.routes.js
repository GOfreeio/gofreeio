import express from "express";
import {
  createContactInquiry,
  getContactInquiries,
} from "../controllers/contactInquiry.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", createContactInquiry);
router.get("/", protect, requireAdmin, getContactInquiries);

export default router;
