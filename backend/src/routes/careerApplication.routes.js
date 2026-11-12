import express from "express";
import {
  createCareerApplication,
  getCareerApplications,
} from "../controllers/careerApplication.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", createCareerApplication);
router.get("/", protect, requireAdmin, getCareerApplications);

export default router;
