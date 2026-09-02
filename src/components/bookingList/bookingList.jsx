// Modern Booking List Item - AapkaKaam

import axios from "axios";
import CamleCase from "../camleCase/camleCase";
import { SERVER_URL } from "../../utils/base";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../showAlert";
import "./bookingList.css";

export default function BookingList({ data, lang = "en" }) {
  const category = localStorage.getItem("category");
  const token = `Bearer ${JSON.parse(localStorage.getItem(category))?.token}`;
  const user = JSON.parse(localStorage.getItem(category));
  const [isLoadingRatingPermission, setIsLoadingRatingPermission] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Helper function for translations
  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const isSelfBooked = data.userId === data.vendorId;

  // Get booking status details
  const getStatusDetails = () => {
    if (data.cancelOrder) {
      return { label: t("Canceled", "रद्द"), color: "#dc2626", icon: "❌", bg: "#fef2f2" };
    } else if (data.orderCompleted) {
      return { label: t("Completed", "पूर्ण"), color: "#16a34a", icon: "✅", bg: "#f0fdf4" };
    } else {
      return { label: t("Pending", "लंबित"), color: "#2563eb", icon: "⏳", bg: "#eff6ff" };
    }
  };

  const status = getStatusDetails();

  // Get user data based on booking type
  const getUserData = () => {
    if (isSelfBooked) {
      return {
        name: data?.name || user?.name,
        phone: data?.phoneNo || user?.phoneNo,
        address: {
          vill: data?.vill || user?.address[0]?.vill,
          post: data?.post || user?.address[0]?.post,
          dist: data?.dist || user?.address[0]?.dist,
        },
      };
    } else {
      return {
        name: data?.bookedById?.name || data?.name || user?.name,
        phone: data?.bookedById?.phoneNo || data?.phoneNo || user?.phoneNo,
        address: {
          vill: data?.bookedById?.address?.[0]?.vill || data?.vill || user?.address[0]?.vill,
          post: data?.bookedById?.address?.[0]?.post || data?.post || user?.address[0]?.post,
          dist: data?.bookedById?.address?.[0]?.dist || data?.dist || user?.address[0]?.dist,
        },
      };
    }
  };

  const bookingUser = getUserData();

  return (
    <div className="booking-list-modern">
      {/* Status Badge */}
      <div
        className="booking-status-badge"
        style={{
          background: status.bg,
          color: status.color,
          borderColor: status.color,
        }}
      >
        <span className="status-icon">{status.icon}</span>
        <span className="status-label">{status.label}</span>
      </div>

      {/* Main Content */}
      <div className="booking-content-modern">
        {/* User Info */}
        <div className="booking-row">
          <span className="booking-label">{t("Name", "नाम")}</span>
          <span className="booking-value">
            <CamleCase element={bookingUser.name} />
          </span>
        </div>

        <div className="booking-row">
          <span className="booking-label">{t("Mobile", "मोबाइल")}</span>
          <span className="booking-value">{bookingUser.phone}</span>
        </div>

        {/* Address */}
        <div className="booking-address-section">
          <span className="booking-label">{t("Address", "पता")}</span>
          <div className="booking-address-details">
            <div className="address-line">
              <span className="address-label">{t("Vill", "गाँव")}:</span>
              <span>{bookingUser.address.vill || "-"}</span>
            </div>
            <div className="address-line">
              <span className="address-label">{t("Post", "पोस्ट")}:</span>
              <span>{bookingUser.address.post || "-"}</span>
            </div>
            <div className="address-line">
              <span className="address-label">{t("Dist", "जिला")}:</span>
              <span>{bookingUser.address.dist || "-"}</span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="booking-row">
          <span className="booking-label">{t("Date", "तारीख")}</span>
          <span className="booking-value booking-date">
            {new Date(data.bookingDate).toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="booking-row">
          <span className="booking-label">{t("Service Type", "सेवा प्रकार")}</span>
          <span className="booking-value booking-date">{data.type.toUpperCase()}</span>
        </div>

        {/* Rating & Review */}
        {data.orderCompleted && (
          <div className="booking-rating-section">
            <div className="booking-row">
              <span className="booking-label">{t("Rated By User", "उपयोगकर्ता रेटिंग")}</span>
              <span className="booking-value rating-value">
                {data.rating == 0 ? (
                  <span className="not-rated">{t("Not Rated", "रेटिंग नहीं")}</span>
                ) : (
                  <span className="rating-display">
                    {"⭐".repeat(Math.round(data.rating))}
                    <span className="rating-number">{data.rating}/5</span>
                  </span>
                )}
              </span>
            </div>

            <div className="booking-row">
              <span className="booking-label">{t("Review", "समीक्षा")}</span>
              <span className="booking-value review-value">
                {data.review ? (
                  <span className="review-text">“{data.review}”</span>
                ) : (
                  <span className="no-review">{t("No review provided", "कोई समीक्षा नहीं")}</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="booking-row status-row">
          <span className="booking-label">{t("Status", "स्थिति")}</span>
          <span className="booking-value status-value" style={{ color: status.color }}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
