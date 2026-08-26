// Modern Concerns Page - AapkaKaam (with scroll to top)

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Concern.css";

import { SERVER_URL } from "../utils/base";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
const API_URL = SERVER_URL;

const CATEGORY_OPTIONS = [
  { value: "Payment", icon: "💳", color: "#7C3AED", label: "Payment", labelHindi: "भुगतान" },
  { value: "Booking", icon: "📅", color: "#4F46E5", label: "Booking", labelHindi: "बुकिंग" },
  { value: "Service", icon: "⚡", color: "#059669", label: "Service", labelHindi: "सेवा" },
  { value: "Vendor", icon: "🏪", color: "#D97706", label: "Vendor", labelHindi: "विक्रेता" },
  { value: "User", icon: "👤", color: "#2563EB", label: "User", labelHindi: "उपयोगकर्ता" },
  {
    value: "Cancellation",
    icon: "❌",
    color: "#EF4444",
    label: "Cancellation",
    labelHindi: "रद्दीकरण",
  },
  { value: "Refund", icon: "💰", color: "#059669", label: "Refund", labelHindi: "धनवापसी" },
  { value: "Technical", icon: "⚙️", color: "#DC2626", label: "Technical", labelHindi: "तकनीकी" },
  { value: "Other", icon: "📌", color: "#6B7280", label: "Other", labelHindi: "अन्य" },
];

const PRIORITY_OPTIONS = [
  { value: "Low", icon: "🟢", color: "#10B981", label: "Low", labelHindi: "कम" },
  { value: "Medium", icon: "🟡", color: "#F59E0B", label: "Medium", labelHindi: "मध्यम" },
  { value: "High", icon: "🟠", color: "#F97316", label: "High", labelHindi: "उच्च" },
  { value: "Critical", icon: "🔴", color: "#EF4444", label: "Critical", labelHindi: "गंभीर" },
];

const STATUS_CONFIG = {
  Open: { label: "Open", icon: "🟦", color: "#3B82F6", bg: "#EFF6FF", labelHindi: "खुला" },
  InProgress: {
    label: "In Progress",
    icon: "🟨",
    color: "#D97706",
    bg: "#FFFBEB",
    labelHindi: "प्रगति में",
  },
  Resolved: {
    label: "Resolved",
    icon: "✅",
    color: "#059669",
    bg: "#ECFDF5",
    labelHindi: "हल किया गया",
  },
  Rejected: {
    label: "Rejected",
    icon: "❌",
    color: "#DC2626",
    bg: "#FEF2F2",
    labelHindi: "अस्वीकृत",
  },
  Closed: {
    label: "Closed",
    icon: "🔒",
    color: "#6B7280",
    bg: "#F3F4F6",
    labelHindi: "बंद किया गया",
  },
};

const Concerns = () => {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

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
        title: lang === "hin" ? "विफल" : "Failed",
        text:
          error.response?.data?.message ||
          (lang === "hin" ? "आपकी शिकायतें लोड नहीं हो पाईं" : "Unable to load your concerns"),
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
        title: lang === "hin" ? "श्रेणी आवश्यक" : "Category Required",
        text: lang === "hin" ? "कृपया एक श्रेणी चुनें।" : "Please select a concern category.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    if (!formData.subject.trim()) {
      Swal.fire({
        icon: "warning",
        title: lang === "hin" ? "विषय आवश्यक" : "Subject Required",
        text: lang === "hin" ? "कृपया विषय दर्ज करें।" : "Please enter a subject.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: lang === "hin" ? "विवरण आवश्यक" : "Description Required",
        text: lang === "hin" ? "कृपया अपनी समस्या का विवरण दें।" : "Please describe your concern.",
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
          title: lang === "hin" ? "शिकायत सबमिट की गई!" : "Concern Submitted!",
          text:
            lang === "hin"
              ? "आपकी शिकायत सफलतापूर्वक सबमिट हो गई है।"
              : "Your concern has been submitted successfully.",
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
        title: lang === "hin" ? "सबमिट विफल" : "Submission Failed",
        text:
          error.response?.data?.message ||
          (lang === "hin" ? "आपकी शिकायत सबमिट नहीं हो पाई" : "Unable to submit your concern"),
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
    return new Date(date).toLocaleString(lang === "hin" ? "hi-IN" : "en-IN", {
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

  const getStatusLabel = (status) => {
    const config = getStatusConfig(status);
    return lang === "hin" ? config.labelHindi : config.label;
  };

  const getPriorityLabel = (priority) => {
    const config = getPriorityConfig(priority);
    return lang === "hin" ? config.labelHindi : config.label;
  };

  const getCategoryLabel = (category) => {
    const config = getCategoryConfig(category);
    return lang === "hin" ? config.labelHindi : config.label;
  };

  const filteredConcerns = concerns.filter((concern) => {
    const matchesSearch = concern.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || concern.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="concerns-modern" ref={containerRef}>
      {/* ========== HEADER ========== */}
      <div className="concerns-header-modern">
        <div className="header-left-modern">
          <div className="header-icon-wrapper-modern">
            <span className="header-icon-modern">🎫</span>
          </div>
          <div>
            <h1>{lang === "hin" ? "मेरी शिकायतें" : "My Concerns"}</h1>
            <p>
              {lang === "hin"
                ? "अपनी शिकायतें सबमिट करें और ट्रैक करें"
                : "Submit and track your support requests"}
            </p>
          </div>
        </div>
        <div className="header-actions-modern">
          <button className="back-btn-modern" onClick={() => navigate("/")}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {lang === "hin" ? "वापस" : "Back"}
          </button>
          <button
            className={`new-concern-btn-modern ${showForm ? "active" : ""}`}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? (
              <>✕ {lang === "hin" ? "बंद करें" : "Close"}</>
            ) : (
              <>
                <span className="btn-icon-modern">+</span>{" "}
                {lang === "hin" ? "नई शिकायत" : "New Concern"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========== CREATE CONCERN FORM ========== */}
      {showForm && (
        <div className="concern-form-modern">
          <div className="form-header-modern">
            <div>
              <h3>{lang === "hin" ? "शिकायत सबमिट करें" : "Submit a Concern"}</h3>
              <p>
                {lang === "hin"
                  ? "अपनी समस्या के बारे में हमें बताएं"
                  : "Tell us about the issue you're facing"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row-modern">
              <div className="form-group-modern">
                <label>
                  {lang === "hin" ? "श्रेणी" : "Category"} <span className="required">*</span>
                </label>
                <div className="category-select-wrapper-modern">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select-modern"
                  >
                    <option value="">{lang === "hin" ? "श्रेणी चुनें" : "Select Category"}</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {lang === "hin" ? category.labelHindi : category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-modern">
                <label>
                  {lang === "hin" ? "प्राथमिकता" : "Priority"} <span className="required">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="select-modern"
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.icon} {lang === "hin" ? priority.labelHindi : priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-modern">
              <label>
                {lang === "hin" ? "विषय" : "Subject"} <span className="required">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={
                  lang === "hin"
                    ? "अपनी समस्या का संक्षिप्त विवरण"
                    : "Brief summary of your concern"
                }
                maxLength={200}
                className="input-modern"
              />
              <div className="char-counter">{formData.subject.length}/200</div>
            </div>

            <div className="form-group-modern">
              <label>
                {lang === "hin" ? "विवरण" : "Description"} <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={
                  lang === "hin"
                    ? "अपनी समस्या का विस्तृत विवरण दें..."
                    : "Please provide detailed information about your issue..."
                }
                rows={6}
                maxLength={5000}
                className="textarea-modern"
              />
              <div className="char-counter">{formData.description.length}/5000</div>
            </div>

            <div className="form-actions-modern">
              <button
                type="button"
                className="cancel-btn-modern"
                onClick={() => setShowForm(false)}
                disabled={submitLoading}
              >
                {lang === "hin" ? "रद्द करें" : "Cancel"}
              </button>
              <button type="submit" className="submit-concern-btn-modern" disabled={submitLoading}>
                {submitLoading ? (
                  <>
                    <span className="spinner-modern"></span>{" "}
                    {lang === "hin" ? "सबमिट हो रहा..." : "Submitting..."}
                  </>
                ) : (
                  <>✨ {lang === "hin" ? "शिकायत सबमिट करें" : "Submit Concern"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== CONCERNS LIST ========== */}
      <div className="concerns-list-modern">
        <div className="section-header-modern">
          <div className="section-left-modern">
            <h3>{lang === "hin" ? "सभी शिकायतें" : "All Concerns"}</h3>
            <span className="concern-count-modern">
              {concerns.length} {lang === "hin" ? "कुल" : "total"}
            </span>
          </div>

          <div className="section-controls-modern">
            <div className="search-wrapper-modern">
              <span className="search-icon-modern">🔍</span>
              <input
                type="text"
                placeholder={lang === "hin" ? "शिकायतें खोजें..." : "Search concerns..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-modern"
              />
            </div>

            <select
              className="filter-select-modern"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">{lang === "hin" ? "सभी स्थितियाँ" : "All Status"}</option>
              {Object.keys(STATUS_CONFIG).map((status) => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].icon} {getStatusLabel(status)}
                </option>
              ))}
            </select>

            <button className="refresh-btn-modern" onClick={fetchConcerns} disabled={loading}>
              <span className={`refresh-icon-modern ${loading ? "spinning" : ""}`}>⟳</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="concern-loading-modern">
            <div className="loading-spinner-modern"></div>
            <p>{lang === "hin" ? "आपकी शिकायतें लोड हो रही हैं..." : "Loading your concerns..."}</p>
          </div>
        ) : filteredConcerns.length === 0 ? (
          <div className="empty-concerns-modern">
            <div className="empty-icon-modern">📭</div>
            <h3>{lang === "hin" ? "कोई शिकायत नहीं मिली" : "No concerns found"}</h3>
            <p>
              {searchTerm || filterStatus
                ? lang === "hin"
                  ? "आपकी खोज से मेल खाने वाली कोई शिकायत नहीं"
                  : "No concerns match your search criteria"
                : lang === "hin"
                  ? "यदि आपको कोई समस्या है, तो नई शिकायत सबमिट करें"
                  : "If you're facing an issue, submit a new concern"}
            </p>
            {searchTerm || filterStatus ? (
              <button
                className="clear-filters-btn-modern"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("");
                }}
              >
                {lang === "hin" ? "फ़िल्टर साफ़ करें" : "Clear Filters"}
              </button>
            ) : (
              <button className="new-concern-btn-modern" onClick={() => setShowForm(true)}>
                + {lang === "hin" ? "शिकायत सबमिट करें" : "Submit Concern"}
              </button>
            )}
          </div>
        ) : (
          <div className="concerns-grid-modern">
            {filteredConcerns.map((concern) => {
              const statusConfig = getStatusConfig(concern.status);
              const priorityConfig = getPriorityConfig(concern.priority);
              const categoryConfig = getCategoryConfig(concern.category);

              return (
                <div className="concern-card-modern" key={concern._id}>
                  <div className="concern-card-header-modern">
                    <div className="concern-card-top-modern">
                      <span
                        className="category-badge-modern"
                        style={{
                          background: categoryConfig.color + "20",
                          color: categoryConfig.color,
                        }}
                      >
                        {categoryConfig.icon} {getCategoryLabel(concern.category)}
                      </span>
                      <span className={`status-badge-modern ${concern.status.toLowerCase()}`}>
                        {statusConfig.icon} {getStatusLabel(concern.status)}
                      </span>
                    </div>
                    <h4 className="concern-card-title-modern">{concern.subject}</h4>
                  </div>

                  <p className="concern-card-description-modern">
                    {concern.description?.length > 120
                      ? `${concern.description.substring(0, 120)}...`
                      : concern.description}
                  </p>

                  <div className="concern-card-meta-modern">
                    <span
                      className="priority-badge-modern"
                      style={{
                        background: priorityConfig.color + "20",
                        color: priorityConfig.color,
                      }}
                    >
                      {priorityConfig.icon} {getPriorityLabel(concern.priority)}
                    </span>
                    <span className="date-badge-modern">📅 {formatDate(concern.createdAt)}</span>
                  </div>

                  {concern.adminResponse && (
                    <div className="admin-response-preview-modern">
                      <span className="response-icon-modern">💬</span>
                      <p>{concern.adminResponse.substring(0, 80)}...</p>
                    </div>
                  )}

                  <button
                    className="view-concern-btn-modern"
                    onClick={() => handleViewConcern(concern)}
                  >
                    {lang === "hin" ? "विवरण देखें" : "View Details"} →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========== CONCERN DETAILS MODAL ========== */}
      {selectedConcern && (
        <div className="concern-modal-overlay-modern" onClick={closeDetails}>
          <div className="concern-modal-modern" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn-modern" onClick={closeDetails}>
              ✕
            </button>

            <div className="modal-content-modern">
              <div className="modal-header-modern">
                <div className="modal-header-left-modern">
                  <span
                    className="modal-category-modern"
                    style={{
                      background: getCategoryConfig(selectedConcern.category).color + "20",
                      color: getCategoryConfig(selectedConcern.category).color,
                    }}
                  >
                    {getCategoryConfig(selectedConcern.category).icon}{" "}
                    {getCategoryLabel(selectedConcern.category)}
                  </span>
                  <h2>{selectedConcern.subject}</h2>
                </div>
                <div className="modal-status-group-modern">
                  <span
                    className={`status-badge-modern ${selectedConcern.status.toLowerCase()} large`}
                  >
                    {getStatusConfig(selectedConcern.status).icon}{" "}
                    {getStatusLabel(selectedConcern.status)}
                  </span>
                </div>
              </div>

              <div className="modal-meta-modern">
                <div className="meta-item-modern">
                  <span className="meta-label-modern">
                    {lang === "hin" ? "प्राथमिकता" : "Priority"}
                  </span>
                  <span
                    className="priority-value-modern"
                    style={{
                      color: getPriorityConfig(selectedConcern.priority).color,
                    }}
                  >
                    {getPriorityConfig(selectedConcern.priority).icon}{" "}
                    {getPriorityLabel(selectedConcern.priority)}
                  </span>
                </div>
                <div className="meta-item-modern">
                  <span className="meta-label-modern">
                    {lang === "hin" ? "सबमिट किया गया" : "Submitted"}
                  </span>
                  <span>{formatDate(selectedConcern.createdAt)}</span>
                </div>
                {selectedConcern.resolvedAt && (
                  <div className="meta-item-modern">
                    <span className="meta-label-modern">
                      {lang === "hin" ? "हल किया गया" : "Resolved"}
                    </span>
                    <span>{formatDate(selectedConcern.resolvedAt)}</span>
                  </div>
                )}
              </div>

              <div className="detail-section-modern">
                <h3>📝 {lang === "hin" ? "विवरण" : "Description"}</h3>
                <div className="detail-content-modern">
                  <p>{selectedConcern.description}</p>
                </div>
              </div>

              <div className="detail-section-modern">
                <h3>💬 {lang === "hin" ? "प्रशासक प्रतिक्रिया" : "Admin Response"}</h3>
                {selectedConcern.adminResponse ? (
                  <div className="admin-response-content-modern">
                    <p>{selectedConcern.adminResponse}</p>
                    {selectedConcern.resolvedAt && (
                      <small>
                        {lang === "hin" ? "अपडेट किया गया" : "Updated"}{" "}
                        {formatDate(selectedConcern.resolvedAt)}
                      </small>
                    )}
                  </div>
                ) : (
                  <div className="waiting-response-modern">
                    <div className="waiting-icon-modern">⏳</div>
                    <p>
                      {lang === "hin"
                        ? "आपकी शिकायत की समीक्षा की जा रही है"
                        : "Your concern is being reviewed by the admin team"}
                    </p>
                    <span className="waiting-subtext-modern">
                      {lang === "hin"
                        ? "अपडेट होने पर आपको सूचित किया जाएगा"
                        : "You'll be notified when there's an update"}
                    </span>
                  </div>
                )}
              </div>

              {selectedConcern.attachments?.length > 0 && (
                <div className="detail-section-modern">
                  <h3>📎 {lang === "hin" ? "अटैचमेंट" : "Attachments"}</h3>
                  <div className="attachment-list-modern">
                    {selectedConcern.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attachment-item-modern"
                      >
                        <span className="attachment-icon-modern">📄</span>
                        {attachment.name ||
                          `${lang === "hin" ? "अटैचमेंट" : "Attachment"} ${index + 1}`}
                        <span className="attachment-arrow-modern">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-footer-modern">
                <button className="close-details-btn-modern" onClick={closeDetails}>
                  {lang === "hin" ? "बंद करें" : "Close"}
                </button>
                <button
                  className="refresh-details-btn-modern"
                  onClick={() => {
                    fetchConcerns();
                    closeDetails();
                  }}
                >
                  ⟳ {lang === "hin" ? "रिफ्रेश करें" : "Refresh"}
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
