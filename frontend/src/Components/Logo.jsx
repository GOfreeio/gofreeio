import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ variant = "dark", size = "normal" }) => {
  const isLight = variant === "light";

  const blue = "#2563EB";
  const gray = isLight ? "#E5E7EB" : "#6B7280";

  // Increased logo size
  const fontSize = size === "large" ? "32px" : "25px";

  return (
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        textDecoration: "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize,
        fontWeight: 800,
        letterSpacing: "-1.3px",
        lineHeight: 1,
      }}
    >
      {/* Go */}
      <span style={{ color: blue }}>Go</span>

      {/* Free */}
      <span style={{ color: gray }}>Free</span>

      {/* i */}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          color: gray,
        }}
      >
        {/* Blue dot above i */}
        <span
          style={{
            position: "absolute",
            width: size === "large" ? "8px" : "7px",
            height: size === "large" ? "8px" : "7px",
            background: blue,
            borderRadius: "50%",

            // Closer to the "i"
            top: size === "large" ? "-1cpx" : "-2px",

            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {/* Dotless i */}
        ı
      </span>

      {/* o */}
      <span style={{ color: gray }}>o</span>

      {/* Final blue dot */}
      <span style={{ color: blue }}>.</span>
    </Link>
  );
};

export default Logo;
