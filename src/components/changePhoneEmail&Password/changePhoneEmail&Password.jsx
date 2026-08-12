import "./changePhoneEmail&Password.css";
import { Suspense, useEffect, useState } from "react";
import { SERVER_URL } from "../../utils/base";
import { useLocation, useNavigate } from "react-router";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import axios from "axios";
import Timer from "../timer/timer";
import { useDispatch, useSelector } from "react-redux";

import { addDataUser } from "../../utils/userslice";
import { addDataVendor } from "../../utils/vendorslice";
import { showError, showSuccess } from "../showAlert";

export default function ChangePhoneEmailPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  let editType = location.state.editType;

  const category = localStorage.getItem("category");

  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);
  const token = `Bearer ${userData[0]?.token}`;

  const [pass, setPass] = useState("");
  const [email, setEmail] = useState(userData[0]?.email);
  const [phoneNo, setPhoneNo] = useState(userData[0]?.phoneNo);
  const [otpId, setOtpId] = useState("");

  const [isPhoneOtpLoading, setIsPhoneOtpLoading] = useState(false);
  const [isEmailOtpLoading, setIsEmailOtpLoading] = useState(false);

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [otp, setOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [otpVerification, setOtpVerification] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpESent, setIsOtpESent] = useState(false);

  const [otpTimer, setOtpTimer] = useState(false);

  function hanldeCrossInChange() {
    navigate("/");
  }

  useEffect(() => {
    if (err) showError(err);
  }, [err]);
  useEffect(() => {
    if (success) showSuccess(success);
  }, [success]);
  function handleChangePhoneNoEmailPassword() {
    if (!navigator.onLine) {
      setErr("You are offline");
      setTimeout(() => {
        setErr("");
      }, 3000);
      return;
    }
    if (!otpTimer) {
      if (otpVerification) {
        if (editType == "phoneNo") {
          setIsPhoneOtpLoading(true);
          if (!isOtpSent) {
            if (phoneNo.length != 10) {
              setErr("Mobile Number must be 10 digits");
              setIsPhoneOtpLoading(false);
              setTimeout(() => {
                setErr("");
              }, 3000);
              return;
            }
            setOtpTimer(true);
            axios
              .post(`${SERVER_URL}/${category}/phoneVerification`, {
                phoneNo,
              })
              .then((res) => {
                if (res.data.verified) {
                  setOtpId(res.data.otpId);
                  setSuccess("OTP sent successfuly");
                  setIsOtpSent(true);
                  setOtpTimer(false);
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setErr("Too many otp request has been sent on this number. Try after 30 minutes");
                  setOtpTimer(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
                setIsPhoneOtpLoading(false);
              })
              .catch((err) => {
                setIsPhoneOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 3000);
              });
          } else {
            axios
              .post(`${SERVER_URL}/${category}/otpVerification`, {
                otp,
                otpId,
              })
              .then((res) => {
                if (res.data.verify) {
                  setIsOtpSent(false);
                  if (category === "user") {
                    axios
                      .patch(
                        `${SERVER_URL}/${category}/edit/phoneNo`,

                        {
                          phoneNo: phoneNo,
                          userId: userData[0].userId,
                          otpId,
                        },
                        {
                          headers: { Authorization: token },
                        },
                      )
                      .then((result) => {
                        const data = {
                          ...userData[0],
                          phoneNo: result.data.phoneNo,
                        };
                        dispatch(addDataUser(data));
                        localStorage.setItem(category, JSON.stringify(data));

                        setSuccess("User Mobile Number Updated Successfully");
                        setIsOtpSent(false);
                        setIsPhoneOtpLoading(false);
                        setTimeout(() => {
                          navigate("/");
                        }, 2000);
                      })
                      .catch((err) => {
                        setIsEmailOtpLoading(false);
                        setErr(err.response.data.message);
                      });
                  } else if (category === "vendor") {
                    axios
                      .patch(
                        `${SERVER_URL}/${category}/edit/phoneNo`,

                        {
                          phoneNo: phoneNo,
                          vendorId: userData[0]?.vendorId,
                          otpId,
                        },
                        {
                          headers: { Authorization: token },
                        },
                      )
                      .then((result) => {
                        const data = {
                          ...userData[0],
                          phoneNo: result.data.phoneNo,
                        };
                        dispatch(addDataVendor(data));
                        localStorage.setItem(category, JSON.stringify(data));

                        setSuccess("Vendor Mobile Number Updated Successfully");
                        setIsOtpSent(false);
                        setIsPhoneOtpLoading(false);
                        setTimeout(() => {
                          navigate("/");
                        }, 2000);
                      })
                      .catch((err) => {
                        setIsEmailOtpLoading(false);
                        setErr(err.response.data.message);
                      });
                  }
                } else {
                  setErr(res.data.message);
                  setIsPhoneOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
              });
          }
        } else if (editType == "email") {
          setIsEmailOtpLoading(true);
          if (!isOtpESent) {
            setOtpTimer(true);
            axios
              .post(`${SERVER_URL}/${category}/emailVerification`, {
                email,
              })
              .then((res) => {
                if (res.data.verified) {
                  setOtpId(res.data.otpId);
                  setSuccess("OTP sent successfuly");
                  setOtpTimer(false);
                  setIsOtpESent(true);
                  setIsEmailOtpLoading(false);
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setErr("Something bad happens");
                  setIsEmailOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 2000);
                }
              })
              .catch((err) => {
                setIsEmailOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 2000);
              });
          } else {
            axios
              .post(`${SERVER_URL}/${category}/emailOtpVerification`, {
                emailOtp,
                otpId,
              })
              .then((res) => {
                if (res.data.verify) {
                  setSuccess("OTP verified successfully");
                  if (category === "user") {
                    axios
                      .patch(
                        `${SERVER_URL}/${category}/edit/email`,

                        {
                          email: email,
                          userId: userData[0]?.userId,
                          otpId,
                        },
                        {
                          headers: { Authorization: token },
                        },
                      )
                      .then((result) => {
                        const data = {
                          ...userData[0],
                          email: result.data.email,
                        };
                        dispatch(addDataUser(data));
                        localStorage.setItem(category, JSON.stringify(data));

                        setSuccess("User Email Updated Successfully");
                        setIsOtpESent(false);
                        setIsEmailOtpLoading(false);

                        setTimeout(() => {
                          navigate("/");
                        }, 2000);
                      })
                      .catch((err) => {
                        setIsEmailOtpLoading(false);
                        setTimeout(() => {
                          setSuccess("");

                          setErr(err.response.data.message);
                        }, 2000);
                        setTimeout(() => {
                          setIsOtpESent(false);
                          setEmailOtp("");
                          setErr("");
                        }, 4000);
                      });
                  } else if (category === "vendor") {
                    axios
                      .patch(
                        `${SERVER_URL}/${category}/edit/email`,

                        {
                          email: email,
                          vendorId: userData[0]?.vendorId,
                          otpId,
                        },
                        {
                          headers: { Authorization: token },
                        },
                      )
                      .then((result) => {
                        const data = {
                          ...userData[0],
                          email: result.data.email,
                        };
                        dispatch(addDataVendor(data));
                        localStorage.setItem(category, JSON.stringify(data));

                        setSuccess("Vendor Email Updated Successfully");
                        setIsOtpESent(false);
                        setIsEmailOtpLoading(false);
                        setTimeout(() => {
                          navigate("/");
                        }, 2000);
                      })
                      .catch((err) => {
                        setIsEmailOtpLoading(false);
                        setTimeout(() => {
                          setSuccess("");

                          setErr(err.response.data.message);
                        }, 2000);
                        setTimeout(() => {
                          setIsOtpESent(false);
                          setEmailOtp("");
                          setErr("");
                        }, 4000);
                      });
                  }
                } else {
                  setErr(res.data.message);
                  setIsEmailOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
              });
          }
        } else if (editType == "pass") {
          setIsPhoneOtpLoading(true);

          if (phoneNo.length != 10) {
            setErr("Mobile Number must be 10 digits");
            setIsPhoneOtpLoading(false);
            setTimeout(() => {
              setErr("");
            }, 3000);
            return;
          }
          if (phoneNo && pass) {
            if (pass.length < 6) {
              setErr("Password length must be greater than 6 digits");
              setIsPhoneOtpLoading(false);
              setTimeout(() => {
                setErr("");
              }, 3000);
              return;
            }
            if (category === "user") {
              axios
                .patch(
                  `${SERVER_URL}/${category}/edit/password`,

                  {
                    phoneNo: phoneNo,
                    password: pass,
                    otpId,
                  },
                )
                .then((result) => {
                  setSuccess("User Password Updated Successfully");
                  setIsOtpSent(false);
                  setIsPhoneOtpLoading(false);

                  setTimeout(() => {
                    navigate("/login", { state: { category: category } });
                  }, 2000);
                })
                .catch((err) => {
                  setErr(err.response.data.message);
                  setIsPhoneOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 2000);
                });
            } else if (category === "vendor") {
              axios
                .patch(
                  `${SERVER_URL}/${category}/edit/password`,

                  {
                    phoneNo: phoneNo,
                    password: pass,
                    otpId,
                  },
                )
                .then((result) => {
                  setSuccess("Vendor Password Updated Successfully");
                  setIsOtpSent(false);
                  setIsPhoneOtpLoading(false);
                  setTimeout(() => {
                    navigate("/login", { state: { category: category } });
                  }, 2000);
                })
                .catch((err) => {
                  setIsPhoneOtpLoading(false);
                  setErr(err.response.data.message);
                  setTimeout(() => {
                    setErr("");
                  }, 2000);
                });
            }
          }
        }
      } else {
        if (editType == "phoneNo") {
          setIsPhoneOtpLoading(true);
          if (!isOtpSent) {
            setOtpTimer(true);
            axios
              .post(`${SERVER_URL}/${category}/phoneVerification`, {
                phoneNo,
              })
              .then((res) => {
                if (res.data.verified) {
                  setOtpId(res.data.otpId);
                  setSuccess("OTP sent successfuly");
                  setIsOtpSent(true);
                  setOtpTimer(false);
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setErr("Too many otp request has been sent on this number. Try after 30 minutes");
                  setOtpTimer(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
                setIsPhoneOtpLoading(false);
              })
              .catch((err) => {
                setIsPhoneOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 3000);
              });
          } else {
            axios
              .post(`${SERVER_URL}/${category}/otpVerification`, {
                otp,
                otpId,
              })
              .then((res) => {
                if (res.data.verify) {
                  setSuccess("OTP verified successfully");
                  setIsOtpSent(false);
                  setIsPhoneOtpLoading(false);
                  setOtp("");
                  setPhoneNo("");
                  setOtpVerification(true);
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setErr(res.data.message);
                  setIsPhoneOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
              })
              .catch((err) => {
                setIsPhoneOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 2000);
              });
          }
        } else if (editType == "email") {
          setIsEmailOtpLoading(true);
          if (!isOtpESent) {
            setOtpTimer(true);
            axios
              .post(`${SERVER_URL}/${category}/emailVerification`, {
                email,
              })
              .then((res) => {
                if (res.data.verified) {
                  setOtpId(res.data.otpId);
                  setSuccess("OTP sent successfuly");
                  setIsOtpESent(true);
                  setOtpTimer(false);
                  setIsEmailOtpLoading(false);
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setIsEmailOtpLoading(false);
                  setOtpTimer(false);
                  setErr("Something Bad happens");
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
              })
              .catch((err) => {
                setOtpTimer(false);
                setIsEmailOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 2000);
              });
          } else {
            axios
              .post(`${SERVER_URL}/${category}/emailOtpVerification`, {
                emailOtp,
                otpId,
              })
              .then((res) => {
                if (res.data.verify) {
                  setSuccess("OTP verified successfully");
                  setIsOtpESent(false);
                  setIsEmailOtpLoading(false);
                  setEmail("");
                  setEmailOtp("");
                  setOtpVerification(true);
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setErr(res.data.message);
                  setIsEmailOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
              })
              .catch((err) => {
                setIsEmailOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 2000);
              });
          }
        } else if (editType == "pass") {
          setIsPhoneOtpLoading(true);
          if (!isOtpSent) {
            setOtpTimer(true);
            axios
              .post(`${SERVER_URL}/${category}/phoneVerificationPasswordReset`, {
                phoneNo,
                changingPass: true,
              })
              .then((res) => {
                setOtpId(res.data.otpId);
                setSuccess("OTP sent successfuly");
                setOtpTimer(false);
                setIsOtpSent(true);
                setIsPhoneOtpLoading(false);
                setTimeout(() => {
                  setSuccess("");
                }, 2000);
              })
              .catch((err) => {
                setIsPhoneOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 2000);
              });
          } else {
            axios
              .post(`${SERVER_URL}/${category}/otpVerificationResetPassword`, {
                otp,
                otpId,
              })
              .then((res) => {
                if (res.data.verified) {
                  setOtpVerification(true);
                  setIsOtpSent(true);
                  setIsPhoneOtpLoading(false);
                  setSuccess("OTP verified successfully");
                  setTimeout(() => {
                    setSuccess("");
                  }, 2000);
                } else {
                  setErr(res.data.message);
                  setIsPhoneOtpLoading(false);
                  setTimeout(() => {
                    setErr("");
                  }, 3000);
                }
              })
              .catch((err) => {
                setIsPhoneOtpLoading(false);
                setErr(err.response.data.message);
                setTimeout(() => {
                  setErr("");
                }, 2000);
              });
          }
        }
      }
    }
  }

  return (
    <div style={{ height: "50rem" }}>
      <div className="editPhoneEmail">
        <h3 style={{ marginBottom: "4rem" }}>
          Change{" "}
          {editType == "phoneNo" ? "Mobile Number" : editType == "email" ? "Email" : "Password"}
        </h3>
        <img
          src={cross}
          alt="cross"
          style={{
            width: "20px",
            position: "absolute",
            top: ".5rem",
            right: ".5rem",
            cursor: "pointer",
          }}
          onClick={hanldeCrossInChange}
        />

        {!otpVerification ? (
          editType == "phoneNo" ? (
            <div>
              {isOtpSent ? (
                <input
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              ) : (
                <input type="number" placeholder="Mobile Number" value={phoneNo} readOnly />
              )}
            </div>
          ) : editType == "email" ? (
            <div>
              {isOtpESent ? (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                />
              ) : (
                <input type="text" placeholder="Email" value={email} readOnly />
              )}
            </div>
          ) : (
            <div>
              {isOtpSent ? (
                <input
                  type="number"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  autoFocus
                />
              )}
            </div>
          )
        ) : editType == "phoneNo" ? (
          <div>
            {isOtpSent ? (
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            ) : (
              <input
                type="number"
                placeholder="New Mobile Number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            )}
          </div>
        ) : editType == "email" ? (
          <div>
            {isOtpESent ? (
              <input
                type="text"
                placeholder="Enter OTP"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
              />
            ) : (
              <input
                type="text"
                placeholder="New Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </div>
        ) : (
          <div>
            {isOtpSent ? (
              <input
                type="text"
                placeholder="Enter New Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            ) : (
              <input type="text" placeholder="Enter New Password" value={pass} readOnly />
            )}
          </div>
        )}
        <button
          className={otpTimer ? "hover btn" : "btn"}
          style={{
            marginTop: "3rem",
            backgroundColor: otpTimer ? "rgb(17, 97, 228,.5)" : "",
          }}
          onClick={handleChangePhoneNoEmailPassword}
        >
          {!otpVerification ? (
            editType == "phoneNo" ? (
              isOtpSent ? (
                isPhoneOtpLoading ? (
                  <div className="loading"></div>
                ) : (
                  "Verify OTP"
                )
              ) : isPhoneOtpLoading ? (
                <div className="loading"></div>
              ) : (
                "Send OTP"
              )
            ) : editType == "email" ? (
              isOtpESent ? (
                isEmailOtpLoading ? (
                  <div className="loading"></div>
                ) : (
                  "Verify OTP"
                )
              ) : isEmailOtpLoading ? (
                <div className="loading"></div>
              ) : (
                "Send OTP"
              )
            ) : isOtpSent ? (
              isPhoneOtpLoading ? (
                <div className="loading"></div>
              ) : (
                "Verify OTP"
              )
            ) : isPhoneOtpLoading ? (
              <div className="loading"></div>
            ) : (
              "Send OTP"
            )
          ) : editType == "phoneNo" ? (
            isOtpSent ? (
              isPhoneOtpLoading ? (
                <div className="loading"></div>
              ) : (
                "Verify OTP"
              )
            ) : isPhoneOtpLoading ? (
              <div className="loading"></div>
            ) : (
              "Verify Number"
            )
          ) : editType == "email" ? (
            isOtpESent ? (
              isEmailOtpLoading ? (
                <div className="loading"></div>
              ) : (
                "Verify OTP"
              )
            ) : isEmailOtpLoading ? (
              <div className="loading"></div>
            ) : (
              "Verify Email"
            )
          ) : isOtpSent ? (
            isPhoneOtpLoading ? (
              <div className="loading"></div>
            ) : (
              "Update Password"
            )
          ) : (
            "Update Password"
          )}
        </button>
        {otpTimer ? (
          <div className="otpTimer">
            <span>Resend OTP After </span>
            <span>
              <Timer setOtpTimer={setOtpTimer} />
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
