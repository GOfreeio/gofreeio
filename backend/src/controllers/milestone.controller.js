import Milestone from "../models/milestone.model.js";
import Job from "../models/job.model.js";
import Proposal from "../models/proposal.model.js";


// CREATE MILESTONE
export const createMilestone = async (req, res) => {
  try {
    const {
      job,
      proposal,
      title,
      description,
      amount,
      dueDate,
    } = req.body;

    if (!job || !proposal || !title || amount === undefined || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const existingJob = await Job.findById(job);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (existingJob.client.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the job owner can create milestones",
      });
    }

    const existingProposal = await Proposal.findById(proposal);

    if (!existingProposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (existingProposal.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Milestone can only be created for an accepted proposal",
      });
    }

    const milestone = await Milestone.create({
      job,
      proposal,
      title,
      description,
      amount,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      data: milestone,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create milestone",
      error: error.message,
    });
  }
};


// GET JOB MILESTONES
export const getJobMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({
      job: req.params.jobId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch milestones",
      error: error.message,
    });
  }
};


// UPDATE MILESTONE STATUS
export const updateMilestoneStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid milestone status",
      });
    }

    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    const job = await Job.findById(milestone.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const proposal = await Proposal.findById(milestone.proposal);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const isClient =
      job.client.toString() === req.user.userId.toString();

    const isFreelancer =
      proposal.freelancer.toString() === req.user.userId.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this project",
      });
    }

    milestone.status = status;

    await milestone.save();

    return res.status(200).json({
      success: true,
      message: "Milestone status updated successfully",
      data: milestone,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update milestone",
      error: error.message,
    });
  }
};