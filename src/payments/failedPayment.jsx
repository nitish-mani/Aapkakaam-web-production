import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentFailed.css";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/add-balance");
  };

  const handleSupport = () => {
    window.location.href = "mailto:support@aapkakaam.com";
  };

  return (
    <div className="payment-failed-container">
      <div className="failed-card">
        <div className="failed-icon">❌</div>
        <h1>Payment Failed</h1>
        <p>We couldn't process your payment. Please try again.</p>

        <div className="failure-reasons">
          <h3>Possible reasons:</h3>
          <ul>
            <li>Insufficient balance in your account</li>
            <li>Network connectivity issues</li>
            <li>Bank declined the transaction</li>
            <li>Payment gateway timeout</li>
          </ul>
        </div>

        <div className="button-group">
          <button className="retry-button" onClick={handleRetry}>
            Try Again
          </button>
          <button className="support-button" onClick={handleSupport}>
            Contact Support
          </button>
        </div>

        <p className="note">
          If the amount was deducted from your account but you didn't receive
          credits, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
