import React from "react";

const EmptyState = ({ 
  icon = "fa-inbox", 
  title = "Không có dữ liệu", 
  message = "Không tìm thấy dữ liệu nào phù hợp với yêu cầu của bạn." 
}) => {
  return (
    <div className="text-center py-5 text-muted">
      <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(114,47,55,0.05)", color: "#722f37" }}>
        <i className={`fa ${icon} fa-2x`} style={{ opacity: 0.6 }}></i>
      </div>
      <h6 className="fw-bold mb-2 text-dark">{title}</h6>
      <p className="small mb-0" style={{ maxWidth: "300px", margin: "0 auto", opacity: 0.8 }}>{message}</p>
    </div>
  );
};

export default EmptyState;
