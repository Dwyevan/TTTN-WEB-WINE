import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from 'xlsx';
import toast from "react-hot-toast";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/admin/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", err);
        setError("Không thể kết nối đến server");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // Hàm Xuất Báo Cáo Doanh Thu ra Excel
  const exportToExcel = async () => {
    const loadingToast = toast.loading("Đang thu thập dữ liệu...");
    try {
      // 1. Fetch toàn bộ orders (Không chỉ limit những order gần đây)
      const res = await axios.get("http://localhost:8080/api/orders");
      const orders = res.data;
      
      if (!orders || orders.length === 0) {
        toast.error("Không có dữ liệu đơn hàng để xuất", { id: loadingToast });
        return;
      }

      // 2. Format dữ liệu
      const excelData = orders.map(order => ({
        "Mã Đơn": `#${order.id}`,
        "Ngày Đặt": new Date(order.orderDate).toLocaleString('vi-VN'),
        "Khách Hàng": order.customerName || "N/A",
        "SĐT": order.phone || "N/A",
        "Email": order.customerEmail || "N/A",
        "Sản Phẩm": order.items?.map(i => `${i.name} (x${i.quantity})`).join(", ") || "",
        "Tổng Tiền (VNĐ)": order.totalAmount,
        "Lý Do Hủy": order.cancellationReason || "",
        "Trạng Thái": statusConfig[order.status]?.label || order.status
      }));

      // 3. Khởi tạo Sheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Tùy chỉnh độ rộng cột cho đẹp
      const wscols = [
        { wch: 10 }, // Mã đơn
        { wch: 20 }, // Ngày đặt
        { wch: 25 }, // Khách hàng
        { wch: 15 }, // SĐT
        { wch: 25 }, // Email
        { wch: 45 }, // Sản phẩm
        { wch: 15 }, // Tổng tiền
        { wch: 25 }, // Lý do hủy
        { wch: 15 }  // Trạng thái
      ];
      worksheet['!cols'] = wscols;

      // 4. Tạo Workbook và xuất file
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh Thu");

      const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
      XLSX.writeFile(workbook, `Bao_Cao_Doanh_Thu_${dateStr}.xlsx`);
      
      toast.success("Xuất báo cáo Excel thành công!", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xuất file Excel!", { id: loadingToast });
    }
  };

  // Format VNĐ
  const formatCurrency = (value) => {
    if (!value) return "0 đ";
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + " tỷ";
    if (value >= 1000000) return (value / 1000000).toFixed(1) + " triệu";
    if (value >= 1000) return (value / 1000).toFixed(0) + "K";
    return value.toLocaleString() + " đ";
  };

  const formatFullCurrency = (value) => {
    if (!value) return "0 đ";
    return value.toLocaleString() + " đ";
  };

  // Status badge config
  const statusConfig = {
    PENDING: { label: "Chờ xử lý", bg: "rgba(255,193,7,0.12)", color: "#e6a700", icon: "fa-clock" },
    CONFIRMED: { label: "Đã xác nhận", bg: "rgba(0,123,255,0.12)", color: "#0069d9", icon: "fa-check" },
    SHIPPING: { label: "Đang giao", bg: "rgba(23,162,184,0.12)", color: "#138496", icon: "fa-truck" },
    SHIPPED: { label: "Đã giao", bg: "rgba(40,167,69,0.12)", color: "#218838", icon: "fa-check-circle" },
    DELIVERED: { label: "Hoàn tất", bg: "rgba(40,167,69,0.12)", color: "#218838", icon: "fa-check-double" },
    CANCELLED: { label: "Đã hủy", bg: "rgba(220,53,69,0.12)", color: "#c82333", icon: "fa-times-circle" },
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: '#722f37' }} role="status"></div>
      <h5 className="fw-bold" style={{ color: '#722f37' }}>Đang tải Dashboard...</h5>
      <p className="text-muted small">Vui lòng chờ trong giây lát</p>
    </div>
  );

  if (error) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <i className="fa fa-exclamation-triangle fa-3x mb-3" style={{ color: '#dc3545', opacity: 0.5 }}></i>
      <h5 className="fw-bold text-dark">{error}</h5>
      <button className="btn mt-3 px-4 py-2" style={{ background: '#722f37', color: '#fff', borderRadius: '10px' }} onClick={() => window.location.reload()}>
        <i className="fa fa-redo me-2"></i>Thử lại
      </button>
    </div>
  );

  // Stat cards data
  const statCards = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats?.totalRevenue),
      subtitle: formatFullCurrency(stats?.totalRevenue),
      icon: "fa-coins",
      gradient: "linear-gradient(135deg, #722f37 0%, #a04050 100%)",
      lightBg: "rgba(114,47,55,0.08)",
      lightColor: "#722f37"
    },
    {
      title: "Tổng đơn hàng",
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.pendingOrdersCount || 0} chờ xử lý`,
      icon: "fa-shopping-bag",
      gradient: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)",
      lightBg: "rgba(45,106,79,0.08)",
      lightColor: "#2d6a4f"
    },
    {
      title: "Sản phẩm",
      value: stats?.totalProducts || 0,
      subtitle: `${stats?.lowStockCount || 0} sắp hết hàng`,
      icon: "fa-wine-bottle",
      gradient: "linear-gradient(135deg, #5a189a 0%, #7b2cbf 100%)",
      lightBg: "rgba(90,24,154,0.08)",
      lightColor: "#5a189a"
    },
    {
      title: "Cảnh báo kho",
      value: (stats?.lowStockCount || 0) + (stats?.outOfStockCount || 0),
      subtitle: `${stats?.outOfStockCount || 0} hết hàng hoàn toàn`,
      icon: "fa-exclamation-triangle",
      gradient: "linear-gradient(135deg, #e07c24 0%, #f4a261 100%)",
      lightBg: "rgba(224,124,36,0.08)",
      lightColor: "#e07c24"
    }
  ];

  // Order status summary
  const orderStatusCards = [
    { key: "pending", label: "Chờ xử lý", count: stats?.pendingOrdersCount, icon: "fa-clock", color: "#e6a700", bg: "rgba(255,193,7,0.1)" },
    { key: "confirmed", label: "Đã xác nhận", count: stats?.confirmedOrdersCount, icon: "fa-clipboard-check", color: "#0069d9", bg: "rgba(0,123,255,0.1)" },
    { key: "shipping", label: "Đang giao", count: stats?.shippingOrdersCount, icon: "fa-shipping-fast", color: "#138496", bg: "rgba(23,162,184,0.1)" },
    { key: "delivered", label: "Hoàn tất", count: stats?.deliveredOrdersCount, icon: "fa-check-double", color: "#218838", bg: "rgba(40,167,69,0.1)" },
    { key: "cancelled", label: "Đã hủy", count: stats?.cancelledOrdersCount, icon: "fa-ban", color: "#c82333", bg: "rgba(220,53,69,0.1)" },
  ];

  // ===== CHART DATA SETUP =====
  const orderStatusChartData = {
    labels: ['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy'],
    datasets: [{
      data: [
        stats?.pendingOrdersCount || 0,
        stats?.confirmedOrdersCount || 0,
        stats?.shippingOrdersCount || 0,
        stats?.deliveredOrdersCount || 0,
        stats?.cancelledOrdersCount || 0
      ],
      backgroundColor: ['#ffc107', '#007bff', '#17a2b8', '#28a745', '#dc3545'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } }
    },
    cutout: '75%'
  };

  const bestSellerChartData = {
    labels: stats?.bestSellers?.map(item => {
      // Rút gọn tên nếu quá dài để hiển thị trên trục X
      const name = item.name || '';
      return name.length > 20 ? name.substring(0, 20) + '...' : name;
    }) || [],
    datasets: [{
      label: 'Đã bán (chai)',
      data: stats?.bestSellers?.map(item => item.soldCount) || [],
      backgroundColor: 'rgba(114, 47, 55, 0.85)', // Màu đỏ vang
      borderRadius: 6,
      barThickness: 30
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (context) => stats?.bestSellers?.[context[0].dataIndex]?.name || ''
        }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { borderDash: [2, 4], color: '#e9ecef' } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } }
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ===== HEADER ===== */}
      <div className="card border-0 mb-4" style={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #722f37 0%, #a04050 60%, #c4666e 100%)',
        boxShadow: '0 8px 32px rgba(114,47,55,0.25)'
      }}>
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <div className="d-flex align-items-center mb-2">
                <div className="d-flex align-items-center justify-content-center me-3" style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)'
                }}>
                  <i className="fa fa-wine-glass-alt text-white" style={{ fontSize: '22px' }}></i>
                </div>
                <div>
                  <h2 className="fw-bold text-white mb-0" style={{ letterSpacing: '-0.5px' }}>
                    WineStore Dashboard
                  </h2>
                  <p className="text-white-50 mb-0 small">Bảng điều khiển quản trị tổng quan</p>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3 mt-md-0 align-items-center">
              <span className="badge px-3 py-2 me-2 d-none d-sm-inline-block" style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                borderRadius: '10px', fontSize: '12px', color: '#fff'
              }}>
                <i className="fa fa-calendar-alt me-1"></i>
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              
              {/* Nút Xuất Excel */}
              <button className="btn btn-sm px-3 py-2 fw-bold shadow-sm" onClick={exportToExcel} style={{
                background: '#217346', color: '#fff', border: '1px solid #1e6b41', borderRadius: '10px',
                transition: 'all 0.2s ease'
              }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                <i className="fa fa-file-excel me-2"></i>Xuất Excel
              </button>

              <button className="btn btn-sm px-3 py-2" onClick={() => window.location.reload()} style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: '10px'
              }}>
                <i className="fa fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="row g-3 mb-4">
        {statCards.map((card, idx) => (
          <div className="col-xl-3 col-md-6" key={idx}>
            <div className="card border-0 h-100 position-relative overflow-hidden" style={{
              borderRadius: '16px', transition: 'all 0.3s ease', cursor: 'default',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: card.gradient }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center justify-content-center" style={{
                    width: '50px', height: '50px', background: card.gradient, borderRadius: '14px',
                    boxShadow: `0 4px 12px ${card.lightColor}30`
                  }}>
                    <i className={`fa ${card.icon} text-white`} style={{ fontSize: '20px' }}></i>
                  </div>
                </div>
                <div className="mb-1">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>{card.title}</span>
                </div>
                <h3 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>{card.value}</h3>
                <span className="small" style={{ color: card.lightColor }}>
                  <i className="fa fa-info-circle me-1"></i>{card.subtitle}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== ORDER STATUS PIPELINE ===== */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">
              <i className="fa fa-stream me-2" style={{ color: '#722f37' }}></i>
              Tình Trạng Đơn Hàng
            </h5>
            <Link to="/admin/orders" className="btn btn-sm px-3 py-2" style={{
              background: 'rgba(114,47,55,0.08)', color: '#722f37', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '12px'
            }}>
              Xem tất cả <i className="fa fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-3">
            {orderStatusCards.map((item) => (
              <div className="col" key={item.key}>
                <div className="text-center p-3 rounded-3 position-relative" style={{
                  background: item.bg, transition: 'all 0.2s ease', cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <div className="d-flex align-items-center justify-content-center mx-auto mb-2" style={{
                    width: '44px', height: '44px', borderRadius: '12px', background: item.bg
                  }}>
                    <i className={`fa ${item.icon}`} style={{ color: item.color, fontSize: '18px' }}></i>
                  </div>
                  <h4 className="fw-bold mb-1" style={{ color: item.color }}>{item.count || 0}</h4>
                  <div className="small fw-semibold" style={{ color: item.color, fontSize: '11px' }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CHARTS ROW ===== */}
      <div className="row g-4 mb-4">
        {/* Doughnut Chart: Tỷ lệ Đơn Hàng */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 p-4 pb-0">
              <h5 className="fw-bold mb-0">
                <i className="fa fa-chart-pie me-2" style={{ color: '#722f37' }}></i>
                Tỷ Lệ Đơn Hàng
              </h5>
            </div>
            <div className="card-body p-4 d-flex justify-content-center align-items-center" style={{ height: '320px' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {stats ? <Doughnut data={orderStatusChartData} options={doughnutOptions} /> : null}
                <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ marginTop: '-15px' }}>
                  <div className="text-muted small">Tổng đơn</div>
                  <h4 className="fw-bold mb-0 text-dark">{stats?.totalOrders || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Sản Phẩm Bán Chạy */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <i className="fa fa-chart-bar me-2" style={{ color: '#722f37' }}></i>
                Top 5 Rượu Vang Bán Chạy Nhất
              </h5>
            </div>
            <div className="card-body p-4" style={{ height: '320px' }}>
              {stats?.bestSellers?.length > 0 ? (
                <Bar data={bestSellerChartData} options={barOptions} />
              ) : (
                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                  <i className="fa fa-box-open fa-3x text-muted mb-3" style={{ opacity: 0.3 }}></i>
                  <span className="text-muted">Chưa có dữ liệu sản phẩm bán ra</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="row g-4">
        {/* --- BEST SELLERS --- */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 p-4 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  <i className="fa fa-trophy me-2" style={{ color: '#e6a700' }}></i>
                  Sản Phẩm Bán Chạy
                </h5>
                <Link to="/admin/products" className="btn btn-sm px-3 py-2" style={{
                  background: 'rgba(114,47,55,0.08)', color: '#722f37', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '12px'
                }}>
                  Xem kho <i className="fa fa-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            <div className="card-body p-4">
              {stats?.bestSellers?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr className="text-muted small" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th className="border-0 pb-3 fw-semibold">#</th>
                        <th className="border-0 pb-3 fw-semibold">Sản phẩm</th>
                        <th className="border-0 pb-3 fw-semibold text-center">Đã bán</th>
                        <th className="border-0 pb-3 fw-semibold text-center">Tồn kho</th>
                        <th className="border-0 pb-3 fw-semibold text-end">Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.bestSellers.map((item, index) => (
                        <tr key={item.id} className="border-bottom" style={{ transition: 'background 0.2s ease' }}>
                          <td className="py-3">
                            <div className="d-flex align-items-center justify-content-center fw-bold" style={{
                              width: '28px', height: '28px', borderRadius: '8px', fontSize: '12px',
                              background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#f0f0f0',
                              color: index < 3 ? '#fff' : '#666'
                            }}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} style={{
                                  width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover',
                                  border: '2px solid #f0f0f0'
                                }} onError={(e) => { e.target.src = "https://placehold.co/44x44?text=🍷"; }} />
                              ) : (
                                <div className="d-flex align-items-center justify-content-center" style={{
                                  width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(114,47,55,0.08)'
                                }}>
                                  <i className="fa fa-wine-bottle" style={{ color: '#722f37' }}></i>
                                </div>
                              )}
                              <div className="ms-3">
                                <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{item.name}</div>
                                <span className="text-muted" style={{ fontSize: '11px' }}>{item.category || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3">
                            <span className="badge px-3 py-2" style={{
                              background: 'rgba(114,47,55,0.1)', color: '#722f37', borderRadius: '8px', fontSize: '12px', fontWeight: '700'
                            }}>
                              {item.soldCount}
                            </span>
                          </td>
                          <td className="text-center py-3">
                            <span className={`badge px-3 py-2`} style={{
                              background: item.stock < 10 ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)',
                              color: item.stock < 10 ? '#c82333' : '#218838',
                              borderRadius: '8px', fontSize: '12px', fontWeight: '600'
                            }}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="text-end py-3">
                            <span className="fw-bold" style={{ color: '#722f37', fontSize: '13px' }}>
                              {item.price?.toLocaleString()} đ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="fa fa-wine-glass fa-3x mb-3" style={{ opacity: 0.2 }}></i>
                  <p className="mb-0">Chưa có dữ liệu bán hàng</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RECENT ORDERS --- */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header bg-white border-0 p-4 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  <i className="fa fa-receipt me-2" style={{ color: '#722f37' }}></i>
                  Đơn Hàng Gần Đây
                </h5>
                <Link to="/admin/orders" className="btn btn-sm px-3 py-2" style={{
                  background: 'rgba(114,47,55,0.08)', color: '#722f37', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '12px'
                }}>
                  Tất cả <i className="fa fa-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            <div className="card-body p-4 pt-3">
              {stats?.recentOrders?.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentOrders.map((order) => {
                    const sc = statusConfig[order.status] || statusConfig.PENDING;
                    return (
                      <Link
                        key={order.id}
                        to={`/admin/orders/${order.id}`}
                        className="list-group-item list-group-item-action border-0 px-0 py-3"
                        style={{ transition: 'all 0.2s ease', borderRadius: '10px', textDecoration: 'none' }}
                      >
                        <div className="d-flex align-items-center">
                          {/* Avatar */}
                          <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)',
                            color: '#fff', fontWeight: '700', fontSize: '16px'
                          }}>
                            {order.customerName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          {/* Info */}
                          <div className="ms-3 flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div style={{ minWidth: 0 }}>
                                <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '13px' }}>
                                  {order.customerName}
                                </div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                  <i className="fa fa-hashtag me-1" style={{ fontSize: '9px' }}></i>
                                  {order.id} · {order.itemCount} sản phẩm
                                </div>
                              </div>
                              <div className="text-end ms-2 flex-shrink-0">
                                <div className="fw-bold" style={{ color: '#722f37', fontSize: '12px' }}>
                                  {formatCurrency(order.totalAmount)}
                                </div>
                                <span className="badge px-2 py-1" style={{
                                  background: sc.bg, color: sc.color, borderRadius: '6px', fontSize: '10px', fontWeight: '600'
                                }}>
                                  <i className={`fa ${sc.icon} me-1`} style={{ fontSize: '8px' }}></i>
                                  {sc.label}
                                </span>
                              </div>
                            </div>
                            <div className="text-muted mt-1" style={{ fontSize: '10px' }}>
                              <i className="fa fa-calendar me-1"></i>{order.orderDate}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="fa fa-inbox fa-3x mb-3" style={{ opacity: 0.2 }}></i>
                  <p className="mb-0">Chưa có đơn hàng nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="row g-3 mt-2">
        {[
          { title: "Thêm sản phẩm", desc: "Nhập kho sản phẩm mới", icon: "fa-plus-circle", link: "/admin/add-product", gradient: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)" },
          { title: "Quản lý kho", desc: "Nhập hàng & kiểm kho", icon: "fa-warehouse", link: "/admin/products", gradient: "linear-gradient(135deg, #5a189a 0%, #7b2cbf 100%)" },
          { title: "Đơn hàng", desc: "Xử lý đơn chờ", icon: "fa-shopping-cart", link: "/admin/orders", gradient: "linear-gradient(135deg, #e07c24 0%, #f4a261 100%)" },
          { title: "Phản hồi", desc: "Đánh giá từ khách", icon: "fa-comments", link: "/admin/feedbacks", gradient: "linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)" },
        ].map((action, idx) => (
          <div className="col-xl-3 col-md-6" key={idx}>
            <Link to={action.link} className="text-decoration-none">
              <div className="card border-0 h-100" style={{
                borderRadius: '16px', transition: 'all 0.3s ease', cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center" style={{
                      width: '48px', height: '48px', borderRadius: '14px', background: action.gradient
                    }}>
                      <i className={`fa ${action.icon} text-white`} style={{ fontSize: '20px' }}></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="fw-bold mb-1 text-dark">{action.title}</h6>
                      <span className="text-muted small">{action.desc}</span>
                    </div>
                    <i className="fa fa-chevron-right ms-auto text-muted"></i>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;