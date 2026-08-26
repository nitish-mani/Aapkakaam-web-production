// Modern Payment Success Page - AapkaKaam

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("razorpay_payment_id");
    const orderId = params.get("razorpay_order_id");
    const amount = params.get("amount");

    if (paymentId && orderId) {
      setPaymentDetails({
        paymentId,
        orderId,
        amount: amount || "N/A",
      });
    } else {
      // If no payment details, redirect to home
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [location, navigate]);

  const handleContinue = () => {
    navigate("/");
  };

  if (!paymentDetails) {
    return (
      <div className="payment-success-modern">
        <div className="payment-success-loading">
          <div className="loader"></div>
          <p>{lang === "hin" ? "भुगतान विवरण लोड हो रहा है..." : "Loading payment details..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-modern">
      <div className="payment-success-container">
        {/* Decorative Elements */}
        <div className="payment-success-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <div className="success-icon-ring">
            <div className="success-icon">✓</div>
          </div>
        </div>

        {/* Header */}
        <div className="payment-success-header">
          <div className="success-badge">
            {lang === "hin" ? "✅ भुगतान सफल" : "✅ PAYMENT SUCCESS"}
          </div>
          <h1>{lang === "hin" ? "भुगतान सफल हुआ!" : "Payment Successful!"}</h1>
          <p>
            {lang === "hin"
              ? "आपका भुगतान सफलतापूर्वक संसाधित हो गया है।"
              : "Your payment has been processed successfully."}
          </p>
        </div>

        {/* Payment Details */}
        <div className="payment-details-modern">
          <div className="details-header">
            <span className="details-icon">📋</span>
            <span className="details-title">
              {lang === "hin" ? "भुगतान विवरण" : "Payment Details"}
            </span>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">{lang === "hin" ? "भुगतान आईडी" : "Payment ID"}</span>
              <span className="detail-value payment-id">{paymentDetails.paymentId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{lang === "hin" ? "ऑर्डर आईडी" : "Order ID"}</span>
              <span className="detail-value">{paymentDetails.orderId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{lang === "hin" ? "राशि" : "Amount"}</span>
              <span className="detail-value amount">₹{paymentDetails.amount}</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-message-modern">
          <div className="message-icon">🎉</div>
          <div className="message-content">
            <p>
              {lang === "hin"
                ? "आपका बैलेंस सफलतापूर्वक अपडेट हो गया है।"
                : "Your balance has been updated successfully."}
            </p>
            <p>
              {lang === "hin"
                ? "अब आप अपने क्रेडिट का उपयोग बुकिंग के लिए कर सकते हैं।"
                : "You can now use your credits for bookings."}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button className="continue-button-modern" onClick={handleContinue}>
          <span>{lang === "hin" ? "डैशबोर्ड पर जाएं" : "Continue to Dashboard"}</span>
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

        {/* Footer */}
        <div className="payment-success-footer">
          <span>
            {lang === "hin"
              ? "किसी भी समस्या के लिए सहायता से संपर्क करें"
              : "Contact support for any issues"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
