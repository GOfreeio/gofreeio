import express from "express";
import { createJob } from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  getJobs,getJobById,updateJob,deleteJob
} from "../controllers/job.controller.js";


const router = express.Router();

router.post("/", protect, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);


export default router;