// Modern Order List Component - AapkaKaam

import { useEffect, useState } from "react";
import { SERVER_URL } from "../../utils/base";
import CamleCase from "../camleCase/camleCase";
import "./orderList.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCancelOrder } from "../../utils/categoryslice";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";
import { showConfirm, showError, showSuccess, showInfo } from "../showAlert";
import Swal from "sweetalert2";

export default function OrderList({ element, orderStatus, lang = "en" }) {
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

  // Helper function for language
  const t = (en, hi) => {
    return lang === "hin" ? hi : en;
  };

  async function handleCancelOrder(bookingId) {
    if (!navigator.onLine) {
      setErr(t("You are offline", "आप ऑफलाइन हैं"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    const result = await showConfirm({
      title: t("Are you sure?", "क्या आप निश्चित हैं?"),
      text: t("You want to cancel this order?", "आप इस ऑर्डर को रद्द करना चाहते हैं?"),
      confirmButtonText: t("Yes, cancel it!", "हाँ, रद्द करें!"),
      cancelButtonText: t("No, keep it", "नहीं, रखें"),
      icon: "warning",
    });

    if (!result.isConfirmed) return;

    setIsLoadingCancelOrder(true);

    const endpoint =
      category === "user"
        ? `${SERVER_URL}/bookings/cancelOrderU`
        : `${SERVER_URL}/bookings/cancelOrderV`;

    const action = category === "user" ? addDataUser : addDataVendor;

    try {
      const succ = await axios.patch(
        endpoint,
        { bookingId },
        { headers: { Authorization: token } },
      );

      const data = { ...userData[0] };
      dispatch(action(data));
      localStorage.setItem(category, JSON.stringify(data));
      setSuccess(succ.data.message);
      dispatch(setCancelOrder(!cancelOrder));
      setIsLoadingCancelOrder(false);
      setTimeout(() => setSuccess(""), 1000);
    } catch (err) {
      setErr(
        err.response?.data?.message || t("Failed to cancel order", "ऑर्डर रद्द करने में विफल"),
      );
      setIsLoadingCancelOrder(false);
      setTimeout(() => setErr(""), 3000);
    }
  }

  async function handleCompletedOrder(bookingId) {
    if (!navigator.onLine) {
      setErr(t("You are offline", "आप ऑफलाइन हैं"));
      setTimeout(() => setErr(""), 3000);
      return;
    }

    const result = await showConfirm({
      title: t("Are you sure?", "क्या आप निश्चित हैं?"),
      text: t(
        "You want to mark this order as complete?",
        "आप इस ऑर्डर को पूर्ण के रूप में चिह्नित करना चाहते हैं?",
      ),
      confirmButtonText: t("Yes, mark it complete!", "हाँ, पूर्ण चिह्नित करें!"),
      cancelButtonText: t("No, keep it", "नहीं, रखें"),
      icon: "info",
    });

    if (!result.isConfirmed) return;

    setIsLoadingCompleteOrder(true);

    const endpoint =
      category === "user"
        ? `${SERVER_URL}/bookings/orderCompletedU`
        : `${SERVER_URL}/bookings/orderCompletedV`;

    try {
      const succ = await axios.patch(
        endpoint,
        { bookingId },
        { headers: { Authorization: token } },
      );

      setSuccess(succ.data.message);
      dispatch(setCancelOrder(!cancelOrder));
      setIsLoadingCompleteOrder(false);
      setTimeout(() => setSuccess(""), 1000);
    } catch (err) {
      setErr(
        err.response?.data?.message || t("Failed to complete order", "ऑर्डर पूर्ण करने में विफल"),
      );
      setIsLoadingCompleteOrder(false);
      setTimeout(() => setErr(""), 3000);
    }
  }

  async function handleRatings(bookingId, existingRating) {
    // Already rated
    if (existingRating) {
      const ratingEmojis = { 1: "😔", 2: "😕", 3: "😐", 4: "😊", 5: "🌟" };

      await Swal.fire({
        title: `${ratingEmojis[existingRating]} ${t("Already Rated!", "पहले ही रेटिंग दी गई!")}`,
        html: `
          <div style="padding: 10px 0;">
            <div style="font-size: 64px; margin-bottom: 12px;">
              ${"⭐".repeat(existingRating)}${"☆".repeat(5 - existingRating)}
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #1f2937;">
              ${t("You rated this vendor", "आपने इस विक्रेता को रेटिंग दी")} ${existingRating}/5
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 8px;">
              ${t("Thank you for your feedback!", "आपकी प्रतिक्रिया के लिए धन्यवाद!")} 🙏
            </div>
          </div>
        `,
        icon: "info",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "👍 Got it",
        timer: 4000,
        timerProgressBar: true,
      });
      return;
    }

    if (!navigator.onLine) {
      await Swal.fire({
        title: "🌐 " + t("You're Offline", "आप ऑफलाइन हैं"),
        html: `
          <div style="padding: 10px 0;">
            <div style="font-size: 48px; margin-bottom: 8px;">📡</div>
            <div style="font-size: 15px; color: #6b7280;">
              ${t("Please check your internet connection and try again", "कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें")}
            </div>
          </div>
        `,
        icon: "warning",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "Got it",
      });
      return;
    }

    // Rating Modal
    const result = await Swal.fire({
      title: "",
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 4px 0;">
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: -30px -30px 20px -30px;
            padding: 25px 30px 20px 30px;
            border-radius: 16px 16px 0 0;
            color: white;
          ">
            <div style="font-size: 14px; opacity: 0.8; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 500;">
              ${t("Share Your Experience", "अपना अनुभव साझा करें")}
            </div>
            <div style="font-size: 24px; font-weight: 700; margin-top: 4px;">
              ${t("How was your booking?", "आपकी बुकिंग कैसी थी?")} ✨
            </div>
            <div style="font-size: 14px; opacity: 0.85; margin-top: 6px;">
              ${t("Your feedback helps others make better decisions", "आपकी प्रतिक्रिया दूसरों को बेहतर निर्णय लेने में मदद करती है")}
            </div>
          </div>

          <div style="margin: 20px 0 16px 0; text-align: center;">
            <div style="display: flex; justify-content: center; gap: 10px; font-size: 44px;" id="star-container">
              <span class="star" data-value="1" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
              <span class="star" data-value="2" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
              <span class="star" data-value="3" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
              <span class="star" data-value="4" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
              <span class="star" data-value="5" style="cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); color: #e5e7eb; user-select: none;">☆</span>
            </div>
            <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-top: 8px; min-height: 28px;" id="rating-label">
              ${t("Tap a star to rate", "रेटिंग देने के लिए स्टार पर टैप करें")}
            </div>
            <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;" id="rating-subtext">
              ${t("Choose from 1 to 5 stars", "1 से 5 स्टार में से चुनें")}
            </div>
          </div>

          <div style="margin: 16px 0 20px 0; padding: 0 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 500; color: #9ca3af; margin-bottom: 6px;">
              <span>${t("Not Great", "बहुत अच्छा नहीं")}</span>
              <span>${t("Average", "औसत")}</span>
              <span>${t("Amazing", "अद्भुत")}</span>
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

          <div style="margin-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="font-weight: 600; color: #1f2937; font-size: 14px;">
                📝 ${t("Write a Review", "समीक्षा लिखें")}
              </label>
              <span style="font-size: 12px; color: #9ca3af;" id="char-count">0/500</span>
            </div>
            <textarea
              id="swal-review"
              maxlength="500"
              placeholder="${t("What stood out to you? Share the highlights of your experience...", "आपको क्या खास लगा? अपने अनुभव के मुख्य बिंदु साझा करें...")}"
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
              <span class="suggestion-chip" data-text="${t("Great service!", "बहुत अच्छी सेवा!")} 👍" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
                👍 ${t("Great", "बहुत अच्छा")}
              </span>
              <span class="suggestion-chip" data-text="${t("Professional and friendly", "पेशेवर और मिलनसार")} 😊" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
                😊 ${t("Friendly", "मिलनसार")}
              </span>
              <span class="suggestion-chip" data-text="${t("Highly recommended!", "अत्यधिक अनुशंसित!")} ⭐" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
                ⭐ ${t("Recommend", "अनुशंसा")}
              </span>
              <span class="suggestion-chip" data-text="${t("Will book again", "फिर से बुक करूंगा")} 🔄" style="font-size: 11px; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; color: #6b7280; cursor: pointer; transition: all 0.2s;">
                🔄 ${t("Again", "फिर से")}
              </span>
            </div>
          </div>

          <div style="margin-top: 16px; padding: 10px 14px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280; text-align: center;">
            💡 ${t("Your review helps the community. Be honest and constructive!", "आपकी समीक्षा समुदाय की मदद करती है। ईमानदार और रचनात्मक बनें!")}
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "🌟 " + t("Submit Review", "समीक्षा सबमिट करें"),
      cancelButtonText: t("Cancel", "रद्द करें"),
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      reverseButtons: true,
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
            1: {
              main: t("😔 Needs Improvement", "😔 सुधार की आवश्यकता"),
              sub: t("We'll do better next time", "हम अगली बार बेहतर करेंगे"),
            },
            2: {
              main: t("😕 Could Be Better", "😕 बेहतर हो सकता है"),
              sub: t("Thank you for your honesty", "आपकी ईमानदारी के लिए धन्यवाद"),
            },
            3: {
              main: t("😐 It Was Okay", "😐 यह ठीक था"),
              sub: t("Room for improvement", "सुधार की गुंजाइश है"),
            },
            4: {
              main: t("😊 Good Experience", "😊 अच्छा अनुभव"),
              sub: t("Glad you enjoyed it!", "खुशी है कि आपको पसंद आया!"),
            },
            5: {
              main: t("🌟 Excellent!", "🌟 उत्कृष्ट!"),
              sub: t("Absolutely amazing experience!", "बिल्कुल अद्भुत अनुभव!"),
            },
          };
          ratingLabel.textContent = labels[value].main;
          ratingLabel.style.color = value >= 4 ? "#10b981" : value >= 3 ? "#f59e0b" : "#ef4444";
          ratingSubtext.textContent = labels[value].sub;
        }

        // Star interactions
        stars.forEach((star) => {
          star.addEventListener("click", () => {
            const value = parseInt(star.dataset.value);
            selectedRating = value;
            slider.value = value;
            updateStars(value);
            updateLabels(value);
            if (navigator.vibrate) navigator.vibrate(10);
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

        // Focus/Blur handlers
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

        // Initialize
        updateStars(3);
        updateLabels(3);
      },
      preConfirm: () => {
        const ratingElement = document.getElementById("swal-rating");
        const reviewElement = document.getElementById("swal-review");

        if (!ratingElement) return false;

        const rating = parseInt(ratingElement.value || "0");
        const review = reviewElement?.value?.trim() || "";

        if (rating < 1 || rating > 5) {
          Swal.showValidationMessage({
            icon: "error",
            title: t("Invalid Rating", "अमान्य रेटिंग"),
            text: t("Please select a rating between 1 and 5", "कृपया 1 से 5 के बीच रेटिंग चुनें"),
          });
          return false;
        }

        return { rating, review };
      },
    });

    if (!result.isConfirmed) {
      setIsLoadingRating(false);
      return;
    }

    const formValues = result.value;
    if (!formValues) {
      setIsLoadingRating(false);
      return;
    }

    setIsLoadingRating(true);

    // Show loading state
    Swal.fire({
      title: t("Submitting Your Review", "आपकी समीक्षा सबमिट हो रही है"),
      html: `
        <div style="padding: 20px 0; text-align: center;">
          <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">
            ${t("Please wait while we process your feedback", "कृपया प्रतीक्षा करें जब हम आपकी प्रतिक्रिया संसाधित कर रहे हैं")}
          </div>
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
    });

    try {
      const endpoint =
        category === "user" ? `${SERVER_URL}/bookings/ratingU` : `${SERVER_URL}/bookings/ratingV`;

      await axios.patch(
        endpoint,
        {
          bookingId,
          rating: formValues.rating,
          review: formValues.review || "",
        },
        { headers: { Authorization: token } },
      );

      Swal.close();
      dispatch(setCancelOrder(!cancelOrder));
      setIsLoadingRating(false);

      const ratingStars = "⭐".repeat(formValues.rating) + "☆".repeat(5 - formValues.rating);

      await Swal.fire({
        title: "",
        html: `
          <div style="text-align: center; padding: 10px 0;">
            <div style="font-size: 64px; margin-bottom: 8px;">🎉</div>
            <div style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">
              ${t("Thank You!", "धन्यवाद!")}
            </div>
            <div style="font-size: 42px; margin: 12px 0;">
              ${ratingStars}
            </div>
            <div style="font-size: 16px; color: #6b7280;">
              ${t("Your", "आपकी")} ${formValues.rating}-star ${t("review has been submitted", "समीक्षा सबमिट कर दी गई है")}
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
              ✓ ${t("Feedback submitted successfully", "प्रतिक्रिया सफलतापूर्वक सबमिट की गई")}
            </div>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "✨ " + t("Awesome!", "बहुत बढ़िया!"),
        timer: 4000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.close();
      setErr(
        error.response?.data?.message || t("Failed to submit rating", "रेटिंग सबमिट करने में विफल"),
      );
      setTimeout(() => setErr(""), 3000);
      setIsLoadingRating(false);
    }
  }

  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);

  useEffect(() => {
    if (err) showError(err);
  }, [err]);

  // Get status colors
  const getStatusColor = () => {
    if (orderStatus === "complete") return "#16a34a";
    if (orderStatus === "cancel") return "#dc2626";
    return "#2563eb";
  };

  const getStatusLabel = () => {
    if (orderStatus === "complete") return t("Completed", "पूर्ण");
    if (orderStatus === "cancel") return t("Canceled", "रद्द");
    return t("Pending", "लंबित");
  };

  return (
    <div className="order-list-modern" style={{ borderColor: getStatusColor() }}>
      <div className="order-list-header">
        <div className="order-list-status">
          <span className={`status-dot ${orderStatus}`}></span>
          <span className="status-label" style={{ color: getStatusColor() }}>
            {getStatusLabel()}
          </span>
        </div>
        <span className="order-list-date">
          {new Date(element.date).toLocaleDateString(lang === "hin" ? "hi-IN" : "en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="order-list-body">
        <div className="order-list-field">
          <span className="field-label">{t("Name", "नाम")}:</span>
          <span className="field-value">
            <CamleCase element={element.name} />
          </span>
        </div>

        <div className="order-list-field">
          <span className="field-label">{t("Phone", "फोन")}:</span>
          <span className="field-value">{element.phoneNo}</span>
        </div>

        <div className="order-list-field">
          <span className="field-label">{t("Service", "सेवा")}:</span>
          <span className="field-value">
            <CamleCase element={element.type} />
          </span>
        </div>
      </div>

      {orderStatus === "pending" && (
        <div className="order-list-actions">
          <button
            className="action-btn cancel-btn"
            onClick={() => handleCancelOrder(element.bookingId)}
            disabled={isLoadingCancelOrder}
          >
            {isLoadingCancelOrder ? (
              <span className="btn-spinner"></span>
            ) : (
              t("Cancel Order", "ऑर्डर रद्द करें")
            )}
          </button>

          <button
            className="action-btn complete-btn"
            onClick={() => handleCompletedOrder(element.bookingId)}
            disabled={isLoadingCompleteOrder}
          >
            {isLoadingCompleteOrder ? (
              <span className="btn-spinner"></span>
            ) : (
              t("Mark As Complete", "पूर्ण चिह्नित करें")
            )}
          </button>
        </div>
      )}

      {orderStatus === "complete" && (
        <div className="order-list-rating">
          <button
            className={`rating-btn ${element.rating ? "rated" : ""}`}
            onClick={() => handleRatings(element.bookingId, element.rating)}
            disabled={isLoadingRating}
          >
            {isLoadingRating ? (
              <span className="btn-spinner"></span>
            ) : element.rating ? (
              <span className="rating-display">
                <span className="rating-label">{t("Rated By You", "आपकी रेटिंग")}:</span>
                <span className="rating-stars">
                  {"⭐".repeat(element.rating)}
                  <span className="rating-number">{element.rating}/5</span>
                </span>
              </span>
            ) : (
              t("Give Rating & Review", "रेटिंग और समीक्षा दें")
            )}
          </button>

          {element.review && (
            <div className="review-display">
              <span className="review-label">{t("Your Review", "आपकी समीक्षा")}:</span>
              <span className="review-text">“{element.review}”</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
