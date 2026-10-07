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

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Freeio API is running',
  });
});

app.use('/api/users', userRoutes);

export default app;