import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./Outsource.css";

const CATEGORIES = [
  "Document Translation",
  "Audio & Video Transcription",
  "Character Dubbing & Voiceover",
  "App & Game Localization",
  "Subtitling & Captions",
  "Simultaneous Interpretation",
];

const Outsource = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("form"); // "form" | "inquiries"

  // Form fields as requested by user (Clean empty state)
  const [formData, setFormData] = useState({
    companyName: "",
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    clientPhone: "",
    projectTitle: "",
    category: "Document Translation",
    projectDetails: "",
    payment: "",
    duration: "",
    deadline: "",
    attachmentUrl: "",
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const stored = localStorage.getItem("freeio_outsource_requests");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Attempt to fetch from backend
    fetch("/api/outsource")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setInquiries(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.companyName.trim()) {
      setErrorMessage("Please enter your Company Name.");
      return;
    }
    if (!formData.projectTitle.trim()) {
      setErrorMessage("Please enter a Project Title.");
      return;
    }
    if (!formData.projectDetails.trim()) {
      setErrorMessage("Please describe your Project Details & requirements.");
      return;
    }
    if (!formData.payment.trim()) {
      setErrorMessage("Please specify the Project Budget / Payment.");
      return;
    }
    if (!formData.duration.trim()) {
      setErrorMessage("Please specify the Expected Duration.");
      return;
    }
    if (!formData.deadline.trim()) {
      setErrorMessage("Please specify the Target Deadline.");
      return;
    }

    setLoading(true);

    const newRequest = {
      ...formData,
      _id: `OUT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "submitted",
    };

    try {
      // 1. Try sending to backend
      const res = await fetch("/api/outsource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      const created = data?.success && data?.data ? data.data : newRequest;
      const updatedList = [created, ...inquiries];
      setInquiries(updatedList);
      localStorage.setItem("freeio_outsource_requests", JSON.stringify(updatedList));

      setSuccessInfo(created);
    } catch (err) {
      // Fallback local save
      const updatedList = [newRequest, ...inquiries];
      setInquiries(updatedList);
      localStorage.setItem("freeio_outsource_requests", JSON.stringify(updatedList));
      setSuccessInfo(newRequest);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSuccessInfo(null);
    setFormData({
      companyName: "",
      clientName: user?.name || "",
      clientEmail: user?.email || "",
      clientPhone: "",
      projectTitle: "",
      category: "Document Translation",
      projectDetails: "",
      payment: "",
      duration: "",
      deadline: "",
      attachmentUrl: "",
    });
  };

  return (
    <div className="outsource-page-wrapper">
      <Navbar />

      {/* Hero Header */}
      <section className="outsource-hero-banner">
        <div className="outsource-hero-container">
          <div className="outsource-badge">
            <span>🏢 Freeio Enterprise Outsource Desk</span>
          </div>

          <h1 className="outsource-hero-title">
            Outsource Your Translation, Dubbing & Media Projects
          </h1>

          <p className="outsource-hero-subtitle">
            Submit your company project specifications. Freeio's Project Management team handles
            linguist vetting, milestone execution, and quality assurance — delivering end-to-end results.
          </p>

          <div className="outsource-highlights-row">
            <div className="outsource-highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Vetted Native Translators & Dubbing Artists</span>
            </div>
            <div className="outsource-highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Dedicated Freeio Project Manager</span>
            </div>
            <div className="outsource-highlight-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Milestone Escrow & On-Time SLA Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body Area */}
      <div className="outsource-body-container">
        {/* Navigation Tabs */}
        <div className="outsource-nav-tabs">
          <button
            type="button"
            className={`outsource-tab-btn ${activeTab === "form" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("form");
              setSuccessInfo(null);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Outsource a Project</span>
          </button>

          <button
            type="button"
            className={`outsource-tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
            onClick={() => setActiveTab("inquiries")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>My Outsource Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Tab 1: Submit Outsource Form */}
        {activeTab === "form" && (
          <div>
            {successInfo ? (
              <div className="outsource-success-card">
                <div className="outsource-success-icon">🎉</div>
                <h2 className="outsource-success-title">
                  Project Outsource Request Received!
                </h2>
                <div className="ref-code-chip">
                  Reference ID: {successInfo._id || "OUT-SUCCESS"}
                </div>
                <p className="outsource-success-text">
                  Thank you for submitting your project specifications for{" "}
                  <strong>{successInfo.companyName}</strong>. Our dedicated Project Management team
                  has logged your requirement. We are reviewing the scope and will contact you at{" "}
                  <strong>{successInfo.clientEmail || "your email"}</strong> within 2 hours with
                  talent proposals and milestone confirmation.
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab("inquiries")}
                  >
                    View Project Inquiries →
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleResetForm}
                  >
                    Submit Another Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="outsource-form-card">
                <div className="form-section-title">
                  <span>📋</span> Client Project Outsource Form
                </div>
                <p className="form-section-desc">
                  Please provide details about your company, project scope, budget, and deadline so we can assign the best team.
                </p>

                {errorMessage && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      border: "1px solid #fecaca",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Row 1: Company Name & Category */}
                  <div className="outsource-grid-2">
                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Company Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        className="outsource-input"
                        placeholder="e.g. Netflix, Duolingo, Sony, Media Studio"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                      <div className="outsource-hint">Enter your organization or business name</div>
                    </div>

                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Service Category <span className="req">*</span>
                      </label>
                      <select
                        name="category"
                        className="outsource-select"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="outsource-hint">Select the primary service discipline</div>
                    </div>
                  </div>

                  {/* Quick Category Chips */}
                  <div className="category-pills-row">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`category-pill ${formData.category === cat ? "selected" : ""}`}
                        onClick={() => setFormData({ ...formData, category: cat })}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Row 2: Client Contact Details */}
                  <div className="outsource-grid-2" style={{ marginTop: "16px" }}>
                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Contact Person Name <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        className="outsource-input"
                        placeholder="e.g. John Doe"
                        value={formData.clientName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Work Email Address <span className="req">*</span>
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        className="outsource-input"
                        placeholder="e.g. john@company.com"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 3: Phone & Project Title */}
                  <div className="outsource-grid-2">
                    <div className="outsource-form-group">
                      <label className="outsource-label">Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        name="clientPhone"
                        className="outsource-input"
                        placeholder="e.g. +91 98765 43210 or +1 (555) 019-2834"
                        value={formData.clientPhone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Project Title <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectTitle"
                        className="outsource-input"
                        placeholder="e.g. Multilingual RPG Game Localization (English to Japanese & German)"
                        value={formData.projectTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 4: Project Details */}
                  <div className="outsource-form-group">
                    <label className="outsource-label">
                      Project Details & Scope <span className="req">*</span>
                    </label>
                    <textarea
                      name="projectDetails"
                      rows={5}
                      className="outsource-textarea"
                      placeholder="Specify your project requirements in detail:
- Target language pairs (e.g. English → Spanish & French)
- Word count, audio length, or number of videos
- File format requirements (e.g. SRT, DOCX, WAV)
- Quality benchmarks and tone of voice guidelines..."
                      value={formData.projectDetails}
                      onChange={handleChange}
                      required
                    ></textarea>
                    <div className="outsource-hint">
                      Be as specific as possible so our PM team can accurately price and staff your project.
                    </div>
                  </div>

                  {/* Row 5: Payment, Duration, Deadline */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Payment / Budget <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        name="payment"
                        className="outsource-input"
                        placeholder="e.g. $2,500 or 1,50,000 INR"
                        value={formData.payment}
                        onChange={handleChange}
                        required
                      />
                      <div className="outsource-hint">Specify fixed budget or price range</div>
                    </div>

                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Project Duration <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        className="outsource-input"
                        placeholder="e.g. 2 Weeks, 1 Month, Ongoing"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                      <div className="outsource-hint">Expected turnaround timeframe</div>
                    </div>

                    <div className="outsource-form-group">
                      <label className="outsource-label">
                        Target Deadline <span className="req">*</span>
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        className="outsource-input"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                      />
                      <div className="outsource-hint">Final deliverables due date</div>
                    </div>
                  </div>

                  {/* Row 6: Attachment / Google Drive Link */}
                  <div className="outsource-form-group">
                    <label className="outsource-label">
                      Project Files or Specification Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="attachmentUrl"
                      className="outsource-input"
                      placeholder="https://drive.google.com/... or OneDrive / Dropbox link"
                      value={formData.attachmentUrl}
                      onChange={handleChange}
                    />
                    <div className="outsource-hint">
                      Paste a shareable link to project assets, scripts, or audio samples.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit-outsource"
                    disabled={loading}
                  >
                    {loading ? (
                      "Submitting Outsource Request..."
                    ) : (
                      <>
                        <span>Submit Outsource Project</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: View Inquiries */}
        {activeTab === "inquiries" && (
          <div className="inquiries-grid">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                Submitted Outsource Projects ({inquiries.length})
              </h2>
              <button
                onClick={() => {
                  setActiveTab("form");
                  handleResetForm();
                }}
                className="btn btn-primary"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                + Outsource New Project
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", background: "#ffffff", borderRadius: "16px", border: "1.5px dashed #cbd5e1", margin: "16px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>No Outsource Projects Submitted Yet</h3>
                <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "440px", margin: "6px auto 20px" }}>
                  You haven't submitted any outsourcing requests yet. Click below to fill in your company project details.
                </p>
                <button onClick={() => setActiveTab("form")} className="btn btn-primary">
                  Fill Outsource Project Form →
                </button>
              </div>
            ) : (
              inquiries.map((req) => (
                <div key={req._id} className="inquiry-card">
                  <div className="inquiry-header-row">
                    <div>
                      <div className="inquiry-company">{req.companyName}</div>
                      <h3 className="inquiry-title">{req.projectTitle}</h3>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Category: <strong>{req.category}</strong> • Submitted: {req.createdAt || "Recently"}
                      </div>
                    </div>

                    <span
                      className={`inquiry-status-badge ${
                        req.status === "assigned"
                          ? "assigned"
                          : req.status === "in_review"
                          ? "in_review"
                          : "submitted"
                      }`}
                    >
                      {req.status === "assigned"
                        ? "✓ Linguists Assigned"
                        : req.status === "in_review"
                        ? "⏳ Scope Under Review"
                        : "● Submitted to Admin"}
                    </span>
                  </div>

                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5", margin: 0 }}>
                    {req.projectDetails}
                  </p>

                  <div className="inquiry-meta-grid">
                    <div className="inquiry-meta-item">
                      <strong>Payment / Budget</strong>
                      <span>{req.payment}</span>
                    </div>
                    <div className="inquiry-meta-item">
                      <strong>Duration</strong>
                      <span>{req.duration}</span>
                    </div>
                    <div className="inquiry-meta-item">
                      <strong>Deadline</strong>
                      <span>{req.deadline}</span>
                    </div>
                    <div className="inquiry-meta-item">
                      <strong>Client Contact</strong>
                      <span>{req.clientName} ({req.clientEmail})</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Outsource;
