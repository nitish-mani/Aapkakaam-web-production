// Updated frontend component with consistent API calls

import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../showAlert";
import Swal from "sweetalert2";
import "./leaveManagement.css";
import { useNavigate } from "react-router";

export default function LeaveManagement() {
  const navigate = useNavigate();
  const category = localStorage.getItem("category");
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );
  const token = `Bearer ${JSON.parse(localStorage.getItem(category)).token}`;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

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
      const errorMessage = error?.response?.data?.message || "Failed to fetch leave records";
      setErr(errorMessage);
      setTimeout(() => setErr(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLeaveStatus = (leave) => {
    if (leave.status === "cancelled") return "cancelled";
    return leave.classification || "past";
  };

  const renderLeaveCard = (leave) => {
    const status = getLeaveStatus(leave);
    console.log(status);
    const statusConfig = {
      current: { bg: "#FFF3E0", color: "#E65100", label: "Current" },
      future: { bg: "#E3F2FD", color: "#0D47A1", label: "Upcoming" },
      past: { bg: "#F5F5F5", color: "#616161", label: "Past" },
      cancelled: { bg: "#F44336", color: "#FFFFFF", label: "Cancelled" },
    };
    const config = statusConfig[status] || statusConfig.past;

    const fromDate = formatDate(leave.from);
    const toDate = formatDate(leave.to);

    return (
      <div key={leave._id} className="leave-card" style={{ borderLeftColor: config.color }}>
        <div className="leave-card-header">
          <div className="leave-dates-section">
            <div className="leave-date-range">
              <span className="leave-date">{fromDate}</span>
              <span className="date-separator">–</span>
              <span className="leave-date">{toDate}</span>
            </div>
            <span
              className="leave-status-badge"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              {config.label}
            </span>
          </div>
          {(status === "future" || status === "current") && (
            <button
              className="cancel-leave-btn"
              onClick={() => handleCancelLeave(leave._id)}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>

        {leave.reason && (
          <div className="leave-reason-section">
            <span className="reason-label">Reason:</span>
            <span className="reason-text">{leave.reason}</span>
          </div>
        )}

        <div className="leave-created-date">
          Created:{" "}
          {new Date(leave.createdAt).toLocaleDateString("en-IN", {
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
      title: "Cancel Leave",
      html: `
        <div class="delete-leave-confirmation">
          <p>Are you sure you want to cancel this leave?</p>
          <div class="leave-period-display">
            <strong>${fromDate}</strong>
            <span class="date-arrow">→</span>
            <strong>${toDate}</strong>
          </div>
          ${leaveToCancel.reason ? `<p class="leave-reason-display">Reason: ${leaveToCancel.reason}</p>` : ""}
          <p class="warning-text">This action cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#1976d2",
      confirmButtonText: "Yes, Cancel Leave",
      cancelButtonText: "No, Keep It",
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

      setSuccess("Leave cancelled successfully");
      fetchLeaves();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to cancel leave";
      setErr(errorMessage);
      setTimeout(() => setErr(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const showLeaveForm = () => {
    const today = new Date().toISOString().split("T")[0];

    Swal.fire({
      title: "Take Leave",
      html: `
        <div class="leave-form-container">
          <div class="form-group-leave">
            <label for="leave-from">From Date *</label>
            <input 
              type="date" 
              id="leave-from" 
              class="swal2-input" 
              min="${today}"
            />
            <span id="leave-from-error" class="form-error" style="display:none;"></span>
          </div>
          
          <div class="form-group-leave">
            <label for="leave-to">To Date *</label>
            <input 
              type="date" 
              id="leave-to" 
              class="swal2-input" 
              min="${today}"
            />
            <span id="leave-to-error" class="form-error" style="display:none;"></span>
          </div>
          
          <div class="form-group-leave">
            <label for="leave-reason">Reason (Optional)</label>
            <textarea 
              id="leave-reason" 
              class="swal2-textarea" 
              rows="3"
              placeholder="Brief reason for leave..."
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
      confirmButtonText: "Confirm Leave",
      cancelButtonText: "Cancel",
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
        // Add event listeners for real-time validation
        const fromInput = document.getElementById("leave-from");
        const toInput = document.getElementById("leave-to");
        const reasonInput = document.getElementById("leave-reason");
        const charCounter = document.querySelector(".char-counter");

        if (fromInput) {
          fromInput.addEventListener("change", () => {
            if (toInput) {
              toInput.min = fromInput.value || today;
            }
            // Clear error
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
                errorEl.textContent = "Reason cannot exceed 200 characters";
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

        // Validate
        const errors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!from) {
          errors.from = "Start date is required";
        } else {
          const fromDate = new Date(from);
          fromDate.setHours(0, 0, 0, 0);
          if (fromDate < today) {
            errors.from = "Start date cannot be in the past";
          }
        }

        if (!to) {
          errors.to = "End date is required";
        } else {
          const toDate = new Date(to);
          toDate.setHours(0, 0, 0, 0);
          if (toDate < today) {
            errors.to = "End date cannot be in the past";
          }
        }

        if (from && to) {
          const fromDate = new Date(from);
          const toDate = new Date(to);
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);

          if (toDate < fromDate) {
            errors.to = "End date must be after start date";
          }
        }

        if (reason && reason.length > 200) {
          errors.reason = "Reason must be less than 200 characters";
        }

        // Show errors if any
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
        // Submit the leave
        setSubmitting(true);
        axios
          .post(`${SERVER_URL}/vendor/createLeave`, result.value, {
            headers: { Authorization: token },
          })
          .then((response) => {
            setSuccess("Leave created successfully");
            fetchLeaves();
            setTimeout(() => setSuccess(""), 3000);
          })
          .catch((error) => {
            const errorMessage = error?.response?.data?.message || "Failed to create leave";
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
      return <p className="no-leaves-message">No {status} leaves</p>;
    }

    return filtered.map((leave) => renderLeaveCard(leave));
  };

  if (loading) {
    return (
      <div className="leave-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading leaves...</p>
      </div>
    );
  }

  return (
    <div className="leave-management-container">
      <div className="leave-management-header">
        <h2 className="leave-title">Leave Management</h2>
        <div>
          <button
            className="add-leave-btn"
            onClick={() => navigate("/")}
            style={{ backgroundColor: "red", marginRight: ".5rem" }}
          >
            Back
          </button>
          <button className="add-leave-btn" onClick={showLeaveForm} disabled={submitting}>
            + Take Leave
          </button>
        </div>
      </div>

      {/* Current Leaves */}
      <div className="leave-section">
        <h3 className="section-subtitle">Current Leave</h3>
        <div className="leave-list">{renderLeavesByStatus("current")}</div>
      </div>

      {/* Future Leaves */}
      <div className="leave-section">
        <h3 className="section-subtitle">Upcoming Leave</h3>
        <div className="leave-list">{renderLeavesByStatus("future")}</div>
      </div>

      {/* Past Leaves */}
      <div className="leave-section">
        <h3 className="section-subtitle">Past Leave</h3>
        <div className="leave-list">{renderLeavesByStatus("past")}</div>
      </div>

      {/* Cancelled Leaves (shown separately if needed) */}
      {leaves.some((l) => l.status === "cancelled") && (
        <div className="leave-section">
          <h3 className="section-subtitle">Cancelled</h3>
          <div className="leave-list">{renderLeavesByStatus("cancelled")}</div>
        </div>
      )}
    </div>
  );
}
