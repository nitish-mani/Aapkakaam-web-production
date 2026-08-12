//optimized and production ready

import axios from "axios";
import CamleCase from "../camleCase/camleCase";
import { SERVER_URL } from "../../utils/base";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../showAlert";

export default function BookingList({ data }) {
  const category = localStorage.getItem("category");
  const token = `Bearer ${JSON.parse(localStorage.getItem(category))?.token}`;
  const user = JSON.parse(localStorage.getItem(category));
  const [isLoadingRatingPermission, setIsLoadingRatingPermission] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  console.log("BookingList data:", data);
  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  return (
    <>
      <div
        style={{
          boxShadow: "0 1px 8px #868e96",
          margin: "1rem",
          padding: "1rem",
          borderRadius: "5px",
        }}
      >
        {/* Name Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: ".2rem",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Name</span>
          <span>
            <CamleCase element={data?.bookedById.name || data?.name || user?.name} />
          </span>
        </div>

        {/* Phone Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: ".2rem",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Mobile No</span>
          <span>{data?.bookedById.phoneNo || data?.phoneNo || user?.phoneNo}</span>
        </div>

        {/* Address Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: ".2rem",
          }}
        >
          <span style={{ textAlign: "left", fontWeight: "bold" }}>Address</span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ marginLeft: "5rem" }}>Vill :-</span>
            <span>{data.bookedById.address[0].vill || data?.vill || user?.address[0]?.vill}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ marginLeft: "5rem" }}>Post :-</span>
            <span>{data.bookedById.address[0].post || data?.post || user?.address[0]?.post}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ marginLeft: "5rem" }}>Dist :-</span>
            <span>{data.bookedById.address[0].dist || data?.dist || user?.address[0]?.dist}</span>
          </div>
        </div>

        {/* Date Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: ".2rem",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Date</span>
          <span style={{ color: "blue" }}>{new Date(data.bookingDate).toDateString()}</span>
        </div>

        {/* Rating Section */}
        {data.orderCompleted && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Rated By User</span>
            <span>{data.rating == 0 ? "Not Rated" : `${data.rating}/5`}</span>
          </div>
        )}
        {/* Review Section */}
        {data.orderCompleted && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Review By User</span>
            <span style={{ maxWidth: "50%" }}>{data.review || "No review provided"}</span>
          </div>
        )}

        {/* Status Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Booking Status</span>
          <span
            style={{
              color: data.cancelOrder ? "red" : data.orderCompleted ? "green" : "blue",
            }}
          >
            {data.cancelOrder ? "Canceled" : data.orderCompleted ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
    </>
  );
}
