import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import About from "./pages/About";
import RoleGateway from "./pages/Auth/RoleGateway";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile/Profile";
import Outsource from "./pages/Outsource/Outsource";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobDetails";
import ClientDashboard from "./pages/client/ClientDashboard";
import CreateJob from "./pages/client/CreateJob";
import MyJobs from "./pages/client/MyJobs";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import MyProposals from "./pages/freelancer/MyProposals";
import Chat from "./pages/Chat/Chat";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ENTRY ROUTES ================= */}
      {/* First visit entry gateway: As a freelancer / As a client -> Login form */}
      <Route path="/" element={<RoleGateway />} />
      <Route path="/login" element={<RoleGateway />} />
      <Route path="/register" element={<RoleGateway />} />
      <Route path="/outsource" element={<Outsource />} />

      {/* ================= PROTECTED INTERNAL ROUTES ================= */}
      {/* Unauthenticated visitors cannot access these routes without logging in */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelancer/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Jobs Marketplace (Freelancer / Admin Login Required) */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowedRoles={["freelancer", "admin"]}>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute allowedRoles={["freelancer", "admin"]}>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      {/* Client Protected Routes */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute allowedRoles={["client", "admin"]}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/create"
        element={
          <ProtectedRoute allowedRoles={["client", "admin"]}>
            <CreateJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/jobs"
        element={
          <ProtectedRoute allowedRoles={["client", "admin"]}>
            <MyJobs />
          </ProtectedRoute>
        }
      />

      {/* Freelancer Protected Routes */}
      <Route
        path="/freelancer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["freelancer", "admin"]}>
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelancer/proposals"
        element={
          <ProtectedRoute allowedRoles={["freelancer", "admin"]}>
            <MyProposals />
          </ProtectedRoute>
        }
      />

      {/* Chat Desk (Login Required) */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* Fallback to home gateway */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;