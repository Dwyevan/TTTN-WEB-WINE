import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="card-footer bg-white border-0 p-3" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <small className="text-muted">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} trong <span className="fw-bold">{totalItems}</span> kết quả
        </small>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link shadow-sm" style={{ borderRadius: "8px", border: "none", color: "#722f37", background: currentPage === 1 ? "#f8f9fa" : "#fff", marginRight: "4px" }} onClick={() => onPageChange(currentPage - 1)}>
                <i className="fa fa-chevron-left" style={{ fontSize: "10px" }}></i>
              </button>
            </li>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (currentPage <= 4) p = i + 1;
              else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
              else p = currentPage - 3 + i;
              return (
                <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                  <button className="page-link shadow-sm mx-1" style={{
                    borderRadius: "8px", border: "none", minWidth: "32px",
                    background: currentPage === p ? "linear-gradient(135deg, #722f37, #a04050)" : "#fff",
                    color: currentPage === p ? "#fff" : "#722f37",
                    fontWeight: "600", fontSize: "12px", transition: "all 0.2s"
                  }} onClick={() => onPageChange(p)}>
                    {p}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link shadow-sm" style={{ borderRadius: "8px", border: "none", color: "#722f37", background: currentPage === totalPages ? "#f8f9fa" : "#fff", marginLeft: "4px" }} onClick={() => onPageChange(currentPage + 1)}>
                <i className="fa fa-chevron-right" style={{ fontSize: "10px" }}></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
