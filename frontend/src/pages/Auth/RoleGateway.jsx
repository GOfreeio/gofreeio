import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Logo from "../../Components/Logo";
import { useAuth } from "../../context/AuthContext";
import "./RoleGateway.css";

const RoleGateway = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, login, register } = useAuth();

  // If role is passed in URL query e.g. /?role=freelancer&step=login
  const initialRoleParam = searchParams.get("role");
  const initialStepParam = searchParams.get("step");

  // Step 1: "select_role", Step 2: "auth_form"
  const [step, setStep] = useState(initialStepParam === "login" ? "auth_form" : "select_role");
  const [selectedRole, setSelectedRole] = useState(
    initialRoleParam === "client" ? "client" : "freelancer"
  );
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
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

  // Handle proceed to login after selecting role
  const handleProceedToAuth = () => {
    setErrorMessage("");
    setStep("auth_form");
  };

  const handleBackToRoleSelect = () => {
    setErrorMessage("");
    setStep("select_role");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!loginData.email.trim() || !loginData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Pass selectedRole to strictly enforce that freelancer cannot join as client and vice versa
      const res = await login(loginData.email.trim(), loginData.password, selectedRole);
      if (res.success) {
        setSuccessMessage("Sign in successful! Redirecting to workspace...");
        setTimeout(() => {
          if (res.user?.role === "admin") {
            navigate("/messages");
          } else if (res.user?.role === "client") {
            navigate("/client/dashboard");
          } else {
            navigate("/freelancer/dashboard");
          }
        }, 600);
      } else {
        setErrorMessage(res.error || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      setErrorMessage("Please fill in your name, email, and password.");
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (!registerData.agreeTerms) {
      setErrorMessage("Please agree to the Freeio Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        role: selectedRole,
        location: registerData.location.trim(),
      });

      if (res.success) {
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          if (selectedRole === "client") {
            navigate("/client/dashboard");
          } else {
            // After signup as freelancer, navigate to profile so they can fill details or fill later!
            navigate("/profile?new=true");
          }
        }, 700);
      } else {
        setErrorMessage(res.error || "Registration failed. Please try a different email.");
      }
    } catch (err) {
      setErrorMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-gateway-wrapper">
      {/* Universal Top Navbar (Includes Outsource button) */}
      <Navbar />

      {/* Main Content Area */}
      <main className="gateway-main">
        <div className="gateway-content-box">
          {isAuthenticated && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                padding: "16px 20px",
                borderRadius: "12px",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div>
                  <strong style={{ color: "#065f46" }}>You are currently logged in as {user?.name}</strong>
                  <div style={{ fontSize: "13px", color: "#047857" }}>
                    Role: {user?.role === "client" ? "Client (Hiring)" : "Freelancer (Working)"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link
                  to={user?.role === "client" ? "/client/dashboard" : "/freelancer/dashboard"}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  Open Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="btn btn-outline"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  My Profile
                </Link>
              </div>
            </div>
          )}

          {/* =================================================================
              STEP 1: FIRST VISIT ROLE SELECTION SCREEN
              "as a freelancer (work and get paid) or as a client (post job and hire )"
              ================================================================= */}
          {step === "select_role" ? (
            <div className="gateway-step-role">
              <div className="gateway-header-center">
                <span className="gateway-badge">Getting Started</span>
                <h1 className="gateway-title">
                  Join as a Freelancer or as a Client
                </h1>
                <p className="gateway-subtitle">
                  Choose how you want to use Freeio. You can switch or adjust your profile settings later at any time.
                </p>
              </div>

              {/* Two Choice Cards */}
              <div className="gateway-cards-grid">
                {/* Option 1: Freelancer */}
                <div
                  className={`role-card freelancer ${selectedRole === "freelancer" ? "selected" : ""}`}
                  onClick={() => setSelectedRole("freelancer")}
                  onDoubleClick={handleProceedToAuth}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="role-card-top">
                      <div className="role-card-icon-wrap">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </div>

                      <div className="role-radio-indicator">
                        {selectedRole === "freelancer" && <div className="role-radio-inner-dot"></div>}
                      </div>
                    </div>

                    <h2 className="role-card-title">As a Freelancer</h2>
                    <div className="role-card-tagline">Work and get paid</div>
                    <p className="role-card-desc">
                      Browse translation, transcription, localization, and dubbing jobs, then showcase your experience to clients.
                    </p>
                  </div>

                </div>

                {/* Option 2: Client */}
                <div
                  className={`role-card client ${selectedRole === "client" ? "selected" : ""}`}
                  onClick={() => setSelectedRole("client")}
                  onDoubleClick={handleProceedToAuth}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="role-card-top">
                      <div className="role-card-icon-wrap">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>

                      <div className="role-radio-indicator">
                        {selectedRole === "client" && <div className="role-radio-inner-dot"></div>}
                      </div>
                    </div>

                    <h2 className="role-card-title">As a Client</h2>
                    <div className="role-card-tagline">Post job and hire</div>
                    <p className="role-card-desc">
                      Post a language or media project, review freelancer proposals, and coordinate delivery.
                    </p>
                  </div>

                </div>
              </div>

              {/* Action Bar */}
              <div className="gateway-action-bar">
                <button
                  onClick={handleProceedToAuth}
                  className="btn-gateway-continue"
                >
                  <span>
                    {selectedRole === "freelancer"
                      ? "Apply as a Freelancer →"
                      : "Join as a Client →"}
                  </span>
                </button>

              </div>
            </div>
          ) : (
            /* =================================================================
                STEP 2: LOGIN / REGISTER FORM SCREEN
                "then login form should appear"
                ================================================================= */
            <div className="gateway-auth-card">
              <div className="auth-card-top-nav">
                <button onClick={handleBackToRoleSelect} className="btn-change-role">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Change Role</span>
                </button>

                <div className={`role-pill-badge ${selectedRole}`}>
                  {selectedRole === "freelancer" ? "As Freelancer" : "As Client"}
                </div>
              </div>

              {/* Mode Switch: Log In vs Create Account */}
              <div className="auth-mode-tabs">
                <button
                  type="button"
                  className={`auth-mode-tab ${authMode === "login" ? "active" : ""}`}
                  onClick={() => {
                    setAuthMode("login");
                    setErrorMessage("");
                  }}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className={`auth-mode-tab ${authMode === "register" ? "active" : ""}`}
                  onClick={() => {
                    setAuthMode("register");
                    setErrorMessage("");
                  }}
                >
                  Create Account
                </button>
              </div>

              <h2 className="auth-form-title">
                {authMode === "login"
                  ? `Welcome back, ${selectedRole === "freelancer" ? "Freelancer" : "Client"}!`
                  : `Create your ${selectedRole === "freelancer" ? "Freelancer" : "Client"} account`}
              </h2>
              <p className="auth-form-subtitle">
                {authMode === "login"
                  ? selectedRole === "freelancer"
                    ? "Log in to view active contracts, submit proposals, and get paid."
                    : "Log in to manage jobs, review proposals, and hire talent."
                  : selectedRole === "freelancer"
                  ? "Sign up to start working. You can fill your profile now or later!"
                  : "Sign up to post projects and review freelancer proposals."}
              </p>

              {errorMessage && (
                <div className="auth-alert-box auth-alert-error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="auth-alert-box auth-alert-success">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              {authMode === "login" ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit}>
                  <div className="auth-form-group">
                    <label className="auth-label">Email Address</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="auth-text-input"
                        placeholder="name@example.com"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="auth-text-input"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="auth-options-row">
                    <label className="auth-checkbox-label">
                      <input
                        type="checkbox"
                        checked={loginData.rememberMe}
                        onChange={(e) =>
                          setLoginData({ ...loginData, rememberMe: e.target.checked })
                        }
                      />
                      <span>Remember me</span>
                    </label>
                    <span style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}>
                      Forgot password?
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn-auth-action"
                    disabled={loading}
                  >
                    {loading ? (
                      "Signing In..."
                    ) : (
                      <>
                        <span>Sign In as {selectedRole === "freelancer" ? "Freelancer" : "Client"}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit}>
                  <div className="auth-form-group">
                    <label className="auth-label">Full Name</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="auth-text-input"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Email Address</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="auth-text-input"
                        placeholder="john@example.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="auth-text-input"
                        placeholder="At least 6 characters"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Location (City, Country)</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="auth-text-input"
                        placeholder="e.g. Mumbai, India or Remote"
                        value={registerData.location}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, location: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label className="auth-checkbox-label">
                      <input
                        type="checkbox"
                        checked={registerData.agreeTerms}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            agreeTerms: e.target.checked,
                          })
                        }
                      />
                      <span style={{ fontSize: "13px" }}>
                        I agree to the Freeio Terms of Service & Privacy Policy
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-auth-action"
                    disabled={loading}
                  >
                    {loading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        <span>Create {selectedRole === "freelancer" ? "Freelancer" : "Client"} Account</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoleGateway;
