import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";

const popularTags = [
  "Spanish", "French", "German", "Japanese", "Mandarin", "Arabic", "Portuguese",
  "Legal Translation", "Medical Translation", "Technical Translation",
  "Audio Transcription", "Video Transcription", "Timestamps",
  "Game Localization", "App Localization", "Voice Acting", "Character Dubbing",
  "Subtitles (SRT)", "Pro Tools", "Audio Sync"
];

export default function CreateJob() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "Translation",
    description: "",
    skills: ["Spanish", "Translation"],
    budget: "",
    budgetType: "fixed",
    deadline: "",
  });

  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleCustomTagKeyDown = (e) => {
    if (e.key === "Enter" && customTag.trim()) {
      e.preventDefault();
      addSkill(customTag.trim());
      setCustomTag("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isAuthenticated || !token) {
      setErrorMessage("Please log in as a Client to post a job.");
      return;
    }

    if (!formData.title.trim()) {
      setErrorMessage("Please provide a project title.");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage("Please provide a project description.");
      return;
    }

    if (formData.skills.length === 0) {
      setErrorMessage("Please add at least one required language or skill.");
      return;
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      setErrorMessage("Please specify a valid budget amount.");
      return;
    }

    if (!formData.deadline) {
      setErrorMessage("Please select a project deadline.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          skills: [formData.category, ...formData.skills],
          budget: Number(formData.budget),
          budgetType: formData.budgetType,
          deadline: formData.deadline,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create job posting.");
      }

      setSuccessMessage("Job posted successfully! Redirecting...");
      setTimeout(() => {
        if (data.data && data.data._id) {
          navigate(`/jobs/${data.data._id}`);
        } else {
          navigate("/client/dashboard");
        }
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || "Network error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <main style={{ padding: "40px 0 80px" }}>
        <div className="container" style={{ maxWidth: "840px" }}>
          {/* Header */}
          <div style={{ marginBottom: "30px" }}>
            <Link to="/client/dashboard" style={{ fontSize: "13.5px", color: "#64748b", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "12px", fontWeight: "600" }}>
              ← Back to Client Dashboard
            </Link>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", letterSpacing: "-0.8px" }}>
              Post a New Project
            </h1>
            <p style={{ color: "#64748b", marginTop: "6px", fontSize: "15px" }}>
              Reach certified translators, voiceover dubbing artists, transcribers, and localization specialists worldwide.
            </p>
          </div>

          {!isAuthenticated && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "16px 20px", borderRadius: "12px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#92400e", fontSize: "14px" }}>
                ⚠️ You need to be logged in as a Client to publish this job post.
              </span>
              <Link to="/login" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "13px" }}>
                Log In Now
              </Link>
            </div>
          )}

          {errorMessage && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "14px 18px", borderRadius: "10px", color: "#dc2626", marginBottom: "20px", fontSize: "14px" }}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "14px 18px", borderRadius: "10px", color: "#059669", marginBottom: "20px", fontSize: "14px" }}>
              ✓ {successMessage}
            </div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "36px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Title */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Spanish to English Medical Report Translation or Anime Dubbing in Japanese"
                value={formData.title}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14.5px",
                  outline: "none",
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                Service Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14.5px",
                  background: "#ffffff",
                  outline: "none",
                }}
              >
                <option value="Translation">Translation (Documents, Legal, Medical, Technical)</option>
                <option value="Transcription">Transcription (Audio & Video to text)</option>
                <option value="Localization">Localization (Games, Apps, Websites)</option>
                <option value="Dubbing & Voiceover">Dubbing & Voiceover (Character, Narration, Commercials)</option>
                <option value="Subtitling">Subtitling & Closed Captions</option>
                <option value="Interpretation">Live Interpretation (Simultaneous / Consecutive)</option>
                <option value="Web Development">Web & App Development</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                Project Description & Guidelines *
              </label>
              <textarea
                name="description"
                rows="6"
                placeholder="Describe your requirements, word count or audio duration, tone, formatting requirements, and any source reference files..."
                value={formData.description}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  lineHeight: "1.5",
                  outline: "none",
                }}
              />
            </div>

            {/* Skills & Target Languages */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                Required Languages & Skills *
              </label>

              {/* Selected Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#eff6ff",
                      color: "#2563eb",
                      border: "1px solid #bfdbfe",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{ color: "#2563eb", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Custom Input */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
                <input
                  type="text"
                  placeholder="Type a language or skill and press Add or Enter..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={handleCustomTagKeyDown}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customTag.trim()) {
                      addSkill(customTag.trim());
                      setCustomTag("");
                    }
                  }}
                  className="btn btn-outline"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  + Add
                </button>
              </div>

              {/* Quick suggestions */}
              <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "6px" }}>
                Popular language pairs & skills:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {popularTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addSkill(tag)}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      padding: "3px 9px",
                      borderRadius: "4px",
                      fontSize: "11.5px",
                      color: "#475569",
                      cursor: "pointer",
                    }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Type */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                  Budget Amount (USD $) *
                </label>
                <input
                  type="number"
                  name="budget"
                  placeholder="e.g. 500"
                  min="5"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14.5px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                  Budget Type *
                </label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14.5px",
                    background: "#ffffff",
                    outline: "none",
                  }}
                >
                  <option value="fixed">Fixed Price (Milestone delivery)</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
                Target Project Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14.5px",
                  outline: "none",
                }}
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Link to="/client/dashboard" className="btn btn-outline" style={{ padding: "12px 24px" }}>
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ padding: "12px 32px", fontSize: "15px" }}
              >
                {loading ? "Publishing Project..." : "Publish Project →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
