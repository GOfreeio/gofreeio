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
              <Link to="/freelancer/proposals" className="btn btn-outline">
                View My Proposals
              </Link>
              <Link to="/jobs" className="btn btn-primary">
                Browse New Projects →
              </Link>
            </div>
          </div>
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
