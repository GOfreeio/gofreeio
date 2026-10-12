import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateProfile } = useAuth();
  const isNewUser = searchParams.get("new") === "true";

  // Clean profile state (Starts empty for user to fill now or later)
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Hours per week (Starts empty)
  const [hoursPerWeek, setHoursPerWeek] = useState(user?.hoursPerWeek || "");
  const [customHours, setCustomHours] = useState("");

  // LinkedIn Account (Starts empty)
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");

  // Education list (Starts empty)
  const [education, setEducation] = useState(
    user?.education && Array.isArray(user.education) ? user.education : []
  );
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({
    degree: "",
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  // Video instruction / introduction (Starts empty)
  const [videoUrl, setVideoUrl] = useState(user?.videoInstruction?.url || "");

  // Certifications list (Starts empty)
  const [certifications, setCertifications] = useState(
    user?.certifications && Array.isArray(user.certifications) ? user.certifications : []
  );
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    issueYear: "",
    credentialUrl: "",
  });

  // Government Issued ID Verification (Aadhaar & PAN) - "Appear on camera"
  const [idType, setIdType] = useState(user?.govIdVerification?.idType || "aadhaar");
  const [idNumber, setIdNumber] = useState(user?.govIdVerification?.idNumber || "");
  const [idSnapshot, setIdSnapshot] = useState(user?.govIdVerification?.snapshot || "");
  const [idStatus, setIdStatus] = useState(user?.govIdVerification?.status || "unverified");

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Billing modal state ("just for show (in progress)")
  const [showBillingModal, setShowBillingModal] = useState(false);

  // Save status & messages
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.title) setTitle(user.title);
      if (user.bio) setBio(user.bio);
      if (user.avatar) setAvatar(user.avatar);
      if (user.location) setLocation(user.location);
      if (user.hoursPerWeek) setHoursPerWeek(user.hoursPerWeek);
      if (user.linkedinUrl) setLinkedinUrl(user.linkedinUrl);
      if (user.education && user.education.length > 0) setEducation(user.education);
      if (user.certifications && user.certifications.length > 0) setCertifications(user.certifications);
      if (user.videoInstruction?.url) setVideoUrl(user.videoInstruction.url);
      if (user.govIdVerification?.idType) setIdType(user.govIdVerification.idType);
      if (user.govIdVerification?.idNumber) setIdNumber(user.govIdVerification.idNumber);
      if (user.govIdVerification?.snapshot) setIdSnapshot(user.govIdVerification.snapshot);
      if (user.govIdVerification?.status) setIdStatus(user.govIdVerification.status);
    }
  }, [user]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Calculate profile strength
  const calculateStrength = () => {
    let score = 0;
    if (avatar) score += 15;
    if (education.length > 0) score += 15;
    if (videoUrl) score += 15;
    if (certifications.length > 0) score += 15;
    if (linkedinUrl) score += 15;
    if (hoursPerWeek) score += 10;
    return Math.min(score, 100);
  };

  const strength = calculateStrength();

  // Handle avatar upload from local file
  const handleAvatarFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Choose an image file for your profile photo.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage("Choose a profile photo smaller than 10 MB.");
      e.target.value = "";
      return;
    }

    try {
      const image = await createImageBitmap(file);
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();

      let quality = 0.78;
      let blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      while (blob && blob.size > 75 * 1024 && quality > 0.4) {
        quality -= 0.1;
        blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      }

      if (!blob || blob.size > 90 * 1024) {
        throw new Error("This image could not be compressed enough. Choose a smaller image.");
      }

      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(blob);
      setStatusMessage("");
    } catch (error) {
      setStatusMessage(error.message || "Could not load this image. Try another file.");
    } finally {
      e.target.value = "";
    }
  };

  // Camera handling for ID verification ("Appear on camera")
  const startCamera = async () => {
    setCameraError("");
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera access was blocked or is unavailable. Please grant browser camera permissions or upload an ID photo below."
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureIdSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");

      // Draw mirrored image
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add security watermark
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
      ctx.fillRect(10, canvas.height - 35, 340, 25);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`FREEIO KYC • ${idType.toUpperCase()} CARD • ${new Date().toLocaleDateString()}`, 18, canvas.height - 18);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setIdSnapshot(dataUrl);
      setIdStatus("pending");
      stopCamera();
    }
  };

  const handleIdFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdSnapshot(reader.result);
        setIdStatus("pending");
      };
      reader.readAsDataURL(file);
    }
  };

  // Add education entry
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree.trim() || !newEdu.school.trim()) return;
    setEducation([...education, { ...newEdu }]);
    setNewEdu({ degree: "", school: "", fieldOfStudy: "", startYear: "", endYear: "" });
    setShowAddEdu(false);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Add certification entry
  const handleAddCertification = (e) => {
    e.preventDefault();
    if (!newCert.name.trim() || !newCert.issuer.trim()) return;
    setCertifications([...certifications, { ...newCert }]);
    setNewCert({ name: "", issuer: "", issueYear: "", credentialUrl: "" });
    setShowAddCert(false);
  };

  const handleRemoveCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setSaving(true);
    setStatusMessage("");

    const updates = {
      name,
      title,
      avatar,
      bio,
      location,
      hoursPerWeek: customHours ? `${customHours} hrs/week` : hoursPerWeek,
      linkedinUrl,
      education,
      certifications,
      videoInstruction: {
        url: videoUrl,
        title: "Video Introduction",
      },
    };

    try {
      const res = await updateProfile(updates);
      if (res.success) {
        setStatusMessage("Profile saved successfully.");
        setTimeout(() => setStatusMessage(""), 4000);
      } else {
        setStatusMessage(res.error || "Profile could not be saved. Please try again.");
      }
    } catch (err) {
      setStatusMessage(err.message || "Profile could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to parse embeddable video URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      <div className="profile-container">
        {/* =================================================================
            "late user can fill the profile later but imp hope you understand"
            Prominent Notice Banner
            ================================================================= */}
        <div className="fill-later-banner">
          <div className="banner-left">
            <div>
              <div className="banner-title">
                {isNewUser ? "Welcome to Freeio! Setup your profile now or later" : "Your Freelancer Profile Setup"}
              </div>
              <div className="banner-text">
                You can fill out your profile details now, or skip and complete it later anytime at your convenience.
                Save your details to keep your profile current and give clients a clear picture of your experience.
              </div>
            </div>
          </div>

          <div className="banner-actions">
            <Link
              to={user?.role === "client" ? "/client/dashboard" : "/freelancer/dashboard"}
              className="btn-fill-later"
            >
              <span>Fill Later (Dashboard)</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <button
              onClick={handleSaveProfile}
              className="btn-save-top"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            style={{
              padding: "14px 20px",
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              borderRadius: "12px",
              marginBottom: "24px",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Profile Strength Progress Meter */}
        <div className="profile-strength-card">
          <div className="strength-header">
            <span className="strength-title">
              <span>Profile Strength:</span>
              <span style={{ color: strength > 70 ? "#10b981" : "#f59e0b" }}>
                {strength >= 80 ? "Profile Complete" : strength >= 50 ? "Profile In Progress" : "Getting Started"}
              </span>
            </span>
            <span className="strength-percent">{strength}% Completed</span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${strength}%` }}></div>
          </div>

          <div className="strength-checklist">
            <span className={`strength-chip ${avatar ? "done" : "pending"}`}>
              {avatar ? "✓" : "○"} Profile Picture
            </span>
            <span className={`strength-chip ${education.length > 0 ? "done" : "pending"}`}>
              {education.length > 0 ? "✓" : "○"} Education
            </span>
            <span className={`strength-chip ${videoUrl ? "done" : "pending"}`}>
              {videoUrl ? "✓" : "○"} Video Introduction
            </span>
            <span className={`strength-chip ${certifications.length > 0 ? "done" : "pending"}`}>
              {certifications.length > 0 ? "✓" : "○"} Certifications
            </span>
            <span className={`strength-chip ${linkedinUrl ? "done" : "pending"}`}>
              {linkedinUrl ? "✓" : "○"} LinkedIn Account
            </span>
            <span className={`strength-chip ${hoursPerWeek ? "done" : "pending"}`}>
              {hoursPerWeek ? "✓" : "○"} Hours per Week
            </span>
          </div>
        </div>

        {/* Main Grid: Left Column (Photo, Hours, LinkedIn) & Right Column (Education, Video, Certs, ID, Billing) */}
        <div className="profile-main-grid">
          {/* LEFT SIDEBAR: Photo & Quick Meta */}
          <div className="profile-left-col">
            {/* 1. Profile Picture Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">
                  Profile Picture
                </h3>
                <span className="badge badge-green" style={{ textTransform: "capitalize" }}>
                  {user?.role || "Freelancer"}
                </span>
              </div>

              <div className="avatar-preview-box">
                <div className="avatar-wrapper-circle">
                  {avatar ? (
                    <img src={avatar} alt="Profile Avatar" className="avatar-img-view" />
                  ) : (
                    <div className="avatar-fallback-initials">
                      {name ? name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>

                <div className="avatar-action-btns">
                  <label className="btn-upload-avatar">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarFile}
                    />
                  </label>
                  {avatar && (
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => setAvatar("")}
                    >
                      Remove
                    </button>
                  )}
                </div>

              </div>

              <div className="form-field-group">
                <label className="field-label">Full Name</label>
                <input
                  type="text"
                  className="field-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Professional Title</label>
                <input
                  type="text"
                  className="field-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Certified Spanish Translator & Subtitler"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">Location</label>
                <input
                  type="text"
                  className="field-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, India or Remote"
                />
              </div>

              <div className="form-field-group">
                <label className="field-label">About / Bio</label>
                <textarea
                  className="field-textarea"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your linguistic skills, language pairs, and experience..."
                />
              </div>
            </div>

            {/* 2. Hours Per Week Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">
                  Hours Per Week
                </h3>
              </div>
              <p className="profile-card-subtitle" style={{ marginBottom: "16px" }}>
                Select your weekly project availability for clients.
              </p>

              <div className="hours-options-grid" style={{ gridTemplateColumns: "1fr" }}>
                {[
                  {
                    id: "More than 30 hrs/week",
                    title: "More than 30 hrs/week",
                    desc: "Full-time project availability",
                  },
                  {
                    id: "Less than 30 hrs/week",
                    title: "Less than 30 hrs/week",
                    desc: "Part-time or secondary projects",
                  },
                  {
                    id: "As needed / Open to offers",
                    title: "As needed / Open to offers",
                    desc: "Flexible, freelance project basis",
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    className={`hours-option-card ${hoursPerWeek === opt.id ? "selected" : ""}`}
                    onClick={() => {
                      setHoursPerWeek(opt.id);
                      setCustomHours("");
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <input
                      type="radio"
                      name="hours"
                      checked={hoursPerWeek === opt.id && !customHours}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="hours-option-title">{opt.title}</div>
                      <div className="hours-option-desc">{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-field-group" style={{ marginTop: "12px" }}>
                <label className="field-label" style={{ fontSize: "12.5px" }}>
                  Or enter custom hours:
                </label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. 20 hours/week"
                  value={customHours}
                  onChange={(e) => {
                    setCustomHours(e.target.value);
                    if (e.target.value) setHoursPerWeek(`${e.target.value} hrs/week`);
                  }}
                />
              </div>
            </div>

            {/* 3. LinkedIn Account Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn Account</span>
                </h3>
              </div>
              <p className="profile-card-subtitle" style={{ marginBottom: "14px" }}>
                Connect your professional profile to verify your experience.
              </p>

              <div className="linkedin-input-wrapper">
                <span className="linkedin-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                  </svg>
                </span>
                <input
                  type="url"
                  className="field-input"
                  style={{ paddingLeft: "42px" }}
                  placeholder="https://www.linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              {linkedinUrl && (
                <div className="linkedin-connected-badge">
                  <span>✓ Connected:</span>
                  <a
                    href={linkedinUrl.startsWith("http") ? linkedinUrl : `https://${linkedinUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#16a34a", textDecoration: "underline" }}
                  >
                    View Public Profile ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Education, Video Intro, Certifications, Govt ID, Billing */}
          <div className="profile-right-col">
            {/* 4. Education Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div>
                  <h3 className="profile-card-title">
                    Education
                  </h3>
                  <div className="profile-card-subtitle">
                    Add your university degrees, diplomas, or linguistic qualifications.
                  </div>
                </div>

                {!showAddEdu && (
                  <button
                    type="button"
                    className="btn-add-secondary"
                    onClick={() => setShowAddEdu(true)}
                  >
                    + Add Education
                  </button>
                )}
              </div>

              {education.length > 0 ? (
                <div className="education-items-list">
                  {education.map((item, index) => (
                    <div key={index} className="education-item-card">
                      <div className="edu-item-info">
                        <h4>{item.degree}</h4>
                        <p>
                          {item.school} • {item.fieldOfStudy}
                        </p>
                        <span>
                          {item.startYear} - {item.endYear || "Present"}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#64748b", fontSize: "14px", fontStyle: "italic", marginBottom: "14px" }}>
                  No education entries added yet. (You can fill this later)
                </div>
              )}

              {/* Add Education Form */}
              {showAddEdu && (
                <form onSubmit={handleAddEducation} className="add-form-inline">
                  <div className="form-inline-grid">
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>Degree</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. Master of Arts"
                        value={newEdu.degree}
                        onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>School / University</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. Cambridge University"
                        value={newEdu.school}
                        onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field-group" style={{ marginBottom: "10px" }}>
                    <label className="field-label" style={{ fontSize: "12.5px" }}>Field of Study</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Linguistics, Spanish Literature"
                      value={newEdu.fieldOfStudy}
                      onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                    />
                  </div>

                  <div className="form-inline-grid">
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>Start Year</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. 2018"
                        value={newEdu.startYear}
                        onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>End / Graduation Year</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. 2022"
                        value={newEdu.endYear}
                        onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
                      Save Degree
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: "8px 14px", fontSize: "13px" }}
                      onClick={() => setShowAddEdu(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 5. Video Instruction / Introduction Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div>
                  <h3 className="profile-card-title">
                    Video Instruction / Introduction
                  </h3>
                  <div className="profile-card-subtitle">
                    Record or link a 60-second video introducing yourself, your accents, and your voice.
                  </div>
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Video Link (YouTube, Vimeo, or Loom)</label>
                <input
                  type="url"
                  className="field-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              {/* Video Player Preview */}
              {embedUrl && (
                <div className="video-preview-container">
                  <iframe
                    src={embedUrl}
                    title="Video Introduction Preview"
                    className="video-embed-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="video-guidance-card">
                <strong>Profile guidance:</strong> Mention your native language, regional dialect,
                audio recording equipment, and previous translation or dubbing projects to stand out to clients.
              </div>
            </div>

            {/* 6. Certification Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div>
                  <h3 className="profile-card-title">
                    Certifications
                  </h3>
                  <div className="profile-card-subtitle">
                    Showcase credentials and specialized translation certificates.
                  </div>
                </div>

                {!showAddCert && (
                  <button
                    type="button"
                    className="btn-add-secondary"
                    onClick={() => setShowAddCert(true)}
                  >
                    + Add Certificate
                  </button>
                )}
              </div>

              {certifications.length > 0 ? (
                <div className="education-items-list">
                  {certifications.map((cert, index) => (
                    <div key={index} className="education-item-card">
                      <div className="edu-item-info">
                        <h4>{cert.name}</h4>
                        <p>{cert.issuer} • Issued {cert.issueYear}</p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: "12px", color: "#2563eb", textDecoration: "underline" }}
                          >
                            Verify Credential ↗
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => handleRemoveCertification(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#64748b", fontSize: "14px", fontStyle: "italic", marginBottom: "14px" }}>
                  No certifications listed yet. (Fill later anytime)
                </div>
              )}

              {/* Add Certification Form */}
              {showAddCert && (
                <form onSubmit={handleAddCertification} className="add-form-inline">
                  <div className="form-inline-grid">
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>Certificate Name</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. ATA Certified Translator"
                        value={newCert.name}
                        onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>Issuing Organization</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. American Translators Association"
                        value={newCert.issuer}
                        onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-inline-grid">
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>Issue Year</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. 2023"
                        value={newCert.issueYear}
                        onChange={(e) => setNewCert({ ...newCert, issueYear: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label" style={{ fontSize: "12.5px" }}>Credential URL</label>
                      <input
                        type="url"
                        className="field-input"
                        placeholder="https://..."
                        value={newCert.credentialUrl}
                        onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
                      Save Certificate
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: "8px 14px", fontSize: "13px" }}
                      onClick={() => setShowAddCert(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* =================================================================
                7. Verified Government Issued ID (PAN Card & Aadhaar Card)
                "appear on camera"
                ================================================================= */}
            <div className="profile-card" id="gov-id-section">
              <h3 className="profile-card-title">Identity Verification</h3>
              <p className="profile-card-subtitle">
                Identity document uploads are unavailable until secure verification storage is in place. Do not enter or upload government ID details here.
              </p>
            </div>

            {false && <div className="profile-card" id="gov-id-legacy">
              <div className="profile-card-header">
                <div>
                  <h3 className="profile-card-title">
                    Government Issued ID Verification
                  </h3>
                  <div className="profile-card-subtitle">
                    Verify your identity via live camera snapshot with PAN Card or Aadhaar Card.
                  </div>
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "700",
                    background: idStatus === "verified" ? "#ecfdf5" : idStatus === "pending" ? "#fef3c7" : "#f1f5f9",
                    color: idStatus === "verified" ? "#047857" : idStatus === "pending" ? "#b45309" : "#64748b",
                    border: `1px solid ${
                      idStatus === "verified" ? "#a7f3d0" : idStatus === "pending" ? "#fde68a" : "#cbd5e1"
                    }`,
                  }}
                >
                  {idStatus === "verified"
                    ? "✓ Verified ID"
                    : idStatus === "pending"
                    ? "⏳ Verification Under Review"
                    : "○ Unverified (Fill later)"}
                </div>
              </div>

              {/* ID Type Selector: Aadhaar or PAN */}
              <div className="id-type-selector-row">
                <div
                  className={`id-type-card ${idType === "aadhaar" ? "active" : ""}`}
                  onClick={() => setIdType("aadhaar")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="id-type-name">Aadhaar Card</div>
                  <div className="id-type-desc">12-Digit Unique Identification Authority of India</div>
                </div>

                <div
                  className={`id-type-card ${idType === "pancard" ? "active" : ""}`}
                  onClick={() => setIdType("pancard")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="id-type-name">PAN Card</div>
                  <div className="id-type-desc">10-Character Permanent Account Number (Income Tax Dept)</div>
                </div>
              </div>

              {/* ID Number input */}
              <div className="form-field-group">
                <label className="field-label">
                  {idType === "aadhaar" ? "Aadhaar Number (12 Digits)" : "PAN Card Number (10 Characters)"}
                </label>
                <input
                  type="text"
                  className="field-input"
                  placeholder={idType === "aadhaar" ? "XXXX XXXX XXXX" : "ABCDE1234F"}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                />
              </div>

              {/* Camera Activation / Snapshot UI */}
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className="field-label" style={{ margin: 0 }}>
                    Appear on Camera (Hold your {idType === "aadhaar" ? "Aadhaar Card" : "PAN Card"} in front of camera)
                  </label>
                  {!isCameraActive && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: "8px 16px", fontSize: "13px" }}
                      onClick={startCamera}
                    >
                      Open Camera to Verify
                    </button>
                  )}
                </div>

                {cameraError && (
                  <div className="auth-alert-box auth-alert-error" style={{ marginBottom: "12px" }}>
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Live Camera View */}
                {isCameraActive && (
                  <div className="camera-box-wrap">
                    <video ref={videoRef} className="camera-feed-video" playsInline muted />

                    {/* ID Card Alignment Viewfinder Guide */}
                    <div className="camera-viewfinder-overlay">
                      <div className="viewfinder-tag">
                        Hold {idType === "aadhaar" ? "Aadhaar" : "PAN"} Card Here
                      </div>
                      <div className="viewfinder-subtext">
                        Ensure your name and photo are clearly visible inside this box
                      </div>
                    </div>

                    <div className="camera-controls-bar">
                      <button
                        type="button"
                        className="btn-capture-shutter"
                        onClick={captureIdSnapshot}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Capture ID Photo</span>
                      </button>

                      <button
                        type="button"
                        className="btn-close-cam"
                        onClick={stopCamera}
                      >
                        Cancel Camera
                      </button>
                    </div>
                  </div>
                )}

                {/* Hidden canvas for snapshot rendering */}
                <canvas ref={canvasRef} style={{ display: "none" }} />

                {/* Snapshot Preview */}
                {idSnapshot && (
                  <div className="snapshot-preview-card">
                    <img src={idSnapshot} alt="Captured Government ID" className="snapshot-img" />
                    <div className="snapshot-watermark">
                      FOR FREEIO IDENTITY VERIFICATION ONLY
                    </div>
                    <div className="snapshot-actions">
                      <div style={{ fontSize: "13px", color: "#047857", fontWeight: "700" }}>
                        ✓ {idType === "aadhaar" ? "Aadhaar" : "PAN"} Card Captured
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="btn-upload-avatar"
                          onClick={startCamera}
                        >
                          Retake with Camera
                        </button>
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => {
                            setIdSnapshot("");
                            setIdStatus("unverified");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fallback upload option */}
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Or upload photo from device:</span>
                  <label className="btn-add-secondary" style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
                    <span>Browse Document File</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: "none" }}
                      onChange={handleIdFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>}

            {/* =================================================================
                8. Billing Method Section
                "and billing method section just for show (in progress)"
                ================================================================= */}
            <div className="profile-card" id="billing-section">
              <div className="profile-card-header">
                <div>
                  <h3 className="profile-card-title">
                    Billing & Payout Methods
                  </h3>
                  <div className="profile-card-subtitle">
                    Manage where your earnings and project payouts are transferred.
                  </div>
                </div>

                <div className="billing-in-progress-badge">
                  <span>In Progress (Coming Soon)</span>
                </div>
              </div>

              {/* Informational Box */}
              <div className="billing-notice-box">
                <div>
                  <strong style={{ color: "#92400e", fontSize: "14px" }}>
                    Payment & Payout Gateways are currently in test-mode deployment.
                  </strong>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#78350f", lineHeight: "1.45" }}>
                    Bank account transfers, UPI payouts, and escrow releases are undergoing regulatory compliance audits.
                    Once you complete your first client milestone, payout release options will be unlocked.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowBillingModal(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>+ Add Payout Method</span>
                  <span style={{ fontSize: "11px", color: "#d97706", fontWeight: "700" }}>
                    (In Progress)
                  </span>
                </button>
              </div>

              {/* Billing Modal "Just for show" */}
              {showBillingModal && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100,
                    padding: "20px",
                  }}
                  onClick={() => setShowBillingModal(false)}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      maxWidth: "460px",
                      width: "100%",
                      padding: "28px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                      Billing Integration In Progress
                    </h3>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5", marginBottom: "20px" }}>
                      Payment and payout processing is not available in Freeio yet. No bank or card details are collected here.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                      onClick={() => setShowBillingModal(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="profile-bottom-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>
                Ready to save your progress?
              </div>
              <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                Remember: you can come back and complete your profile anytime.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to={user?.role === "client" ? "/client/dashboard" : "/freelancer/dashboard"}
              className="btn btn-outline"
            >
              Fill Later
            </Link>
            <button
              onClick={handleSaveProfile}
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Profile Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
