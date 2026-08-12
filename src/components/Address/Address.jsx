// optimized and production ready

import { useEffect, useState, useCallback, useMemo } from "react";
import "./Address.css";
import { useDispatch, useSelector } from "react-redux";
import { addDataUser, clearDataUser } from "../../utils/userslice";
import { addDataVendor, clearDataVendor } from "../../utils/vendorslice";
import { SERVER_URL } from "../../utils/base";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { setLocationPincode, setLocationPost } from "../../utils/categoryslice";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import CamleCase from "../camleCase/camleCase";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import { showError, showSuccess } from "../showAlert";

const Address = () => {
  // Hooks and initial setup
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const category = localStorage.getItem("category");

  // Select user data based on category
  const userData = useSelector((store) =>
    category === "user" ? store.user.data : store.vendor.data,
  );

  // State management
  const [formData, setFormData] = useState({
    vill: "",
    post: "",
    dist: "",
    state: "",
    pincode: "",
  });
  const [errors, setError] = useState({
    vill: false,
    post: false,
    pincode: false,
  });
  const [success, setSuccess] = useState({ message: "", err: "" });
  const [isLoading, setIsLoading] = useState({
    address: false,
    submit: false,
  });
  const [postOfficeDetails, setPostOfficeDetails] = useState([{ Name: "Select Post Office" }]);

  // Derived values
  const viewOnLocation = location.state?.viewOnLocation;
  const token = `Bearer ${userData[0]?.token}`;
  const isOnline = navigator.onLine;
  const isPincodeValid = formData.pincode.length === 6;
  const isFormValid = !viewOnLocation
    ? formData.vill && isPincodeValid && formData.post && formData.post !== "Select Post Office"
    : isPincodeValid;

  // Memoized user ID based on category
  const userId = useMemo(() => {
    return category === "user" ? userData[0]?.userId : userData[0]?.vendorId;
  }, [category, userData]);

  // API call to fetch post office details
  const fetchPostOfficeDetails = useCallback(async () => {
    if (!isPincodeValid) return;

    if (!isOnline) {
      setSuccess((prev) => ({ ...prev, err: "You are offline" }));
      setTimeout(() => setSuccess((prev) => ({ ...prev, err: "" })), 3000);
      return;
    }

    setIsLoading((prev) => ({ ...prev, address: true }));

    try {
      const endpoint = category === "user" ? "getU" : "getV";
      const url = `${SERVER_URL}/pincode/${endpoint}`;

      const response = await axios.post(
        url,
        {
          pincode: formData.pincode,
        },
        {
          headers: { Authorization: token },
        },
      );
      const result = response.data.data.offices;

      console.log(response);
      if (response?.status === 200) {
        const result = response.data.data;
        const offices = result.offices || [];

        const cleanedOffices = offices.map((office) => ({
          Name: office.officename.replace(/\s(BO|SO|HO)$/, "").toUpperCase(), // remove " BO" or " SO"
          original: office, // optional: keep full data
        }));

        setPostOfficeDetails([{ Name: "Select Post Office" }, ...cleanedOffices]);

        setFormData((prev) => ({
          ...prev,
          dist: result.offices[0]?.district || "",
          state: result.offices[0]?.statename || "",
        }));
      } else {
        setSuccess((prev) => ({ ...prev, err: "Enter Valid Pincode" }));
      }
    } catch (error) {
      setSuccess((prev) => ({ ...prev, err: "Enter Valid Pincode" }));
    } finally {
      setIsLoading((prev) => ({ ...prev, address: false }));
    }
  }, [formData.pincode, isOnline, isPincodeValid]);

  // Handle form field changes
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess((prev) => ({ ...prev, [field]: false, err: "" }));

    // Reset district and state when pincode changes
    if (field === "pincode") {
      setFormData((prev) => ({ ...prev, dist: "", state: "" }));
      setPostOfficeDetails([{ Name: "Select Post Office" }]);
    }
  }, []);

  // Handle form submission
  const handleSubmitAddress = useCallback(async () => {
    if (!isOnline) {
      setSuccess((prev) => ({ ...prev, err: "You are offline" }));
      setTimeout(() => setSuccess((prev) => ({ ...prev, err: "" })), 3000);
      return;
    }

    // Validation
    const newErrors = {
      vill: viewOnLocation ? false : !formData.vill,
      post: viewOnLocation ? false : !formData.post || formData.post === "Select Post Office",
      pincode: !isPincodeValid,
      err: "",
    };

    if (newErrors.vill || newErrors.post || newErrors.pincode) {
      setSuccess(newErrors);
      newErrors.err = newErrors.vill
        ? "Village Required"
        : newErrors.pincode
          ? "Pincode Must Have 6 Characters"
          : "Select Post Office";
      return;
    }

    if (viewOnLocation) {
      dispatch(setLocationPincode(formData.pincode));
      dispatch(setLocationPost(formData.post));
      navigate("/");
      return;
    }

    setIsLoading((prev) => ({ ...prev, submit: true }));

    try {
      const payload = {
        vill: formData.vill.toUpperCase(),
        post: formData.post,
        dist: formData.dist,
        state: formData.state,
        pincode: formData.pincode,
        [category === "user" ? "userId" : "vendorId"]: userId,
      };

      const response = await axios.patch(`${SERVER_URL}/${category}/update/address`, payload, {
        headers: { Authorization: token },
      });

      const updatedData = { ...userData[0], address: response.data.address };
      const action = category === "user" ? addDataUser : addDataVendor;

      dispatch(action(updatedData));
      localStorage.setItem(category, JSON.stringify(updatedData));

      setSuccess({ message: response.data.message });
      setTimeout(() => {
        setSuccess({ message: "" });
        navigate("/");
      }, 2000);
    } catch (error) {
      setSuccess((prev) => ({
        ...prev,
        err: error.response?.data?.message || "An error occurred",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, submit: false }));
    }
  }, [
    formData,
    isOnline,
    isPincodeValid,
    viewOnLocation,
    category,
    userId,
    token,
    userData,
    dispatch,
    navigate,
  ]);

  // Effects
  useEffect(() => {
    if (success.err) showError(success.err);
    const timer = errors.err
      ? setTimeout(() => setSuccess((prev) => ({ ...prev, err: "" })), 1000)
      : null;
    return () => timer && clearTimeout(timer);
  }, [success.err]);

  useEffect(() => {
    if (success.message) showSuccess(success.message);
    const timer = success.message ? setTimeout(() => setSuccess({ message: "" }), 1000) : null;
    return () => timer && clearTimeout(timer);
  }, [success.message]);

  useEffect(() => {
    fetchPostOfficeDetails();
  }, [fetchPostOfficeDetails]);

  // Helper functions
  const handleCrossInAddress = useCallback(() => navigate("/"), [navigate]);

  const resetLocation = useCallback(() => {
    dispatch(setLocationPincode(""));
    dispatch(setLocationPost(""));
    navigate("/");
  }, [dispatch, navigate]);

  // Render functions
  const renderInputField = (field, placeholder, type = "text", readOnly = false) => (
    <input
      placeholder={isLoading.address ? "Loading..." : placeholder}
      type={type}
      value={formData[field].toUpperCase()}
      onChange={(e) => handleChange(field, e.target.value)}
      style={{
        border: errors[field] ? "2px solid red" : "",
        textAlign: isLoading.address ? "center" : "left",
      }}
      readOnly={readOnly}
    />
  );

  const renderPostOfficeSelect = () =>
    postOfficeDetails.length !== 1 ? (
      <select
        className="post-select"
        value={formData.post}
        onChange={(e) => handleChange("post", e.target.value)}
        style={{ border: errors.post ? "2px solid red" : "" }}
      >
        {postOfficeDetails.map((data, i) => (
          <option key={i} value={data.Name}>
            {data.Name}
          </option>
        ))}
      </select>
    ) : (
      renderInputField("post", "Post", "text", true)
    );

  return (
    <>
      <AdsterraBanner_320x50 />
      <div className="address">
        {/* Close button */}
        <img
          src={cross}
          alt="close"
          className="address__close-button"
          onClick={handleCrossInAddress}
        />

        {/* Header */}
        <div className="address__header">
          <h3>{viewOnLocation ? "Location" : `${CamleCase({ element: category })} Address`}</h3>
        </div>
        {/* Form fields */}
        <div className="address__form">
          {!viewOnLocation && <div>{renderInputField("vill", "Village")}</div>}

          {renderInputField("pincode", "Enter Pincode", "number")}
          <div>{renderPostOfficeSelect()}</div>
          {renderInputField("dist", "District", "text", true)}
          {renderInputField("state", "State", "text", true)}

          <button
            className="address__submit-button"
            onClick={handleSubmitAddress}
            disabled={!isFormValid || isLoading.submit}
          >
            {isLoading.submit ? <div className="loading"></div> : "Submit"}
          </button>

          {viewOnLocation && (
            <p className="address__pick-from-address" onClick={resetLocation}>
              Pick from Address
            </p>
          )}
        </div>
      </div>
      <AdsterraBanner />
    </>
  );
};

Address.propTypes = {
  // Add prop types if this component receives any props
};

export default Address;
