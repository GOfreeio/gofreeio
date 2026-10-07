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
                Join Freeio to find top-tier projects or hire verified freelance professionals.
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

            <div className="auth-divider">
              <span>Or sign up with</span>
            </div>

            <div className="social-login-grid">
              <button
                type="button"
                className="btn-social-auth"
                onClick={() => setErrorMessage("Social signup is simulated for demonstration.")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="btn-social-auth"
                onClick={() => setErrorMessage("Social signup is simulated for demonstration.")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#111827">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

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
              <span>✦ The #1 Freelance Network</span>
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

            <div className="showcase-testimonial">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "Finding verified remote clients who value high-quality design was tough until I joined Freeio. Now I manage consistent projects every month."
              </p>
              <div className="testimonial-user">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Freelancer avatar"
                  className="testimonial-avatar"
                />
                <div>
                  <h4 className="testimonial-name">Elena Rostova</h4>
                  <span className="testimonial-role">Senior UI/UX Designer</span>
                </div>
              </div>
            </div>

            <div className="showcase-features">
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Fast & Simple Onboarding (Zero Setup Fees)</span>
              </div>
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Direct Client-to-Freelancer Messaging</span>
              </div>
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Milestone-Based Secure Escrow Contracts</span>
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