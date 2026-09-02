// Modern Add Money Page - AapkaKaam (with scroll to top)

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DiscountedCard.css";
import { addDataUser } from "../utils/userslice";
import { addDataVendor } from "../utils/vendorslice";
import { SERVER_URL } from "../utils/base";
import cross from "../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import axios from "axios";
import { showWarning } from "../components/showAlert";

const pricingOptions = [
  { original: 100, discounted: 100 },
  { original: 500, discounted: 475 },
  { original: 1000, discounted: 900 },
  { original: 1500, discounted: 1270 },
  { original: 2000, discounted: 1600 },
  { original: 5000, discounted: 3500 },
  { original: 10000, discounted: 6000 },
  { original: 20000, discounted: 10000 },
];

const DiscountCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = localStorage.getItem("category");
  const containerRef = useRef(null);

  // Get language from Redux store
  const lang = useSelector((store) => store.category?.selectLanguage || "en");

  const userData = useSelector((state) =>
    category === "user" ? state.user.data : state.vendor.data,
  );

  const user = userData?.[0] || {};
  const token = `Bearer ${user?.token || ""}`;
  const name = user?.name || "";
  const email = user?.email || "";
  const phoneNo = user?.phoneNo || "";
  const userId = user?.userId || null;
  const vendorId = user?.vendorId || null;

  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    // Scroll window to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    // Also scroll the container to top if it exists
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // ============ RAZORPAY CLOSE HANDLER ============
  const handleRazorpayClose = async (razorpayInstance, orderId, amount) => {
    console.log("Razorpay modal closed by user", { orderId, amount });

    showWarning(
      lang === "hin"
        ? "भुगतान रद्द कर दिया गया। आप कभी भी पुनः प्रयास कर सकते हैं।"
        : "Payment was cancelled. You can try again anytime.",
    );

    setLoadingIndex(null);
    setIsLoading(false);

    try {
      await axios.post(
        `${SERVER_URL}/payment/abandoned-payment`,
        {
          orderId,
          amount,
          userId: userId || null,
          vendorId: vendorId || null,
          category,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
      console.log("Abandoned payment tracked successfully");
    } catch (err) {
      console.error("Failed to log abandoned payment:", err);
    }

    if (razorpayInstance) {
      try {
        razorpayInstance.close();
      } catch (e) {
        console.log("Razorpay instance already closed");
      }
    }
  };

  // ============ PAYMENT FAILURE HANDLER ============
  const handlePaymentFailure = async (error, orderId, amount) => {
    console.error("Payment failed:", error);

    setLoadingIndex(null);
    setIsLoading(false);

    let errorMessage =
      lang === "hin" ? "भुगतान विफल। कृपया पुनः प्रयास करें।" : "Payment failed. Please try again.";
    let errorCode = "PAYMENT_FAILED";
    let errorDescription = "";

    if (error && error.error) {
      errorCode = error.error.code || errorCode;
      errorMessage = error.error.description || error.error.reason || errorMessage;
      errorDescription = error.error.description || "";
    } else if (error && error.message) {
      errorMessage = error.message;
    }

    setPaymentError(errorMessage);

    try {
      await axios.post(
        `${SERVER_URL}/payment/payment-failed`,
        {
          orderId,
          amount,
          userId: userId || null,
          vendorId: vendorId || null,
          category,
          error: {
            code: errorCode,
            message: errorMessage,
            description: errorDescription,
          },
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
      console.log("Payment failure tracked successfully");
    } catch (err) {
      console.error("Failed to log payment failure:", err);
    }

    showWarning(errorMessage);
  };

  // ============ HANDLE PAY FUNCTION ============
  const handlePay = async (amount, discountPercent, index) => {
    setLoadingIndex(index);
    setPaymentError(null);
    setCurrentAmount(amount);

    try {
      const response = await axios.post(
        `${SERVER_URL}/payment/create-order`,
        {
          amount: amount,
          userId: userId,
          vendorId: vendorId,
          category: category,
          currency: "INR",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
      console.log("Order creation response:", response.data, token);
      if (!response.data.success) {
        throw new Error(response.data.message || "Order creation failed");
      }

      const { order, transaction } = response.data;
      setCurrentOrderId(order.id);

      setIsLoading(true);
      setLoadingIndex(null);

      const options = {
        key: "rzp_live_ymm3SOr7DUIJiM",
        amount: order.amount,
        currency: order.currency,
        name: "Aapkakaam",
        description: `Purchase Credits - ₹${amount}`,
        order_id: order.id,
        prefill: {
          name: name || "Guest",
          email: email || "guest@aapkakaam.com",
          contact: phoneNo || "9999999999",
        },
        notes: {
          userId: userId || "",
          vendorId: vendorId || "",
          category: category,
          amount: amount,
          discountPercent: discountPercent,
        },

        handler: async function (response) {
          console.log("Payment successful:", response);

          try {
            const verifyResponse = await axios.post(
              `${SERVER_URL}/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount,
                discount: (amount * discountPercent) / 100,
                discountPercent: discountPercent,
                balance: amount,
                userId: userId,
                vendorId: vendorId,
                category: category,
                name: name,
                email: email,
                phoneNo: phoneNo,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              },
            );

            const data = verifyResponse.data;
            if (data.success) {
              setLoadingIndex(null);

              const updatedData = {
                ...userData[0],
                balance: data.balance || userData[0]?.balance + amount,
                totalDiscount: data.totalDiscount,
                transactionCount: data.transactionCount,
                totalOriginalAmount: data.totalOriginalAmount,
              };
              const action = category === "user" ? addDataUser : addDataVendor;
              dispatch(action(updatedData));
              localStorage.setItem(category, JSON.stringify(updatedData));

              window.location.href = `/paymentSuccessful?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&amount=${data.transaction.finalAmount}`;
            } else {
              setIsLoading(false);
              setLoadingIndex(null);
              showWarning(data.message || "Payment verification failed. Please contact support.");
              window.location.href = "/paymentFailed";
            }
          } catch (err) {
            console.error("Verification error:", err);
            setIsLoading(false);
            setLoadingIndex(null);
            showWarning(
              lang === "hin"
                ? "सत्यापन के दौरान कुछ गलत हो गया। कृपया सहायता से संपर्क करें।"
                : "Something went wrong during verification. Please contact support.",
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Modal dismissed by user");
            handleRazorpayClose(this, order.id, amount);
          },
          escape: true,
          animation: true,
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed event:", response);
        handlePaymentFailure(response.error, order.id, amount);
      });

      rzp.on("payment.success", function (response) {
        console.log("Payment success event triggered:", response);
      });

      rzp.on("loaded", function () {
        console.log("Razorpay modal loaded successfully");
      });

      let isClosedHandled = false;
      rzp.on("checkout.close", function () {
        if (!isClosedHandled) {
          isClosedHandled = true;
          console.log("Checkout closed event");

          setTimeout(() => {
            if (!rzp._paymentCompleted) {
              handleRazorpayClose(rzp, order.id, amount);
            }
            isClosedHandled = false;
          }, 2000);
        }
      });

      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setLoadingIndex(null);
      setIsLoading(false);
      setPaymentError(err.message || "Something went wrong. Please try again.");
      showWarning(
        err.response?.data?.message ||
          err.data?.message ||
          err.message ||
          (lang === "hin"
            ? "कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
            : "Something went wrong. Please try again."),
      );
    }
  };

  // ============ HANDLE CROSS BUTTON ============
  function handleCrossInOrders() {
    if (window.Razorpay && window._rzp) {
      try {
        window._rzp.close();
      } catch (e) {
        console.log("Razorpay instance already closed");
      }
    }
    navigate("/");
  }

  function handleTransactionHistory() {
    navigate("/transactionHistory");
  }

  // ============ CLEANUP ON UNMOUNT ============
  useEffect(() => {
    return () => {
      if (window.Razorpay && window._rzp) {
        try {
          window._rzp.close();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  return (
    <div className="add-money-modern">
      <div className="add-money-container" ref={containerRef}>
        {/* Decorative Elements */}
        <div className="add-money-decoration">
          <div className="deco-circle c1"></div>
          <div className="deco-circle c2"></div>
          <div className="deco-circle c3"></div>
        </div>

        {/* Close Button */}
        <button className="add-money-close-btn" onClick={handleCrossInOrders}>
          <svg viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="add-money-header">
          <div className="add-money-badge">{lang === "hin" ? "💰 बैलेंस" : "💰 BALANCE"}</div>
          <h1>{lang === "hin" ? "बैलेंस जोड़ें" : "Add Balance"}</h1>
          <div className="add-money-balance">
            <span>{lang === "hin" ? "वर्तमान बैलेंस" : "Current Balance"}</span>
            <span className="balance-amount">₹{user?.balance?.toFixed(2) || 0}</span>
          </div>
          <button className="add-money-history-btn" onClick={handleTransactionHistory}>
            {lang === "hin" ? "📜 लेनदेन इतिहास" : "📜 Transaction History"}
          </button>
          <button className="add-money-history-btn" onClick={() => navigate("/paymentFailed")}>
            failed
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="add-money-loading">
            <div className="loader"></div>
            <p>{lang === "hin" ? "भुगतान की तैयारी हो रही है..." : "Preparing payment..."}</p>
          </div>
        ) : (
          /* Pricing Grid */
          <div className="add-money-grid">
            {pricingOptions.map((amount, index) => {
              const userAmount = {
                discounted: amount.discounted / 10,
                original: amount.original / 10,
              };
              const option = category === "user" ? userAmount : amount;
              const discountPercent = Math.round(
                ((option.original - option.discounted) / option.original) * 100,
              );

              return (
                <div className="add-money-card" key={index}>
                  <div className="card-header">
                    <div className="card-amount">₹{option.discounted}</div>
                    {discountPercent > 0 && (
                      <span className="card-discount-badge">-{discountPercent}%</span>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="card-original-price">
                      <span className="original-label">
                        {lang === "hin" ? "मूल कीमत" : "Original"}
                      </span>
                      <span
                        className="original-value"
                        style={{
                          textDecoration: discountPercent > 0 ? "line-through" : "none",
                          opacity: discountPercent > 0 ? 0.6 : 1,
                        }}
                      >
                        ₹{option.original}
                      </span>
                    </div>
                    <div className="card-savings">
                      <span className="savings-label">
                        {lang === "hin" ? "आप बचाते हैं" : "You Save"}
                      </span>
                      <span className="savings-value">₹{option.original - option.discounted}</span>
                    </div>
                  </div>
                  <button
                    className="card-pay-btn"
                    onClick={() => handlePay(option.original, discountPercent, index)}
                    disabled={loadingIndex === index}
                  >
                    {loadingIndex === index ? (
                      <span className="loader-small"></span>
                    ) : (
                      <>
                        {lang === "hin" ? "भुगतान करें" : "Pay Now"}
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
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountCard;
