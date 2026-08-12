// src/components/AdsterraBanner_ScriptOnly.jsx
import { useEffect, useRef } from "react";

const AdsterraBanner_ScriptOnly = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//shorterwanderer.com/6e/e6/b9/6ee6b9a3bed042dfd2b3fc93211a69fa.js";
    script.async = true;

    if (adRef.current) {
      adRef.current.innerHTML = ""; // Clear previous ads if any
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1rem 0",
      }}
    >
      <div ref={adRef} style={{ width: "320px", height: "50px" }} />
    </div>
  );
};

export default AdsterraBanner_ScriptOnly;
