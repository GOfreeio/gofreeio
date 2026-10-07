import express from "express";

import {
  createMilestone,
  getJobMilestones,
  updateMilestoneStatus,
} from "../controllers/milestone.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createMilestone);

router.get("/job/:jobId", protect, getJobMilestones);

router.patch("/:id/status", protect, updateMilestoneStatus);

export default router;