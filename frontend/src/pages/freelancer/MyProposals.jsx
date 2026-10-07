import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function MyProposals() {
  const { user, token, isAuthenticated } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetchProposals();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setProposals(data.data);
      } else {
        setProposals([]);
      }
    } catch (err) {
      setErrorMessage("Could not load proposals from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this proposal?")) return;
    try {
      const res = await fetch(`/api/proposals/${id}/withdraw`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProposals();
      } else {
        alert(data.message || "Failed to withdraw");
      }
    } catch (err) {
      alert("Error withdrawing proposal");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span style={{ background: "#ecfdf5", color: "#059669", padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "700" }}>✓ Accepted</span>;
      case "rejected":
        return <span style={{ background: "#fef2f2", color: "#dc2626", padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "700" }}>✕ Declined</span>;
      case "withdrawn":
        return <span style={{ background: "#f1f5f9", color: "#64748b", padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "700" }}>Withdrawn</span>;
      default:
        return <span style={{ background: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "700" }}>● Under Review</span>;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <main style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: "8px" }}>
                Freelancer Portal
              </span>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>
                My Submitted Proposals
              </h1>
              <p style={{ color: "#64748b", fontSize: "14.5px" }}>
                Track active client pitches, delivery time estimates, and project acceptances.
              </p>
            </div>

            <Link to="/jobs" className="btn btn-primary">
              Browse New Projects →
            </Link>
          </div>

          {!isAuthenticated ? (
            <div style={{ background: "#ffffff", padding: "40px", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <p style={{ color: "#64748b", marginBottom: "16px" }}>Please log in to view your submitted proposals.</p>
              <Link to="/login" className="btn btn-primary">
                Log In
              </Link>
            </div>
          ) : loading ? (
            <p style={{ color: "#64748b" }}>Loading your proposals...</p>
          ) : proposals.length === 0 ? (
            <div style={{ background: "#ffffff", padding: "48px 24px", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "36px" }}>📂</span>
              <h3 style={{ fontSize: "18px", color: "#111827", marginTop: "12px", marginBottom: "6px" }}>
                No Proposals Submitted Yet
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
                Explore open translation, dubbing, and transcription jobs and submit your pitch to start earning.
              </p>
              <Link to="/jobs" className="btn btn-primary">
                Browse Projects Now
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {proposals.map((prop) => (
                <div
                  key={prop._id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <div>
                      <span className="badge badge-blue" style={{ marginBottom: "6px" }}>
                        {prop.job?.skills && prop.job.skills[0] ? prop.job.skills[0] : "Project"}
                      </span>
                      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>
                        <Link to={`/jobs/${prop.job?._id || prop.job}`} style={{ color: "inherit" }}>
                          {prop.job?.title || "Project Details"}
                        </Link>
                      </h3>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "20px", fontWeight: "800", color: "#10b981", display: "block" }}>
                        ${prop.bidAmount}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Est. {prop.estimatedDays} days delivery
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.55", marginBottom: "16px" }}>
                    "{prop.coverLetter}"
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {getStatusBadge(prop.status)}
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        Submitted {new Date(prop.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      {prop.status === "pending" && (
                        <button
                          onClick={() => handleWithdraw(prop._id)}
                          className="btn btn-outline"
                          style={{ padding: "6px 14px", fontSize: "12px", color: "#ef4444" }}
                        >
                          Withdraw
                        </button>
                      )}
                      <Link
                        to={`/jobs/${prop.job?._id || prop.job}`}
                        className="btn btn-outline"
                        style={{ padding: "6px 14px", fontSize: "12px" }}
                      >
                        View Project →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
