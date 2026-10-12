import React, { useEffect, useState } from "react";
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

const emptyForm = (user) => ({
  companyName: "",
  clientName: user?.name || "",
  clientEmail: user?.email || "",
  clientPhone: "",
  projectTitle: "",
  category: CATEGORIES[0],
  projectDetails: "",
  payment: "",
  duration: "",
  deadline: "",
  attachmentUrl: "",
});

export default function Outsource() {
  const { user, token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState(() => emptyForm(user));
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    setLoadingInquiries(true);
    fetch("/api/outsource", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not load outsource inquiries.");
        }
        setInquiries(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => setErrorMessage(error.message))
      .finally(() => setLoadingInquiries(false));
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/outsource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.message || "Could not submit your project request.");
      }

      setInquiries((current) => [data.data, ...current]);
      setSuccessInfo(data.data);
    } catch (error) {
      setErrorMessage(error.message || "Could not submit your project request.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessInfo(null);
    setErrorMessage("");
    setFormData(emptyForm(user));
  };

  return (
    <div className="outsource-page-wrapper">
      <Navbar />

      <section className="outsource-hero-banner">
        <div className="outsource-hero-container">
          <div className="outsource-badge"><span>Freeio Enterprise Outsource Desk</span></div>
          <h1 className="outsource-hero-title">Outsource Your Translation, Dubbing &amp; Media Projects</h1>
          <p className="outsource-hero-subtitle">
            Share your project scope, service category, budget, and timeline with the Freeio team.
          </p>
          <div className="outsource-highlights-row">
            <div className="outsource-highlight-item"><span>Translation and localization</span></div>
            <div className="outsource-highlight-item"><span>Transcription and subtitling</span></div>
            <div className="outsource-highlight-item"><span>Dubbing and voiceover</span></div>
          </div>
        </div>
      </section>

      <main className="outsource-body-container">
        <div className="outsource-nav-tabs">
          <button
            type="button"
            className={`outsource-tab-btn ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            Outsource a Project
          </button>
          <button
            type="button"
            className={`outsource-tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
            onClick={() => setActiveTab("inquiries")}
          >
            My Outsource Inquiries ({inquiries.length})
          </button>
        </div>

        {activeTab === "form" && (
          <section className="outsource-form-card">
            {successInfo ? (
              <div className="outsource-success-card">
                <h2 className="outsource-success-title">Project request submitted</h2>
                <div className="ref-code-chip">Reference ID: {successInfo._id}</div>
                <p className="outsource-success-text">
                  Your request for <strong>{successInfo.companyName}</strong> was saved. Reference it if you contact Freeio about this project.
                </p>
                <div className="outsource-form-actions">
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab("inquiries")}>
                    View inquiries
                  </button>
                  <button type="button" className="btn btn-outline" onClick={resetForm}>
                    Submit another project
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="form-section-title">Client Project Request</h2>
                <p className="form-section-desc">Provide accurate project details so the team can review your request.</p>
                {errorMessage && <div className="outsource-form-error" role="alert">{errorMessage}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="outsource-grid-2">
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="companyName">Company name *</label>
                      <input id="companyName" name="companyName" className="outsource-input" value={formData.companyName} onChange={handleChange} required />
                    </div>
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="category">Service category *</label>
                      <select id="category" name="category" className="outsource-select" value={formData.category} onChange={handleChange} required>
                        {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="outsource-grid-2">
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="clientName">Contact person *</label>
                      <input id="clientName" name="clientName" className="outsource-input" value={formData.clientName} onChange={handleChange} required />
                    </div>
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="clientEmail">Work email *</label>
                      <input id="clientEmail" name="clientEmail" type="email" className="outsource-input" value={formData.clientEmail} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="outsource-grid-2">
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="clientPhone">Phone</label>
                      <input id="clientPhone" name="clientPhone" type="tel" className="outsource-input" value={formData.clientPhone} onChange={handleChange} />
                    </div>
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="projectTitle">Project title *</label>
                      <input id="projectTitle" name="projectTitle" className="outsource-input" value={formData.projectTitle} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="outsource-form-group">
                    <label className="outsource-label" htmlFor="projectDetails">Project details *</label>
                    <textarea id="projectDetails" name="projectDetails" rows={5} className="outsource-textarea" value={formData.projectDetails} onChange={handleChange} required />
                  </div>

                  <div className="outsource-grid-2">
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="payment">Budget *</label>
                      <input id="payment" name="payment" className="outsource-input" value={formData.payment} onChange={handleChange} required />
                    </div>
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="duration">Duration *</label>
                      <input id="duration" name="duration" className="outsource-input" value={formData.duration} onChange={handleChange} required />
                    </div>
                    <div className="outsource-form-group">
                      <label className="outsource-label" htmlFor="deadline">Target deadline *</label>
                      <input id="deadline" name="deadline" type="date" className="outsource-input" value={formData.deadline} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="outsource-form-group">
                    <label className="outsource-label" htmlFor="attachmentUrl">Project files link</label>
                    <input id="attachmentUrl" name="attachmentUrl" type="url" className="outsource-input" value={formData.attachmentUrl} onChange={handleChange} />
                  </div>

                  <button type="submit" className="btn-submit-outsource" disabled={loading}>
                    {loading ? "Submitting request..." : "Submit project request"}
                  </button>
                </form>
              </>
            )}
          </section>
        )}

        {activeTab === "inquiries" && (
          <section className="inquiries-grid">
            <div className="inquiry-list-heading">
              <h2>Submitted project requests</h2>
              <button type="button" className="btn btn-primary" onClick={() => setActiveTab("form")}>
                New project request
              </button>
            </div>
            {!isAuthenticated ? (
              <div className="no-inquiries-state">
                <p>Log in with the email used on your request to view saved inquiries.</p>
                <Link to="/login" className="btn btn-primary">Log in</Link>
              </div>
            ) : loadingInquiries ? (
              <div className="no-inquiries-state">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="no-inquiries-state">No project requests found for this account.</div>
            ) : inquiries.map((inquiry) => (
              <article key={inquiry._id} className="inquiry-card">
                <div className="inquiry-header-row">
                  <div>
                    <div className="inquiry-company">{inquiry.companyName}</div>
                    <h3 className="inquiry-title">{inquiry.projectTitle}</h3>
                    <div className="inquiry-meta-line">{inquiry.category} · {new Date(inquiry.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="inquiry-status-badge submitted">{inquiry.status}</span>
                </div>
                <p className="inquiry-description">{inquiry.projectDetails}</p>
                <div className="inquiry-meta-grid">
                  <div className="inquiry-meta-item"><strong>Budget</strong><span>{inquiry.payment}</span></div>
                  <div className="inquiry-meta-item"><strong>Duration</strong><span>{inquiry.duration}</span></div>
                  <div className="inquiry-meta-item"><strong>Deadline</strong><span>{inquiry.deadline}</span></div>
                  <div className="inquiry-meta-item"><strong>Contact</strong><span>{inquiry.clientName} ({inquiry.clientEmail})</span></div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
