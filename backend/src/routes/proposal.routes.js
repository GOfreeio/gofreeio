import express from "express";

import {
  createProposal,
  getMyProposals,
  getJobProposals,
  getProposalById,
  withdrawProposal,
  acceptProposal,
  rejectProposal,
} from "../controllers/proposal.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProposal);

router.get("/my", protect, getMyProposals);

router.get("/job/:jobId", protect, getJobProposals);

router.get("/:id", protect, getProposalById);

router.patch("/:id/withdraw", protect, withdrawProposal);

router.patch("/:id/accept", protect, acceptProposal);

router.patch("/:id/reject", protect, rejectProposal);

export default router;