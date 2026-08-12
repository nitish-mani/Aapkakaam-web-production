import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

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
      <div className="payment-success-container">
        <div className="loading-spinner"></div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>

        <div className="payment-details">
          <div className="detail-row">
            <span className="label">Payment ID:</span>
            <span className="value">{paymentDetails.paymentId}</span>
          </div>
          <div className="detail-row">
            <span className="label">Order ID:</span>
            <span className="value">{paymentDetails.orderId}</span>
          </div>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">₹{paymentDetails.amount}</span>
          </div>
        </div>

        <div className="success-message">
          <p>Your balance has been updated successfully.</p>
          <p>You can now use your credits for bookings.</p>
        </div>

        <button className="continue-button" onClick={handleContinue}>
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
