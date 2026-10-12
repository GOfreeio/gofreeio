import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function FreelancerDashboard() {
  const { user, token } = useAuth();
  const [proposalCount, setProposalCount] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch("/api/proposals/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProposalCount(data.data.length);
        }
      })
      .catch(() => {});
  }, [token]);

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
                Welcome back, {user?.name || "Freelancer"}
              </h1>
              <p style={{ color: "#64748b", marginTop: "4px" }}>
                Track your active proposals, client messages, and ongoing project deliverables.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/profile" className="btn btn-outline" style={{ background: "#eff6ff", borderColor: "#93c5fd", color: "#2563eb" }}>
                <span>My Profile Setup</span>
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
              ✓
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

        <div style={{ maxWidth: "340px", background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Your proposals</span>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>
            {proposalCount === null ? "—" : proposalCount}
          </div>
          <Link to="/freelancer/proposals" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>
            View proposal activity
          </Link>
        </div>
      </div>
    </div>
  );
}
