// AdminStats component giờ đã được tích hợp trực tiếp vào AdminDashboard.
// File này được giữ lại để backward-compatible nếu có nơi khác import.
// Nếu muốn dùng widget stats nhỏ ở bất kỳ đâu, import component này.

import React, { useState, useEffect } from "react";
import axios from "axios";

import API_BASE_URL from '../config';
const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`);
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-3 text-muted">Đang tải số liệu...</div>;
  if (!stats) return null;

  const cards = [
    { label: "Tổng đơn hàng", value: stats.totalOrders, icon: "fa-shopping-bag", gradient: "linear-gradient(135deg, #722f37, #a04050)" },
    { label: "Doanh thu", value: `${((stats.totalRevenue || 0) / 1000000).toFixed(1)}M đ`, icon: "fa-coins", gradient: "linear-gradient(135deg, #2d6a4f, #40916c)" },
    { label: "Sản phẩm", value: stats.totalProducts, icon: "fa-wine-bottle", gradient: "linear-gradient(135deg, #5a189a, #7b2cbf)" },
  ];

  return (
    <div className="row g-3">
      {cards.map((card, i) => (
        <div className="col-md-4" key={i}>
          <div className="card border-0 text-white shadow-sm" style={{ borderRadius: '14px', background: card.gradient }}>
            <div className="card-body p-3 d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center me-3" style={{
                width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)'
              }}>
                <i className={`fa ${card.icon}`} style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <div className="small text-white-50 text-uppercase fw-semibold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>{card.label}</div>
                <h4 className="fw-bold mb-0">{card.value}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;