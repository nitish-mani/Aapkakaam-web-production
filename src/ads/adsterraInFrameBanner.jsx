// src/components/AdsterraBanner_320x50.jsx
import { useEffect, useRef } from "react";

const AdsterraBanner_320x50 = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Define ad settings globally
    window.atOptions = {
      key: "c01fc275eedc06991bb1ea22ac2e2917",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    };

    // Create and inject script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//www.highperformanceformat.com/c01fc275eedc06991bb1ea22ac2e2917/invoke.js";
    script.async = true;

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear previous content if re-rendered
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem 0", // optional spacing
      }}
    >
      <div ref={adRef} style={{ width: "320px", height: "50px" }} />
    </div>
  );
};

export default AdsterraBanner_320x50;
