import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function MyJobs() {
  const { user, token, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientJobs();
  }, [user]);

  const fetchClientJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        // Filter jobs posted by this client if user ID matches
        const myJobs = data.data.filter((j) => {
          const clientId = j.client?._id || j.client;
          return user && (clientId === user._id || clientId === user.userId);
        });
        setJobs(myJobs.length > 0 ? myJobs : data.data.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to load client jobs", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <main style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: "8px" }}>
                Client Management
              </span>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>
                My Posted Projects
              </h1>
              <p style={{ color: "#64748b", fontSize: "14.5px" }}>
                Manage your active job postings and review proposals from qualified talent.
              </p>
            </div>

            <Link to="/client/create" className="btn btn-primary">
              + Post a New Project
            </Link>
          </div>

          {loading ? (
            <p style={{ color: "#64748b" }}>Loading your projects...</p>
          ) : jobs.length === 0 ? (
            <div style={{ background: "#ffffff", padding: "48px 24px", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "36px" }}>📝</span>
              <h3 style={{ fontSize: "18px", color: "#111827", marginTop: "12px", marginBottom: "6px" }}>
                No Projects Posted Yet
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
                Post your first translation, transcription, or dubbing project to start receiving bids.
              </p>
              <Link to="/client/create" className="btn btn-primary">
                Post a Project Now →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <span className="badge badge-blue" style={{ marginBottom: "6px" }}>
                      {job.skills && job.skills[0] ? job.skills[0] : "Project"}
                    </span>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "4px 0" }}>
                      <Link to={`/jobs/${job._id}`} style={{ color: "inherit" }}>
                        {job.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: "13.5px", color: "#64748b", lineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {job.description}
                    </p>
                  </div>

                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "20px" }}>
                    <div>
                      <span style={{ fontSize: "18px", fontWeight: "800", color: "#10b981", display: "block" }}>
                        ${job.budget}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Status: <strong style={{ color: "#2563eb", textTransform: "uppercase" }}>{job.status}</strong>
                      </span>
                    </div>

                    <Link to={`/jobs/${job._id}`} className="btn btn-outline" style={{ padding: "8px 18px", fontSize: "13px" }}>
                      View & Manage Proposals →
                    </Link>
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
