import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import API_BASE_URL from '../config';
const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingConfig, setShippingConfig] = useState({
    SHIPPING_THRESHOLD: 2000000,
    SHIPPING_FEE: 35000
  });

  const fetchOrderDetail = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông tin đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrderDetail(); 
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/settings`);
        if (res.data) {
          setShippingConfig({
            SHIPPING_THRESHOLD: parseInt(res.data.FREE_SHIPPING_THRESHOLD) || 2000000,
            SHIPPING_FEE: parseInt(res.data.SHIPPING_FEE) || 35000
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy cài đặt phí vận chuyển:", error);
      }
    };
    fetchSettings();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    const loadingToast = toast.loading("Đang cập nhật...");
    try {
      await axios.patch(`${API_BASE_URL}/api/orders/${id}/status?status=${newStatus}`);
      toast.success(`Đã chuyển sang: ${statusConfig[newStatus]?.label || newStatus}`, { id: loadingToast });
      fetchOrderDetail();
    } catch (error) {
      const msg = error.response?.data;
      toast.error(typeof msg === 'string' ? msg : "Lỗi cập nhật!", { id: loadingToast });
    }
  };

  // Status config
  const statusConfig = {
    PENDING:   { label: "Chờ xử lý",   icon: "fa-clock",         color: "#e6a700", bg: "rgba(255,193,7,0.12)" },
    PAID:      { label: "Đã thanh toán", icon: "fa-money-check", color: "#28a745", bg: "rgba(40,167,69,0.12)" },
    REFUND_PENDING: { label: "Yêu cầu hoàn tiền", icon: "fa-undo", color: "#fd7e14", bg: "rgba(253,126,20,0.12)" },
    CONFIRMED: { label: "Đã xác nhận", icon: "fa-clipboard-check", color: "#0069d9", bg: "rgba(0,123,255,0.12)" },
    SHIPPING:  { label: "Đang giao",   icon: "fa-shipping-fast", color: "#138496", bg: "rgba(23,162,184,0.12)" },
    DELIVERED: { label: "Hoàn tất",    icon: "fa-check-double",  color: "#218838", bg: "rgba(40,167,69,0.12)" },
    SHIPPED:   { label: "Đã giao",    icon: "fa-check-circle",  color: "#218838", bg: "rgba(40,167,69,0.12)" },
    CANCELLED: { label: "Đã hủy",     icon: "fa-ban",           color: "#c82333", bg: "rgba(220,53,69,0.12)" },
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: '#722f37' }} role="status"></div>
      <h5 className="fw-bold" style={{ color: '#722f37' }}>Đang tải đơn hàng...</h5>
    </div>
  );

  if (!order) return (
    <div className="text-center py-5">
      <i className="fa fa-search fa-4x text-muted mb-3" style={{ opacity: 0.3 }}></i>
      <h3>Không tìm thấy đơn hàng #{id}</h3>
      <button className="btn px-4 py-2 mt-3" style={{ background: '#722f37', color: '#fff', borderRadius: '12px', border: 'none' }} onClick={() => navigate("/admin/orders")}>
        <i className="fa fa-arrow-left me-2"></i>Quay lại
      </button>
    </div>
  );

  const sc = statusConfig[order.status] || statusConfig.PENDING;

  // Timeline steps
  const timelineSteps = [
    { key: "PENDING",   icon: "fa-file-alt",        label: "Đặt hàng" },
    { key: "CONFIRMED", icon: "fa-clipboard-check",  label: "Xác nhận" },
    { key: "SHIPPING",  icon: "fa-shipping-fast",    label: "Đang giao" },
    { key: "DELIVERED", icon: "fa-check-double",     label: "Hoàn tất" },
  ];

  const statusOrder = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"];
  const currentIdx = statusOrder.indexOf(order.status === "SHIPPED" ? "DELIVERED" : (order.status === "PAID" ? "PENDING" : order.status));
  const isCancelled = order.status === "CANCELLED";

  // Next valid actions
  const getNextActions = () => {
    switch (order.status) {
      case "PENDING":
      case "PAID": return [
        { status: "CONFIRMED", label: "Xác nhận đơn", icon: "fa-check", gradient: "linear-gradient(135deg, #0069d9, #0085e0)", desc: "Xác nhận và trừ kho" },
        { status: "CANCELLED", label: "Hủy đơn hàng", icon: "fa-times", gradient: "linear-gradient(135deg, #c82333, #dc3545)", desc: "Hủy đơn hàng này", outline: true },
      ];
      case "REFUND_PENDING": return [
        { status: "CANCELLED", label: "Xác nhận Đã Hoàn Tiền & Hủy Đơn", icon: "fa-check-circle", gradient: "linear-gradient(135deg, #c82333, #dc3545)", desc: "Xác nhận bạn đã hoàn tiền trên Momo và hủy đơn này" },
      ];
      case "CONFIRMED": return [
        { status: "SHIPPING", label: "Giao hàng", icon: "fa-truck", gradient: "linear-gradient(135deg, #138496, #17a2b8)", desc: "Chuyển cho đơn vị vận chuyển" },
        { status: "CANCELLED", label: "Hủy đơn", icon: "fa-times", gradient: "linear-gradient(135deg, #c82333, #dc3545)", desc: "Hủy và hoàn kho", outline: true },
      ];
      case "SHIPPING": return [
        { status: "DELIVERED", label: "Đã giao thành công", icon: "fa-check-double", gradient: "linear-gradient(135deg, #218838, #28a745)", desc: "Xác nhận giao hàng thành công" },
      ];
      default: return [];
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        @media print { .no-print { display: none !important; } .only-print { display: block !important; } body { background: white !important; } * { -webkit-print-color-adjust: exact !important; } }
        .only-print { display: none; }
      `}</style>

      {/* HEADER */}
      <div className="card border-0 mb-4 no-print" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 60%, #c4666e 100%)', boxShadow: '0 8px 32px rgba(114,47,55,0.25)' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button className="btn btn-sm px-3 py-2 mb-3" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }} onClick={() => navigate(-1)}>
                <i className="fa fa-arrow-left me-2"></i>Quay lại
              </button>
              <h2 className="fw-bold text-white mb-1"><i className="fa fa-file-invoice me-2"></i>Chi Tiết Đơn Hàng</h2>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="badge px-2 py-1" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }}>#{order.id}</span>
                <span className="badge px-2 py-1" style={{ background: sc.bg, color: sc.color, borderRadius: '6px', fontSize: '11px' }}>
                  <i className={`fa ${sc.icon} me-1`}></i>{sc.label}
                </span>
              </div>
            </div>
            <button className="btn px-3 py-2" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }} onClick={() => window.print()}>
              <i className="fa fa-print me-2"></i>In
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* STATUS TIMELINE */}
          {!isCancelled && (
            <div className="card border-0 shadow-sm mb-4 no-print" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-4"><i className="fa fa-tasks me-2" style={{ color: '#722f37' }}></i>Tiến Trình Đơn Hàng</h6>
                <div className="d-flex justify-content-between position-relative">
                  {timelineSteps.map((step, idx) => {
                    const isActive = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div key={step.key} className="text-center position-relative" style={{ flex: 1, zIndex: 1 }}>
                        {idx < timelineSteps.length - 1 && (
                          <div style={{ position: 'absolute', top: '22px', left: '50%', width: '100%', height: '3px', background: isActive ? '#722f37' : '#e9ecef', zIndex: 0 }}></div>
                        )}
                        <div className="d-flex align-items-center justify-content-center mx-auto mb-2" style={{
                          width: '44px', height: '44px', borderRadius: '50%', position: 'relative', zIndex: 2, transition: 'all 0.3s ease',
                          background: isCurrent ? 'linear-gradient(135deg, #722f37, #a04050)' : isActive ? '#722f37' : '#fff',
                          border: `3px solid ${isActive ? '#722f37' : '#e9ecef'}`,
                          color: isActive ? '#fff' : '#adb5bd',
                          boxShadow: isCurrent ? '0 4px 12px rgba(114,47,55,0.35)' : 'none',
                        }}>
                          <i className={`fa ${step.icon}`} style={{ fontSize: '16px' }}></i>
                        </div>
                        <div style={{ fontSize: '11px', color: isActive ? '#722f37' : '#6c757d', fontWeight: isActive ? '700' : '400' }}>{step.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled banner */}
          {isCancelled && (
            <div className="card border-0 shadow-sm mb-4 no-print" style={{ borderRadius: '16px', background: 'rgba(220,53,69,0.05)', border: '2px solid rgba(220,53,69,0.2)' }}>
              <div className="card-body p-4 text-center">
                <i className="fa fa-ban fa-3x mb-2" style={{ color: '#c82333', opacity: 0.5 }}></i>
                <h5 className="fw-bold" style={{ color: '#c82333' }}>ĐƠN HÀNG ĐÃ BỊ HỦY</h5>
              </div>
            </div>
          )}

          {/* PRODUCTS LIST PREMIUM */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0"><i className="fa fa-shopping-cart me-2" style={{ color: '#722f37' }}></i>Sản Phẩm ({order.items?.length || 0})</h6>
            </div>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="d-flex align-items-center p-3 rounded-4" style={{ border: '1px solid #f0f0f0', transition: 'all 0.2s', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-white" style={{ width: '80px', height: '80px', borderRadius: '12px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
                      {item.wine?.imageUrl ? (
                        <img src={item.wine.imageUrl.startsWith('http') ? item.wine.imageUrl : `${API_BASE_URL}${item.wine.imageUrl}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(114,47,55,0.05)' }}>
                           <i className="fa fa-wine-bottle fs-3" style={{ color: '#722f37', opacity: 0.8 }}></i>
                        </div>
                      )}
                    </div>
                    <div className="ms-4 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>{item.name}</h6>
                          <small className="text-muted">ID: #{item.productId || item.wine?.id || 'N/A'}</small>
                        </div>
                        <div className="text-end">
                           <span className="fw-bold fs-6" style={{ color: '#722f37' }}>{(item.price * item.quantity).toLocaleString()} đ</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <span className="badge px-3 py-2" style={{ background: '#f8f9fa', color: '#555', border: '1px solid #ddd', fontSize: '12px', fontWeight: '600' }}>
                           {item.price?.toLocaleString()} đ <span className="mx-1 text-muted fw-normal">x</span> {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-footer bg-white border-top p-4">
              <div className="row justify-content-end">
                <div className="col-md-6 col-lg-5">
                  <div className="d-flex justify-content-between mb-3 small">
                    <span className="text-muted">Tạm tính:</span>
                    <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{(order.totalAmount - (order.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? 0 : shippingConfig.SHIPPING_FEE)).toLocaleString()} đ</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 pb-3 border-bottom small">
                    <span className="text-muted">Phí giao hàng:</span>
                    <span className="fw-semibold" style={{ color: order.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? '#218838' : '#722f37', fontSize: '14px' }}>
                      {order.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? "Miễn phí" : `${shippingConfig.SHIPPING_FEE.toLocaleString()} đ`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 mt-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #722f37, #a04050)', borderRadius: '12px' }}>
                    <span className="fw-bold text-white text-uppercase" style={{ letterSpacing: '1px', fontSize: '13px' }}>Tổng Cộng</span>
                    <span className="fw-bold text-white fs-4">{order.totalAmount?.toLocaleString()} <span className="fs-6">đ</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-4">
          {/* CUSTOMER INFO */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 text-muted small text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Thông Tin Khách Hàng</h6>
              <div className="d-flex align-items-center mb-4 p-3" style={{ background: 'rgba(114,47,55,0.05)', borderRadius: '12px' }}>
                <div className="d-flex align-items-center justify-content-center fw-bold text-white" style={{
                  width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #722f37, #a04050)', fontSize: '22px'
                }}>
                  {order.customerName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-0 text-dark">{order.customerName}</h6>
                  <span className="text-muted small">{order.customerEmail}</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex align-items-start mb-3 p-2">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(114,47,55,0.08)' }}>
                    <i className="fa fa-phone" style={{ color: '#722f37', fontSize: '13px' }}></i>
                  </div>
                  <span className="ms-3 small text-dark">{order.phone}</span>
                </div>
                <div className="d-flex align-items-start mb-3 p-2">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(114,47,55,0.08)' }}>
                    <i className="fa fa-map-marker-alt" style={{ color: '#722f37', fontSize: '13px' }}></i>
                  </div>
                  <span className="ms-3 small text-dark">{order.address}</span>
                </div>
                
                {order.cancellationReason && (
                  <div className="mt-3 p-3 text-dark border border-warning" style={{ fontSize: '13px', background: '#fff3cd', borderRadius: '8px' }}>
                    <h6 className="fw-bold text-danger mb-1"><i className="fa fa-exclamation-triangle me-1"></i> Lý do hủy đơn:</h6>
                    <span style={{ lineHeight: '1.5' }}>{order.cancellationReason}</span>
                  </div>
                )}
              </div>

              {/* Note */}
              {(order.note || order.customerNote || order.orderNote) && (
                <div className="p-3 mt-2" style={{ background: 'rgba(255,193,7,0.08)', borderRadius: '10px', borderLeft: '3px solid #e6a700' }}>
                  <div className="d-flex align-items-center mb-1">
                    <i className="fa fa-comment-dots me-2" style={{ color: '#e6a700', fontSize: '12px' }}></i>
                    <span className="fw-bold small text-dark">Ghi chú</span>
                  </div>
                  <div className="small text-muted" style={{ fontStyle: 'italic' }}>
                    "{order.note || order.customerNote || order.orderNote}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="card border-0 shadow-sm mb-4 no-print" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 text-muted small text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>Thao Tác</h6>
              {getNextActions().length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {getNextActions().map(action => (
                    <button key={action.status} className={`btn w-100 py-3 fw-bold ${action.outline ? '' : 'shadow-sm'}`} style={{
                      background: action.outline ? 'transparent' : action.gradient,
                      color: action.outline ? '#c82333' : '#fff',
                      borderRadius: '12px',
                      border: action.outline ? '2px solid rgba(220,53,69,0.3)' : 'none',
                      fontSize: '13px'
                    }} onClick={() => handleUpdateStatus(action.status)}>
                      <i className={`fa ${action.icon} me-2`}></i>{action.label}
                      <div className="small fw-normal" style={{ opacity: 0.8, fontSize: '11px' }}>{action.desc}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4" style={{ background: sc.bg, borderRadius: '12px', border: `2px solid ${sc.color}30` }}>
                  <i className={`fa ${sc.icon} fa-2x mb-2`} style={{ color: sc.color }}></i>
                  <div className="fw-bold" style={{ color: sc.color }}>{sc.label?.toUpperCase()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRINT FOOTER */}
      <div className="only-print mt-5 pt-5 border-top">
        <div className="row text-center">
          <div className="col-4"><p className="fw-bold">Khách hàng</p><div style={{ height: '60px' }}></div><p>{order.customerName}</p></div>
          <div className="col-4"><p className="fw-bold">Nhân viên giao</p><div style={{ height: '60px' }}></div></div>
          <div className="col-4"><p className="fw-bold">WineStore</p><div style={{ height: '60px' }}></div><p className="small text-muted">Ngày: {new Date().toLocaleDateString('vi-VN')}</p></div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;