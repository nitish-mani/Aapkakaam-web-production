import "./view.css";

import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import Attendance from "../Attendance/attendance";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import { showError } from "../showAlert";

export default function ViewShare() {
  const category = localStorage.getItem("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const token = `Bearer ${userData[0]?.token || JSON.parse(localStorage.getItem(category))?.token}`;
  const userId =
    category === "user"
      ? userData[0]?.userId || JSON.parse(localStorage.getItem(category))?.userId
      : userData[0]?.vendorId || JSON.parse(localStorage.getItem(category))?.vendorId;

  const [share, setShare] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalShare, setTotalShare] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [err, setErr] = useState("");
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      setIsLoading(false);
      setErr("You are offline");
      setTimeout(() => {
        setErr("");
      }, 3000);
      return;
    }
    if (isFetched)
      if (category === "user") {
        axios
          .get(`${SERVER_URL}/${category}/getShare/${userId}/${pageNo}`, {
            headers: { Authorization: token },
          })
          .then((result) => {
            setTotalShare(result.data.total);
            const page = Math.floor(result.data.total / 12) + 1;
            setTotalPage(page);
            setShare(result.data.share);
            setIsLoading(false);
          })
          .catch((err) => {
            showError(err.response.data.message);
            setIsLoading(false);
            setTimeout(() => {
              setErr("");
            }, 3000);
          });
      } else if (category === "vendor") {
        axios
          .get(`${SERVER_URL}/${category}/getShare/${userId}/${pageNo}`, {
            headers: { Authorization: token },
          })
          .then((result) => {
            setTotalShare(result.data.total);
            const page = Math.floor(result.data.total / 12) + 1;
            setTotalPage(page);
            setShare(result.data.share);
            setIsLoading(false);
          })
          .catch((err) => {
            showError(err.response.data.message);
            setIsLoading(false);
            setTimeout(() => {
              setErr("");
            }, 3000);
          });
      }
  }, [pageNo, isFetched]);

  function hanldeCrossInShare() {
    navigate("/");
    JSON.parse(localStorage.getItem(category));
  }

  function handlePrev() {
    if (pageNo > 1) {
      setIsLoading(true);
      setIsFetched(true);
      setPageNo((page) => page - 1);
    }
  }

  function handleNext() {
    if (pageNo < totalPage) {
      setIsLoading(true);
      setIsFetched(true);
      setPageNo((page) => page + 1);
    }
  }

  return (
    <>
      {" "}
      <AdsterraBanner_320x50 />
      <div className="views-P">
        <img
          className="profile__close-button"
          src={cross}
          alt="cross"
          onClick={hanldeCrossInShare}
        />
        <h1
          style={{
            gridColumnEnd: "4",
            gridColumnStart: "1",
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(105, 102, 102, 0.637)",
          }}
        >
          Share <span style={{ fontSize: "1.5rem" }}>(Total Share = {totalShare} )</span>
        </h1>

        {isFetched ? (
          <div className="views">
            {isLoading ? (
              <div
                style={{
                  width: "100vw",
                  height: "40rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <div className="loading" style={{ width: "3rem", height: "3rem" }}></div>
              </div>
            ) : share.length === 0 ? (
              <h1
                style={{
                  width: "80vw",
                  height: "40rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                You haven't shared to Anyone
              </h1>
            ) : (
              share.map((element) => {
                return (
                  <div className="views-children" key={element.phoneNo}>
                    <div>
                      <span>Phone No :</span> <span>{element.phoneNo}</span>
                    </div>

                    <div>
                      <span>Date :</span>
                      <span>
                        {new Date(element.shareDate).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <button
            className="btn"
            style={{
              width: "15rem",
            }}
            onClick={() => setIsFetched(true)}
          >
            Fetch Share Data
          </button>
        )}
        <AdsterraBanner />
        <div className="pageHandler">
          <div
            className="verify-btn"
            style={{
              width: "fit-content",
              opacity: pageNo > 1 ? "1" : ".5",
              cursor: pageNo > 1 ? "pointer" : "not-allowed",
            }}
            onClick={handlePrev}
          >
            Prev
          </div>
          <div
            style={{
              width: "2rem",
              backgroundColor: "blue",
              textAlign: "center",
              color: "#fff",
              padding: ".2rem",
              borderRadius: "5px",
            }}
          >
            {pageNo}
          </div>
          <div
            className="verify-btn"
            style={{
              width: "fit-content",
              opacity: totalPage > pageNo && pageNo > 1 ? "1" : ".5",
              cursor: totalPage > pageNo && pageNo > 1 ? "pointer" : "not-allowed",
            }}
            onClick={handleNext}
          >
            Next
          </div>
        </div>

        {/* <Attendance pageNo={3} /> */}
      </div>
    </>
  );
}
