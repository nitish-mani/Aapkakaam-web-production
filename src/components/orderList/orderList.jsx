import { useEffect, useState } from "react";
import { SERVER_URL } from "../../utils/base";
import CamleCase from "../camleCase/camleCase";
import "./orderList";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCancelOrder } from "../../utils/categoryslice";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";
import { showConfirm, showError, showSuccess, showInfo } from "../showAlert";
import Swal from "sweetalert2";

export default function OrderList({ element, orderStatus }) {
  const dispatch = useDispatch();

  const category = localStorage.getItem("category");

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const cancelOrder = useSelector((store) => store.category.cancelOrder);

  const [isLoadingRating, setIsLoadingRating] = useState(false);
  const [isLoadingCancelOrder, setIsLoadingCancelOrder] = useState(false);
  const [isLoadingCompleteOrder, setIsLoadingCompleteOrder] = useState(false);

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;

  async function handleCancelOrder(bookingId) {
    if (!navigator.onLine) {
      setErr("You are offline");
      setTimeout(() => {
        setErr("");
      }, 3000);
      return;
    }

    const result = await showConfirm({
      title: "Are you sure?",
      text: "You want to cancel this order?",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      icon: "warning",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoadingCancelOrder(true);

    if (category == "user")
      axios
        .patch(
          `${SERVER_URL}/bookings/cancelOrderU`,
          {
            bookingId,
          },
          {
            headers: { Authorization: token },
          },
        )
        .then((succ) => {
          const data = { ...userData[0] };
          dispatch(addDataUser(data));
          localStorage.setItem(category, JSON.stringify(data));
          setSuccess(succ.data.message);
          dispatch(setCancelOrder(!cancelOrder));
          setIsLoadingCancelOrder(false);
          setTimeout(() => {
            setSuccess("");
          }, 1000);
        })
        .catch((err) => {
          setErr(err.response.data.message);
          setIsLoadingCancelOrder(false);
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
    else if (category == "vendor")
      axios
        .patch(
          `${SERVER_URL}/bookings/cancelOrderV`,
          {
            bookingId,
          },
          {
            headers: { Authorization: token },
          },
        )
        .then((succ) => {
          const data = { ...userData[0] };
          dispatch(addDataVendor(data));
          localStorage.setItem(category, JSON.stringify(data));
          setSuccess(succ.data.message);
          dispatch(setCancelOrder(!cancelOrder));
          setIsLoadingCancelOrder(false);
          setTimeout(() => {
            setSuccess("");
          }, 1000);
        })
        .catch((err) => {
          setErr(err.response.data.message);
          setIsLoadingCancelOrder(false);
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
  }

  async function handleCompletedOrder(bookingId) {
    if (!navigator.onLine) {
      setErr("You are offline");
      setTimeout(() => {
        setErr("");
      }, 3000);
      return;
    }

    const result = await showConfirm({
      title: "Are you sure?",
      text: "You want to mark this order as complete?",
      confirmButtonText: "Yes, mark it complete!",
      cancelButtonText: "No, keep it",
      icon: "info",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoadingCompleteOrder(true);

    if (category == "user")
      axios
        .patch(
          `${SERVER_URL}/bookings/orderCompletedU`,
          {
            bookingId,
          },
          {
            headers: { Authorization: token },
          },
        )
        .then((succ) => {
          setSuccess(succ.data.message);
          dispatch(setCancelOrder(!cancelOrder));
          setIsLoadingCompleteOrder(false);
          setTimeout(() => {
            setSuccess("");
          }, 1000);
        })
        .catch((err) => {
          setErr(err.response.data.message);
          setIsLoadingCompleteOrder(false);
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
    else if (category == "vendor")
      axios
        .patch(
          `${SERVER_URL}/bookings/orderCompletedV`,
          {
            bookingId,
          },
          {
            headers: { Authorization: token },
          },
        )
        .then((succ) => {
          setSuccess(succ.data.message);
          dispatch(setCancelOrder(!cancelOrder));
          setIsLoadingCompleteOrder(false);
          setTimeout(() => {
            setSuccess("");
          }, 1000);
        })
        .catch((err) => {
          setErr(err.response.data.message);
          setIsLoadingCompleteOrder(false);
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
  }

  // Handle rating with confirmation dialog
  // Handle rating with confirmation dialog
  async function handleRatings(bookingId, existingRating) {
    console.count("handleRatings");
    // Already rated - Premium notification with confetti effect
    if (existingRating) {
      const ratingEmojis = {
        1: "😔",
        2: "😕",
        3: "😐",
        4: "😊",
        5: "🌟",
      };

      await Swal.fire({
        title: `${ratingEmojis[existingRating]} Already Rated!`,
        html: `
        <div style="font-family: 'Inter', sans-serif; padding: 10px 0;">
          <div style="font-size: 64px; margin-bottom: 12px;">
            ${"⭐".repeat(existingRating)}${"☆".repeat(5 - existingRating)}
          </div>
          <div style="font-size: 18px; font-weight: 600; color: #1f2937;">
            You rated this vendor ${existingRating}/5
          </div>
          <div style="font-size: 14px; color: #6b7280; margin-top: 8px;">
            Thank you for your feedback! 🙏
          </div>
        </div>
      `,
        icon: "info",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "👍 Got it",
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.6) blur(10px)",
        timer: 4000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
      return;
    }

    // Offline check - Modern toast-style alert
    if (!navigator.onLine) {
      await Swal.fire({
        title: "🌐 You're Offline",
        html: `
        <div style="padding: 10px 0;">
          <div style="font-size: 48px; margin-bottom: 8px;">📡</div>
          <div style="font-size: 15px; color: #6b7280;">
            Please check your internet connection<br>and try again
          </div>
        </div>
      `,
        icon: "warning",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Got it",
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.5)",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
      });
      return;
    }

    // Rating Modal with proper cancel handling
    const result = await Swal.fire({
      title: "",
      html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 4px 0; position: relative;">
        <!-- Header with gradient -->
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: -30px -30px 20px -30px;
          padding: 25px 30px 20px 30px;
          border-radius: 16px 16px 0 0;
          color: white;
        ">
          <div style="font-size: 14px; opacity: 0.8; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 500;">
            Share Your Experience
          </div>
          <div style="font-size: 24px; font-weight: 700; margin-top: 4px;">
            How was your booking? ✨
          </div>
          <div style="font-size: 14px; opacity: 0.85; margin-top: 6px;">
            Your feedback helps others make better decisions
          </div>
        </div>

        <!-- Rating Section -->
        <div style="margin: 20px 0 16px 0; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 10px; font-size: 44px;" id="star-container">
            <span class="star" data-value="1" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
            <span class="star" data-value="2" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
            <span class="star" data-value="3" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
            <span class="star" data-value="4" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
            <span class="star" data-value="5" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
          </div>
          <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-top: 8px; min-height: 28px;" id="rating-label">
            Tap a star to rate
          </div>
          <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;" id="rating-subtext">
            Choose from 1 to 5 stars
          </div>
        </div>

        <!-- Slider -->
        <div style="margin: 16px 0 20px 0; padding: 0 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 500; color: #9ca3af; margin-bottom: 6px;">
            <span>Not Great</span>
            <span>Average</span>
            <span>Amazing</span>
          </div>
          <input
            id="swal-rating"
            type="range"
            min="1"
            max="5"
            step="1"
            value="3"
            style="
              width: 100%;
              height: 8px;
              border-radius: 4px;
              background: linear-gradient(to right, #fbbf24, #f59e0b, #f97316);
              outline: none;
              -webkit-appearance: none;
              appearance: none;
            "
          />
          <style>
            #swal-rating::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: linear-gradient(135deg, #7c3aed, #6d28d9);
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
              transition: all 0.2s;
            }
            #swal-rating::-webkit-slider-thumb:hover {
              transform: scale(1.15);
              box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
            }
            #swal-rating::-moz-range-thumb {
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: linear-gradient(135deg, #7c3aed, #6d28d9);
              cursor: pointer;
              border: none;
              box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
            }
          </style>
        </div>

        <!-- Review Section -->
        <div style="margin-top: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-weight: 600; color: #1f2937; font-size: 14px;">
              📝 Write a Review
            </label>
            <span style="font-size: 12px; color: #9ca3af;" id="char-count">0/500</span>
          </div>
          <textarea
            id="swal-review"
            maxlength="500"
            placeholder="What stood out to you? Share the highlights of your experience..."
            style="
              width: 100%;
              padding: 14px 16px;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              font-size: 14px;
              font-family: 'Inter', sans-serif;
              resize: vertical;
              min-height: 80px;
              max-height: 150px;
              transition: all 0.3s ease;
              background: #fafafa;
              color: #1f2937;
              line-height: 1.6;
            "
          ></textarea>
          <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
            <span class="suggestion-chip" data-text="Great service! 👍" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
              👍 Great
            </span>
            <span class="suggestion-chip" data-text="Professional and friendly 😊" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
              😊 Friendly
            </span>
            <span class="suggestion-chip" data-text="Highly recommended! ⭐" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
              ⭐ Recommend
            </span>
            <span class="suggestion-chip" data-text="Will book again 🔄" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
              🔄 Again
            </span>
          </div>
        </div>

        <!-- Quick tips -->
        <div style="margin-top: 16px; padding: 10px 14px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280; text-align: center;">
          💡 Your review helps the community. Be honest and constructive!
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "🌟 Submit Review",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      allowOutsideClick: false,
      reverseButtons: true,
      backdrop: "rgba(0,0,0,0.7) blur(4px)",
      background: "#ffffff",
      width: 520,
      customClass: {
        confirmButton: "swal-confirm",
        cancelButton: "swal-confirm",
      },
      didOpen: () => {
        const slider = document.getElementById("swal-rating");
        const stars = document.querySelectorAll(".star");
        const ratingLabel = document.getElementById("rating-label");
        const ratingSubtext = document.getElementById("rating-subtext");
        const reviewText = document.getElementById("swal-review");
        const charCount = document.getElementById("char-count");
        const suggestionChips = document.querySelectorAll(".suggestion-chip");
        const cancelBtn = Swal.getCancelButton();

        cancelBtn.addEventListener("click", () => {
          console.log("Cancel clicked");
        });

        let selectedRating = 3;

        function updateStars(value) {
          stars.forEach((star) => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= value) {
              star.textContent = "★";
              star.style.color = "#fbbf24";
              star.style.transform = "scale(1.1)";
            } else {
              star.textContent = "☆";
              star.style.color = "#e5e7eb";
              star.style.transform = "scale(1)";
            }
          });
        }

        function updateLabels(value) {
          const labels = {
            1: { main: "😔 Needs Improvement", sub: "We'll do better next time" },
            2: { main: "😕 Could Be Better", sub: "Thank you for your honesty" },
            3: { main: "😐 It Was Okay", sub: "Room for improvement" },
            4: { main: "😊 Good Experience", sub: "Glad you enjoyed it!" },
            5: { main: "🌟 Excellent!", sub: "Absolutely amazing experience!" },
          };
          ratingLabel.textContent = labels[value].main;
          ratingLabel.style.color = value >= 4 ? "#10b981" : value >= 3 ? "#f59e0b" : "#ef4444";
          ratingSubtext.textContent = labels[value].sub;
        }

        function triggerHapticFeedback() {
          if (navigator.vibrate) {
            navigator.vibrate(10);
          }
        }

        // Star interactions
        stars.forEach((star) => {
          star.addEventListener("click", () => {
            const value = parseInt(star.dataset.value);
            selectedRating = value;
            slider.value = value;
            updateStars(value);
            updateLabels(value);
            triggerHapticFeedback();
          });

          star.addEventListener("mouseenter", () => {
            const value = parseInt(star.dataset.value);
            stars.forEach((s) => {
              const sVal = parseInt(s.dataset.value);
              if (sVal <= value) {
                s.style.color = "#fbbf24";
                s.style.transform = "scale(1.3) rotate(-5deg)";
                s.style.textShadow = "0 0 20px rgba(251, 191, 36, 0.4)";
              } else {
                s.style.color = "#e5e7eb";
                s.style.transform = "scale(1)";
                s.style.textShadow = "none";
              }
            });
          });

          star.addEventListener("mouseleave", () => {
            const currentValue = parseInt(slider.value);
            updateStars(currentValue);
            stars.forEach((s) => {
              s.style.transform = "scale(1)";
              s.style.textShadow = "none";
            });
          });
        });

        // Slider interaction
        slider.addEventListener("input", () => {
          const value = parseInt(slider.value);
          selectedRating = value;
          updateStars(value);
          updateLabels(value);
        });

        // Character counter
        reviewText.addEventListener("input", () => {
          const count = reviewText.value.length;
          charCount.textContent = `${count}/500`;
          if (count > 450) {
            charCount.style.color = "#ef4444";
            charCount.style.fontWeight = "700";
          } else if (count > 300) {
            charCount.style.color = "#f59e0b";
            charCount.style.fontWeight = "600";
          } else {
            charCount.style.color = "#9ca3af";
            charCount.style.fontWeight = "400";
          }
        });

        // Focus/Blur handlers for textarea
        reviewText.addEventListener("focus", () => {
          reviewText.style.borderColor = "#7c3aed";
          reviewText.style.background = "white";
          reviewText.style.boxShadow = "0 0 0 4px rgba(124,58,237,0.1)";
        });

        reviewText.addEventListener("blur", () => {
          reviewText.style.borderColor = "#e5e7eb";
          reviewText.style.background = "#fafafa";
          reviewText.style.boxShadow = "none";
        });

        // Suggestion chips
        suggestionChips.forEach((chip) => {
          chip.addEventListener("click", () => {
            const text = chip.dataset.text;
            const currentText = reviewText.value;
            const newText = currentText + (currentText ? " " : "") + text;
            reviewText.value = newText;
            reviewText.dispatchEvent(new Event("input", { bubbles: true }));
            reviewText.focus();
          });

          chip.addEventListener("mouseenter", () => {
            chip.style.background = "#e5e7eb";
            chip.style.transform = "scale(1.05)";
          });

          chip.addEventListener("mouseleave", () => {
            chip.style.background = "#f3f4f6";
            chip.style.transform = "scale(1)";
          });
        });

        // Initialize with default
        updateStars(3);
        updateLabels(3);
      },

      preConfirm: () => {
        const ratingElement = document.getElementById("swal-rating");
        const reviewElement = document.getElementById("swal-review");
        console.log("preConfirm called");
        if (!ratingElement) {
          return false;
        }

        const rating = parseInt(ratingElement.value || "0");
        const review = reviewElement?.value?.trim() || "";

        if (rating < 1 || rating > 5) {
          Swal.showValidationMessage({
            icon: "error",
            title: "Invalid Rating",
            text: "Please select a rating between 1 and 5",
          });
          return false;
        }

        return { rating, review };
      },
    });

    // ✅ Check if user cancelled or dismissed
    if (!result.isConfirmed) {
      // User clicked Cancel, pressed ESC, or closed the popup
      setIsLoadingRating(false);
      return;
    }

    // console.log("Reached after isConfirmed check");
    // ✅ User confirmed - get the values
    const formValues = result.value;

    if (!formValues) {
      setIsLoadingRating(false);
      return;
    }

    // ✅ Start the submission process
    setIsLoadingRating(true);
    // Show loading state
    Swal.fire({
      title: "Submitting Your Review",
      html: `
      <div style="padding: 20px 0; text-align: center;">
        <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">Please wait while we process your feedback</div>
        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: #7c3aed; border-radius: 50%; animation: pulse 1.4s infinite ease-in-out both; animation-delay: 0s;"></div>
          <div style="width: 12px; height: 12px; background: #7c3aed; border-radius: 50%; animation: pulse 1.4s infinite ease-in-out both; animation-delay: 0.2s;"></div>
          <div style="width: 12px; height: 12px; background: #7c3aed; border-radius: 50%; animation: pulse 1.4s infinite ease-in-out both; animation-delay: 0.4s;"></div>
        </div>
        <style>
          @keyframes pulse {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        </style>
      </div>
    `,
      showConfirmButton: false,
      allowOutsideClick: false,
      background: "#ffffff",
      backdrop: "rgba(0,0,0,0.6) blur(8px)",
      width: 400,
      padding: "30px",
      customClass: {
        popup: "rounded-3xl",
      },
    });

    try {
      // Determine endpoint based on category
      const endpoint =
        category === "user" ? `${SERVER_URL}/bookings/ratingU` : `${SERVER_URL}/bookings/ratingV`;

      // Send the review data
      const response = await axios.patch(
        endpoint,
        {
          bookingId,
          rating: formValues.rating,
          review: formValues.review || "",
        },
        {
          headers: { Authorization: token },
        },
      );

      // Close loading popup
      Swal.close();

      // ✅ Update success message
      // setSuccess(response.data.message);
      // setTimeout(() => {
      //   setSuccess("");
      // }, 1000);

      // ✅ Update UI state
      dispatch(setCancelOrder(!cancelOrder));
      setIsLoadingRating(false);

      // ✅ Show success popup
      const ratingStars = "⭐".repeat(formValues.rating) + "☆".repeat(5 - formValues.rating);

      await Swal.fire({
        title: "",
        html: `
        <div style="text-align: center; padding: 10px 0;">
          <div style="font-size: 64px; margin-bottom: 8px;">🎉</div>
          <div style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
            Thank You!
          </div>
          <div style="font-size: 42px; margin: 12px 0;">
            ${ratingStars}
          </div>
          <div style="font-size: 16px; color: #6b7280;">
            Your ${formValues.rating}-star review has been submitted
          </div>
          ${
            formValues.review
              ? `
            <div style="margin-top: 16px; padding: 12px 16px; background: #f3f4f6; border-radius: 12px; text-align: left; font-size: 14px; color: #374151; font-style: italic;">
              "${formValues.review}"
            </div>
          `
              : ""
          }
          <div style="margin-top: 12px; font-size: 13px; color: #10b981; font-weight: 600;">
            ✓ Feedback submitted successfully
          </div>
        </div>
      `,
        icon: "success",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "✨ Awesome!",
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.6) blur(8px)",
        timer: 4000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__tada",
        },
        width: 480,
        padding: "30px",
        customClass: {
          popup: "rounded-3xl",
          confirmButton:
            "font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105",
        },
      });
    } catch (error) {
      // Close loading popup
      Swal.close();

      // ✅ Update error message
      setErr(error.response?.data?.message || "Failed to submit rating");
      setTimeout(() => {
        setErr("");
      }, 3000);

      setIsLoadingRating(false);

      // ✅ Show error popup
      // await Swal.fire({
      //   title: "",
      //   html: `
      //   <div style="text-align: center; padding: 10px 0;">
      //     <div style="font-size: 64px; margin-bottom: 8px;">😅</div>
      //     <div style="font-size: 22px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
      //       Oops! Something Went Wrong
      //     </div>
      //     <div style="font-size: 15px; color: #6b7280; margin-bottom: 8px;">
      //       ${error.response?.data?.message || "Please check your connection and try again"}
      //     </div>
      //     <div style="font-size: 13px; color: #ef4444; background: #fef2f2; padding: 8px 12px; border-radius: 8px; margin-top: 8px;">
      //       🔄 You can try submitting again
      //     </div>
      //   </div>
      // `,
      //   icon: "error",
      //   confirmButtonColor: "#7c3aed",
      //   confirmButtonText: "Got it",
      //   background: "#ffffff",
      //   backdrop: "rgba(0,0,0,0.6) blur(8px)",
      //   showClass: {
      //     popup: "animate__animated animate__headShake",
      //   },
      //   width: 440,
      //   padding: "30px",
      //   customClass: {
      //     popup: "rounded-3xl",
      //     confirmButton:
      //       "font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105",
      //   },
      // });
    }
  }

  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  return (
    <div
      className="views-children"
      key={element.key}
      style={{
        border:
          orderStatus == "complete"
            ? "2px solid green"
            : orderStatus == "cancel"
              ? "2px solid red"
              : "2px solid blue",
      }}
    >
      <div>
        <span>Name :</span>{" "}
        <span>
          <CamleCase element={element.name} />
        </span>
      </div>
      <div>
        <span>Phone No :</span> <span>{element.phoneNo}</span>
      </div>
      <div>
        <span>Type :</span>
        <span>
          <CamleCase element={element.type} />
        </span>
      </div>
      <div>
        <span>Date :</span>
        <span>{new Date(element.date).toDateString()}</span>
      </div>
      <div style={{ gap: "1rem" }}>
        {orderStatus == "pending" ? (
          <button
            className="btn"
            style={{
              padding: isLoadingCancelOrder ? "0" : "",
              backgroundColor: "red",
            }}
            onClick={() => handleCancelOrder(element.bookingId)}
          >
            {isLoadingCancelOrder ? <div className="loading"></div> : "Cancel Order"}
          </button>
        ) : (
          ""
        )}
        {orderStatus == "pending" ? (
          <button
            className="btn"
            style={{
              padding: isLoadingCompleteOrder ? "0" : "",
            }}
            onClick={() => handleCompletedOrder(element.bookingId)}
          >
            {isLoadingCompleteOrder ? <div className="loading"></div> : "Mark As Complete"}
          </button>
        ) : (
          ""
        )}
      </div>

      {orderStatus == "complete" ? (
        <>
          <button
            className="btn"
            style={{
              backgroundColor: element.rating ? "#fff" : "green",
              color: element.rating ? "blue" : "",
              padding: isLoadingRating ? "0" : "",
            }}
            onClick={() => handleRatings(element.bookingId, element.rating)}
          >
            {isLoadingRating ? (
              <div className="loading"></div>
            ) : element.rating ? (
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "green",
                }}
              >
                <span style={{ color: "brown" }}>Rated By You :</span> {element.rating}/5
              </p>
            ) : (
              "Give Rating And Review To Vendor"
            )}
          </button>
          <p
            style={{
              fontSize: "1.3rem",
              color: "green",
              padding: "0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            {element.review ? (
              <>
                <span style={{ color: "brown" }}>Reviewed By You :</span> {element.review}
              </>
            ) : (
              ""
            )}
          </p>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
