import React from "react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?", 
  confirmText = "Xác nhận", 
  cancelText = "Hủy",
  type = "danger" // danger, warning, primary
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger:  { icon: "fa-exclamation-triangle", color: "#c82333", btnBg: "linear-gradient(135deg, #c82333, #dc3545)", bgLight: "rgba(220,53,69,0.1)" },
    warning: { icon: "fa-exclamation-circle", color: "#e6a700", btnBg: "linear-gradient(135deg, #e6a700, #ffc107)", bgLight: "rgba(255,193,7,0.1)" },
    primary: { icon: "fa-question-circle", color: "#722f37", btnBg: "linear-gradient(135deg, #722f37, #a04050)", bgLight: "rgba(114,47,55,0.1)" }
  };

  const config = typeConfig[type] || typeConfig.danger;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.6)", zIndex: 9999, backdropFilter: "blur(4px)" }}>
      <div className="card border-0 shadow-lg" style={{ borderRadius: "20px", width: "400px", maxWidth: "90vw", animation: "slideInDown 0.3s ease" }}>
        <style>{`
          @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <div className="card-body p-4 text-center">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px", borderRadius: "50%", background: config.bgLight, color: config.color }}>
            <i className={`fa ${config.icon} fa-2x`}></i>
          </div>
          <h5 className="fw-bold text-dark mb-2">{title}</h5>
          <p className="text-muted mb-4">{message}</p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-light px-4 py-2" style={{ borderRadius: "10px", fontWeight: "600" }} onClick={onClose}>
              {cancelText}
            </button>
            <button className="btn px-4 py-2 text-white shadow-sm" style={{ borderRadius: "10px", fontWeight: "600", background: config.btnBg, border: "none" }} onClick={() => { onConfirm(); onClose(); }}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
