import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./Jobs.css";

const defaultLanguageJobs = [
  {
    id: "1",
    title: "Spanish to English Medical & Legal Document Translation",
    category: "Translation",
    description: "Certified translation needed for 8,500 words of clinical research summaries, consent forms, and protocol documentations. Native fluency and technical medical terminology knowledge required.",
    skills: ["Translation", "Spanish", "English", "Medical Translation", "Legal Translation"],
    budget: "$650",
    budgetType: "Fixed Price",
    proposals: 6,
    posted: "1 day ago",
  },
  {
    id: "2",
    title: "Multilingual RPG Game Localization (English to Japanese & German)",
    category: "Localization",
    description: "Translate dialogue strings, character backstories, items, and UI tooltips for a fantasy RPG on Steam and Nintendo Switch. Maintain immersive tone and creative narrative style.",
    skills: ["Localization", "Japanese", "German", "Game Localization", "Creative Writing"],
    budget: "$2,400",
    budgetType: "Fixed Price",
    proposals: 9,
    posted: "2 days ago",
  },
  {
    id: "3",
    title: "Anime & Animated Series Character Dubbing in Neutral Spanish",
    category: "Dubbing & Voiceover",
    description: "Voice casting for two lead characters across a 12-episode animated series. Requires studio-grade audio delivery (clean WAV, no room noise, Pro Tools sync) and professional vocal range.",
    skills: ["Dubbing", "Voice Acting", "Spanish", "Lip Sync", "Audio Mastering"],
    budget: "$1,200",
    budgetType: "Fixed Price",
    proposals: 14,
    posted: "3 days ago",
  },
  {
    id: "4",
    title: "60-Minute Financial Podcast Audio Transcription with Timestamps",
    category: "Transcription",
    description: "Transcribe a high-tempo fintech interview podcast with two speakers. Must include speaker tags, timestamps every 2 minutes, and clean verbatim text.",
    skills: ["Transcription", "English", "Audio Transcription", "Finance", "Timestamps"],
    budget: "$220",
    budgetType: "Fixed Price",
    proposals: 11,
    posted: "4 days ago",
  },
  {
    id: "5",
    title: "Video Subtitling & Captioning for YouTube Educational Channel",
    category: "Subtitling",
    description: "Create accurately synced SRT subtitles in English, Spanish, and French for 5 science documentary videos (approx 20 mins each). Format for YouTube and international broadcast.",
    skills: ["Subtitling", "SRT", "French", "Spanish", "Closed Captions"],
    budget: "$450",
    budgetType: "Fixed Price",
    proposals: 8,
    posted: "5 days ago",
  },
  {
    id: "6",
    title: "French to English Technical Manual & Software String Translation",
    category: "Translation",
    description: "Translate enterprise cloud architecture manuals and JSON localization files from French to English. Must adhere to glossary and software terminology.",
    skills: ["Translation", "French", "English", "Technical Translation", "JSON"],
    budget: "$850",
    budgetType: "Fixed Price",
    proposals: 5,
    posted: "6 days ago",
  },
];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";

  const [jobs, setJobs] = useState(defaultLanguageJobs);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");

  useEffect(() => {
    // Optionally fetch live jobs from backend
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const apiJobs = data.data.map((j) => ({
            id: j._id,
            title: j.title,
            category: j.skills && j.skills[0] ? j.skills[0] : "Translation",
            description: j.description || "Exciting language project opportunity on Freeio.",
            skills: j.skills || ["Translation", "Languages"],
            budget: `$${j.budget}`,
            budgetType: j.budgetType === "hourly" ? "Hourly Rate" : "Fixed Price",
            proposals: 5,
            posted: "Recently",
          }));

          // Merge backend jobs with defaults so there's always a full variety
          setJobs([...apiJobs, ...defaultLanguageJobs]);
        }
      })
      .catch(() => {
        // Fallback to default language jobs
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All Categories" ||
      job.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="jobs-page-wrapper">
      <Navbar />

      <main className="jobs-main-content">
        <div className="container">
          {/* Header */}
          <div className="jobs-page-header">
            <span className="jobs-pill-tag">EXPLORE LANGUAGE & MEDIA PROJECTS</span>
            <h1 className="jobs-page-title">Find Translation, Dubbing & Transcription Jobs</h1>
            <p className="jobs-page-sub">
              Browse projects from global businesses, game studios, and publishers looking for native linguists and voice talent.
            </p>
          </div>

          <div className="jobs-layout-grid">
            {/* Filters Sidebar */}
            <aside className="jobs-sidebar">
              <div className="filter-card">
                <h3 className="filter-heading">Filters</h3>

                <div className="filter-group">
                  <label className="filter-label">Search Keywords</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="e.g. Spanish, Dubbing, Medical..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Service Category</label>
                  <select
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Translation">Translation</option>
                    <option value="Transcription">Transcription</option>
                    <option value="Localization">Localization</option>
                    <option value="Dubbing">Dubbing & Voiceover</option>
                    <option value="Subtitling">Subtitling & Captions</option>
                    <option value="Interpretation">Interpretation</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Budget Range</label>
                  <select
                    className="filter-select"
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                  >
                    <option value="Any Budget">Any Budget</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 - $1000">$500 - $1,000</option>
                    <option value="$1000+">$1,000+</option>
                  </select>
                </div>

                {(searchTerm || selectedCategory !== "All Categories") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Categories");
                    }}
                    className="btn-clear-filters"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Jobs Results List */}
            <div className="jobs-results-column">
              <div className="results-toolbar">
                <span className="results-count">
                  Showing <strong>{filteredJobs.length}</strong> available projects
                </span>
                <select className="results-sort">
                  <option>Most Recent</option>
                  <option>Highest Budget</option>
                  <option>Fewest Proposals</option>
                </select>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="no-jobs-card">
                  <h3>No matching projects found</h3>
                  <p>Try searching for different languages or resetting filters.</p>
                </div>
              ) : (
                <div className="jobs-cards-list">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="job-feed-card">
                      <div className="job-feed-header">
                        <div>
                          <span className="job-badge-cat">{job.category}</span>
                          <h2 className="job-feed-title">
                            <Link to={`/jobs/${job.id}`} style={{ color: "inherit" }}>
                              {job.title}
                            </Link>
                          </h2>
                        </div>
                        <div className="job-feed-price">
                          <strong>{job.budget}</strong>
                          <span>{job.budgetType}</span>
                        </div>
                      </div>

                      <p className="job-feed-desc">{job.description}</p>

                      <div className="job-feed-skills">
                        {job.skills.map((skill) => (
                          <span key={skill} className="skill-pill">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="job-feed-footer">
                        <div className="job-feed-meta">
                          <span>Posted {job.posted}</span>
                          <span className="bullet">•</span>
                          <span>{job.proposals} proposals</span>
                        </div>

                        <Link to={`/jobs/${job.id}`} className="btn-feed-action">
                          View & Submit Proposal →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;