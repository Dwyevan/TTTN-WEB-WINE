import React from "react";

const LoadingSpinner = ({ message = "Đang tải dữ liệu...", fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column justify-content-center align-items-center p-5">
      <div className="spinner-border mb-3" style={{ width: "3rem", height: "3rem", color: "#722f37", animationDuration: "1s" }} role="status"></div>
      <h6 className="fw-bold text-muted mb-0" style={{ letterSpacing: "0.5px" }}>{message}</h6>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(255,255,255,0.8)", zIndex: 9999, backdropFilter: "blur(4px)" }}>
        {content}
      </div>
    );
  }

  return (
    <div className="w-100 text-center py-5" style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {content}
    </div>
  );
};

export default LoadingSpinner;
