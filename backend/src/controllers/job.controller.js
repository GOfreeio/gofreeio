import Job from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      budget,
      budgetType,
      deadline,
    } = req.body;

    if (
      !title ||
      !description ||
      !skills ||
      !budget ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const job = await Job.create({
      title,
      description,
      skills,
      budget,
      budgetType,
      deadline,

      // Logged-in user
      client: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("client", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("client", "name email avatar");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check job owner
    if (job.client.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this job",
      });
    }

    const {
      title,
      description,
      skills,
      budget,
      budgetType,
      deadline,
      status,
    } = req.body;

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (skills !== undefined) job.skills = skills;
    if (budget !== undefined) job.budget = budget;
    if (budgetType !== undefined) job.budgetType = budgetType;
    if (deadline !== undefined) job.deadline = deadline;
    if (status !== undefined) job.status = status;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check job owner
    if (job.client.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};