import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobDetails";
import ClientDashboard from "./pages/client/ClientDashboard";
import CreateJob from "./pages/client/CreateJob";
import MyJobs from "./pages/client/MyJobs";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import MyProposals from "./pages/freelancer/MyProposals";
import Chat from "./pages/Chat/Chat";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route path="/client/create" element={<CreateJob />} />
      <Route path="/client/jobs" element={<MyJobs />} />
      <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
      <Route path="/freelancer/proposals" element={<MyProposals />} />
      <Route path="/messages" element={<Chat />} />
      <Route path="/chat" element={<Chat />} />
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;