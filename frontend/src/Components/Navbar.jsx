import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="freeio-navbar">
        <div className="container freeio-navbar-inner">
          {/* Brand Logo */}
          <div className="navbar-left">
            <Logo />
          </div>
          {/* <div className="navbar-left">

         <img
          src="/gofreeio.png"
          alt="GoFreeio"
          className="gofreeio-logo"
         />
         </div> */}

          {/* Desktop Navigation Links (Only shown when authenticated) */}
          <nav className="navbar-nav">
            {!isAuthenticated ? (
              // Unauthenticated visitor: Only show Outsource portal link
              <>
                <Link
                  to="/outsource"
                  className={`nav-link ${isActive("/outsource") ? "active" : ""}`}
                  style={{ fontWeight: "700", color: "#2563eb" }}
                >
                  <span>🏢 Project Outsource</span>
                </Link>
              </>
            ) : user?.role === "client" ? (
              // Client navigation (NO freelancer chat desk)
              <>
                <Link
                  to="/outsource"
                  className={`nav-link ${isActive("/outsource") ? "active" : ""}`}
                  style={{ fontWeight: "700", color: "#2563eb" }}
                >
                  <span>🏢 Outsource</span>
                </Link>
                <Link
                  to="/client/jobs"
                  className={`nav-link ${isActive("/client/jobs") ? "active" : ""}`}
                >
                  My Posted Projects
                </Link>
                <Link
                  to="/client/create"
                  className={`nav-link ${isActive("/client/create") ? "active" : ""}`}
                >
                  + Post Job
                </Link>
                <Link
                  to="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                >
                  Account Profile
                </Link>
              </>
            ) : user?.role === "admin" ? (
              // Admin navigation (Talk with all freelancers & view outsource)
              <>
                <Link
                  to="/messages"
                  className={`nav-link ${isActive("/messages") ? "active" : ""}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "700" }}
                >
                  <span>💬</span>
                  <span>Freelancers Desk</span>
                </Link>
                <Link
                  to="/outsource"
                  className={`nav-link ${isActive("/outsource") ? "active" : ""}`}
                >
                  Outsource Inquiries
                </Link>
                <Link
                  to="/jobs"
                  className={`nav-link ${isActive("/jobs") ? "active" : ""}`}
                >
                  Jobs Console
                </Link>
                <Link
                  to="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              // Freelancer navigation (Browse jobs, proposals, talk with admin)
              <>
                <Link
                  to="/jobs"
                  className={`nav-link ${isActive("/jobs") ? "active" : ""}`}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/freelancer/proposals"
                  className={`nav-link ${isActive("/freelancer/proposals") ? "active" : ""}`}
                >
                  My Proposals
                </Link>
                <Link
                  to="/messages"
                  className={`nav-link ${isActive("/messages") ? "active" : ""}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>💬</span>
                  <span>Desk Support (Admin)</span>
                </Link>
                <Link
                  to="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                >
                  My Profile
                </Link>
                <Link
                  to="/outsource"
                  className={`nav-link ${isActive("/outsource") ? "active" : ""}`}
                >
                  Outsource
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="navbar-right">
            {/* Outsource Button for immediate visibility */}
            <Link to="/outsource" className="btn-nav-outsource" title="Outsource Client Project">
              <span>🏢 Outsource</span>
            </Link>

            {isAuthenticated ? (
              <div className="navbar-user-menu">
                <Link
                  to="/profile"
                  className="user-badge-link"
                  title="View & Edit Profile"
                >
                  <div className="user-avatar-circle" style={{ overflow: "hidden" }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      "U"
                    )}
                  </div>
                  <div className="user-badge-info">
                    <span className="user-badge-name">{user?.name || "My Account"}</span>
                    <span className="user-badge-role">{user?.role === "client" ? "Client" : user?.role === "admin" ? "Admin" : "Freelancer"}</span>
                  </div>
                </Link>

                <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="navbar-auth-actions">
                <Link to="/login" className="btn-navbar-login">
                  Log In
                </Link>

                <Link to="/register" className="btn-navbar-signup">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            <Link to="/outsource" onClick={() => setMobileMenuOpen(false)} style={{ color: "#2563eb", fontWeight: "800" }}>
              🏢 Project Outsource
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            ) : user?.role === "client" ? (
              <>
                <Link to="/client/jobs" onClick={() => setMobileMenuOpen(false)}>
                  My Posted Projects
                </Link>
                <Link to="/client/create" onClick={() => setMobileMenuOpen(false)}>
                  + Post a New Job
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  My Profile
                </Link>
              </>
            ) : user?.role === "admin" ? (
              <>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)} style={{ color: "#2563eb", fontWeight: "700" }}>
                  💬 Freelancers Desk
                </Link>
                <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                  Jobs Console
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                  Find Jobs
                </Link>
                <Link to="/freelancer/proposals" onClick={() => setMobileMenuOpen(false)}>
                  My Proposals
                </Link>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)} style={{ color: "#2563eb", fontWeight: "700" }}>
                  💬 Desk Support (Admin)
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  My Profile
                </Link>
              </>
            )}
            <hr style={{ borderColor: "#f1f5f9", margin: "8px 0" }} />
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-logout-btn"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="mobile-auth-btns">
                <Link to="/login" className="btn-navbar-login" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/register" className="btn-navbar-signup" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="search-modal-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit}>
              <div className="search-modal-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search by language (e.g. Spanish, Japanese) or service (Translation, Dubbing)..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" className="close-btn" onClick={() => setShowSearchModal(false)}>
                  ✕
                </button>
              </div>
              <div className="search-modal-footer">
                <span>Press Enter to search</span>
                <button type="submit" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "13px" }}>
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;