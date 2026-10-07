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

          {/* Desktop Navigation Links */}
          <nav className="navbar-nav">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`nav-link ${isActive("/jobs") ? "active" : ""}`}
            >
              Find Jobs
            </Link>
            <Link
              to="/freelancer/dashboard"
              className={`nav-link ${isActive("/freelancer/dashboard") || isActive("/freelancer/proposals") ? "active" : ""}`}
            >
              For Freelancers
            </Link>
            <Link
              to="/client/dashboard"
              className={`nav-link ${isActive("/client/dashboard") || isActive("/client/create") || isActive("/client/jobs") ? "active" : ""}`}
            >
              For Clients
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActive("/about") ? "active" : ""}`}
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                to="/messages"
                className={`nav-link ${isActive("/messages") ? "active" : ""}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>💬</span>
                <span>{user?.role === "admin" ? "Desk Console" : "Project Desk"}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="navbar-right">
            {/* Search Icon */}
            <button
              className="navbar-search-btn"
              onClick={() => setShowSearchModal(true)}
              aria-label="Search"
              title="Search jobs or skills"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {isAuthenticated ? (
              <div className="navbar-user-menu">
                {user?.role === "client" && (
                  <Link to="/client/create" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "13px" }}>
                    + Post Job
                  </Link>
                )}

                {/* Direct Messages Shortcut Button */}
                <Link
                  to="/messages"
                  className="navbar-search-btn"
                  title="Open Project Desk Chat"
                  style={{ background: isActive("/messages") ? "#eff6ff" : "transparent", color: isActive("/messages") ? "#2563eb" : "#4b5563" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </Link>

                <Link
                  to={user?.role === "client" ? "/client/dashboard" : user?.role === "admin" ? "/messages" : "/freelancer/dashboard"}
                  className="user-badge-link"
                >
                  <div className="user-avatar-circle">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-badge-info">
                    <span className="user-badge-name">{user?.name || "My Account"}</span>
                    <span className="user-badge-role">{user?.role || "Member"}</span>
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
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link to="/freelancer/dashboard" onClick={() => setMobileMenuOpen(false)}>
              For Freelancers
            </Link>
            <Link to="/client/dashboard" onClick={() => setMobileMenuOpen(false)}>
              For Clients
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            {isAuthenticated && (
              <Link to="/messages" onClick={() => setMobileMenuOpen(false)} style={{ color: "#2563eb", fontWeight: "700" }}>
                💬 Project Desk Messages
              </Link>
            )}
            <hr style={{ borderColor: "#f1f5f9", margin: "8px 0" }} />
            {isAuthenticated ? (
              <>
                {user?.role === "client" && (
                  <Link to="/client/create" onClick={() => setMobileMenuOpen(false)} style={{ color: "#2563eb", fontWeight: "700" }}>
                    + Post a New Job
                  </Link>
                )}
                <Link
                  to={user?.role === "client" ? "/client/dashboard" : user?.role === "admin" ? "/messages" : "/freelancer/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard ({user?.name})
                </Link>
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