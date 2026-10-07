import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

const mockFallbackJobs = {
  "1": {
    _id: "1",
    title: "Spanish to English Medical & Legal Document Translation",
    description: "We require a certified translator to translate medical clinical research summaries and consent documents from Castilian Spanish to US English. Requires familiarity with medical terminology, HIPAA standards, and accurate formatting. Source files are provided in DOCX (approx 8,500 words).",
    skills: ["Translation", "Spanish", "English", "Medical Translation", "Legal Translation"],
    budget: 650,
    budgetType: "fixed",
    deadline: "2026-10-15T00:00:00.000Z",
    status: "open",
    client: {
      name: "BioHealth Global Research",
      email: "research@biohealth.org",
      avatar: "",
    },
    createdAt: "2026-09-24T10:00:00.000Z",
  },
  "2": {
    _id: "2",
    title: "Multilingual RPG Game Localization (English to Japanese & German)",
    description: "Seeking experienced video game localizers to adapt UI dialogue, character lore, skill trees, and quest logs for a dark fantasy RPG coming to Steam and Nintendo Switch. Must preserve emotional tone, character nuance, and fantasy idioms.",
    skills: ["Localization", "Japanese", "German", "Game Localization", "Creative Writing"],
    budget: 2400,
    budgetType: "fixed",
    deadline: "2026-10-30T00:00:00.000Z",
    status: "open",
    client: {
      name: "Pixel Forge Interactive",
      email: "producers@pixelforge.io",
      avatar: "",
    },
    createdAt: "2026-09-25T14:30:00.000Z",
  },
};

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Proposal submission state for freelancers
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("5");
  const [coverLetter, setCoverLetter] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalError, setProposalError] = useState("");

  // Proposals received for job owner (client)
  const [clientProposals, setClientProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setJob(data.data);
        if (data.data.budget) {
          setBidAmount(String(data.data.budget));
        }

        // If client is logged in and owns this job, fetch proposals
        const clientId = data.data.client?._id || data.data.client;
        if (user && token && (user._id === clientId || user.userId === clientId)) {
          fetchJobProposals(data.data._id);
        }
      } else {
        // Fallback to sample mock job if not found in db
        const fallback = mockFallbackJobs[id] || {
          _id: id,
          title: "Translation & Audio Dubbing Project",
          description: "High-priority language localization project requiring native fluency, prompt delivery, and studio-grade audio recording.",
          skills: ["Translation", "Dubbing", "Voice Acting"],
          budget: 500,
          budgetType: "fixed",
          deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
          status: "open",
          client: { name: "Global Media Studio", email: "contact@globalmedia.com" },
        };
        setJob(fallback);
        setBidAmount(String(fallback.budget));
      }
    } catch (err) {
      const fallback = mockFallbackJobs[id] || mockFallbackJobs["1"];
      setJob(fallback);
      setBidAmount(String(fallback.budget));
    } finally {
      setLoading(false);
    }
  };

  const fetchJobProposals = async (jobId) => {
    if (!token) return;
    setLoadingProposals(true);
    try {
      const res = await fetch(`/api/proposals/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setClientProposals(data.data);
      }
    } catch (err) {
      console.error("Failed to load proposals", err);
    } finally {
      setLoadingProposals(false);
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setProposalError("");

    if (!isAuthenticated || !token) {
      setProposalError("Please log in as a Freelancer to submit a proposal.");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      setProposalError("Please enter a valid bid amount.");
      return;
    }

    if (!estimatedDays || Number(estimatedDays) <= 0) {
      setProposalError("Please enter your estimated completion days.");
      return;
    }

    if (!coverLetter.trim()) {
      setProposalError("Please write a cover letter outlining your experience and approach.");
      return;
    }

    setSubmittingProposal(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job: job._id,
          bidAmount: Number(bidAmount),
          estimatedDays: Number(estimatedDays),
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit proposal.");
      }

      setProposalSuccess(true);
    } catch (err) {
      setProposalError(err.message || "Failed to submit proposal. Please check server.");
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Proposal accepted! Project is now active.");
        fetchJobProposals(job._id);
        fetchJobDetails();
      } else {
        alert(data.message || "Failed to accept proposal");
      }
    } catch (err) {
      alert("Error accepting proposal");
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Proposal rejected.");
        fetchJobProposals(job._id);
      } else {
        alert(data.message || "Failed to reject proposal");
      }
    } catch (err) {
      alert("Error rejecting proposal");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar />
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2>Loading Project Details...</h2>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Navbar />
        <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h2>Project Not Found</h2>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const clientId = job.client?._id || job.client;
  const isOwner = user && token && (user._id === clientId || user.userId === clientId);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <main style={{ padding: "40px 0 80px" }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px" }}>
            <Link to="/jobs" style={{ fontSize: "13.5px", color: "#64748b", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              ← Back to All Jobs
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: "36px", alignItems: "start" }}>
            {/* Left Column: Job Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Job Header Card */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "36px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <span className="badge badge-blue" style={{ marginBottom: "10px" }}>
                      {job.skills && job.skills[0] ? job.skills[0] : "Translation"}
                    </span>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", lineHeight: "1.25" }}>
                      {job.title}
                    </h1>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: "26px", fontWeight: "800", color: "#10b981", display: "block" }}>
                      ${job.budget}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>
                      {job.budgetType === "hourly" ? "Hourly Rate" : "Fixed Price"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: "16px", marginTop: "12px" }}>
                  <span>Status: <strong style={{ color: job.status === "open" ? "#10b981" : "#2563eb", textTransform: "uppercase" }}>{job.status}</strong></span>
                  <span>•</span>
                  <span>Target Deadline: <strong>{new Date(job.deadline).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Job Description Card */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "36px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
                  Project Description & Specifications
                </h3>
                <p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                  {job.description}
                </p>

                <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginTop: "28px", marginBottom: "12px" }}>
                  Required Language Pairs & Skills
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {job.skills && job.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Client Owner: Proposals Management Area */}
              {isOwner && (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid #bfdbfe",
                    borderRadius: "16px",
                    padding: "36px",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.05)",
                  }}
                >
                  <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
                    Proposals Received ({clientProposals.length})
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                    Review applicant bids, cover letters, and accept the best talent for this project.
                  </p>

                  {loadingProposals ? (
                    <p style={{ color: "#64748b" }}>Loading proposals...</p>
                  ) : clientProposals.length === 0 ? (
                    <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "10px", textAlign: "center", color: "#64748b" }}>
                      No proposals submitted yet for this project.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {clientProposals.map((prop) => (
                        <div
                          key={prop._id}
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "20px",
                            background: "#fcfdfe",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                              <strong style={{ fontSize: "16px", color: "#111827" }}>
                                {prop.freelancer?.name || "Freelancer"}
                              </strong>
                              <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>
                                {prop.freelancer?.email} • {prop.freelancer?.location || "Global"}
                              </span>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: "18px", fontWeight: "800", color: "#10b981" }}>
                                ${prop.bidAmount}
                              </span>
                              <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>
                                Delivery in {prop.estimatedDays} days
                              </span>
                            </div>
                          </div>

                          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5", marginBottom: "14px" }}>
                            "{prop.coverLetter}"
                          </p>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                color: prop.status === "accepted" ? "#10b981" : prop.status === "rejected" ? "#ef4444" : "#f59e0b",
                              }}
                            >
                              Status: {prop.status}
                            </span>

                            {prop.status === "pending" && (
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  onClick={() => handleRejectProposal(prop._id)}
                                  className="btn btn-outline"
                                  style={{ padding: "6px 14px", fontSize: "12px", color: "#ef4444" }}
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleAcceptProposal(prop._id)}
                                  className="btn btn-primary"
                                  style={{ padding: "6px 14px", fontSize: "12px" }}
                                >
                                  Accept & Hire →
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Proposal Submission / Client Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Proposal Form for Freelancers */}
              {!isOwner && (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
                    Submit a Proposal
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#64748b", marginBottom: "20px" }}>
                    Pitch your qualifications, delivery timeline, and proposed rate.
                  </p>

                  {proposalSuccess ? (
                    <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                      <span style={{ fontSize: "28px" }}>🎉</span>
                      <h4 style={{ color: "#065f46", fontSize: "16px", fontWeight: "700", marginTop: "8px" }}>
                        Proposal Submitted!
                      </h4>
                      <p style={{ color: "#047857", fontSize: "13.5px", marginTop: "4px" }}>
                        The client has received your bid and cover letter. Track updates in your Proposals tab.
                      </p>
                      <Link to="/freelancer/proposals" className="btn btn-primary" style={{ marginTop: "16px", fontSize: "13px" }}>
                        View My Proposals →
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleProposalSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      {proposalError && (
                        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "12px", borderRadius: "8px", color: "#dc2626", fontSize: "13px" }}>
                          {proposalError}
                        </div>
                      )}

                      {!isAuthenticated && (
                        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "8px", color: "#1e40af", fontSize: "12.5px" }}>
                          You must be logged in as a <strong>Freelancer</strong> to submit.{" "}
                          <Link to="/login" style={{ textDecoration: "underline", fontWeight: "700" }}>
                            Log In here
                          </Link>.
                        </div>
                      )}

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                          Your Bid Amount (USD $)
                        </label>
                        <input
                          type="number"
                          min="5"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                        <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", display: "block" }}>
                          Client budget: ${job.budget}
                        </span>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                          Estimated Delivery (Days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="180"
                          value={estimatedDays}
                          onChange={(e) => setEstimatedDays(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#374151", marginBottom: "6px" }}>
                          Cover Letter / Pitch
                        </label>
                        <textarea
                          rows="5"
                          placeholder="Describe your native language experience, voice setup, past projects, or quick turnaround guarantees..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "13.5px",
                            fontFamily: "inherit",
                            lineHeight: "1.45",
                            outline: "none",
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submittingProposal}
                        style={{ width: "100%", padding: "12px", fontSize: "15px", fontWeight: "700" }}
                      >
                        {submittingProposal ? "Submitting..." : "Send Proposal Now →"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Client Info Card */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "28px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "14px" }}>
                  About the Client
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontSize: "18px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {job.client?.name ? job.client.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <strong style={{ fontSize: "15px", color: "#111827", display: "block" }}>
                      {job.client?.name || "Verified Client"}
                    </strong>
                    <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>
                      ● Payment Method Verified
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#64748b" }}>
                  <div>🛡️ 100% Escrow Milestone Protection</div>
                  <div>⚡ Fast Communication Guarantee</div>
                  <div>📍 Location: {job.client?.location || "Verified International Client"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
