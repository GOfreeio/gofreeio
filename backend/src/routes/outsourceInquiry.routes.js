import express from "express";
import {
  createOutsourceInquiry,
  getOutsourceInquiries,
} from "../controllers/outsourceInquiry.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const optionalProtect = (req, res, next) => {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
};

const router = express.Router();

router.post("/", optionalProtect, createOutsourceInquiry);
router.get("/", protect, getOutsourceInquiries);

export default router;