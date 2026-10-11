import express from "express";
import {
  createOutsourceRequest,
  getOutsourceRequests,
  getOutsourceById,
} from "../controllers/outsource.controller.js";

const router = express.Router();

// Allow submitting even unauthenticated (with client email) or authenticated
router.post("/", createOutsourceRequest);
router.get("/", getOutsourceRequests);
router.get("/:id", getOutsourceById);

export default router;
