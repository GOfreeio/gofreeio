import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../Components/Logo";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData.email.trim(), formData.password);

      if (res.success) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          // Check if there was a redirected location
          const from = location.state?.from?.pathname;
          if (from) {
            navigate(from, { replace: true });
          } else if (res.user?.role === "client") {
            navigate("/client/dashboard");
          } else if (res.user?.role === "freelancer") {
            navigate("/freelancer/dashboard");
          } else {
            navigate("/jobs");
          }
        }, 600);
      } else {
        setErrorMessage(res.error || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Unable to connect to the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Side: Login Form */}
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
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">
                Enter your credentials to access your Freeio workspace and active projects.
              </p>
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
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
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
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="form-helper-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>

                <a href="#forgot" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="btn-auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account?
              <Link to="/register">Sign up for free</Link>
            </p>
          </div>

          <div className="auth-footer-bottom">
            <span>© {new Date().getFullYear()} Freeio Inc. All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Showcase & Trust Proof */}
        <div className="auth-showcase-side">
          <div>
            <div className="showcase-pill">
              <span>✦ Trusted Freelance Marketplace</span>
            </div>
          </div>

          <div className="showcase-content">
            <h2 className="showcase-title">
              Find the right talent
              <br />
              or the perfect job.
            </h2>
            <p className="showcase-text">
              Sign in to manage your Freeio projects, proposals, and profile.
            </p>

            <div className="showcase-features">
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Browse open language and media projects</span>
              </div>
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Submit and manage project proposals</span>
              </div>
              <div className="showcase-feature-item">
                <span className="showcase-check-icon">✓</span>
                <span>Keep your professional profile up to date</span>
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

export default Login;