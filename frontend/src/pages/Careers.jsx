import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../utils/api";
import "./Careers.css";

const initialForm = {
  title: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  description: "",
  requirements: "",
  price: {
    min: "",
    max: "",
    currency: "USD",
    payPeriod: "Hourly",
  },
};

const readApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const body = await response.text();
    if (/^\s*(<!doctype html|<html)/i.test(body)) {
      throw new Error(
        `The API URL returned an HTML page instead of JSON (${response.url}). Check that VITE_API_URL points to the backend and that the backend is running the latest code.`
      );
    }
    throw new Error(`The API returned an unexpected response (${response.status}).`);
  }

  return response.json();
};

export default function Careers() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(apiUrl("/api/career-jobs"));
      const result = await readApiResponse(response);
      if (!response.ok || !result.success || !Array.isArray(result.data)) {
        throw new Error(result.message || "Could not load career openings.");
      }
      setJobs(result.data);
    } catch (error) {
      setErrorMessage(error.message || "Could not load career openings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      price: { ...current.price, [name]: value },
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(apiUrl("/api/career-jobs"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: {
            ...form.price,
            min: Number(form.price.min),
            max: Number(form.price.max),
          },
        }),
      });
      const result = await readApiResponse(response);
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Could not post this opening.");
      }
      setJobs((current) => [result.data, ...current]);
      setForm(initialForm);
      setSuccessMessage("Opening posted and is now visible on the careers page.");
    } catch (error) {
      setErrorMessage(error.message || "Could not post this opening.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Remove this career opening?")) return;
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(apiUrl(`/api/career-jobs/${jobId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await readApiResponse(response);
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not remove this opening.");
      }
      setJobs((current) => current.filter((job) => job._id !== jobId));
      setSuccessMessage("Career opening removed.");
    } catch (error) {
      setErrorMessage(error.message || "Could not remove this opening.");
    }
  };

  return (
    <div className="careers-page">
      <Navbar />
      <header className="careers-hero">
        <div className="container">
          <span className="careers-eyebrow">CAREERS AT FREEIO</span>
          <h1>Do meaningful work with us.</h1>
          <p>Explore current opportunities and help connect people through language and media.</p>
        </div>
      </header>

      <main className="container careers-content">
        {isAdmin && (
          <section className="career-admin-panel">
            <h2>Post a career opening</h2>
            <p>Add an opening here and it will appear on this page as soon as it is posted.</p>
            <form className="career-job-form" onSubmit={handleSubmit}>
              <label>
                Job title
                <input name="title" value={form.title} onChange={handleChange} maxLength="120" required />
              </label>
              <label>
                Department
                <input name="department" value={form.department} onChange={handleChange} maxLength="100" required />
              </label>
              <label>
                Location
                <input name="location" value={form.location} onChange={handleChange} maxLength="120" required />
              </label>
              <label>
                Employment type
                <select name="employmentType" value={form.employmentType} onChange={handleChange}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </label>
              <fieldset className="career-price-section career-form-wide">
                <legend>Price / hourly rate</legend>
                <p>Set the compensation range and currency for this opening.</p>
                <div className="career-price-fields">
                  <label>
                    Minimum
                    <input
                      name="min"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price.min}
                      onChange={handlePriceChange}
                      required
                    />
                  </label>
                  <label>
                    Maximum
                    <input
                      name="max"
                      type="number"
                      min={form.price.min || "0"}
                      step="0.01"
                      value={form.price.max}
                      onChange={handlePriceChange}
                      required
                    />
                  </label>
                  <label>
                    Currency code
                    <input
                      name="currency"
                      value={form.price.currency}
                      onChange={handlePriceChange}
                      maxLength="3"
                      pattern="[A-Za-z]{3}"
                      placeholder="USD"
                      required
                    />
                  </label>
                  <label>
                    Pay period
                    <select name="payPeriod" value={form.price.payPeriod} onChange={handlePriceChange}>
                      <option>Hourly</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </label>
                </div>
              </fieldset>
              <label className="career-form-wide">
                Description
                <textarea name="description" value={form.description} onChange={handleChange} maxLength="5000" rows="5" required />
              </label>
              <label className="career-form-wide">
                Requirements <span>(optional)</span>
                <textarea name="requirements" value={form.requirements} onChange={handleChange} maxLength="5000" rows="4" />
              </label>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Posting..." : "Post opening"}
              </button>
            </form>
          </section>
        )}

        {errorMessage && <div className="careers-alert careers-error" role="alert">{errorMessage}</div>}
        {successMessage && <div className="careers-alert careers-success" role="status">{successMessage}</div>}

        <section className="career-list-section">
          <div className="career-list-heading">
            <div>
              <span className="careers-eyebrow">OPEN POSITIONS</span>
              <h2>Find your next opportunity</h2>
            </div>
            {!loading && <span className="career-count">{jobs.length} {jobs.length === 1 ? "opening" : "openings"}</span>}
          </div>

          {loading ? (
            <p className="career-empty-state">Loading openings...</p>
          ) : jobs.length === 0 ? (
            <div className="career-empty-state">
              <h3>No open positions right now</h3>
              <p>Please check back later for new opportunities at Freeio.</p>
            </div>
          ) : (
            <div className="career-job-list">
              {jobs.map((job) => (
                <article className="career-job-card" key={job._id}>
                  <div className="career-job-details">
                    <span className="career-department">{job.department}</span>
                    <h3>{job.title}</h3>
                    <div className="career-job-meta">
                      <span>{job.location}</span>
                      <span>{job.employmentType}</span>
                      {job.price && (
                        <span>
                          {job.price.currency} {job.price.min.toLocaleString()}–{job.price.max.toLocaleString()} / {job.price.payPeriod.toLowerCase()}
                        </span>
                      )}
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="career-description">{job.description}</p>
                    {job.requirements && (
                      <div className="career-requirements">
                        <h4>Requirements</h4>
                        <p>{job.requirements}</p>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="career-delete-button"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
