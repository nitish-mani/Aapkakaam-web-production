// src/components/AdsterraBanner.jsx
import { useEffect, useRef } from "react";

const AdsterraBanner = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src =
      "//pl26911723.profitableratecpm.com/161072a43ac77b10a12395a402fe6254/invoke.js";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      id="container-161072a43ac77b10a12395a402fe6254"
      ref={containerRef}
      style={{ width: "100%", textAlign: "center", margin: "1rem 0" }}
    ></div>
  );
};

export default AdsterraBanner;
