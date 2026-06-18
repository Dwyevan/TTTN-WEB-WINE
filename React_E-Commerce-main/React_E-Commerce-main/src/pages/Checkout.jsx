import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  
  // Sửa lỗi: Lấy user từ localStorage vì Login.jsx lưu vào localStorage chứ không dispatch vào Redux
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "COD",
    note: ""
  });

  const [shippingConfig, setShippingConfig] = useState({
    SHIPPING_THRESHOLD: 2000000,
    SHIPPING_FEE: 35000
  });

  useEffect(() => {
    if (user) {
      const names = user.fullName ? user.fullName.split(" ") : ["", ""];
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      }));
    }

    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/settings");
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const subtotal = state.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > shippingConfig.SHIPPING_THRESHOLD ? 0 : shippingConfig.SHIPPING_FEE;
  const totalAmount = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10,11}$/.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Hệ thống đang xử lý đơn hàng...");

    const orderPayload = {
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      address: formData.address,
      phone: formData.phone,
      totalAmount: totalAmount,
      note: formData.note,
      status: "PENDING",
      userId: user ? user.id : null,
      items: state.map(item => ({
        name: item.title || item.name,
        quantity: item.qty,
        price: item.price,
        wineId: item.id
      }))
    };

    try {
      // 1. Tạo đơn hàng với trạng thái PENDING
      const response = await axios.post('http://localhost:8080/api/orders', orderPayload);
      
      if (response.status === 201 || response.status === 200) {
        const orderId = response.data.id;
        
        // 2. Nếu thanh toán VNPAY hoặc MOMO, gọi API tạo URL
        if (formData.paymentMethod === 'VNPAY' || formData.paymentMethod === 'MOMO') {
          toast.dismiss(loadingToast);
          toast.loading(`Đang chuyển hướng đến ${formData.paymentMethod}...`);
          
          const paymentRes = await axios.post(`http://localhost:8080/api/payments/create`, {
            orderId: orderId,
            paymentMethod: formData.paymentMethod
          });
          
          if (paymentRes.data && paymentRes.data.url) {
            // Chuyển hướng người dùng tới cổng thanh toán
            window.location.href = paymentRes.data.url;
            return;
          }
        }
        
        // Nếu là COD
        toast.dismiss(loadingToast);
        toast.success("Đặt hàng thành công!");
        dispatch({ type: "EMPTY_CART" });
        navigate("/history");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      let errorMsg = "Đặt hàng thất bại!";
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }
      
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container my-5 py-5 text-center">
          <h4 className="text-muted">Bạn không có sản phẩm nào để thanh toán.</h4>
          <Link to="/" className="btn btn-dark mt-3 rounded-pill">Quay lại mua sắm</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-light min-vh-100 pb-5">
        <style>{`
          .luxury-card {
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.03);
          }
          .luxury-input {
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            padding: 12px 15px;
            background-color: #fdfdfd;
            transition: all 0.3s;
          }
          .luxury-input:focus {
            background-color: #fff;
            border-color: #d4af37;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
            outline: none;
          }
          .step-indicator {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #722f37, #5c242c);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(114,47,55,0.2);
          }
          .payment-card {
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            transition: all 0.3s;
            background: #fff;
            cursor: pointer;
            height: 100%;
          }
          .payment-card:hover {
            border-color: #d4af37;
            background: #fdfbf7;
          }
          .payment-card.active {
            border-color: #722f37;
            background: rgba(114,47,55,0.03);
            box-shadow: 0 5px 15px rgba(114,47,55,0.08);
          }
          .payment-card.active .fa {
            color: #722f37 !important;
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
        `}</style>

        <div className="bg-white border-bottom mb-5">
          <div className="container py-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small fw-bold">
                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang Chủ</Link></li>
                <li className="breadcrumb-item"><Link to="/cart" className="text-decoration-none text-muted">Giỏ Hàng</Link></li>
                <li className="breadcrumb-item active" style={{ color: '#722f37' }}>Thanh Toán</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          <div className="row g-5">
            {/* BÊN TRÁI: FORM THÔNG TIN */}
            <div className="col-lg-8">
              <div className="card luxury-card p-4 p-md-5 bg-white mb-4">
                <form onSubmit={handleSubmit}>
                  {/* BƯỚC 1 */}
                  <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                    <div className="step-indicator me-3">1</div>
                    <h4 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>Thông tin nhận hàng</h4>
                  </div>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px', color: '#722f37' }}>Họ & tên đệm</label>
                      <input type="text" className="form-control luxury-input" id="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="VD: Nguyễn Văn" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px', color: '#722f37' }}>Tên</label>
                      <input type="text" className="form-control luxury-input" id="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="VD: A" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px', color: '#722f37' }}>Email liên hệ</label>
                      <input type="email" className="form-control luxury-input" id="email" value={formData.email} onChange={handleInputChange} required placeholder="email@example.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px', color: '#722f37' }}>Số điện thoại</label>
                      <input type="tel" className="form-control luxury-input" id="phone" value={formData.phone} onChange={handleInputChange} required placeholder="09xxxxxxx" />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px', color: '#722f37' }}>Địa chỉ giao hàng chi tiết</label>
                      <input type="text" className="form-control luxury-input" id="address" value={formData.address} onChange={handleInputChange} required placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px', color: '#722f37' }}>Ghi chú đơn hàng (Tùy chọn)</label>
                      <textarea className="form-control luxury-input" id="note" rows="3" value={formData.note} onChange={handleInputChange} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."></textarea>
                    </div>
                  </div>

                  {/* BƯỚC 2 */}
                  <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                    <div className="step-indicator me-3">2</div>
                    <h4 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>Phương thức thanh toán</h4>
                  </div>

                  <div className="row g-3 mb-5">
                    <div className="col-md-4">
                      <div className={`payment-card ${formData.paymentMethod === 'COD' ? 'active' : ''}`} 
                           onClick={() => setFormData({...formData, paymentMethod: 'COD'})}>
                        <div className="p-3 d-flex flex-column align-items-center text-center">
                          <div className="d-flex justify-content-center align-items-center rounded-circle mb-3" style={{ width: '48px', height: '48px', background: formData.paymentMethod === 'COD' ? 'rgba(114,47,55,0.1)' : '#f8f9fa' }}>
                            <i className={`fa fa-truck fs-4 ${formData.paymentMethod === 'COD' ? '' : 'text-muted'}`}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>Tiền mặt</h6>
                            <small className="text-muted">Thanh toán khi nhận hàng (COD)</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className={`payment-card ${formData.paymentMethod === 'VNPAY' ? 'active' : ''}`} 
                           onClick={() => setFormData({...formData, paymentMethod: 'VNPAY'})}>
                        <div className="p-3 d-flex flex-column align-items-center text-center">
                          <div className="d-flex justify-content-center align-items-center rounded-circle mb-3" style={{ width: '48px', height: '48px', background: formData.paymentMethod === 'VNPAY' ? 'rgba(114,47,55,0.1)' : '#f8f9fa' }}>
                            <i className={`fa fa-credit-card fs-4 ${formData.paymentMethod === 'VNPAY' ? '' : 'text-muted'}`}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>VNPay</h6>
                            <small className="text-muted">Quét mã QR, Thẻ ATM/Visa</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className={`payment-card ${formData.paymentMethod === 'MOMO' ? 'active' : ''}`} 
                           onClick={() => setFormData({...formData, paymentMethod: 'MOMO'})}>
                        <div className="p-3 d-flex flex-column align-items-center text-center">
                          <div className="d-flex justify-content-center align-items-center rounded-circle mb-3" style={{ width: '48px', height: '48px', background: formData.paymentMethod === 'MOMO' ? 'rgba(114,47,55,0.1)' : '#f8f9fa' }}>
                            <i className={`fa fa-wallet fs-4 ${formData.paymentMethod === 'MOMO' ? '' : 'text-muted'}`} style={{ color: formData.paymentMethod === 'MOMO' ? '#a50064' : '' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>Ví MoMo</h6>
                            <small className="text-muted">Thanh toán qua Ví MoMo</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-burgundy btn-lg w-100 py-3 rounded-pill fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2" style={{ letterSpacing: '1px' }} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><span className="spinner-border spinner-border-sm"></span> Đang xử lý...</>
                    ) : (
                        <><i className="fa fa-lock"></i> XÁC NHẬN THANH TOÁN</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className="col-lg-4">
              <div className="card luxury-card overflow-hidden sticky-top bg-white" style={{top: '100px'}}>
                <div className="card-header bg-white p-4 border-bottom">
                  <h5 className="mb-0 fw-bold" style={{ color: '#1a1a1a' }}>Đơn hàng của bạn</h5>
                </div>
                <div className="card-body p-4">
                  <div className="order-items mb-4 pe-2" style={{maxHeight: '350px', overflowY: 'auto'}}>
                    {state.map((item) => (
                      <div key={item.id} className="d-flex align-items-center mb-4">
                        <div className="bg-light rounded-3 p-2 me-3 position-relative border" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={item.imageUrl} alt={item.name} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply'}} />
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle" style={{ background: '#722f37', border: '2px solid #fff', fontSize: '11px' }}>
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-grow-1 overflow-hidden pe-2">
                          <h6 className="small fw-bold mb-1 text-truncate" style={{ color: '#1a1a1a' }}>{item.name}</h6>
                          <small className="text-muted">{(item.price).toLocaleString()} đ</small>
                        </div>
                        <div className="fw-bold small" style={{ color: '#722f37' }}>{(item.price * item.qty).toLocaleString()} đ</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-top pt-4">
                    <div className="d-flex justify-content-between mb-2 text-muted">
                      <span>Tạm tính</span>
                      <span className="fw-bold text-dark">{subtotal.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-muted">
                      <span>Phí giao hàng</span>
                      <span className={shipping === 0 ? "fw-bold" : "fw-bold text-dark"} style={{ color: shipping === 0 ? '#28a745' : '' }}>
                        {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()} đ`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mt-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <span className="fw-bold text-uppercase" style={{ color: '#1a1a1a', letterSpacing: '1px' }}>Tổng Cộng</span>
                      <span className="fw-bold fs-4" style={{ color: '#722f37' }}>{totalAmount.toLocaleString()} đ</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center gap-2 mb-2 small fw-bold" style={{ color: '#28a745' }}>
                      <i className="fa fa-shield-alt"></i> Cam kết bảo mật thông tin 100%
                    </div>
                    <div className="d-flex align-items-center gap-2 small fw-bold" style={{ color: '#28a745' }}>
                      <i className="fa fa-undo"></i> Đổi trả dễ dàng trong 7 ngày
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;