import express from "express";
import {
  createCareerJob,
  deleteCareerJob,
  getCareerJobs,
} from "../controllers/careerJob.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", getCareerJobs);
router.post("/", protect, requireAdmin, createCareerJob);
router.delete("/:id", protect, requireAdmin, deleteCareerJob);

export default router;
