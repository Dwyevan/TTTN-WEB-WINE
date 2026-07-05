import React, { useState, useEffect, useMemo } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import toast from "react-hot-toast";

import API_BASE_URL from '../config';
const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | logs | lowstock
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState("");
  const [restockNote, setRestockNote] = useState("");
  const [selectedWineForLog, setSelectedWineForLog] = useState(null);
  const [wineLogs, setWineLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wines`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Stats
  const stats = useMemo(() => ({
    totalStock: products.reduce((s, p) => s + (p.stock || p.stockQuantity || 0), 0),
    totalProducts: products.length,
    lowStock: products.filter(p => { const s = p.stock || p.stockQuantity || 0; return s > 0 && s <= (p.minimumStock || 5); }),
    outOfStock: products.filter(p => !(p.stock || p.stockQuantity)),
    totalValue: products.reduce((s, p) => s + ((p.price || 0) * (p.stock || p.stockQuantity || 0)), 0),
  }), [products]);

  // Restock
  const handleRestock = async () => {
    if (!restockQty || parseInt(restockQty) <= 0) { toast.error("Số lượng phải > 0"); return; }
    const loadingToast = toast.loading("Đang nhập kho...");
    try {
      await axios.post(`${API_BASE_URL}/api/admin/inventory/restock/${restockModal.id}`, {
        quantity: parseInt(restockQty),
        note: restockNote || "Nhập kho bổ sung"
      });
      toast.success(`Đã nhập ${restockQty} chai cho "${restockModal.name}"`, { id: loadingToast });
      setRestockModal(null); setRestockQty(""); setRestockNote("");
      fetchProducts();
    } catch (err) {
      toast.error("Lỗi nhập kho!", { id: loadingToast });
    }
  };

  // Fetch logs for a wine
  const fetchWineLogs = async (wine) => {
    setSelectedWineForLog(wine);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/inventory/logs/${wine.id}`);
      setWineLogs(res.data);
    } catch (err) {
      toast.error("Không thể tải lịch sử");
      setWineLogs([]);
    }
  };

  const formatCurrency = (v) => v?.toLocaleString() + " đ";

  const actionTypeLabel = {
    SALE: { label: "Xuất kho", icon: "fa-arrow-down", color: "#c82333" },
    RESTOCK: { label: "Nhập kho", icon: "fa-arrow-up", color: "#218838" },
    ADJUSTMENT: { label: "Điều chỉnh", icon: "fa-pen", color: "#e6a700" },
    CANCEL_ORDER: { label: "Hoàn kho", icon: "fa-undo", color: "#0069d9" },
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: '#722f37' }} role="status"></div>
      <h5 className="fw-bold" style={{ color: '#722f37' }}>Đang tải kho hàng...</h5>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* RESTOCK MODAL */}
      {restockModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', width: '450px', maxWidth: '95vw' }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4"><i className="fa fa-boxes me-2" style={{ color: '#722f37' }}></i>Nhập Kho</h5>
              <div className="d-flex align-items-center p-3 mb-4" style={{ background: 'rgba(114,47,55,0.05)', borderRadius: '12px' }}>
                {restockModal.imageUrl && <img src={restockModal.imageUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', marginRight: '12px' }} />}
                <div>
                  <div className="fw-bold text-dark">{restockModal.name}</div>
                  <small className="text-muted">Tồn hiện tại: <strong>{restockModal.stock || restockModal.stockQuantity || 0}</strong> chai</small>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Số lượng nhập thêm <span className="text-danger">*</span></label>
                <input type="number" min="1" className="form-control py-2" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} value={restockQty} onChange={e => setRestockQty(e.target.value)} placeholder="Nhập số lượng..." autoFocus />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Ghi chú</label>
                <input type="text" className="form-control py-2" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} value={restockNote} onChange={e => setRestockNote(e.target.value)} placeholder="Ví dụ: Nhập lô mới từ nhà cung cấp..." />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-light px-4 py-2" style={{ borderRadius: '10px' }} onClick={() => setRestockModal(null)}>Hủy</button>
                <button className="btn px-4 py-2" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #2d6a4f, #40916c)', color: '#fff', border: 'none', fontWeight: '600' }} onClick={handleRestock}>
                  <i className="fa fa-plus me-2"></i>Nhập kho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG MODAL */}
      {selectedWineForLog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', width: '600px', maxWidth: '95vw', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0"><i className="fa fa-history me-2" style={{ color: '#722f37' }}></i>Lịch Sử: {selectedWineForLog.name}</h5>
                <button className="btn btn-sm btn-light" style={{ borderRadius: '8px' }} onClick={() => setSelectedWineForLog(null)}><i className="fa fa-times"></i></button>
              </div>
              {wineLogs.length === 0 ? (
                <div className="text-center py-5 text-muted"><i className="fa fa-inbox fa-2x mb-2 d-block" style={{ opacity: 0.2 }}></i>Chưa có lịch sử</div>
              ) : (
                <div className="list-group list-group-flush">
                  {wineLogs.map((log, i) => {
                    const at = actionTypeLabel[log.actionType] || { label: log.actionType, icon: "fa-circle", color: "#6c757d" };
                    return (
                      <div key={i} className="list-group-item border-0 px-0 py-3">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${at.color}15` }}>
                            <i className={`fa ${at.icon}`} style={{ color: at.color, fontSize: '14px' }}></i>
                          </div>
                          <div className="ms-3 flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <span className="fw-semibold" style={{ fontSize: '13px', color: at.color }}>{at.label}</span>
                              <span className="fw-bold" style={{ fontSize: '13px', color: log.quantityChanged > 0 ? '#218838' : '#c82333' }}>
                                {log.quantityChanged > 0 ? '+' : ''}{log.quantityChanged}
                              </span>
                            </div>
                            <div className="text-muted small">{log.previousStock} → {log.newStock} chai</div>
                            {log.note && <div className="text-muted" style={{ fontSize: '11px', fontStyle: 'italic' }}>{log.note}</div>}
                            <div className="text-muted" style={{ fontSize: '10px' }}><i className="fa fa-clock me-1"></i>{log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="card border-0 mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 60%, #c4666e 100%)', boxShadow: '0 8px 32px rgba(114,47,55,0.25)' }}>
        <div className="card-body p-4">
          <h2 className="fw-bold text-white mb-1"><i className="fa fa-warehouse me-2"></i>Quản Lý Kho Hàng</h2>
          <p className="text-white-50 mb-0 small"><i className="fa fa-box me-1"></i>Tổng: {stats.totalStock.toLocaleString()} chai · Giá trị: {formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          { label: "Tổng tồn kho", value: stats.totalStock.toLocaleString(), icon: "fa-warehouse", color: "#722f37" },
          { label: "Sản phẩm", value: stats.totalProducts, icon: "fa-box", color: "#5a189a" },
          { label: "Sắp hết hàng", value: stats.lowStock.length, icon: "fa-exclamation-triangle", color: "#e07c24" },
          { label: "Hết hàng", value: stats.outOfStock.length, icon: "fa-times-circle", color: "#c82333" },
        ].map((s, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
              <div className="card-body p-3 d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center me-3" style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}15` }}>
                  <i className={`fa ${s.icon}`} style={{ color: s.color, fontSize: '18px' }}></i>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  <h4 className="fw-bold mb-0 text-dark">{s.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-3">
          <div className="d-flex gap-2">
            {[
              { key: "overview", label: "Tất cả sản phẩm", icon: "fa-th-list" },
              { key: "lowstock", label: `Sắp hết (${stats.lowStock.length})`, icon: "fa-exclamation-triangle" },
              { key: "outofstock", label: `Hết hàng (${stats.outOfStock.length})`, icon: "fa-times-circle" },
            ].map(tab => (
              <button key={tab.key} className="btn px-4 py-2" style={{
                borderRadius: '10px', fontSize: '13px', fontWeight: '600', border: 'none',
                background: activeTab === tab.key ? '#722f37' : '#f8f9fa',
                color: activeTab === tab.key ? '#fff' : '#722f37',
              }} onClick={() => setActiveTab(tab.key)}>
                <i className={`fa ${tab.icon} me-2`}></i>{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th className="py-3 ps-4 border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>ID</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Sản phẩm</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Danh mục</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Tồn kho</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Tối thiểu</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Trạng thái</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Đã bán</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center pe-4" style={{ fontSize: '11px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let data = products;
                if (activeTab === "lowstock") data = stats.lowStock;
                if (activeTab === "outofstock") data = stats.outOfStock;
                
                const totalPages = Math.ceil(data.length / itemsPerPage);
                const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                
                if (paginatedData.length === 0) return (
                  <tr><td colSpan="8" className="text-center py-5 text-muted">
                    <i className="fa fa-inbox fa-3x mb-3 d-block" style={{ opacity: 0.2 }}></i>Không có sản phẩm nào
                  </td></tr>
                );

                return paginatedData.map(item => {
                  const stock = item.stock ?? item.stockQuantity ?? 0;
                  const minStock = item.minimumStock || 5;
                  const isLow = stock > 0 && stock <= minStock;
                  const isOut = stock === 0;

                  return (
                    <tr key={item.id} className="border-bottom">
                      <td className="ps-4 py-3">
                        <span className="badge px-2 py-1" style={{ background: 'rgba(114,47,55,0.1)', color: '#722f37', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>#{item.id}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #f0f0f0' }}>
                            <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/44x44?text=🍷"; }} />
                          </div>
                          <div className="ms-3">
                            <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{item.name}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{item.origin} {item.brand && `· ${item.brand}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center"><span className="badge px-2 py-1" style={{ background: 'rgba(114,47,55,0.08)', color: '#722f37', borderRadius: '6px', fontSize: '11px' }}>{item.category || "N/A"}</span></td>
                      <td className="text-center">
                        <span className="fw-bold" style={{ fontSize: '15px', color: isOut ? '#c82333' : isLow ? '#e07c24' : '#218838' }}>
                          {stock}
                        </span>
                        <div style={{ fontSize: '10px', color: '#999' }}>chai</div>
                      </td>
                      <td className="text-center text-muted" style={{ fontSize: '13px' }}>{minStock}</td>
                      <td className="text-center">
                        {isOut ? (
                          <span className="badge px-2 py-1" style={{ background: 'rgba(220,53,69,0.1)', color: '#c82333', borderRadius: '6px', fontSize: '10px' }}><i className="fa fa-times-circle me-1"></i>Hết hàng</span>
                        ) : isLow ? (
                          <span className="badge px-2 py-1" style={{ background: 'rgba(224,124,36,0.1)', color: '#e07c24', borderRadius: '6px', fontSize: '10px' }}><i className="fa fa-exclamation-triangle me-1"></i>Sắp hết</span>
                        ) : (
                          <span className="badge px-2 py-1" style={{ background: 'rgba(40,167,69,0.1)', color: '#218838', borderRadius: '6px', fontSize: '10px' }}><i className="fa fa-check-circle me-1"></i>Đủ hàng</span>
                        )}
                      </td>
                      <td className="text-center text-muted fw-semibold" style={{ fontSize: '13px' }}>{item.soldCount || 0}</td>
                      <td className="pe-4">
                        <div className="d-flex justify-content-center gap-1">
                          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(45,106,79,0.1)', color: '#2d6a4f', border: 'none' }} onClick={() => setRestockModal(item)} title="Nhập kho">
                            <i className="fa fa-plus" style={{ fontSize: '13px' }}></i>
                          </button>
                          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(114,47,55,0.08)', color: '#722f37', border: 'none' }} onClick={() => fetchWineLogs(item)} title="Lịch sử">
                            <i className="fa fa-history" style={{ fontSize: '13px' }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
        {(() => {
            let data = products;
            if (activeTab === "lowstock") data = stats.lowStock;
            if (activeTab === "outofstock") data = stats.outOfStock;
            return (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={Math.ceil(data.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    totalItems={data.length}
                    itemsPerPage={itemsPerPage}
                />
            );
        })()}
      </div>
    </div>
  );
};

export default AdminInventory;
