import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function FreelancerDashboard() {
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
              <span className="badge badge-green" style={{ marginBottom: "8px" }}>
                Freelancer Profile
              </span>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>
                Welcome back, {user?.name || "Freelancer"} 🚀
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Track your active proposals, client messages, and ongoing project deliverables.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/profile" className="btn btn-outline" style={{ background: "#eff6ff", borderColor: "#93c5fd", color: "#2563eb" }}>
                <span>✏️ My Profile Setup</span>
              </Link>
              <Link to="/freelancer/proposals" className="btn btn-outline">
                View My Proposals
              </Link>
              <Link to="/jobs" className="btn btn-primary">
                Browse New Projects →
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Completion Prompt Card (Fill Later / Fill Now) */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)",
            border: "1.5px solid #bbf7d0",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              🛡️
            </div>
            <div>
              <div style={{ fontWeight: "800", color: "#065f46", fontSize: "16px" }}>
                Freelancer Verification & Profile (Fill Later or Now)
              </div>
              <div style={{ color: "#475569", fontSize: "13.5px", marginTop: "2px" }}>
                Upload profile picture, education, video introduction, certifications, LinkedIn, hours/week & verify Govt ID (Aadhaar/PAN on camera).
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="btn btn-primary"
            style={{ padding: "10px 20px", fontSize: "14px" }}
          >
            Complete Profile Now →
          </Link>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Active Proposals</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>4</div>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>● Under review by clients</span>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Active Contracts</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginTop: "4px" }}>2</div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Due in 5 days</span>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Total Earnings</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", marginTop: "4px" }}>$3,850</div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Paid directly to wallet</span>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Profile Rating</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>5.0 ★</div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>From 12 client reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}
