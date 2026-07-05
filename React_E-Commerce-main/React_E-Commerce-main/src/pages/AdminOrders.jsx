import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ConfirmModal, Pagination, LoadingSpinner, EmptyState } from "../components";

import API_BASE_URL from '../config';
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null });
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`);
      const sortedOrders = response.data.sort((a, b) => b.id - a.id);
      setOrders(sortedOrders);
    } catch (error) {
      toast.error("Kết nối đến máy chủ thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Status configuration
  const statusConfig = {
    PENDING:   { label: "Chờ xử lý",   icon: "fa-clock",        color: "#e6a700", bg: "rgba(255,193,7,0.12)",  next: ["CONFIRMED", "CANCELLED"] },
    PAID:      { label: "Đã thanh toán", icon: "fa-money-check", color: "#28a745", bg: "rgba(40,167,69,0.12)",  next: ["CONFIRMED", "CANCELLED"] },
    REFUND_PENDING: { label: "Yêu cầu hoàn tiền", icon: "fa-undo", color: "#fd7e14", bg: "rgba(253,126,20,0.12)", next: ["CANCELLED"] },
    CONFIRMED: { label: "Đã xác nhận", icon: "fa-clipboard-check", color: "#0069d9", bg: "rgba(0,123,255,0.12)", next: ["SHIPPING", "CANCELLED"] },
    SHIPPING:  { label: "Đang giao",   icon: "fa-shipping-fast", color: "#138496", bg: "rgba(23,162,184,0.12)", next: ["DELIVERED"] },
    DELIVERED: { label: "Hoàn tất",    icon: "fa-check-double",  color: "#218838", bg: "rgba(40,167,69,0.12)",  next: [] },
    SHIPPED:   { label: "Đã giao",    icon: "fa-check-circle",  color: "#218838", bg: "rgba(40,167,69,0.12)",  next: [] },
    CANCELLED: { label: "Đã hủy",     icon: "fa-ban",           color: "#c82333", bg: "rgba(220,53,69,0.12)",  next: [] },
  };

  // Filter
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "ALL") result = result.filter(o => o.status === statusFilter);
    if (searchTerm) {
      result = result.filter(o =>
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id?.toString().includes(searchTerm) ||
        o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [orders, statusFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [statusFilter, searchTerm]);

  // Stats
  const stats = useMemo(() => ({
    total: orders.length,
    totalRevenue: orders.filter(o => ["PAID", "CONFIRMED", "SHIPPING", "DELIVERED", "SHIPPED"].includes(o.status)).reduce((s, o) => s + (o.totalAmount || 0), 0),
    pending: orders.filter(o => o.status === "PENDING").length,
    paid: orders.filter(o => o.status === "PAID").length,
    refund_pending: orders.filter(o => o.status === "REFUND_PENDING").length,
    confirmed: orders.filter(o => o.status === "CONFIRMED").length,
    shipping: orders.filter(o => o.status === "SHIPPING").length,
    delivered: orders.filter(o => ["DELIVERED", "SHIPPED"].includes(o.status)).length,
    cancelled: orders.filter(o => o.status === "CANCELLED").length,
  }), [orders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading("Đang cập nhật...");
    try {
      await axios.patch(`${API_BASE_URL}/api/orders/${orderId}/status?status=${newStatus}`);
      const sc = statusConfig[newStatus] || {};
      toast.success(`Đơn #${orderId} → ${sc.label || newStatus}`, { id: loadingToast });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      const msg = error.response?.data || "Lỗi cập nhật!";
      toast.error(typeof msg === 'string' ? msg : "Không thể chuyển trạng thái!", { id: loadingToast });
    }
  };

  const triggerDelete = (orderId) => {
    setDeleteModal({ isOpen: true, orderId });
  };

  const executeDelete = async () => {
    const { orderId } = deleteModal;
    if (!orderId) return;
    
    const loadingToast = toast.loading("Đang xóa...");
    try {
      await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`);
      toast.success("Xóa thành công", { id: loadingToast });
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      toast.error("Không thể xóa!", { id: loadingToast });
    }
  };

  // Format
  const formatCurrency = (v) => {
    if (!v) return "0 đ";
    if (v >= 1000000) return (v / 1000000).toFixed(1) + "M đ";
    return v.toLocaleString() + " đ";
  };

  const filterButtons = [
    { key: "ALL", label: "Tất cả", count: stats.total, color: "#722f37" },
    { key: "PENDING", label: "Chờ xử lý", count: stats.pending, color: "#e6a700" },
    { key: "PAID", label: "Đã TT", count: stats.paid, color: "#28a745" },
    { key: "REFUND_PENDING", label: "Cần hoàn tiền", count: stats.refund_pending, color: "#fd7e14" },
    { key: "CONFIRMED", label: "Xác nhận", count: stats.confirmed, color: "#0069d9" },
    { key: "SHIPPING", label: "Đang giao", count: stats.shipping, color: "#138496" },
    { key: "DELIVERED", label: "Hoàn tất", count: stats.delivered, color: "#218838" },
    { key: "CANCELLED", label: "Đã hủy", count: stats.cancelled, color: "#c82333" },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })} 
        onConfirm={executeDelete} 
        title="Xóa Đơn Hàng" 
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng #${deleteModal.orderId}? Hành động này không thể hoàn tác.`}
      />

      {/* HEADER */}
      <div className="card border-0 mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 60%, #c4666e 100%)', boxShadow: '0 8px 32px rgba(114,47,55,0.25)' }}>
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <h2 className="fw-bold text-white mb-1"><i className="fa fa-shopping-cart me-2"></i>Quản Lý Đơn Hàng</h2>
              <p className="text-white-50 mb-0 small"><i className="fa fa-box me-1"></i>{orders.length} đơn hàng · Doanh thu: {formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <button className="btn btn-sm px-3 py-2" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }} onClick={fetchOrders}>
                <i className="fa fa-sync-alt me-1"></i>Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="row g-3 mb-4">
        {[
          { label: "Tổng đơn", value: stats.total, icon: "fa-receipt", color: "#722f37" },
          { label: "Doanh thu", value: formatCurrency(stats.totalRevenue), icon: "fa-coins", color: "#2d6a4f" },
          { label: "Chờ xử lý", value: stats.pending, icon: "fa-clock", color: "#e6a700" },
          { label: "Hoàn tất", value: stats.delivered, icon: "fa-check-double", color: "#218838" },
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

      {/* FILTER & SEARCH */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="position-relative">
                <i className="fa fa-search position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}></i>
                <input type="text" className="form-control ps-5 py-2 border-0" style={{ background: '#f8f9fa', borderRadius: '10px' }} placeholder="Tìm theo tên, email, mã đơn..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex gap-2 flex-wrap justify-content-md-end">
                {filterButtons.map(btn => (
                  <button key={btn.key} className="btn px-3 py-2 d-flex align-items-center gap-2" style={{
                    borderRadius: '10px', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s ease',
                    background: statusFilter === btn.key ? btn.color : '#f8f9fa',
                    color: statusFilter === btn.key ? '#fff' : btn.color,
                    border: 'none'
                  }} onClick={() => setStatusFilter(btn.key)}>
                    {btn.label}
                    <span className="badge rounded-pill" style={{
                      background: statusFilter === btn.key ? 'rgba(255,255,255,0.3)' : `${btn.color}20`,
                      color: statusFilter === btn.key ? '#fff' : btn.color,
                      fontSize: '10px', minWidth: '20px'
                    }}>{btn.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th className="py-3 ps-4 border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Mã đơn</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Khách hàng</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Giá trị</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Ngày tạo</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Trạng thái</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Chuyển trạng thái</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center pe-4" style={{ fontSize: '11px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7"><LoadingSpinner /></td></tr>
              ) : paginatedOrders.length === 0 ? (
                <tr><td colSpan="7"><EmptyState title="Không tìm thấy đơn hàng nào" message="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" /></td></tr>
              ) : (
                paginatedOrders.map(o => {
                  const sc = statusConfig[o.status] || statusConfig.PENDING;
                  const nextStates = sc.next || [];

                  return (
                    <tr key={o.id} className="border-bottom" style={{ transition: 'background 0.15s ease' }}>
                      <td className="ps-4 py-3">
                        <span className="badge px-2 py-1" style={{ background: 'rgba(114,47,55,0.1)', color: '#722f37', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                          #{o.id}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #722f37, #a04050)',
                            color: '#fff', fontWeight: '700', fontSize: '14px'
                          }}>
                            {o.customerName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="ms-3">
                            <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{o.customerName}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{o.customerEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: '#722f37', fontSize: '13px' }}>
                          {o.totalAmount?.toLocaleString()} đ
                        </span>
                      </td>
                      <td className="text-muted" style={{ fontSize: '12px' }}>
                        <i className="fa fa-calendar-alt me-1" style={{ fontSize: '10px' }}></i>
                        {o.orderDate ? new Date(o.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td>
                        <span className="badge px-2 py-1" style={{ background: sc.bg, color: sc.color, borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                          <i className={`fa ${sc.icon} me-1`} style={{ fontSize: '9px' }}></i>{sc.label}
                        </span>
                      </td>
                      <td className="text-center">
                        {nextStates.length > 0 ? (
                          <div className="d-flex justify-content-center gap-1">
                            {nextStates.map(ns => {
                              const nsc = statusConfig[ns] || {};
                              return (
                                <button key={ns} className="btn btn-sm px-2 py-1" style={{
                                  borderRadius: '6px', fontSize: '10px', fontWeight: '600',
                                  background: nsc.bg, color: nsc.color, border: 'none'
                                }} onClick={() => handleUpdateStatus(o.id, ns)} title={`Chuyển sang ${nsc.label}`}>
                                  <i className={`fa ${nsc.icon} me-1`}></i>{nsc.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '11px' }}>—</span>
                        )}
                      </td>
                      <td className="pe-4">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`/admin/orders/${o.id}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(114,47,55,0.08)', color: '#722f37', border: 'none' }} title="Chi tiết">
                            <i className="fa fa-eye" style={{ fontSize: '12px' }}></i>
                          </Link>
                          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220,53,69,0.08)', color: '#c82333', border: 'none' }} onClick={() => triggerDelete(o.id)} title="Xóa">
                            <i className="fa fa-trash" style={{ fontSize: '12px' }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={filteredOrders.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default AdminOrders;