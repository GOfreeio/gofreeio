import Proposal from "../models/proposal.model.js";
import Job from "../models/job.model.js";

// CREATE PROPOSAL
export const createProposal = async (req, res) => {
  try {
    const { job, coverLetter, bidAmount, estimatedDays } = req.body;

    if (!job || !coverLetter || bidAmount === undefined || !estimatedDays) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (req.user.role !== "freelancer") {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can submit proposals",
      });
    }

    const existingJob = await Job.findById(job);

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (existingJob.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Proposal can only be submitted for an open job",
      });
    }

    if (existingJob.client.toString() === req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot submit a proposal to your own job",
      });
    }

    const alreadyExists = await Proposal.findOne({
      job,
      freelancer: req.user.userId,
    });

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted a proposal for this job",
      });
    }

    const proposal = await Proposal.create({
      job,
      freelancer: req.user.userId,
      coverLetter,
      bidAmount,
      estimatedDays,
    });

    return res.status(201).json({
      success: true,
      message: "Proposal submitted successfully",
      data: proposal,
    });
  } catch (error) {
    console.error("Create Proposal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET MY PROPOSALS
export const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancer: req.user.userId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch proposals",
      error: error.message,
    });
  }
};


// GET PROPOSALS FOR A JOB
export const getJobProposals = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only job owner can see proposals
    if (job.client.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view these proposals",
      });
    }

    const proposals = await Proposal.find({
      job: jobId,
    })
      .populate("freelancer", "name email avatar bio location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job proposals",
      error: error.message,
    });
  }
};


// GET SINGLE PROPOSAL
export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("job")
      .populate("freelancer", "name email avatar bio location");

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch proposal",
      error: error.message,
    });
  }
};


// WITHDRAW PROPOSAL
export const withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.freelancer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to withdraw this proposal",
      });
    }

    if (proposal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending proposals can be withdrawn",
      });
    }

    proposal.status = "withdrawn";

    await proposal.save();

    return res.status(200).json({
      success: true,
      message: "Proposal withdrawn successfully",
      data: proposal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to withdraw proposal",
      error: error.message,
    });
  }
};


// ACCEPT PROPOSAL
export const acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const job = await Job.findById(proposal.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only job owner can accept
    if (job.client.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the job owner can accept a proposal",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer open",
      });
    }

    if (proposal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This proposal cannot be accepted",
      });
    }

    // Accept selected proposal
    proposal.status = "accepted";
    await proposal.save();

    // Reject all other pending proposals
    await Proposal.updateMany(
      {
        job: job._id,
        _id: { $ne: proposal._id },
        status: "pending",
      },
      {
        $set: { status: "rejected" },
      }
    );

    // Job is now in progress
    job.status = "in_progress";
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Proposal accepted successfully",
      data: proposal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to accept proposal",
      error: error.message,
    });
  }
};


// REJECT PROPOSAL
export const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    const job = await Job.findById(proposal.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.client.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the job owner can reject a proposal",
      });
    }

    if (proposal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending proposals can be rejected",
      });
    }

    proposal.status = "rejected";

    await proposal.save();

    return res.status(200).json({
      success: true,
      message: "Proposal rejected successfully",
      data: proposal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject proposal",
      error: error.message,
    });
  }
};