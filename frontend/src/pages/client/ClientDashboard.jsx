import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />
      <div className="container" style={{ padding: "40px 0" }}>
        <div
          style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: "8px" }}>
                Client Workspace
              </span>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>
                Welcome back, {user?.name || "Client"}
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Manage your translation & dubbing projects, proposals from talent, and milestones.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/profile" className="btn btn-outline" style={{ background: "#eff6ff", borderColor: "#93c5fd", color: "#2563eb" }}>
                <span>Account Profile</span>
              </Link>
              <Link to="/client/jobs" className="btn btn-outline">
                My Posted Projects
              </Link>
              <Link to="/client/create" className="btn btn-primary">
                + Post a New Project
              </Link>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)", borderRadius: "16px", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", color: "#ffffff" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>Need a document translated or an anime/game dubbed?</h3>
            <p style={{ color: "#bfdbfe", fontSize: "14px", marginTop: "4px" }}>Add your project requirements and review proposals from freelancers.</p>
          </div>
          <Link to="/client/create" className="btn btn-primary" style={{ background: "#ffffff", color: "#2563eb", fontWeight: "700" }}>
            Post a Project Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
