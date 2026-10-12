import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Logo from "../Components/Logo";
import "./Landing.css";

// Language & Media focused categories
const languageCategories = [
  {
    id: "translation",
    name: "Translation",
    desc: "Documents, Legal, Medical & Technical",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8l6 6"></path>
        <path d="M4 14l6-6 2-3"></path>
        <path d="M2 5h12"></path>
        <path d="M7 2h1"></path>
        <path d="M22 22l-5-10-5 10"></path>
        <path d="M14 18h6"></path>
      </svg>
    ),
    bgColor: "#eff6ff",
  },
  {
    id: "transcription",
    name: "Transcription",
    desc: "Audio & Video to text with timestamps",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    ),
    bgColor: "#f5f3ff",
  },
  {
    id: "localization",
    name: "Localization",
    desc: "Apps, Video Games & Software Strings",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    bgColor: "#f0f9ff",
  },
  {
    id: "dubbing",
    name: "Dubbing & Voiceover",
    desc: "Voice Acting, Character Dubbing & Narration",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    ),
    bgColor: "#fdf2f8",
  },
  {
    id: "subtitling",
    name: "Subtitling & Captions",
    desc: "Closed Captions, Burned-in & Translated SRTs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="M7 15h3M14 15h3M7 11h10"></path>
      </svg>
    ),
    bgColor: "#ecfdf5",
  },
  {
    id: "interpretation",
    name: "Live Interpretation",
    desc: "Simultaneous & Virtual Conference Interpreting",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="10" x2="9.01" y2="10"></line>
        <line x1="12" y1="10" x2="12.01" y2="10"></line>
        <line x1="15" y1="10" x2="15.01" y2="10"></line>
      </svg>
    ),
    bgColor: "#fffbeb",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [latestJobs, setLatestJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setLatestJobs(data.data.slice(0, 4).map((job) => ({
            id: job._id,
            title: job.title,
            category: job.skills?.[0] || "Project",
            jobType: job.budgetType === "hourly" ? "Hourly" : "Fixed Price",
            budget: job.budget ? `$${job.budget}` : "Budget not specified",
            budgetType: job.budgetType === "hourly" ? "Hourly Rate" : "Fixed Price",
            posted: job.createdAt ? `Posted ${new Date(job.createdAt).toLocaleDateString()}` : "Recently posted",
            iconType: (job.skills || []).join(" ").toLowerCase().includes("dub") ? "dubbing" : "translation",
          })));
        }
      })
      .catch(() => {});
  }, []);

  const renderJobIcon = (type) => {
    if (type === "dubbing") {
      return (
        <div className="job-icon-box" style={{ background: "#fdf2f8", color: "#ec4899" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </div>
      );
    }
    if (type === "transcription") {
      return (
        <div className="job-icon-box" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          </svg>
        </div>
      );
    }
    if (type === "localization") {
      return (
        <div className="job-icon-box" style={{ background: "#f0f9ff", color: "#0284c7" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
      );
    }
    return (
      <div className="job-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M5 8l6 6"></path>
          <path d="M4 14l6-6 2-3"></path>
          <path d="M2 5h12"></path>
          <path d="M22 22l-5-10-5 10"></path>
          <path d="M14 18h6"></path>
        </svg>
      </div>
    );
  };

  return (
    <div className="landing-page">
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* Left Hero Content */}
          <div className="hero-content">
            <div className="hero-pill-badge">
              <span>Translation • Transcription • Dubbing • Localization</span>
            </div>

            <h1 className="hero-title">
              Find the right talent
              <br />
              or the perfect job
            </h1>

            <p className="hero-subtitle">
              Freeio helps clients and freelancers connect around translation, transcription,
              localization, and dubbing projects.
            </p>

            <div className="hero-cta-group">
              <Link to="/jobs" className="btn btn-primary hero-btn-main">
                Find a Job
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>

              <Link to="/register?role=freelancer" className="btn btn-outline hero-btn-secondary">
                Become a Freelancer
              </Link>
            </div>

          </div>

          {/* Right Hero Visual with Floating Badges */}
          <div className="hero-visual-wrapper">
            <div className="hero-annotation">
              <span className="annotation-text">Your vision<br />Our platform</span>
              <svg className="annotation-arrow" width="45" height="40" viewBox="0 0 50 45" fill="none">
                <path d="M5 5 C 25 15, 35 30, 42 38" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <path d="M35 38 L 43 39 L 41 31" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <div className="hero-image-frame">
              <div className="hero-shape-backdrop"></div>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
                alt="Professional translator working with laptop and audio setup"
                className="hero-main-photo"
              />

              {/* Floating Badge 1: Post a Job */}
              <div className="floating-badge badge-top" onClick={() => navigate("/client/create")}>
                <div className="floating-badge-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <div className="floating-badge-text">
                  <h4>Post a Job</h4>
                  <p>Describe your translation or dubbing project and get top proposals.</p>
                </div>
                <span className="floating-badge-arrow" style={{ color: "#10b981" }}>→</span>
              </div>

              {/* Floating Badge 2: Get Proposals */}
              <div className="floating-badge badge-bottom" onClick={() => navigate("/jobs")}>
                <div className="floating-badge-icon" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div className="floating-badge-text">
                  <h4>Get Proposals</h4>
                  <p>Review voice demos, translation samples, and hire with confidence.</p>
                </div>
                <span className="floating-badge-arrow" style={{ color: "#8b5cf6" }}>→</span>
              </div>

              {/* Floating Badge 3: Get It Done */}
              <div className="floating-badge badge-right" onClick={() => navigate("/register")}>
                <div className="floating-badge-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="floating-badge-text">
                  <h4>Get It Done</h4>
                  <p>Manage project details and delivery milestones.</p>
                </div>
                <span className="floating-badge-arrow" style={{ color: "#2563eb" }}>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== POPULAR CATEGORIES (LANGUAGE & MEDIA) ===================== */}
      <section className="categories-section">
        <div className="container">
          <div className="section-flex-header">
            <div>
              <span className="section-pretitle">EXPLORE SERVICES</span>
              <h2 className="section-title">Translation, Dubbing & Language Services</h2>
              <p className="section-desc">
                Find expert linguists, voice actors, and transcriptionists tailored to your specific language pair and industry.
              </p>
            </div>
            <Link to="/jobs" className="view-all-link">
              View All Categories <span>→</span>
            </Link>
          </div>

          <div className="categories-grid">
            {languageCategories.map((cat) => (
              <Link
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                key={cat.id}
                className="category-card"
              >
                <div className="cat-icon-box" style={{ background: cat.bgColor }}>
                  {cat.icon}
                </div>
                <h3 className="cat-name">{cat.name}</h3>
                <span className="cat-desc">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY FREEIO SECTION ===================== */}
      <section className="why-section" id="why-freeio">
        <div className="container">
          <div className="section-label-header">
            <span className="section-pretitle">WHY FREEIO</span>
            <h2 className="section-title">Everything you need for seamless global communication</h2>
            <p className="section-desc">
              We connect ambitious creators with native linguists, vetted voiceover talent, and certified transcribers.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon-wrap" style={{ background: "#ecfdf5", color: "#10b981" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Language-Focused Projects</h3>
              <p>Find translation, transcription, localization, and voice projects.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Fast Turnaround</h3>
              <p>Submit a proposal with your experience and proposed delivery timeline.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Share Your Expertise</h3>
              <p>Describe your language pairs, specialties, and relevant project experience.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap" style={{ background: "#fffbeb", color: "#f59e0b" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3>Project Milestones</h3>
              <p>Keep project scope and delivery steps clear with milestone planning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED JOBS & WHY CHOOSE US ===================== */}
      <section className="featured-section">
        <div className="container featured-grid">
          {/* Left: Latest Jobs */}
          <div className="jobs-column">
            <div className="section-flex-header" style={{ marginBottom: "20px" }}>
              <div>
                <span className="section-pretitle">FEATURED OPPORTUNITIES</span>
                <h2 className="section-title" style={{ fontSize: "28px" }}>Latest Language & Media Projects</h2>
              </div>
              <Link to="/jobs" className="view-all-link">
                View All Jobs <span>→</span>
              </Link>
            </div>

            <div className="jobs-list">
              {latestJobs.length === 0 ? (
                <div className="jobs-empty-state">
                  <h3>No projects are available yet</h3>
                  <p>New client projects will appear here when they are posted.</p>
                </div>
              ) : latestJobs.map((job) => (
                <div key={job.id} className="job-item-card">
                  <div className="job-item-left">
                    {renderJobIcon(job.iconType)}
                    <div className="job-item-details">
                      <h3 className="job-item-title">{job.title}</h3>
                      <div className="job-tags-row">
                        <span className="job-tag tag-primary">{job.category}</span>
                        <span className="job-tag tag-secondary">{job.jobType}</span>
                      </div>
                      <div className="job-meta-row"><span>{job.posted}</span></div>
                    </div>
                  </div>
                  <div className="job-item-right">
                    <div className="job-pricing">
                      <span className="job-price-val">{job.budget}</span>
                      <span className="job-price-type">{job.budgetType}</span>
                    </div>
                    <Link to={`/jobs/${job.id}`} className="btn-view-job">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Why Choose Freeio Card */}
          <div className="why-choose-column">
            <div className="why-choose-card">
              <h3 className="why-choose-title">Why Choose Freeio?</h3>
              <p className="why-choose-subtitle">Built for seamless translation & dubbing.</p>

              <div className="benefits-checklist">
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">
                    <strong>Project Workspace</strong>
                    <p>Keep project briefs and proposals in one place.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">
                    <strong>Freelancer Profiles</strong>
                    <p>Review the profile details freelancers choose to share.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">
                    <strong>Flexible Work Options</strong>
                    <p>Per-word rates, audio minutes, or fixed price contracts.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">
                    <strong>Managed Communication</strong>
                    <p>Use the project desk to contact the Freeio team.</p>
                  </div>
                </div>
              </div>

              <div className="why-illustration-wrap">
                <div className="why-handwritten">
                  <span>Big dreams<br />need great talent</span>
                  <svg width="40" height="28" viewBox="0 0 45 30" fill="none">
                    <path d="M5 20 C 15 5, 28 8, 38 18" stroke="#2563eb" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
                    <path d="M30 18 L 39 19 L 38 11" stroke="#2563eb" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="illustration-graphic">
                  <svg width="150" height="120" viewBox="0 0 160 130" fill="none">
                    <circle cx="120" cy="95" r="30" fill="#eff6ff" />
                    <path d="M12 120 C 12 90, 28 80, 42 120 Z" fill="#93c5fd" opacity="0.6" />
                    <circle cx="108" cy="40" r="16" fill="#1e3a8a" />
                    <path d="M88 88 C 88 64, 128 64, 128 88 Z" fill="#2563eb" />
                    <rect x="70" y="80" width="38" height="22" rx="3" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
                    <rect x="64" y="100" width="50" height="4" rx="2" fill="#cbd5e1" />
                    <circle cx="89" cy="91" r="3" fill="#3b82f6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="freeio-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo variant="light" />
              <p className="footer-tagline">
                The global marketplace for translation, transcription, localization, and studio dubbing.
              </p>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Find Jobs</Link></li>
                <li><Link to="/client/create">Post a Job</Link></li>
                <li><Link to="/freelancer/proposals">My Proposals</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><Link to="/jobs?category=Translation">Document Translation</Link></li>
                <li><Link to="/jobs?category=Transcription">Audio Transcription</Link></li>
                <li><Link to="/jobs?category=Localization">Game Localization</Link></li>
                <li><Link to="/jobs?category=Dubbing">Voiceover & Dubbing</Link></li>
                <li><Link to="/jobs?category=Subtitling">Subtitles & Captions</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Stay Connected</h4>
              <div className="footer-social-icons">
                <a href="#facebook" aria-label="Facebook" className="social-circle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#twitter" aria-label="Twitter" className="social-circle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#linkedin" aria-label="LinkedIn" className="social-circle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#instagram" aria-label="Instagram" className="social-circle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
              <p className="footer-copyright">
                © {new Date().getFullYear()} Freeio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;