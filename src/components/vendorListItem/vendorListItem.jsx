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
  token,
  category,
  bookingHappen,
  setBookingHappen,
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

  const handleError = (error) => {
    setIsLoading(false);
    const errorMessage = error?.response?.data?.message || "Something went wrong";
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
    const formattedDate = bookingDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const vendorInitial = data.name?.charAt(0)?.toUpperCase() || "V";
    const ratingStars = "⭐".repeat(Math.round(data.rating || 1));

    Swal.fire({
      title: "📋 Booking Summary",
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
                <span class="rating-text">${(data.rating || 0).toFixed(1) == 0 ? "New Vendor" : data.rating} ${data.ratingCount || 0 == 0 ? "" : `(${data.ratingCount} reviews)`} </span>
              </div>
            </div>
          </div>

          <div class="summary-details">
            <div class="detail-item">
              <div class="detail-icon">🔧</div>
              <div class="detail-content">
                <span class="detail-label">Service</span>
                <span class="detail-value">${data.type.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <div class="detail-icon">📍</div>
              <div class="detail-content">
                <span class="detail-label">Location</span>
                <span class="detail-value">${address[0].vill}, ${address[0].post}</span>
              </div>
            </div>
            
            <div class="detail-item price-item">
              <div class="detail-icon">💰</div>
              <div class="detail-content">
                <span class="detail-label">Cost</span>
                <span class="detail-value price-value">₹${data.wageRate} <span class="price-type">/ ${data.wageRateType}</span></span>
              </div>
            </div>
          </div>

          <div class="summary-footer">
            <div class="fee-note">
              <span class="fee-icon">ℹ️</span>
              <span>Booking fee of <b>₹${totalDiscount ? discountedPrice : 10} </b>will be deducted from your balance and This fee is non-refundable.</span>
            </div>
            <div class="balance-info">
              <span>Available Balance: </span>
              <strong>₹${balance || 0}</strong>
            </div>
          </div>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d32f2f",
      confirmButtonText: "✅ Confirm Booking",
      cancelButtonText: "❌ Cancel",
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
      setErr("Needed Rs 10 for Booking");
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
    const isMale = data.gender === "Male";
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
            <span className="loading-reviews">Loading...</span>
          ) : (
            <span className="review-link" onClick={() => handleGetReviews(data._id)}>
              Reviews
            </span>
          )}
          )
        </>
      );
    }
    return "New Vendor";
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
          <span>{data.completedVendor} Jobs Completed</span>
        </div>
      );
    }
    return null;
  };

  const renderExperience = () => {
    if (data.experience && data.experience > 0) {
      return (
        <div className="vendor-stat">
          <span>🏅 {data.experience} Years Experience</span>
        </div>
      );
    }
    return null;
  };

  // Reviews Modal Component
  const ReviewsModal = () => {
    if (!isReviewsModalOpen) return null;

    const reviewData = reviews?.reviews || [];

    return (
      <div className="reviews-modal-overlay" onClick={closeReviewsModal}>
        <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="reviews-modal-header">
            <h2>
              <span className="review-icon">⭐</span>
              Reviews for {data.name.toUpperCase()}
            </h2>
            <button className="reviews-modal-close" onClick={closeReviewsModal}>
              ✕
            </button>
          </div>

          <div className="reviews-modal-body">
            {isReviewLoading ? (
              <div className="reviews-loading">
                <div className="loading-spinner"></div>
                <p>Loading reviews...</p>
              </div>
            ) : reviewData.length === 0 ? (
              <div className="no-reviews">
                <span className="no-reviews-icon">📝</span>
                <p>No reviews yet for this vendor</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviewData.map((review, index) => (
                  <div key={review._id || index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.bookedById?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">
                            {review.bookedById?.name?.toUpperCase() || "Anonymous"}
                          </span>
                          <span className="reviewer-type">{review.bookingBy || "User"}</span>
                        </div>
                      </div>
                      <div className="review-rating">
                        {"⭐".repeat(Math.round(review.rating || 0))}
                        <span className="review-rating-number">
                          {review.rating?.toFixed(1) || 0}
                        </span>
                      </div>
                    </div>

                    <div className="review-body">
                      <p className="review-text">{review.review || "No review text"}</p>
                    </div>

                    <div className="review-footer">
                      <span className="review-date">
                        📅 {review.bookingDate || "Date not specified"}
                      </span>
                      {review.reviewedOn && (
                        <span className="reviewed-on">
                          Reviewed:{" "}
                          {new Date(review.reviewedOn).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {index < reviewData.length - 1 && <div className="review-divider"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="reviews-modal-footer">
            <button className="reviews-close-btn" onClick={closeReviewsModal}>
              Close Reviews
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="available-vendor__child" key={i}>
      <div className="vendor-profile-section">
        <div id="profilePic">{renderProfilePicture()}</div>
      </div>

      <div className="vendor-info-section">
        <div className="vendor-name">
          <CamleCase element={data.name} />
        </div>

        <div className="vendor-category">
          <CamleCase element={data.type} />
        </div>

        <div className="vendor-rating-section">
          {data.rating == 0 ? "" : <Ratings rating={data.rating || 0} />}
          <span className="vendor-rating-text">{renderRatingText()}</span>
        </div>

        {data.isVerified && (
          <div className="vendor-verified-badge">
            <span className="verified-icon">✔</span>
            <span>Verified</span>
          </div>
        )}

        <div className="vendor-stats-section">
          {renderCompletedJobs()}
          {renderExperience()}
        </div>

        <div className="vendor-phone">📱 {data.phoneNo && renderPhoneNumber(data.phoneNo)}</div>

        <div className="vendor-price">
          <span className="rupee-icon">
            <img src={rupee} alt="Indian Rupee symbol" className="rupee-image" />
          </span>
          <span className="price-amount">{data.wageRate}</span>
          <span className="price-period">/ {data.wageRateType}</span>
        </div>
      </div>

      <div className="vdldiv">
        <button
          className="btn"
          onClick={() => showConfirm(data._id, data.phoneNo)}
          onMouseEnter={handleMouseHoverEnter}
          onMouseLeave={handleMouseHoverLeave}
          disabled={isLoading}
          aria-label={`Book ${data.name}`}
        >
          <div className="popmsg" style={{ display: btnHovered ? "block" : "none" }}>
            It will cost you Rs {totalDiscount ? discountedPrice : 10}
          </div>
          {isLoading ? <div className="loading"></div> : "Book"}
        </button>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal />
    </div>
  );
}
