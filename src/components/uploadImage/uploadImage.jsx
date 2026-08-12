import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../utils/base";
import "./uploads.css";
import male from "../../resources/svg/male-svgrepo-com.svg";
import cross from "../../resources/svg/multiply-svgrepo-com.svg";
import { useNavigate } from "react-router";
import Resizer from "react-image-file-resizer";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";

const UploadImage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const category = localStorage.getItem("category");
  const userData =
    category === "user"
      ? useSelector((store) => store.user.data)
      : useSelector((store) => store.vendor.data);

  const [selectedFile, setSelectedFile] = useState("Selected File");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [resizedImage, setResizedImage] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const token = `Bearer ${userData[0]?.token}`;

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    Resizer.imageFileResizer(
      file,
      300, // New width
      300, // New height
      "JPEG", // Output format
      70, // Quality (0-100)
      0, // Rotation
      (uri) => {
        setSelectedFile(dataURLtoFile(uri, file.name));
        setResizedImage(uri); // Set the resized image URI
      },
      "base64" // Output type
    );
  };

  function uploadToS3() {
    if (!navigator.onLine) {
      setErr("You are offline");
      setTimeout(() => {
        setErr("");
      }, 3000);
      return;
    }
    if (selectedFile.name && !imgLoading) {
      setImgLoading(true);
      axios
        .put(
          `${SERVER_URL}/${category}/uploads/${category}/${
            category == "user" ? userData[0].userId : userData[0].vendorId
          }`,
          {},
          {
            headers: { Authorization: token },
          }
        )
        .then((result) => {
          const url = result.data.urlForUploads;
          axios
            .put(url, selectedFile, {
              headers: {
                "Content-Type": selectedFile.type,
              },

              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
              },
            })
            .then((response) => {
              setUploadProgress(0);
              axios
                .get(
                  `${SERVER_URL}/${category}/getUploads/${category}/${
                    category === "user"
                      ? userData[0].userId
                      : userData[0].vendorId
                  }`,
                  {
                    headers: { Authorization: token },
                  }
                )
                .then((result) => {
                  setImgLoading(false);
                  setSuccess("Image uploaded successfully");
                  const data = { ...userData[0], imgURL: result.data.imgURL };
                  if (category == "vendor") dispatch(addDataVendor(data));
                  else if (category == "user") dispatch(addDataUser(data));
                  localStorage.setItem(category, JSON.stringify(data));
                  setTimeout(() => {
                    setSuccess("");
                    navigate("/");
                  }, 3000);
                });
            })
            .catch((error) => {
              console.log("1", error);
              setImgLoading(false);
              setErr("Error uploading image");
              setTimeout(() => {
                setErr("");
              }, 3000);
            });
        })
        .catch((err) => {
          console.log("2", err);
          setImgLoading(false);
          setErr("Error uploading image");
          setTimeout(() => {
            setErr("");
          }, 3000);
        });
    } else {
      if (imgLoading) setErr("uploading...");
      else setErr("Please select Image");
      setTimeout(() => {
        setErr("");
      }, 3000);
    }
  }

  function handleCrossInProfile() {
    navigate("/");
  }

  return (
    <div className="uploads">
      <div
        className="err"
        style={{
          opacity: err ? "1" : "",
          border: err ? "none" : "none",
          top: "2rem",
        }}
      >
        {err}
      </div>
      <div
        className="success"
        style={{
          opacity: success ? "1" : "",
          border: success ? "none" : "none",
          top: "2rem",
        }}
      >
        {success}
      </div>{" "}
      <div className="uploads-child">
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
          onClick={handleCrossInProfile}
        />

        <img
          src={resizedImage ? resizedImage : male}
          alt=""
          style={{
            width: "10rem",
            height: "10rem",
            margin: "0 auto",
            borderRadius: "50%",
          }}
        />
        <div>
          {" "}
          <label
            className="label"
            htmlFor="upload"
            style={{ cursor: "pointer" }}
          >
            Choose File{" "}
          </label>
          <span
            style={{
              fontSize: "1.2rem",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            {selectedFile.name ? selectedFile.name : selectedFile}
          </span>
          <input type="file" onChange={handleFileChange} id="upload" />
        </div>

        {uploadProgress > 0 && (
          <div
            style={{
              width: "95%",
              fontSize: "1.2rem",
              padding: ".2rem",
              position: "relative",
              height: "1.5rem",

              boxShadow: "0 1px 8px black",
            }}
          >
            <div
              className="uploadProgress"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <div className="percentUpload">{uploadProgress}%</div>
          </div>
        )}

        <button className="btn" onClick={uploadToS3}>
          {imgLoading ? <div className="loading"></div> : " Upload Image"}
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
