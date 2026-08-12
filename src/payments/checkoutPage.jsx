import React, { useState, useEffect } from "react";
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

  // ============ RAZORPAY CLOSE HANDLER ============
  const handleRazorpayClose = async (razorpayInstance, orderId, amount) => {
    console.log("Razorpay modal closed by user", { orderId, amount });

    // showWarning user-friendly message
    showWarning("Payment was cancelled. You can try again anytime.");

    // Reset loading states
    setLoadingIndex(null);
    setIsLoading(false);

    // Send notification to backend about abandoned payment
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

    // Clean up Razorpay instance
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

    // Reset loading states
    setLoadingIndex(null);
    setIsLoading(false);

    // Extract error message
    let errorMessage = "Payment failed. Please try again.";
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

    // Log payment failure to backend
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

    // showWarning showWarning to user
    showWarning(`Payment failed: ${errorMessage}`);
  };

  // ============ HANDLE PAY FUNCTION ============
  const handlePay = async (amount, discountPercent, index) => {
    setLoadingIndex(index);
    setPaymentError(null);
    setCurrentAmount(amount);

    try {
      // Create order
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

      // ============ RAZORPAY OPTIONS ============
      const options = {
        key: "rzp_test_THfazRmCIeemjt",
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

        // ============ HANDLER: SUCCESSFUL PAYMENT ============
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
            // console.log(data);
            if (data.success) {
              setLoadingIndex(null);
              // setIsLoading(false);

              // Update user data in Redux and localStorage
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

              // Redirect to success page
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
            showWarning("Something went wrong during verification. Please contact support.");
          }
        },

        // ============ MODAL CLOSE HANDLER ============
        modal: {
          ondismiss: function () {
            console.log("Modal dismissed by user");
            handleRazorpayClose(this, order.id, amount);
          },
          escape: true,
          animation: true,
        },

        // ============ THEME ============
        theme: {
          color: "#4f46e5",
        },
      };

      // Create Razorpay instance
      const rzp = new window.Razorpay(options);

      // ============ RAZORPAY EVENT LISTENERS ============

      // 1. Payment failure event
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed event:", response);
        handlePaymentFailure(response.error, order.id, amount);
      });

      // 2. Payment success event (extra safety)
      rzp.on("payment.success", function (response) {
        console.log("Payment success event triggered:", response);
        // The handler will handle this
      });

      // 3. Razorpay loaded event
      rzp.on("loaded", function () {
        console.log("Razorpay modal loaded successfully");
      });

      // 4. Checkout close event (fallback)
      let isClosedHandled = false;
      rzp.on("checkout.close", function () {
        if (!isClosedHandled) {
          isClosedHandled = true;
          console.log("Checkout closed event");

          // Check if payment was completed by checking if we have a payment ID
          // If not completed, handle as abandoned
          setTimeout(() => {
            if (!rzp._paymentCompleted) {
              handleRazorpayClose(rzp, order.id, amount);
            }
            isClosedHandled = false;
          }, 2000);
        }
      });

      // Open Razorpay modal
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
          "Something went wrong. Please try again.",
      );
    }
  };

  // ============ HANDLE CROSS BUTTON ============
  function handleCrossInOrders() {
    // Close Razorpay modal if open
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
      // Close Razorpay modal if component unmounts
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
    <div className="views-P">
      <img
        className="profile__close-button"
        src={cross}
        alt="cross"
        onClick={handleCrossInOrders}
        style={{ cursor: "pointer" }}
      />

      <div
        style={{
          gridColumnEnd: "4",
          gridColumnStart: "1",
          marginBottom: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid rgba(105, 102, 102, 0.637)",
        }}
      >
        <h2>Add Balance</h2>
        <p style={{ fontSize: "14px", color: "#93a0f3" }}>
          Current Balance: ₹{user?.balance.toFixed(2) || 0}
        </p>
        <button
          className="pay-button"
          style={{
            fontSize: "14px",
            width: "fit-content",
            padding: "0.5rem 1rem",
            marginTop: "0.5rem",
          }}
          onClick={handleTransactionHistory}
        >
          Transaction History
        </button>
      </div>

      {isLoading ? (
        <div
          style={{
            width: "100vw",
            height: "40rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div className="loading"></div>
            <p>Preparing payment...</p>
          </div>
        </div>
      ) : (
        <div className="pricing-container">
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
              <div className="card animate-fadeInUp" key={index}>
                <div className="card-header">
                  {discountPercent === 0 ? (
                    <span className="discount-badge">{discountPercent}%</span>
                  ) : (
                    <span className="discount-badge">-{discountPercent}%</span>
                  )}
                  <h3>₹{option.discounted}</h3>
                </div>
                <p
                  className="original-price"
                  style={{
                    textDecorationLine: discountPercent === 0 ? "none" : "line-through",
                  }}
                >
                  ₹{option.original}
                </p>
                <p className="discount">You Save ₹{option.original - option.discounted}</p>
                <button
                  className="pay-button"
                  onClick={() => handlePay(option.original, discountPercent, index)}
                  disabled={loadingIndex === index}
                  style={{
                    opacity: loadingIndex === index ? 0.7 : 1,
                    cursor: loadingIndex === index ? "not-allowed" : "pointer",
                  }}
                >
                  {loadingIndex === index ? <div className="loading"></div> : "Pay Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscountCard;
