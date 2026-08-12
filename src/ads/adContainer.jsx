import React from "react";

const AdContainer = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <iframe
        src="/ad.html"
        title="Advertisement"
        style={{
          width: "100%",
          height: "0",
          border: "none",
          margin: "1rem auto",
          display: "block",
          backgroundColor: "#fff",
          minHeight: "250px", // Adjust as needed
        }}
        sandbox="allow-scripts allow-same-origin allow-popups"
        scrolling="no"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default AdContainer;
