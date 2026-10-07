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
                Welcome back, {user?.name || "Client"} 👋
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Manage your translation & dubbing projects, proposals from talent, and milestones.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/client/jobs" className="btn btn-outline">
                My Posted Projects
              </Link>
              <Link to="/client/create" className="btn btn-primary">
                + Post a New Project
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Active Postings</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginTop: "4px" }}>3</div>
            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>● Open for proposals</span>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Received Proposals</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>18</div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Across all language listings</span>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Contracts in Progress</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#8b5cf6", marginTop: "4px" }}>2</div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Protected by Escrow</span>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Total Invested</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10b981", marginTop: "4px" }}>$4,250</div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Safe milestone payments</span>
          </div>
        </div>

        {/* Action Banner */}
        <div style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)", borderRadius: "16px", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", color: "#ffffff" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>Need a document translated or an anime/game dubbed?</h3>
            <p style={{ color: "#bfdbfe", fontSize: "14px", marginTop: "4px" }}>Post your brief in minutes and receive proposals with audio demos and sample text.</p>
          </div>
          <Link to="/client/create" className="btn btn-primary" style={{ background: "#ffffff", color: "#2563eb", fontWeight: "700" }}>
            Post a Project Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
