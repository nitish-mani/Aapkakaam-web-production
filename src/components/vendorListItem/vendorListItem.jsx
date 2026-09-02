// Modern Vendor List Item - AapkaKaam

import { useState, useEffect } from "react";
import CamleCase from "../camleCase/camleCase";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import "./vendorListItem.css";
import { useNavigate } from "react-router";
import male from "../../resources/svg/male-svgrepo-com.svg";
import female from "../../resources/svg/female-svgrepo-com.svg";
import rupee from "../../resources/svg/rupee-1-frame-svgrepo-com.svg";
import Ratings from "../ratings/ratings";
import { useSelector, useDispatch } from "react-redux";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";
import { showError, showSuccess } from "../showAlert";
import Swal from "sweetalert2";

export default function VendorListItem({
  data,
  i,
  userData,
  date,
  month,
  year,
  booked_date,
  jobType,
  jobTypeHindi,
  token,
  category,
  bookingHappen,
  setBookingHappen,
  lang = "en",
}) {
  const pinLocation = useSelector((store) => store.category.location_pincode);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const dispatch = useDispatch();
  const pincode = pinLocation || userData[0]?.address?.[0]?.pincode;
  const balance = Math.round(userData[0]?.balance * 100) / 100;
  const totalDiscount = userData[0]?.totalDiscount;
  const transactionCount = userData[0]?.transactionCount;
  const address = userData[0].address;
  const totalOriginalAmount = userData[0]?.totalOriginalAmount;

  const discountedPrice = ((1 - totalDiscount / totalOriginalAmount) * 10).toFixed(2);

  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  // Helper function for translations
  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  const handleError = (error) => {
    setIsLoading(false);
    const errorMessage =
      error?.response?.data?.message || t("Something went wrong", "कुछ गलत हो गया");
    setErr(errorMessage);
    setTimeout(() => {
      setErr("");
    }, 2000);
  };

  const handleSuccess = (response, userDataUpdate) => {
    const updatedData = {
      ...userData[0],
      balance: response.data.data.balance,
    };

    if (category === "user") {
      dispatch(addDataUser(updatedData));
    } else if (category === "vendor") {
      dispatch(addDataVendor(updatedData));
    }

    localStorage.setItem(category, JSON.stringify(updatedData));
    setIsLoading(false);
    setSuccess(response.data.message);
    setBookingHappen(!bookingHappen);
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  const showConfirm = (vendorId, phoneNo) => {
    const bookingDate = new Date(booked_date);
    const formattedDate = bookingDate.toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const vendorInitial = data.name?.charAt(0)?.toUpperCase() || "V";
    const ratingStars = "⭐".repeat(Math.round(data.rating || 1));

    Swal.fire({
      title: t("📋 Booking Summary", "📋 बुकिंग सारांश"),
      html: `
        <div class="booking-summary-container">
          <div class="summary-header">
            <div class="vendor-avatar-large">
              <span>${vendorInitial}</span>
            </div>
            <div class="vendor-name-large">
              <h2>${data.name.toUpperCase()}</h2>
              <div class="vendor-rating-large">
                ${ratingStars}
                <span class="rating-text">${(data.rating || 0).toFixed(1) == 0 ? t("New Vendor", "नया विक्रेता") : data.rating} ${data.ratingCount || 0 == 0 ? "" : `(${data.ratingCount} ${t("reviews", "समीक्षाएँ")})`} </span>
              </div>
            </div>
          </div>

          <div class="summary-details">
            <div class="detail-item">
              <div class="detail-icon">🔧</div>
              <div class="detail-content"><span class="detail-label">${t("Service", "सेवा")}</span>
<span class="detail-value">
  ${lang === "hin" ? jobTypeHindi : data.type?.toUpperCase()}
</span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <span class="detail-label">${t("Date", "तारीख")}</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">📍</div>
              <div class="detail-content">
                <span class="detail-label">${t("Location", "स्थान")}</span>
                <span class="detail-value">${address[0].vill}, ${address[0].post}</span>
              </div>
            </div>
            
            <div class="detail-item price-item">
              <div class="detail-icon">💰</div>
              <div class="detail-content">
                <span class="detail-label">${t("Cost", "लागत")}</span>
                <span class="detail-value price-value">₹${data.wageRate} <span class="price-type">/ ${data.wageRateType}</span></span>
              </div>
            </div>
          </div>

          <div class="summary-footer">
            <div class="fee-note">
              <span class="fee-icon">ℹ️</span>
              <span>${t("Booking fee of", "बुकिंग शुल्क")} <b>₹${totalDiscount ? discountedPrice : 10} </b>${t("will be deducted from your balance and This fee is non-refundable.", "आपके बैलेंस से काटा जाएगा और यह शुल्क वापस नहीं किया जाएगा।")}</span>
            </div>
            <div class="balance-info">
              <span>${t("Available Balance", "उपलब्ध बैलेंस")}: </span>
              <strong>₹${balance || 0}</strong>
            </div>
          </div>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d32f2f",
      confirmButtonText: t("✅ Confirm Booking", "✅ बुकिंग की पुष्टि करें"),
      cancelButtonText: t("❌ Cancel", "❌ रद्द करें"),
      reverseButtons: true,
      width: 550,
      padding: "2.5rem",
      backdrop: "rgba(0,0,0,0.5)",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      customClass: {
        title: "swal-title-custom",
        confirmButton: "swal-confirm-btn-custom",
        cancelButton: "swal-cancel-btn-custom",
        popup: "swal-popup-custom",
        htmlContainer: "swal-html-custom",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleBookNow(vendorId, phoneNo);
      }
    });
  };

  function handleBookNow(vendorId, phoneNo) {
    if (balance >= 10) {
      setIsLoading(true);

      const bookingEndpoint =
        category === "user"
          ? `${SERVER_URL}/bookings/postToBookingsU`
          : `${SERVER_URL}/bookings/postToBookingsV`;

      const bookingData = {
        userId: userData[0]?.[category === "user" ? "userId" : "vendorId"],
        name: userData[0]?.name,
        vendorId: vendorId,
        bookingDate: booked_date,
        pincode: pincode,
        type: jobType,
        phoneNo,
      };

      axios
        .post(bookingEndpoint, bookingData, {
          headers: { Authorization: token },
        })
        .then((succ) => handleSuccess(succ))
        .catch(handleError);
    } else {
      setErr(t("Needed Rs 10 for Booking", "बुकिंग के लिए ₹10 की आवश्यकता है"));
      setTimeout(() => {
        setErr("");
      }, 5000);
    }
  }

  function handleGetReviews(vendorId) {
    setIsReviewLoading(true);
    setIsReviewsModalOpen(true);

    const bookingEndpoint =
      category === "user"
        ? `${SERVER_URL}/bookings/getReviewsU/${userData[0]?.userId}/${vendorId}/${page}`
        : `${SERVER_URL}/bookings/getReviewsV/${userData[0]?.vendorId}/${vendorId}/${page}`;

    axios
      .get(bookingEndpoint, {
        headers: { Authorization: token },
      })
      .then((succ) => {
        setReviews(succ.data);
        setIsReviewLoading(false);
        console.log("Reviews fetched successfully:", succ);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setIsReviewLoading(false);
      });
  }

  function closeReviewsModal() {
    setIsReviewsModalOpen(false);
    setReviews([]);
  }

  function handleMouseHoverEnter() {
    setBtnHovered(true);
  }

  function handleMouseHoverLeave() {
    setBtnHovered(false);
  }

  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  const renderProfilePicture = () => {
    const isMale = data.gender === "male";
    const defaultAvatar = isMale ? male : female;

    if (data.profilePic) {
      return (
        <img
          src={data.profilePic}
          alt={`${data.name}'s profile`}
          className="vendor-profile-image"
        />
      );
    }

    return <img src={defaultAvatar} alt={`Default ${data.gender} avatar`} />;
  };

  const renderRatingText = () => {
    const rating = data.rating || 0;
    const ratingCount = data.ratingCount || 0;

    if (ratingCount > 0) {
      return (
        <>
          {rating.toFixed(1)} ({ratingCount}
          {isReviewLoading ? (
            <span className="loading-reviews">{t("Loading...", "लोड हो रहा...")}</span>
          ) : (
            <span className="review-link" onClick={() => handleGetReviews(data._id)}>
              {t("Reviews", "समीक्षाएँ")}
            </span>
          )}
          )
        </>
      );
    }
    return t("New Vendor", "नया विक्रेता");
  };

  const renderPhoneNumber = (phone) => {
    if (!phone || phone.length < 10) return phone;
    const visiblePart = phone.slice(0, 2);
    const maskedPart = "*".repeat(phone.length - 4);
    const lastTwo = phone.slice(-2);
    return `${visiblePart}${maskedPart}${lastTwo}`;
  };

  const renderCompletedJobs = () => {
    if (data.completedVendor && data.completedVendor > 0) {
      return (
        <div className="vendor-stat">
          <span className="stat-icon-v">✔</span>
          <span>
            {data.completedVendor} {t("Jobs Completed", "नौकरियाँ पूरी हुईं")}
          </span>
        </div>
      );
    }
    return null;
  };

  const renderExperience = () => {
    if (data.experience && data.experience > 0) {
      return (
        <div className="vendor-stat">
          <span>
            🏅 {data.experience} {t("Years Experience", "वर्षों का अनुभव")}
          </span>
        </div>
      );
    }
    return null;
  };

  // Reviews Modal Component
  // Modern Reviews Modal Component - AapkaKaam

  const ReviewsModal = () => {
    if (!isReviewsModalOpen) return null;

    const reviewData = reviews?.reviews || [];
    const totalReviews = reviewData.length;
    const averageRating =
      totalReviews > 0
        ? (reviewData.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1)
        : 0;

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    reviewData.forEach((review) => {
      const rating = Math.round(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating - 1]++;
      }
    });

    return (
      <div className="reviews-modal-overlay-modern" onClick={closeReviewsModal}>
        <div className="reviews-modal-content-modern" onClick={(e) => e.stopPropagation()}>
          {/* Header with gradient */}
          <div className="reviews-modal-header-modern">
            <div className="modal-header-top">
              <div className="modal-title-section">
                <span className="modal-icon">⭐</span>
                <div>
                  <h2>
                    {t(
                      `Reviews for ${data.name?.toUpperCase()} Vendor`,
                      `${data.name?.toUpperCase()} के लिए समीक्षाएँ`,
                    )}
                  </h2>
                  {totalReviews > 0 && (
                    <div className="modal-rating-summary">
                      <span className="average-rating">{averageRating}</span>
                      <span className="rating-stars">
                        {"⭐".repeat(Math.round(averageRating))}
                        {"☆".repeat(5 - Math.round(averageRating))}
                      </span>
                      <span className="review-count">
                        ({totalReviews} {t("reviews", "समीक्षाएँ")})
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button className="reviews-modal-close-modern" onClick={closeReviewsModal}>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="reviews-modal-body-modern">
            {isReviewLoading ? (
              <div className="reviews-loading-modern">
                <div className="loading-spinner-modern"></div>
                <p>{t("Loading reviews...", "समीक्षाएँ लोड हो रही हैं...")}</p>
              </div>
            ) : reviewData.length === 0 ? (
              <div className="no-reviews-modern">
                <div className="no-reviews-icon-modern">📝</div>
                <h3>{t("No Reviews Yet", "अभी कोई समीक्षा नहीं")}</h3>
                <p>
                  {t(
                    "This vendor hasn't received any reviews yet.",
                    "इस विक्रेता को अभी तक कोई समीक्षा नहीं मिली है।",
                  )}
                </p>
              </div>
            ) : (
              <div className="reviews-content-modern">
                {/* Rating Summary Bar */}
                <div className="rating-summary-bar-modern">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDistribution[star - 1] || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="rating-bar-row">
                        <span className="star-label">{star} ★</span>
                        <div className="rating-bar-track">
                          <div className="rating-bar-fill" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="rating-bar-count">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reviews List */}
                <div className="reviews-list-modern">
                  {reviewData.map((review, index) => (
                    <div key={review._id || index} className="review-item-modern">
                      <div className="review-header-modern">
                        <div className="reviewer-info-modern">
                          <div
                            className="reviewer-avatar-modern"
                            style={{
                              background: `linear-gradient(135deg, ${getRandomColor(review.bookedById?.name || "")}, ${getRandomColor2(review.bookedById?.name || "")})`,
                            }}
                          >
                            {review.bookedById?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="reviewer-details-modern">
                            <span className="reviewer-name-modern">
                              {review.bookedById?.name?.toUpperCase() || "Anonymous"}
                            </span>
                            <span className="reviewer-type-modern">
                              {review.bookingBy === "vendor" ? "🔧 Vendor" : "👤 Customer"}
                            </span>
                            <span className="review-date-modern">
                              {new Date(review.reviewedOn || review.createdAt).toLocaleDateString(
                                lang === "hin" ? "hi-IN" : "en-IN",
                                { day: "numeric", month: "short", year: "numeric" },
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="review-rating-modern">
                          <span className="review-stars">
                            {"⭐".repeat(Math.round(review.rating || 0))}
                            {"☆".repeat(5 - Math.round(review.rating || 0))}
                          </span>
                          <span className="review-rating-number-modern">
                            {review.rating?.toFixed(1) || 0}
                          </span>
                        </div>
                      </div>

                      <div className="review-body-modern">
                        <p className="review-text-modern">
                          {review.review || t("No review text", "कोई समीक्षा नहीं")}
                        </p>
                      </div>

                      {review.bookingDate && (
                        <div className="review-booking-date-modern">
                          <span>
                            📅 {t("Booked on", "बुकिंग तारीख")}: {review.bookingDate}
                          </span>
                        </div>
                      )}

                      {index < reviewData.length - 1 && (
                        <div className="review-divider-modern"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="reviews-modal-footer-modern">
            <div className="footer-stats">
              <span>
                ⭐ {averageRating} {t("average", "औसत")}
              </span>
              <span>•</span>
              <span>
                {totalReviews} {t("reviews", "समीक्षाएँ")}
              </span>
            </div>
            <button className="reviews-close-btn-modern" onClick={closeReviewsModal}>
              {t("Close Reviews", "समीक्षाएँ बंद करें")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function for random colors
  const getRandomColor = (name) => {
    const colors = [
      "#667eea",
      "#f093fb",
      "#4facfe",
      "#43e97b",
      "#fa709a",
      "#a18cd1",
      "#fbc2eb",
      "#a1c4fd",
    ];
    const index = name.length ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getRandomColor2 = (name) => {
    const colors = [
      "#764ba2",
      "#f5576c",
      "#00f2fe",
      "#38f9d7",
      "#fee140",
      "#f093fb",
      "#c1f0c1",
      "#f6d5f7",
    ];
    const index = name.length ? (name.charCodeAt(0) + 5) % colors.length : 1;
    return colors[index];
  };

  return (
    <div className="vendor-list-item-modern" key={i}>
      <div className="vendor-item-left">
        <div className="vendor-avatar-modern">{renderProfilePicture()}</div>
      </div>

      <div className="vendor-item-center">
        <div className="vendor-name-modern">
          <CamleCase element={data.name} />
          {data.isVerified && (
            <span className="verified-badge-modern">
              <span>✓</span>
            </span>
          )}
        </div>

        <div className="vendor-type-modern">
          <CamleCase element={data.type} />
        </div>

        <div className="vendor-rating-modern">
          {data.rating > 0 && <Ratings rating={data.rating || 0} />}
          <span className="rating-text-modern">{renderRatingText()}</span>
        </div>

        <div className="vendor-stats-modern">
          {renderCompletedJobs()}
          {renderExperience()}
        </div>

        <div className="vendor-phone-modern">
          📱 {data.phoneNo && renderPhoneNumber(data.phoneNo)}
        </div>
      </div>

      <div className="vendor-item-right">
        <div className="vendor-price-modern">
          <span className="rupee-icon">
            <img src={rupee} alt="₹" className="rupee-image" />
          </span>
          <span className="price-amount">{data.wageRate}</span>
          <span className="price-period">/ {data.wageRateType}</span>
        </div>

        <button
          className="book-btn-modern"
          onClick={() => showConfirm(data._id, data.phoneNo)}
          onMouseEnter={handleMouseHoverEnter}
          onMouseLeave={handleMouseHoverLeave}
          disabled={isLoading}
          aria-label={`Book ${data.name}`}
        >
          <span className="book-tooltip" style={{ display: btnHovered ? "block" : "none" }}>
            {t("It will cost you Rs", "इसकी कीमत आपको ₹")} {totalDiscount ? discountedPrice : 10}
          </span>
          {isLoading ? <span className="btn-spinner"></span> : t("Book", "बुक करें")}
        </button>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal />
    </div>
  );
}
