import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../Components/Logo";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "freelancer" ? "freelancer" : "client";

  const { register } = useAuth();

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage("Please fill in your name, email, and password.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage("You must agree to the Freeio Terms of Service to register.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        location: formData.location.trim() || "Remote",
      });

      if (res.success) {
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          if (role === "client") {
            navigate("/client/dashboard");
          } else {
            navigate("/freelancer/dashboard");
          }
        }, 800);
      } else {
        setErrorMessage(res.error || "Registration failed. Please check your details.");
      }
    } catch (err) {
      setErrorMessage("Could not connect to the server. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Side: Registration Form */}
        <div className="auth-form-side">
          <div className="auth-header-top">
            <Logo />
            <Link to="/" className="auth-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to home</span>
            </Link>
          </div>

          <div className="auth-card-body">
            <div className="auth-title-box">
              <h1 className="auth-title">Create an account</h1>
              <p className="auth-subtitle">
                Create an account to post projects or find work in language services.
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="role-selector-grid">
              <div
                className={`role-option-card ${role === "client" ? "active" : ""}`}
                onClick={() => setRole("client")}
                role="button"
                tabIndex={0}
              >
                {role === "client" && <span className="role-badge-check">✓</span>}
                <div className="role-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <span className="role-title">Hire Talent</span>
                <span className="role-desc">I am a Client</span>
              </div>

              <div
                className={`role-option-card ${role === "freelancer" ? "active" : ""}`}
                onClick={() => setRole("freelancer")}
                role="button"
                tabIndex={0}
              >
                {role === "freelancer" && <span className="role-badge-check">✓</span>}
                <div className="role-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <span className="role-title">Find Work</span>
                <span className="role-desc">I am a Freelancer</span>
              </div>
            </div>

            {errorMessage && (
              <div className="auth-alert auth-alert-error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert auth-alert-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Work Email
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password (min 6 characters)
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Location (Optional) */}
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location (City, Country)
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </span>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. London, UK or Remote"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="form-helper-row">
                <label className="checkbox-label" style={{ fontSize: "12.5px" }}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to Freeio's <a href="#terms" className="forgot-link">Terms of Service</a> & <a href="#privacy" className="forgot-link">Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?
              <Link to="/login">Log in</Link>
            </p>
          </div>

          <div className="auth-footer-bottom">
            <span>© {new Date().getFullYear()} Freeio Inc. All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Showcase Panel */}
        <div className="auth-showcase-side">
          <div>
            <div className="showcase-pill">
              <span>Language and media project network</span>
            </div>
          </div>

          <div className="showcase-content">
            <h2 className="showcase-title">
              Your vision,
              <br />
              our platform.
            </h2>
            <p className="showcase-text">
              Whether you are an ambitious business building groundbreaking products or a specialist looking for freedom, Freeio provides the tools to succeed.
            </p>

            <div className="showcase-features">
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Create a client or freelancer account</span>
              </div>
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Build a profile with your own details</span>
              </div>
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Explore project and proposal workflows</span>
              </div>
            </div>
          </div>

          <div style={{ opacity: 0.75, fontSize: "12px" }}>
            <span>Privacy Policy • Terms of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;