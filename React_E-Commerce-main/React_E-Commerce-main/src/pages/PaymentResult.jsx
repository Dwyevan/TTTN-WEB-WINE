import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { useDispatch } from "react-redux";
import axios from "axios";

const PaymentResult = () => {
  const [status, setStatus] = useState("processing"); // processing, success, failed
  const [message, setMessage] = useState("Đang xử lý kết quả giao dịch...");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      // Get all query params from URL
      const searchParams = new URLSearchParams(location.search);
      let verifyEndpoint = "";

      if (searchParams.has("vnp_SecureHash")) {
        verifyEndpoint = `http://localhost:8080/api/payments/verify/vnpay${location.search}`;
      } else if (searchParams.has("signature") && searchParams.has("partnerCode")) {
        verifyEndpoint = `http://localhost:8080/api/payments/verify/momo${location.search}`;
      } else {
        setStatus("failed");
        setMessage("Không tìm thấy thông tin giao dịch hợp lệ.");
        return;
      }

      try {
        const response = await axios.get(verifyEndpoint);
        if (response.status === 200) {
          setStatus("success");
          setMessage("Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.");
          // Clear cart on successful payment
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
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
        <style>{`
          .luxury-result-card {
            border: 1px solid #f0f0f0;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(114,47,55,0.08);
            background: #fff;
            max-width: 500px;
            width: 100%;
          }
          .icon-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          }
          .icon-success {
            background: rgba(40,167,69,0.1);
            color: #28a745;
          }
          .icon-failed {
            background: rgba(220,53,69,0.1);
            color: #dc3545;
          }
          .icon-processing {
            background: rgba(114,47,55,0.1);
            color: #722f37;
          }
          .btn-burgundy {
            background-color: #722f37;
            color: #fff;
            transition: all 0.3s;
          }
          .btn-burgundy:hover {
            background-color: #5c242c;
            color: #fff;
            box-shadow: 0 5px 15px rgba(114,47,55,0.2);
          }
          .btn-outline-gold {
            border: 2px solid #d4af37;
            color: #d4af37;
            transition: all 0.3s;
          }
          .btn-outline-gold:hover {
            background-color: #d4af37;
            color: #fff;
          }
        `}</style>
        
        <div className="container px-3">
          <div className="luxury-result-card mx-auto p-4 p-md-5 text-center">
            {status === "processing" && (
              <div className="py-4">
                <div className="icon-circle icon-processing">
                  <div className="spinner-border" style={{ width: "2.5rem", height: "2.5rem", borderWidth: "3px" }}></div>
                </div>
                <h3 className="fw-bold mb-3" style={{ color: '#1a1a1a' }}>Đang Xử Lý Giao Dịch</h3>
                <p className="text-muted">{message}</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-2">
                <div className="icon-circle icon-success">
                  <i className="fa fa-check" style={{ fontSize: "3rem" }}></i>
                </div>
                <h3 className="fw-bold text-success mb-3">Thanh Toán Thành Công!</h3>
                <p className="text-muted mb-4">{message}</p>
                <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <p className="small text-muted mb-0">Cảm ơn bạn đã tin tưởng WineStore. Chúng tôi sẽ sớm chuẩn bị và giao những chai vang tuyệt hảo đến tay bạn.</p>
                </div>
                <div className="d-flex flex-column gap-3">
                  <Link to="/profile" className="btn btn-burgundy rounded-pill py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Xem Đơn Hàng
                  </Link>
                  <Link to="/" className="btn btn-outline-gold bg-white rounded-pill py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Về Trang Chủ
                  </Link>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="py-2">
                <div className="icon-circle icon-failed">
                  <i className="fa fa-times" style={{ fontSize: "3rem" }}></i>
                </div>
                <h3 className="fw-bold text-danger mb-3">Giao Dịch Thất Bại</h3>
                <p className="text-muted mb-4">{message}</p>
                <div className="d-flex flex-column gap-3">
                  <button onClick={() => navigate(-1)} className="btn btn-burgundy rounded-pill py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Thử Lại Thanh Toán
                  </button>
                  <Link to="/contact" className="btn btn-outline-dark rounded-pill py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Liên Hệ Hỗ Trợ
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentResult;
