import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { useDispatch } from "react-redux";
import axios from "axios";

import API_BASE_URL from '../config';
const PaymentResult = () => {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Đang xử lý kết quả giao dịch...");
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      let verifyEndpoint = "";
      
      if (searchParams.has("vnp_SecureHash")) {
        verifyEndpoint = `${API_BASE_URL}/api/payments/verify/vnpay${location.search}`;
        setPaymentMethod("VNPay");
      } else if (searchParams.has("signature") && searchParams.has("partnerCode")) {
        verifyEndpoint = `${API_BASE_URL}/api/payments/verify/momo${location.search}`;
        setPaymentMethod("Ví MoMo");
      } else {
        setStatus("failed");
        setMessage("Không tìm thấy thông tin giao dịch hợp lệ.");
        return;
      }

      try {
        const response = await axios.get(verifyEndpoint);
        if (response.status === 200) {
          setStatus("success");
          setOrderDetails(response.data);
          dispatch({ type: "EMPTY_CART" });
        }
      } catch (error) {
        setStatus("failed");
        setMessage(error.response?.data || "Giao dịch thanh toán thất bại hoặc đã bị hủy.");
      }
    };

    verifyPayment();
  }, [location, dispatch]);

  return (
    <>
      <Navbar />
      <div className="bg-light min-vh-100 py-5">
        <style>{`
          .luxury-result-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(114,47,55,0.08);
            background: #fff;
            max-width: 600px;
            width: 100%;
            overflow: hidden;
          }
          .receipt-header {
            background-color: #722f37;
            color: white;
            padding: 40px 20px 30px;
            text-align: center;
          }
          .icon-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            background: rgba(255,255,255,0.2);
            color: #fff;
          }
          .receipt-body {
            padding: 30px;
            background-image: radial-gradient(circle at 10px 0, transparent 10px, #fff 11px);
            background-size: 20px 20px;
            background-repeat: repeat-x;
            background-position: top -10px left;
          }
          .receipt-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            border-bottom: 1px dashed #eee;
            padding-bottom: 15px;
          }
          .receipt-label {
            color: #6c757d;
            font-size: 0.95rem;
          }
          .receipt-value {
            font-weight: 600;
            color: #1a1a1a;
            text-align: right;
          }
          .product-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px dashed #eee;
          }
          .btn-burgundy {
            background-color: #722f37;
            color: #fff;
            transition: all 0.3s;
          }
          .btn-burgundy:hover {
            background-color: #5c242c;
            color: #fff;
          }
        `}</style>
        
        <div className="container px-3 mt-4">
          <div className="luxury-result-card mx-auto">
            {status === "processing" && (
              <div className="p-5 text-center">
                <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }}></div>
                <h4 className="fw-bold mt-4" style={{ color: '#1a1a1a' }}>Đang Xử Lý Giao Dịch</h4>
                <p className="text-muted">{message}</p>
              </div>
            )}

            {status === "failed" && (
              <div className="p-5 text-center">
                <div className="icon-circle" style={{ background: '#dc3545' }}>
                  <i className="fa fa-times" style={{ fontSize: "2.5rem" }}></i>
                </div>
                <h4 className="fw-bold text-danger mt-3">Giao Dịch Thất Bại</h4>
                <p className="text-muted mb-4">{message}</p>
                <div className="d-flex flex-column gap-3">
                  <button onClick={() => navigate(-1)} className="btn btn-burgundy rounded-pill py-3 fw-bold">
                    Thử Lại Thanh Toán
                  </button>
                </div>
              </div>
            )}

            {status === "success" && orderDetails && (
              <>
                <div className="receipt-header">
                  <div className="icon-circle">
                    <i className="fa fa-check" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h3 className="fw-bold mb-1">Thanh Toán Thành Công</h3>
                  <p className="mb-0 opacity-75">Cảm ơn bạn đã mua sắm tại WineStore</p>
                </div>
                
                <div className="receipt-body">
                  <h5 className="fw-bold mb-4 text-center" style={{ color: '#d4af37' }}>HÓA ĐƠN CHI TIẾT</h5>
                  
                  <div className="receipt-item">
                    <span className="receipt-label">Mã đơn hàng:</span>
                    <span className="receipt-value" style={{ color: '#722f37', fontSize: '1.1rem' }}>#{orderDetails.id}</span>
                  </div>
                  
                  <div className="receipt-item">
                    <span className="receipt-label">Thời gian:</span>
                    <span className="receipt-value">
                      {new Date(orderDetails.orderDate).toLocaleString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="receipt-item">
                    <span className="receipt-label">Khách hàng:</span>
                    <span className="receipt-value">{orderDetails.customerName}</span>
                  </div>
                  
                  <div className="receipt-item">
                    <span className="receipt-label">Phương thức:</span>
                    <span className="receipt-value">{paymentMethod}</span>
                  </div>

                  <h6 className="fw-bold mt-5 mb-2 text-center" style={{ color: '#1a1a1a', letterSpacing: '1px' }}>DANH SÁCH SẢN PHẨM</h6>
                  <div className="mb-4">
                    {orderDetails.items?.map((item, idx) => (
                      <div key={idx} className="product-row">
                        <div style={{ maxWidth: '70%' }}>
                          <div className="fw-bold" style={{ fontSize: '0.95rem' }}>{item.wine?.name || item.name || 'Sản phẩm'}</div>
                          <div className="text-muted small mt-1">Số lượng: x{item.quantity}</div>
                        </div>
                        <div className="fw-bold" style={{ color: '#722f37' }}>
                          {(item.price * item.quantity).toLocaleString()} đ
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="receipt-item border-0 pt-3 mt-4 mb-4" style={{ borderTop: '2px dashed #d4af37 !important' }}>
                    <span className="receipt-label fw-bold fs-5 text-dark" style={{ alignSelf: 'center' }}>TỔNG THANH TOÁN:</span>
                    <span className="receipt-value fw-bold" style={{ color: '#722f37', fontSize: '1.6rem' }}>
                      {orderDetails.totalAmount?.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-3 mt-5">
                    <Link to="/profile" className="btn btn-outline-dark rounded-pill py-3 fw-bold flex-grow-1 text-center">
                      XEM LỊCH SỬ ĐƠN HÀNG
                    </Link>
                    <Link to="/" className="btn btn-burgundy rounded-pill py-3 fw-bold flex-grow-1 text-center">
                      TIẾP TỤC MUA SẮM
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentResult;
