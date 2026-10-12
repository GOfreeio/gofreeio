import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "./Jobs.css";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");
  const [sortOrder, setSortOrder] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setJobs(data.data.map((j) => ({
            id: j._id,
            title: j.title,
            category: j.skills?.[0] || "Project",
            description: j.description || "",
            skills: j.skills || [],
            budget: Number(j.budget) || 0,
            budgetType: j.budgetType === "hourly" ? "Hourly Rate" : "Fixed Price",
            createdAt: j.createdAt,
          })));
        } else {
          setLoadError(data?.message || "Projects could not be loaded.");
        }
      })
      .catch(() => setLoadError("Could not connect to the server. Try again later."))
      .finally(() => setLoading(false));
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

    const matchesBudget = selectedBudget === "Any Budget" || (
      selectedBudget === "Under $500" ? job.budget < 500 :
      selectedBudget === "$500 - $1000" ? job.budget >= 500 && job.budget <= 1000 :
      job.budget > 1000
    );

    return matchesSearch && matchesCategory && matchesBudget;
  });

  const sortedJobs = [...filteredJobs].sort((first, second) => {
    if (sortOrder === "budget") return second.budget - first.budget;
    return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
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
                <select className="results-sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="recent">Most Recent</option>
                  <option value="budget">Highest Budget</option>
                </select>
              </div>

              {loading ? (
                <div className="no-jobs-card"><h3>Loading projects...</h3></div>
              ) : loadError ? (
                <div className="no-jobs-card"><h3>{loadError}</h3></div>
              ) : sortedJobs.length === 0 ? (
                <div className="no-jobs-card">
                  <h3>{jobs.length === 0 ? "No projects have been posted yet" : "No matching projects found"}</h3>
                  <p>Try searching for different languages or resetting filters.</p>
                </div>
              ) : (
                <div className="jobs-cards-list">
                  {sortedJobs.map((job) => (
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
                          <strong>{job.budget ? `$${job.budget}` : "Not specified"}</strong>
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
                          <span>{job.createdAt ? `Posted ${new Date(job.createdAt).toLocaleDateString()}` : "Recently posted"}</span>
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