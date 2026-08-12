import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Concern.css";

import { SERVER_URL } from "../utils/base";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
const API_URL = SERVER_URL;

const CATEGORY_OPTIONS = [
  { value: "Payment", icon: "💳", color: "#7C3AED" },
  { value: "Booking", icon: "📅", color: "#4F46E5" },
  { value: "Service", icon: "⚡", color: "#059669" },
  { value: "Vendor", icon: "🏪", color: "#D97706" },
  { value: "User", icon: "👤", color: "#2563EB" },
  { value: "Cancellation", icon: "❌", color: "#EF4444" },
  { value: "Refund", icon: "💰", color: "#059669" },
  { value: "Technical", icon: "⚙️", color: "#DC2626" },
  { value: "Other", icon: "📌", color: "#6B7280" },
];

const PRIORITY_OPTIONS = [
  { value: "Low", icon: "🟢", color: "#10B981" },
  { value: "Medium", icon: "🟡", color: "#F59E0B" },
  { value: "High", icon: "🟠", color: "#F97316" },
  { value: "Critical", icon: "🔴", color: "#EF4444" },
];

const STATUS_CONFIG = {
  Open: { label: "Open", icon: "🟦", color: "#3B82F6", bg: "#EFF6FF" },
  InProgress: { label: "In Progress", icon: "🟨", color: "#D97706", bg: "#FFFBEB" },
  Resolved: { label: "Resolved", icon: "✅", color: "#059669", bg: "#ECFDF5" },
  Rejected: { label: "Rejected", icon: "❌", color: "#DC2626", bg: "#FEF2F2" },
  Closed: { label: "Closed", icon: "🔒", color: "#6B7280", bg: "#F3F4F6" },
};

const Concerns = () => {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;

  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "Medium",
    attachments: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const getHeaders = () => {
    return {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchConcerns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/concerns`, {
        headers: getHeaders(),
      });

      if (response.data?.success) {
        setConcerns(response.data.concerns || []);
      }
    } catch (error) {
      console.error("fetchConcerns error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Unable to load your concerns",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      Swal.fire({
        icon: "warning",
        title: "Category Required",
        text: "Please select a concern category.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    if (!formData.subject.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Subject Required",
        text: "Please enter a subject.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Description Required",
        text: "Please describe your concern.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      const response = await axios.post(
        `${API_URL}/concerns`,
        {
          category: formData.category,
          subject: formData.subject.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          attachments: formData.attachments,
        },
        {
          headers: getHeaders(),
        },
      );

      if (response.data?.success) {
        await Swal.fire({
          icon: "success",
          title: "Concern Submitted!",
          text: "Your concern has been submitted successfully.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        setFormData({
          category: "",
          subject: "",
          description: "",
          priority: "Medium",
          attachments: [],
        });
        setShowForm(false);
        fetchConcerns();
      }
    } catch (error) {
      console.error("handleSubmit error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "Unable to submit your concern",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewConcern = (concern) => {
    setSelectedConcern(concern);
    document.body.style.overflow = "hidden";
  };

  const closeDetails = () => {
    setSelectedConcern(null);
    document.body.style.overflow = "auto";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.Open;
  };

  const getPriorityConfig = (priority) => {
    return PRIORITY_OPTIONS.find((p) => p.value === priority) || PRIORITY_OPTIONS[0];
  };

  const getCategoryConfig = (category) => {
    return CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];
  };

  const filteredConcerns = concerns.filter((concern) => {
    const matchesSearch = concern.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || concern.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="concerns-page">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="concerns-header">
        <div className="header-left">
          <div className="header-icon-wrapper">
            <div className="header-icon-pulse"></div>
            <span className="header-icon">🎫</span>
          </div>
          <div>
            <h1>My Concerns</h1>
            <p>Submit and track your support requests</p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <button
            className="add-leave-btn"
            onClick={() => navigate("/")}
            style={{ backgroundColor: "red", marginRight: ".5rem" }}
          >
            Back
          </button>
          <button
            className={`new-concern-btn ${showForm ? "active" : ""}`}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? (
              <>✕ Close</>
            ) : (
              <>
                <span className="btn-icon">+</span> New Concern
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================
          CREATE CONCERN FORM
      ============================================ */}

      {showForm && (
        <div className="concern-form-card">
          <div className="form-header">
            <div>
              <h3>Submit a Concern</h3>
              <p>Tell us about the issue you're facing</p>
            </div>
            <div className="form-steps">
              <span className="step-dot active"></span>
              <span className="step-dot"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Category <span className="required">*</span>
                </label>
                <div className="category-select-wrapper">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select-modern"
                  >
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.value}
                      </option>
                    ))}
                  </select>
                  {formData.category && (
                    <span className="category-badge">
                      {getCategoryConfig(formData.category).icon}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Priority <span className="required">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="select-modern"
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.icon} {priority.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                Subject <span className="required">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of your concern"
                maxLength={200}
                className="input-modern"
              />
              <div className="char-counter">{formData.subject.length}/200</div>
            </div>

            <div className="form-group">
              <label>
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide detailed information about your issue..."
                rows={6}
                maxLength={5000}
                className="textarea-modern"
              />
              <div className="char-counter">{formData.description.length}/5000</div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button type="submit" className="submit-concern-btn" disabled={submitLoading}>
                {submitLoading ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  <>✨ Submit Concern</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================
          CONCERNS LIST
      ============================================ */}

      <div className="concerns-list-section">
        <div className="section-header">
          <div className="section-left">
            <h3>All Concerns</h3>
            <span className="concern-count">{concerns.length} total</span>
          </div>

          <div className="section-controls">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search concerns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {Object.keys(STATUS_CONFIG).map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].icon} {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>

            <button className="refresh-btn" onClick={fetchConcerns} disabled={loading}>
              <span className={`refresh-icon ${loading ? "spinning" : ""}`}>⟳</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="concern-loading">
            <div className="loading-spinner"></div>
            <p>Loading your concerns...</p>
          </div>
        ) : filteredConcerns.length === 0 ? (
          <div className="empty-concerns">
            <div className="empty-icon">📭</div>
            <h3>No concerns found</h3>
            <p>
              {searchTerm || filterStatus
                ? "No concerns match your search criteria"
                : "If you're facing an issue, submit a new concern"}
            </p>
            {searchTerm || filterStatus ? (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button className="new-concern-btn" onClick={() => setShowForm(true)}>
                + Submit Concern
              </button>
            )}
          </div>
        ) : (
          <div className="concerns-grid">
            {filteredConcerns.map((concern) => {
              const statusConfig = getStatusConfig(concern.status);
              const priorityConfig = getPriorityConfig(concern.priority);
              const categoryConfig = getCategoryConfig(concern.category);

              return (
                <div className="concern-card" key={concern._id}>
                  <div className="concern-card-header">
                    <div className="concern-card-top">
                      <span
                        className="category-badge"
                        style={{
                          background: categoryConfig.color + "20",
                          color: categoryConfig.color,
                        }}
                      >
                        {categoryConfig.icon} {concern.category}
                      </span>
                      <span className={`status-badge ${concern.status.toLowerCase()}`}>
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                    <h4 className="concern-card-title">{concern.subject}</h4>
                  </div>

                  <p className="concern-card-description">
                    {concern.description?.length > 120
                      ? `${concern.description.substring(0, 120)}...`
                      : concern.description}
                  </p>

                  <div className="concern-card-meta">
                    <span
                      className="priority-badge"
                      style={{
                        background: priorityConfig.color + "20",
                        color: priorityConfig.color,
                      }}
                    >
                      {priorityConfig.icon} {concern.priority}
                    </span>
                    <span className="date-badge">📅 {formatDate(concern.createdAt)}</span>
                  </div>

                  {concern.adminResponse && (
                    <div className="admin-response-preview">
                      <span className="response-icon">💬</span>
                      <p>{concern.adminResponse.substring(0, 80)}...</p>
                    </div>
                  )}

                  <button className="view-concern-btn" onClick={() => handleViewConcern(concern)}>
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================
          CONCERN DETAILS MODAL
      ============================================ */}

      {selectedConcern && (
        <div className="concern-modal-overlay" onClick={closeDetails}>
          <div className="concern-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeDetails}>
              ✕
            </button>

            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-header-left">
                  <span
                    className="modal-category"
                    style={{
                      background: getCategoryConfig(selectedConcern.category).color + "20",
                      color: getCategoryConfig(selectedConcern.category).color,
                    }}
                  >
                    {getCategoryConfig(selectedConcern.category).icon} {selectedConcern.category}
                  </span>
                  <h2>{selectedConcern.subject}</h2>
                </div>
                <div className="modal-status-group">
                  <span className={`status-badge ${selectedConcern.status.toLowerCase()} large`}>
                    {getStatusConfig(selectedConcern.status).icon}{" "}
                    {getStatusConfig(selectedConcern.status).label}
                  </span>
                </div>
              </div>

              <div className="modal-meta">
                <div className="meta-item">
                  <span className="meta-label">Priority</span>
                  <span
                    className="priority-value"
                    style={{
                      color: getPriorityConfig(selectedConcern.priority).color,
                    }}
                  >
                    {getPriorityConfig(selectedConcern.priority).icon} {selectedConcern.priority}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Submitted</span>
                  <span>{formatDate(selectedConcern.createdAt)}</span>
                </div>
                {selectedConcern.resolvedAt && (
                  <div className="meta-item">
                    <span className="meta-label">Resolved</span>
                    <span>{formatDate(selectedConcern.resolvedAt)}</span>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>📝 Description</h3>
                <div className="detail-content">
                  <p>{selectedConcern.description}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>💬 Admin Response</h3>
                {selectedConcern.adminResponse ? (
                  <div className="admin-response-content">
                    <p>{selectedConcern.adminResponse}</p>
                    {selectedConcern.resolvedAt && (
                      <small>Updated {formatDate(selectedConcern.resolvedAt)}</small>
                    )}
                  </div>
                ) : (
                  <div className="waiting-response">
                    <div className="waiting-icon">⏳</div>
                    <p>Your concern is being reviewed by the admin team</p>
                    <span className="waiting-subtext">
                      You'll be notified when there's an update
                    </span>
                  </div>
                )}
              </div>

              {selectedConcern.attachments?.length > 0 && (
                <div className="detail-section">
                  <h3>📎 Attachments</h3>
                  <div className="attachment-list">
                    {selectedConcern.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-item"
                      >
                        <span className="attachment-icon">📄</span>
                        {attachment.name || `Attachment ${index + 1}`}
                        <span className="attachment-arrow">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button className="close-details-btn" onClick={closeDetails}>
                  Close
                </button>
                <button
                  className="refresh-details-btn"
                  onClick={() => {
                    fetchConcerns();
                    closeDetails();
                  }}
                >
                  ⟳ Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Concerns;
