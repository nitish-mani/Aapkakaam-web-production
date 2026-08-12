import { useEffect, useState } from "react";
import "./popup.css";

export default function PopUP({
  purpose,
  handler,
  setPopup,
  rating,
  setRating,
}) {
  const [isEmpty, setIsEmpty] = useState("");

  useEffect(() => {
    setIsEmpty(false);
  }, [rating]);

  function handleRatingValue() {
    if (rating === "" || rating < 1 || rating > 5) {
      setIsEmpty(true);
    } else {
      handler(true);
    }
  }

  return (
    <div id="popup">
      {purpose == "cancelOrder" ? (
        <div id="cancelOrder">
          <div
            style={{
              display: "flex",
              fontSize: "1.5rem",
              justifyContent: "center",
            }}
          >
            Are You Sure... You Want to Cancel Your Order ?
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "5rem" }}>
            <button
              className="btn hover1"
              style={{
                backgroundColor: "green",
              }}
              onClick={() => setPopup(false)}
            >
              No
            </button>
            <button
              className="btn hover1"
              style={{
                backgroundColor: "red",
              }}
              onClick={() => handler(true)}
            >
              Yes
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {purpose == "markAsComplete" ? (
        <div id="markAsComplete">
          <div
            style={{
              display: "flex",
              fontSize: "1.5rem",
              justifyContent: "center",
            }}
          >
            Are You Sure... You Want to Mark this Order as Completed?
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "5rem" }}>
            <button
              className="btn hover1"
              style={{
                backgroundColor: "green",
              }}
              onClick={() => setPopup(false)}
            >
              No
            </button>
            <button
              className="btn hover1"
              style={{
                backgroundColor: "red",
              }}
              onClick={() => handler(true)}
            >
              Yes
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {purpose == "forRating" ? (
        <div id="forRating1">
          {rating != "" ? (
            rating < 1 ? (
              <h4>Rating Should be greater than Zero</h4>
            ) : rating > 5 ? (
              <h4>Rating Should be less than six</h4>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <div
            style={{
              display: "flex",
              fontSize: "1.5rem",
              justifyContent: "center",
            }}
          >
            <input
              type="number"
              placeholder="Give rating Out of 5"
              value={rating}
              style={{ border: isEmpty === true ? "2px solid red" : "" }}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "5rem",
            }}
          >
            <button
              className="btn hover1"
              style={{
                backgroundColor: "green",
              }}
              onClick={() => setPopup(false)}
            >
              No
            </button>
            <button
              className="btn hover1"
              style={{
                backgroundColor: "red",
              }}
              onClick={handleRatingValue}
            >
              Yes
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
