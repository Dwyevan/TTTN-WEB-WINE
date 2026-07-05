import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";

import API_BASE_URL from '../config';
const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const [shippingConfig, setShippingConfig] = useState({
    SHIPPING_THRESHOLD: 2000000,
    SHIPPING_FEE: 35000
  });

  useEffect(() => {
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
  }, []);

  const SHIPPING_THRESHOLD = shippingConfig.SHIPPING_THRESHOLD;
  const SHIPPING_FEE = shippingConfig.SHIPPING_FEE;

  // Nghiệp vụ: Tăng số lượng có kiểm tra kho (Stock)
  const handleIncrement = (item) => {
    if (item.stock && item.qty >= item.stock) {
      toast.error(`Rất tiếc, kho hàng chỉ còn ${item.stock} chai này!`, {
        icon: '⚠️',
      });
      return;
    }
    dispatch(addCart(item));
  };

  // Nghiệp vụ: Giảm số lượng
  const handleDecrement = (item) => {
    dispatch(delCart(item));
  };

  const EmptyCart = () => (
    <div className="container my-5 py-5">
      <div className="text-center shadow-sm bg-white rounded-4 p-5 mx-auto" style={{ maxWidth: '600px', border: '1px solid #f0f0f0' }}>
        <div className="mb-4 d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: '120px', height: '120px', background: 'rgba(114,47,55,0.05)' }}>
            <i className="fa fa-shopping-bag fa-4x" style={{ color: '#722f37' }}></i>
        </div>
        <h3 className="fw-bold mb-3" style={{ color: '#1a1a1a' }}>Giỏ hàng trống</h3>
        <p className="text-muted fs-6 mb-5 px-md-4">Những chai vang thượng hạng đang chờ đợi bạn. Hãy thêm sản phẩm vào giỏ hàng để bắt đầu trải nghiệm ngay hôm nay.</p>
        <Link to="/product" className="btn btn-lg px-5 py-3 rounded-pill fw-bold text-white shadow-sm" style={{ backgroundColor: '#722f37', transition: 'all 0.3s' }}>
          KHÁM PHÁ CỬA HÀNG
        </Link>
      </div>
    </div>
  );

  const ShowCart = () => {
    let subtotal = 0;
    let totalDiscount = 0;

    state.forEach((item) => {
      subtotal += item.price * item.qty;
      // Tính toán tiền tiết kiệm được (nếu có lưu originalPrice ở Reducer)
      if (item.originalPrice > item.price) {
        totalDiscount += (item.originalPrice - item.price) * item.qty;
      }
    });

    const isFreeShipping = subtotal >= SHIPPING_THRESHOLD;
    const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
    const progress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

    return (
      <div className="container py-5">
        <style>{`
          .luxury-card {
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.03);
          }
          .cart-item-row:not(:last-child) {
            border-bottom: 1px solid #f8f9fa;
          }
          .qty-btn {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px !important;
            border: 1px solid #e0e0e0;
            background: #fff;
            color: #333;
            transition: all 0.2s;
          }
          .qty-btn:hover {
            border-color: #d4af37;
            color: #d4af37;
            background: #fdfbf7;
          }
          .qty-input {
            width: 40px;
            text-align: center;
            border: none;
            background: transparent;
            font-weight: bold;
            color: #1a1a1a;
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

        <div className="row g-4">
          {/* CỘT DANH SÁCH SẢN PHẨM */}
          <div className="col-lg-8">
            <div className="card luxury-card overflow-hidden bg-white">
              <div className="card-header bg-white py-4 px-4 border-bottom">
                <h5 className="mb-0 fw-bold" style={{ color: '#1a1a1a' }}>
                  Giỏ hàng của bạn <span className="text-muted fw-normal fs-6">({state.length} sản phẩm)</span>
                </h5>
              </div>
              <div className="card-body p-0">
                {state.map((item) => (
                  <div key={item.id} className="p-4 cart-item-row">
                    <div className="row align-items-center g-3">
                      {/* Ảnh */}
                      <div className="col-4 col-md-2 text-center">
                        <div className="bg-light rounded-3 p-2 d-inline-block">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            style={{ height: "100px", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
                          />
                        </div>
                      </div>
                      
                      {/* Thông tin */}
                      <div className="col-8 col-md-4">
                        <h6 className="fw-bold mb-2" style={{ color: '#1a1a1a', lineHeight: '1.4' }}>{item.name}</h6>
                        <div className="small text-muted mb-2 d-flex flex-wrap gap-2">
                          <span><i className="fa fa-map-marker-alt me-1" style={{ color: '#d4af37' }}></i>{item.origin}</span>
                          <span><i className="fa fa-percent me-1" style={{ color: '#d4af37' }}></i>{item.alcoholContent}%</span>
                        </div>
                        {item.discountPercent > 0 && (
                          <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(114,47,55,0.1)', color: '#722f37', border: '1px solid rgba(114,47,55,0.2)' }}>
                            Giảm {item.discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Số lượng */}
                      <div className="col-6 col-md-3 mt-3 mt-md-0 d-flex flex-column align-items-start align-items-md-center">
                        <label className="small text-muted fw-bold mb-2 d-md-none">Số lượng:</label>
                        <div className="d-flex align-items-center gap-1 bg-light p-1 rounded-3 border">
                          <button className="qty-btn" onClick={() => handleDecrement(item)}>
                            <i className="fa fa-minus small"></i>
                          </button>
                          <input type="text" className="qty-input" value={item.qty} readOnly />
                          <button className="qty-btn" onClick={() => handleIncrement(item)}>
                            <i className="fa fa-plus small"></i>
                          </button>
                        </div>
                        <span className="small text-muted mt-2" style={{ fontSize: '11px' }}>Kho: {item.stock || 0}</span>
                      </div>

                      {/* Giá */}
                      <div className="col-6 col-md-3 text-end mt-3 mt-md-0">
                        <h5 className="fw-bold mb-1" style={{ color: '#722f37' }}>{(item.price * item.qty).toLocaleString()} đ</h5>
                        {item.originalPrice > item.price && (
                          <small className="text-muted text-decoration-line-through">
                            {(item.originalPrice * item.qty).toLocaleString()} đ
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TỔNG KẾT ĐƠN HÀNG */}
          <div className="col-lg-4 align-self-start">
            <div className="card luxury-card sticky-top bg-white" style={{ top: "100px", zIndex: 1 }}>
              <div className="card-body p-4 p-lg-5">
                <h5 className="fw-bold mb-4 border-bottom pb-3" style={{ color: '#1a1a1a' }}>Hóa đơn chi tiết</h5>
                
                {/* Progress bar miễn phí vận chuyển */}
                <div className="mb-4 bg-light p-3 rounded-3 border">
                   <div className="d-flex justify-content-between mb-2 small">
                      <span className="fw-bold text-dark">{isFreeShipping ? "🎉 Miễn phí giao hàng!" : `Mua thêm ${(SHIPPING_THRESHOLD - subtotal).toLocaleString()}đ để Freeship`}</span>
                   </div>
                   <div className="progress rounded-pill bg-white border" style={{ height: "8px" }}>
                      <div className="progress-bar rounded-pill" role="progressbar" style={{ width: `${progress}%`, backgroundColor: isFreeShipping ? '#28a745' : '#d4af37' }}></div>
                   </div>
                </div>

                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Tạm tính:</span>
                  <span className="fw-bold text-dark">{subtotal.toLocaleString()} đ</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Phí vận chuyển:</span>
                  <span className={isFreeShipping ? "fw-bold" : "fw-bold text-dark"} style={{ color: isFreeShipping ? '#28a745' : '' }}>
                    {isFreeShipping ? "Miễn phí" : SHIPPING_FEE.toLocaleString() + " đ"}
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-3 small" style={{ color: '#d4af37' }}>
                    <span className="fw-bold">Khuyến mãi:</span>
                    <span className="fw-bold">-{totalDiscount.toLocaleString()} đ</span>
                  </div>
                )}

                <hr className="my-4 border-light" />

                <div className="d-flex justify-content-between align-items-end mb-4">
                  <span className="fw-bold fs-5 text-dark">Tổng tiền:</span>
                  <div className="text-end">
                    <h3 className="fw-bold mb-0" style={{ color: '#722f37' }}>{(subtotal + shipping).toLocaleString()} đ</h3>
                    <small className="text-muted" style={{ fontSize: '11px' }}>(Đã bao gồm VAT)</small>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <Link to="/checkout" className="btn btn-burgundy w-100 py-3 rounded-pill fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                     Thanh Toán Ngay
                  </Link>
                  <Link to="/product" className="btn btn-outline-gold bg-white w-100 py-3 rounded-pill fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                     Mua Thêm Rượu
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-top text-center">
                  <div className="d-flex justify-content-center align-items-center gap-2 mb-3 text-muted small">
                    <i className="fa fa-lock"></i>
                    <span>Thanh toán bảo mật 100%</span>
                  </div>
                  <div className="d-flex justify-content-center gap-3 opacity-50">
                    <i className="fa fa-cc-visa fa-2x"></i>
                    <i className="fa fa-cc-mastercard fa-2x"></i>
                    <i className="fa fa-money fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="bg-light min-vh-100 pb-5">
        <div className="bg-white border-bottom mb-4">
          <div className="container py-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small fw-bold">
                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang Chủ</Link></li>
                <li className="breadcrumb-item active" style={{ color: '#722f37' }}>Giỏ Hàng Của Bạn</li>
              </ol>
            </nav>
          </div>
        </div>
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;