import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
// import ProposalRoutes from "./models/proposal.model.js";
import proposalRoutes from "./src/routes/proposal.routes.js";
import milestoneRoutes from "./src/routes/milestone.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import outsourceInquiryRoutes from "./src/routes/outsourceInquiry.routes.js";
import outsourceRoutes from "./src/routes/outsource.routes.js";
import contactInquiryRoutes from "./src/routes/contactInquiry.routes.js";
import careerApplicationRoutes from "./src/routes/careerApplication.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/outsource", outsourceInquiryRoutes);
app.use("/api/outsource", outsourceRoutes);
app.use("/api/contact", contactInquiryRoutes);
app.use("/api/applications", careerApplicationRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Freeio API is running',
  });
});

app.use('/api/users', userRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Request body must contain valid JSON",
    });
  }

  console.error("Unhandled API error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;