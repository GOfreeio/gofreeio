import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Logo from "../Components/Logo";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container about-hero-container">
          <span className="about-pill-badge">ABOUT FREEIO</span>
          <h1 className="about-title">
            Bridging Worlds Through
            <br />
            Language, Voice & Media
          </h1>
          <p className="about-subtitle">
            Freeio is the world's premier marketplace specialized in Translation, Transcription,
            Localization, and Dubbing. We empower global businesses, media studios, and independent
            creators to connect with certified native linguists and voice actors across 150+ languages.
          </p>

          <div className="about-cta-row">
            <Link to="/jobs" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
              Explore Services →
            </Link>
            <Link to="/client/create" className="btn btn-outline" style={{ padding: "12px 24px", fontSize: "15px" }}>
              Post a Project
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats Counter */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            <div className="about-stat-card">
              <strong className="stat-number">150+</strong>
              <span className="stat-title">Languages & Dialects</span>
              <p className="stat-desc">From common world languages to rare regional vernaculars.</p>
            </div>

            <div className="about-stat-card">
              <strong className="stat-number">10K+</strong>
              <span className="stat-title">Verified Specialists</span>
              <p className="stat-desc">Native translators, studio voice actors, and fast transcribers.</p>
            </div>

            <div className="about-stat-card">
              <strong className="stat-number">99.4%</strong>
              <span className="stat-title">Accuracy Rate</span>
              <p className="stat-desc">Rigorous dual-layer proofreading and quality assurance.</p>
            </div>

            <div className="about-stat-card">
              <strong className="stat-number">100%</strong>
              <span className="stat-title">Escrow Protected</span>
              <p className="stat-desc">Safe milestone payments with zero upfront risk.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="about-services-section">
        <div className="container">
          <div className="section-label-header" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
            <span className="section-pretitle">OUR EXPERTISE</span>
            <h2 className="section-title">End-to-End Language & Multimedia Capabilities</h2>
            <p className="section-desc">
              We cover every dimension of global communication with certified talent and state-of-the-art tools.
            </p>
          </div>

          <div className="services-showcase-grid">
            <div className="service-pillar-card">
              <div className="pillar-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                🌐
              </div>
              <h3>Document & Technical Translation</h3>
              <p>
                Flawless translation for legal contracts, clinical medical documents, patents, technical manuals,
                and financial reports with sworn certification options.
              </p>
            </div>

            <div className="service-pillar-card">
              <div className="pillar-icon" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
                🎙️
              </div>
              <h3>Audio & Video Transcription</h3>
              <p>
                Verbatim and clean-read transcripts with speaker identification, time-coded markers, and subtitle-ready
                formatting for podcasts, depositions, and video productions.
              </p>
            </div>

            <div className="service-pillar-card">
              <div className="pillar-icon" style={{ background: "#fdf2f8", color: "#ec4899" }}>
                🎭
              </div>
              <h3>Character Dubbing & Voiceover</h3>
              <p>
                Studio-grade narration, video game character voiceovers, anime and film dubbing in authentic native accents
                with lip-sync and audio mastering.
              </p>
            </div>

            <div className="service-pillar-card">
              <div className="pillar-icon" style={{ background: "#f0f9ff", color: "#0284c7" }}>
                🎮
              </div>
              <h3>Software, App & Game Localization</h3>
              <p>
                Cultural adaptation, UI string translation, and in-context testing so your digital products feel native
                and intuitive to users in every international market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="about-workflow-section">
        <div className="container">
          <div className="section-label-header" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <span className="section-pretitle">THE WORKFLOW</span>
            <h2 className="section-title">How Freeio Works</h2>
            <p className="section-desc">Simple, transparent, and completely secure from first pitch to final delivery.</p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step-card">
              <span className="step-num">01</span>
              <h4>Post Your Project Brief</h4>
              <p>Specify target language pairs, word counts, audio duration, and formatting requirements.</p>
            </div>

            <div className="workflow-step-card">
              <span className="step-num">02</span>
              <h4>Review Auditions & Bids</h4>
              <p>Receive custom proposals, compare voice reel samples, and inspect verified linguist portfolios.</p>
            </div>

            <div className="workflow-step-card">
              <span className="step-num">03</span>
              <h4>Escrow Milestone Funding</h4>
              <p>Deposit project funds securely in escrow. Freelancers work with peace of mind knowing funds are verified.</p>
            </div>

            <div className="workflow-step-card">
              <span className="step-num">04</span>
              <h4>Review, Approve & Deliver</h4>
              <p>Download your polished translations and audio files. Release payment only when 100% satisfied.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <div>
              <span style={{ fontSize: "12px", fontWeight: "800", color: "#93c5fd", letterSpacing: "1.5px" }}>
                GET STARTED TODAY
              </span>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff", marginTop: "8px" }}>
                Ready to speak to the world?
              </h2>
              <p style={{ color: "#dbeafe", marginTop: "8px", maxWidth: "500px", fontSize: "15px" }}>
                Join thousands of businesses and creators scaling their global impact through Freeio.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/client/create" className="btn btn-primary" style={{ background: "#ffffff", color: "#2563eb", fontWeight: "700" }}>
                Post a Project Now
              </Link>
              <Link to="/register?role=freelancer" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#ffffff" }}>
                Join as Freelancer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              </ul>
            </div>

            <div className="footer-col">
              <h4>Stay Connected</h4>
              <p className="footer-copyright" style={{ marginTop: "12px" }}>
                © {new Date().getFullYear()} Freeio Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
