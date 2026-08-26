// Modern Leave Management Page - AapkaKaam

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../showAlert";
import Swal from "sweetalert2";
import "./leaveManagement.css";
import { useNavigate } from "react-router";

export default function LeaveManagement() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const category = localStorage.getItem("category");

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );
  const token = `Bearer ${JSON.parse(localStorage.getItem(category)).token}`;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

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

  // Fetch leaves on mount
  useEffect(() => {
    if (token) fetchLeaves();
  }, [token]);

  // Handle success/error messages
  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/vendor/getLeaveStats`, {
        headers: { Authorization: token },
      });
      setLeaves(response.data.data);
      setErr("");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        (lang === "hin" ? "लीव रिकॉर्ड लोड करने में विफल" : "Failed to fetch leave records");
      setErr(errorMessage);
      setTimeout(() => setErr(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLeaveStatus = (leave) => {
    if (leave.status === "cancelled") return "cancelled";
    return leave.classification || "past";
  };

  const getStatusConfig = (status) => {
    const configs = {
      current: {
        bg: "#FFF3E0",
        color: "#E65100",
        label: lang === "hin" ? "वर्तमान" : "Current",
        icon: "🟠",
      },
      future: {
        bg: "#E3F2FD",
        color: "#0D47A1",
        label: lang === "hin" ? "आगामी" : "Upcoming",
        icon: "🔵",
      },
      past: {
        bg: "#F5F5F5",
        color: "#616161",
        label: lang === "hin" ? "पुराना" : "Past",
        icon: "⚪",
      },
      cancelled: {
        bg: "#FFEBEE",
        color: "#C62828",
        label: lang === "hin" ? "रद्द" : "Cancelled",
        icon: "🔴",
      },
    };
    return configs[status] || configs.past;
  };

  const renderLeaveCard = (leave) => {
    const status = getLeaveStatus(leave);
    const config = getStatusConfig(status);

    const fromDate = formatDate(leave.from);
    const toDate = formatDate(leave.to);

    return (
      <div key={leave._id} className="leave-card-modern" style={{ borderLeftColor: config.color }}>
        <div className="leave-card-header-modern">
          <div className="leave-dates-section-modern">
            <div className="leave-date-range-modern">
              <span className="leave-date-modern">{fromDate}</span>
              <span className="date-separator-modern">–</span>
              <span className="leave-date-modern">{toDate}</span>
            </div>
            <span
              className="leave-status-badge-modern"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              {config.icon} {config.label}
            </span>
          </div>
          {(status === "future" || status === "current") && (
            <button
              className="cancel-leave-btn-modern"
              onClick={() => handleCancelLeave(leave._id)}
              disabled={submitting}
            >
              {lang === "hin" ? "रद्द करें" : "Cancel"}
            </button>
          )}
        </div>

        {leave.reason && (
          <div className="leave-reason-section-modern">
            <span className="reason-label-modern">{lang === "hin" ? "कारण:" : "Reason:"}</span>
            <span className="reason-text-modern">{leave.reason}</span>
          </div>
        )}

        <div className="leave-created-date-modern">
          {lang === "hin" ? "बनाया गया:" : "Created:"}{" "}
          {new Date(leave.createdAt).toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    );
  };

  const handleCancelLeave = (leaveId) => {
    const leaveToCancel = leaves.find((l) => l._id === leaveId);
    if (!leaveToCancel) return;

    const fromDate = formatDate(leaveToCancel.from);
    const toDate = formatDate(leaveToCancel.to);

    Swal.fire({
      title: lang === "hin" ? "लीव रद्द करें" : "Cancel Leave",
      html: `
        <div class="delete-leave-confirmation">
          <p>${lang === "hin" ? "क्या आप इस लीव को रद्द करना चाहते हैं?" : "Are you sure you want to cancel this leave?"}</p>
          <div class="leave-period-display">
            <strong>${fromDate}</strong>
            <span class="date-arrow">→</span>
            <strong>${toDate}</strong>
          </div>
          ${leaveToCancel.reason ? `<p class="leave-reason-display">${lang === "hin" ? "कारण" : "Reason"}: ${leaveToCancel.reason}</p>` : ""}
          <p class="warning-text">${lang === "hin" ? "यह क्रिया पूर्ववत नहीं की जा सकती।" : "This action cannot be undone."}</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#1976d2",
      confirmButtonText: lang === "hin" ? "हाँ, लीव रद्द करें" : "Yes, Cancel Leave",
      cancelButtonText: lang === "hin" ? "नहीं, रखें" : "No, Keep It",
      reverseButtons: true,
      width: 450,
      padding: "2rem",
      backdrop: "rgba(0,0,0,0.5)",
      customClass: {
        popup: "swal-popup-custom",
        confirmButton: "swal-confirm-delete-btn",
        cancelButton: "swal-cancel-btn-custom",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        cancelLeave(leaveId);
      }
    });
  };

  const cancelLeave = async (leaveId) => {
    setSubmitting(true);
    try {
      await axios.delete(`${SERVER_URL}/vendor/cancelLeave/${leaveId}`, {
        headers: { Authorization: token },
      });

      setSuccess(lang === "hin" ? "लीव सफलतापूर्वक रद्द की गई" : "Leave cancelled successfully");
      fetchLeaves();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        (lang === "hin" ? "लीव रद्द करने में विफल" : "Failed to cancel leave");
      setErr(errorMessage);
      setTimeout(() => setErr(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const showLeaveForm = () => {
    const today = new Date().toISOString().split("T")[0];

    Swal.fire({
      title: lang === "hin" ? "लीव लें" : "Take Leave",
      html: `
        <div class="leave-form-container">
          <div class="form-group-leave">
            <label for="leave-from">${lang === "hin" ? "से दिनांक" : "From Date"} *</label>
            <input 
              type="date" 
              id="leave-from" 
              class="swal2-input" 
              min="${today}"
            />
            <span id="leave-from-error" class="form-error" style="display:none;"></span>
          </div>
          
          <div class="form-group-leave">
            <label for="leave-to">${lang === "hin" ? "तक दिनांक" : "To Date"} *</label>
            <input 
              type="date" 
              id="leave-to" 
              class="swal2-input" 
              min="${today}"
            />
            <span id="leave-to-error" class="form-error" style="display:none;"></span>
          </div>
          
          <div class="form-group-leave">
            <label for="leave-reason">${lang === "hin" ? "कारण (वैकल्पिक)" : "Reason (Optional)"}</label>
            <textarea 
              id="leave-reason" 
              class="swal2-textarea" 
              rows="3"
              placeholder="${lang === "hin" ? "लीव का संक्षिप्त कारण..." : "Brief reason for leave..."}"
              maxlength="200"
            ></textarea>
            <div class="char-counter">0/200</div>
            <span id="leave-reason-error" class="form-error" style="display:none;"></span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d32f2f",
      confirmButtonText: lang === "hin" ? "लीव की पुष्टि करें" : "Confirm Leave",
      cancelButtonText: lang === "hin" ? "रद्द करें" : "Cancel",
      reverseButtons: true,
      width: 500,
      padding: "2rem",
      backdrop: "rgba(0,0,0,0.5)",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      customClass: {
        popup: "swal-popup-custom",
        confirmButton: "swal-confirm-btn-custom",
        cancelButton: "swal-cancel-btn-custom",
      },
      didOpen: () => {
        const fromInput = document.getElementById("leave-from");
        const toInput = document.getElementById("leave-to");
        const reasonInput = document.getElementById("leave-reason");
        const charCounter = document.querySelector(".char-counter");

        if (fromInput) {
          fromInput.addEventListener("change", () => {
            if (toInput) {
              toInput.min = fromInput.value || today;
            }
            const errorEl = document.getElementById("leave-from-error");
            if (errorEl) {
              errorEl.style.display = "none";
              fromInput.classList.remove("swal2-input-error");
            }
          });
        }

        if (toInput) {
          toInput.addEventListener("change", () => {
            const errorEl = document.getElementById("leave-to-error");
            if (errorEl) {
              errorEl.style.display = "none";
              toInput.classList.remove("swal2-input-error");
            }
          });
        }

        if (reasonInput && charCounter) {
          reasonInput.addEventListener("input", (e) => {
            charCounter.textContent = `${e.target.value.length}/200`;
            if (e.target.value.length > 200) {
              const errorEl = document.getElementById("leave-reason-error");
              if (errorEl) {
                errorEl.textContent =
                  lang === "hin"
                    ? "कारण 200 अक्षरों से अधिक नहीं हो सकता"
                    : "Reason cannot exceed 200 characters";
                errorEl.style.display = "block";
                reasonInput.classList.add("swal2-input-error");
              }
            } else {
              const errorEl = document.getElementById("leave-reason-error");
              if (errorEl) {
                errorEl.style.display = "none";
                reasonInput.classList.remove("swal2-input-error");
              }
            }
          });
        }
      },
      preConfirm: () => {
        const from = document.getElementById("leave-from").value;
        const to = document.getElementById("leave-to").value;
        const reason = document.getElementById("leave-reason").value;

        const errors = {};
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (!from) {
          errors.from = lang === "hin" ? "प्रारंभ दिनांक आवश्यक है" : "Start date is required";
        } else {
          const fromDate = new Date(from);
          fromDate.setHours(0, 0, 0, 0);
          if (fromDate < todayDate) {
            errors.from =
              lang === "hin"
                ? "प्रारंभ दिनांक अतीत में नहीं हो सकती"
                : "Start date cannot be in the past";
          }
        }

        if (!to) {
          errors.to = lang === "hin" ? "अंतिम दिनांक आवश्यक है" : "End date is required";
        } else {
          const toDate = new Date(to);
          toDate.setHours(0, 0, 0, 0);
          if (toDate < todayDate) {
            errors.to =
              lang === "hin"
                ? "अंतिम दिनांक अतीत में नहीं हो सकती"
                : "End date cannot be in the past";
          }
        }

        if (from && to) {
          const fromDate = new Date(from);
          const toDate = new Date(to);
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);

          if (toDate < fromDate) {
            errors.to =
              lang === "hin"
                ? "अंतिम दिनांक प्रारंभ दिनांक के बाद होनी चाहिए"
                : "End date must be after start date";
          }
        }

        if (reason && reason.length > 200) {
          errors.reason =
            lang === "hin"
              ? "कारण 200 अक्षरों से कम होना चाहिए"
              : "Reason must be less than 200 characters";
        }

        if (Object.keys(errors).length > 0) {
          if (errors.from) {
            const fromError = document.getElementById("leave-from-error");
            if (fromError) {
              fromError.textContent = errors.from;
              fromError.style.display = "block";
            }
            document.getElementById("leave-from").classList.add("swal2-input-error");
          }

          if (errors.to) {
            const toError = document.getElementById("leave-to-error");
            if (toError) {
              toError.textContent = errors.to;
              toError.style.display = "block";
            }
            document.getElementById("leave-to").classList.add("swal2-input-error");
          }

          if (errors.reason) {
            const reasonError = document.getElementById("leave-reason-error");
            if (reasonError) {
              reasonError.textContent = errors.reason;
              reasonError.style.display = "block";
            }
            document.getElementById("leave-reason").classList.add("swal2-input-error");
          }

          return false;
        }

        return { from, to, reason };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setSubmitting(true);
        axios
          .post(`${SERVER_URL}/vendor/createLeave`, result.value, {
            headers: { Authorization: token },
          })
          .then((response) => {
            setSuccess(lang === "hin" ? "लीव सफलतापूर्वक बनाई गई" : "Leave created successfully");
            fetchLeaves();
            setTimeout(() => setSuccess(""), 3000);
          })
          .catch((error) => {
            const errorMessage =
              error?.response?.data?.message ||
              (lang === "hin" ? "लीव बनाने में विफल" : "Failed to create leave");
            setErr(errorMessage);
            setTimeout(() => setErr(""), 3000);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    });
  };

  // Filter leaves by status for display
  const renderLeavesByStatus = (status) => {
    const filtered = leaves.filter((leave) => getLeaveStatus(leave) === status);

    if (filtered.length === 0) {
      return (
        <div className="no-leaves-message-modern">
          <span className="empty-icon">📭</span>
          <p>
            {lang === "hin"
              ? `कोई ${getStatusConfig(status).label.toLowerCase()} लीव नहीं`
              : `No ${status} leaves`}
          </p>
        </div>
      );
    }

    return filtered.map((leave) => renderLeaveCard(leave));
  };

  if (loading) {
    return (
      <div className="leave-management-loading-modern">
        <div className="loading-spinner-modern"></div>
        <p>{lang === "hin" ? "लीव लोड हो रही है..." : "Loading leaves..."}</p>
      </div>
    );
  }

  return (
    <div className="leave-management-modern" ref={containerRef}>
      <div className="leave-management-container-modern">
        {/* Header */}
        <div className="leave-header-modern">
          <div className="leave-header-left-modern">
            <div className="header-icon-wrapper-modern">
              <span className="header-icon-modern">🏖️</span>
            </div>
            <div>
              <h1>{lang === "hin" ? "लीव प्रबंधन" : "Leave Management"}</h1>
              <p>
                {lang === "hin" ? "अपनी लीव देखें और प्रबंधित करें" : "View and manage your leaves"}
              </p>
            </div>
          </div>
          <div className="leave-header-actions-modern">
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
            <button className="add-leave-btn-modern" onClick={showLeaveForm} disabled={submitting}>
              <span className="btn-icon">+</span> {lang === "hin" ? "लीव लें" : "Take Leave"}
            </button>
          </div>
        </div>

        {/* Leave Sections */}
        <div className="leave-sections-modern">
          {/* Current Leaves */}
          <div className="leave-section-modern">
            <div className="section-header-modern">
              <span className="section-icon">🟠</span>
              <h3>{lang === "hin" ? "वर्तमान लीव" : "Current Leave"}</h3>
              <span className="section-count">
                {leaves.filter((l) => getLeaveStatus(l) === "current").length}
              </span>
            </div>
            <div className="leave-list-modern">{renderLeavesByStatus("current")}</div>
          </div>

          {/* Future Leaves */}
          <div className="leave-section-modern">
            <div className="section-header-modern">
              <span className="section-icon">🔵</span>
              <h3>{lang === "hin" ? "आगामी लीव" : "Upcoming Leave"}</h3>
              <span className="section-count">
                {leaves.filter((l) => getLeaveStatus(l) === "future").length}
              </span>
            </div>
            <div className="leave-list-modern">{renderLeavesByStatus("future")}</div>
          </div>

          {/* Past Leaves */}
          <div className="leave-section-modern">
            <div className="section-header-modern">
              <span className="section-icon">⚪</span>
              <h3>{lang === "hin" ? "पिछली लीव" : "Past Leave"}</h3>
              <span className="section-count">
                {leaves.filter((l) => getLeaveStatus(l) === "past").length}
              </span>
            </div>
            <div className="leave-list-modern">{renderLeavesByStatus("past")}</div>
          </div>

          {/* Cancelled Leaves */}
          {leaves.some((l) => l.status === "cancelled") && (
            <div className="leave-section-modern">
              <div className="section-header-modern">
                <span className="section-icon">🔴</span>
                <h3>{lang === "hin" ? "रद्द लीव" : "Cancelled"}</h3>
                <span className="section-count">
                  {leaves.filter((l) => l.status === "cancelled").length}
                </span>
              </div>
              <div className="leave-list-modern">{renderLeavesByStatus("cancelled")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
