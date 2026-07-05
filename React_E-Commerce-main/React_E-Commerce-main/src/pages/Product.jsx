import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from "react-redux";
import { addCart, toggleWishlist } from "../redux/action";
import axios from "axios";
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

import API_BASE_URL from '../config';
const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const wishlist = useSelector((state) => state.handleWishlist);

  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  
  // Trạng thái cho tính năng Zoom (Magnifier)
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop";

  useEffect(() => {
    const getProductData = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/wines/${id}`);
        setProduct(res.data);

        const resFb = await axios.get(`${API_BASE_URL}/api/feedbacks/product?name=${res.data.name}`);
        setFeedbacks(resFb.data);

        const resAll = await axios.get(`${API_BASE_URL}/api/wines`);
        setSimilarProducts(resAll.data.filter(item => item.origin === res.data.origin && item.id !== res.data.id));
      } catch (error) {
        toast.error("Không thể kết nối đến máy chủ!");
      } finally {
        setLoading(false);
      }
    };
    getProductData();
  }, [id]);

  const originalPrice = product.price || 0;
  const discount = product.discountPercent || 0;
  const salePrice = originalPrice * (1 - discount / 100);
  const totalPrice = salePrice * quantity; // Tính tổng tiền theo số lượng
  const hasDiscount = discount > 0;

  const handleAddToCart = (silent = false) => {
    const productToCart = { ...product, price: salePrice }; 
    for (let i = 0; i < quantity; i++) {
      dispatch(addCart(productToCart));
    }
    if(!silent) toast.success(`Đã thêm ${quantity} chai vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart(true);
    navigate("/checkout");
  };

  const handlePostFeedback = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return toast.error("Vui lòng nhập nội dung đánh giá!");
    setSubmitting(true);
    try {
      const fbData = {
        fullName: user?.name || "Khách hàng ẩn danh",
        email: user?.email || "guest@winestore.com",
        subject: product.name,
        message: `[${userRating} SAO] - ${userComment}`
      };
      await axios.post(`${API_BASE_URL}/api/feedbacks`, fbData);
      toast.success("Đánh giá của bạn đã được gửi!");
      setUserComment("");
      const resFb = await axios.get(`${API_BASE_URL}/api/feedbacks/product?name=${product.name}`);
      setFeedbacks(resFb.data);
    } catch (err) {
      toast.error("Lỗi khi gửi đánh giá!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.imageUrl || DEFAULT_IMAGE})`,
      backgroundSize: '250%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-danger" role="status"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <style>{`
          .img-hover-zoom {
            transition: transform 0.4s ease;
          }
          .img-hover-zoom:hover {
            transform: scale(1.05);
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
            background: transparent;
          }
          .btn-outline-gold:hover {
            background-color: #d4af37;
            color: #fff;
          }
          .luxury-card-related {
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.03);
            transition: all 0.3s ease;
          }
          .luxury-card-related:hover {
            box-shadow: 0 10px 25px rgba(114,47,55,0.1);
            transform: translateY(-5px);
          }
        `}</style>
        <div className="row g-5">
          {/* PHẦN HÌNH ẢNH SẢN PHẨM VỚI MAGNIFIER */}
          <div className="col-md-5">
            <div className="position-relative border-0 rounded-4 bg-light p-5 shadow-sm sticky-top d-flex justify-content-center align-items-center" style={{top: "110px", minHeight: '500px'}}>
              {hasDiscount && (
                <div className="position-absolute top-0 start-0 m-3 z-3">
                    <span className="badge px-3 py-2 rounded-pill shadow-sm" style={{ background: '#722f37' }}>
                        <i className="fa fa-bolt me-1 text-warning"></i> GIẢM {discount}%
                    </span>
                </div>
              )}
              <div 
                className="product-image-container w-100 position-relative" 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'crosshair', height: '400px', display: 'flex', justifyContent: 'center' }}
              >
                <img 
                  src={product.imageUrl || DEFAULT_IMAGE} 
                  className="img-fluid" 
                  alt={product.name} 
                  style={{ maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                />
                <div 
                  className="zoom-lens position-absolute shadow-lg border rounded-circle"
                  style={{
                    ...zoomStyle,
                    width: '180px',
                    height: '180px',
                    pointerEvents: 'none',
                    top: '50%',
                    left: '110%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#fff',
                    zIndex: 1000
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* PHẦN CHI TIẾT NGHIỆP VỤ */}
          <div className="col-md-7">
            <div className="ps-md-4">
                <nav className="small mb-3 text-muted fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    {product.brand} <span className="mx-2">•</span> {product.origin}
                </nav>
                <h1 className="fw-bold mb-3 text-dark" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>{product.name}</h1>
                
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div className="me-3" style={{ color: '#d4af37' }}>
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa ${i < 4 ? 'fa-star' : 'fa-star-half-o'}`}></i>
                        ))}
                        <span className="text-muted small ms-2">({feedbacks.length} Đánh giá)</span>
                    </div>
                    <div className="border-start ps-3 text-muted small">
                        Đã bán: <span className="fw-bold text-dark">2.4k</span>
                    </div>
                </div>

                {/* GIÁ CẢ & TỔNG TÍNH */}
                <div className="p-4 rounded-4 mb-4" style={{ background: 'rgba(114,47,55,0.03)', border: '1px solid rgba(114,47,55,0.1)' }}>
                    <div className="d-flex align-items-baseline flex-wrap gap-3">
                        <h2 className="fw-bold mb-0" style={{ color: '#722f37' }}>
                            {salePrice.toLocaleString()} <small className="fs-6">VNĐ</small>
                        </h2>
                        {hasDiscount && (
                            <span className="text-muted text-decoration-line-through">
                                {originalPrice.toLocaleString()} VNĐ
                            </span>
                        )}
                    </div>
                    <div className="mt-2 text-muted small" style={{ fontStyle: 'italic' }}>
                        * Giá đã bao gồm thuế VAT và phí nhập khẩu
                    </div>
                </div>

                {/* THÔNG TIN KHO HÀNG */}
                <div className="mb-4">
                    <div className="d-flex align-items-center p-3 rounded-4 bg-white shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                        <div className={`rounded-circle p-2 me-3 d-flex align-items-center justify-content-center`} 
                             style={{ width: '40px', height: '40px', background: product.stock > 0 ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
                            <i className={`fa ${product.stock > 0 ? 'fa-check' : 'fa-times'}`}></i>
                        </div>
                        <div>
                            <div className="fw-bold text-dark">Tình trạng kho</div>
                            <div className="small text-muted">
                                {product.stock > 0 ? `Còn ${product.stock} chai sẵn sàng giao ngay` : "Hiện đã hết hàng"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* LỰA CHỌN SỐ LƯỢNG & TẠM TÍNH */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ background: '#fff' }}>
                    <div className="row align-items-center g-3">
                        <div className="col-auto">
                            <label className="small fw-bold d-block mb-2 text-muted text-uppercase" style={{ letterSpacing: '1px' }}>SỐ LƯỢNG:</label>
                            <div className="d-flex align-items-center border rounded-pill overflow-hidden" style={{ width: "130px", borderColor: '#e0e0e0' }}>
                                <button className="btn btn-light px-3 border-0 bg-transparent text-dark fw-bold" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</button>
                                <input type="text" className="form-control text-center fw-bold border-0 bg-transparent px-0" value={quantity} readOnly />
                                <button className="btn btn-light px-3 border-0 bg-transparent text-dark fw-bold" onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                        </div>
                        <div className="col text-md-end">
                            <div className="small text-muted mb-1 text-uppercase" style={{ letterSpacing: '1px' }}>Tổng tiền tạm tính:</div>
                            <h3 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>{totalPrice.toLocaleString()} VNĐ</h3>
                        </div>
                    </div>

                    <div className="row g-3 mt-4">
                        <div className="col-12 d-flex gap-2">
                            <button 
                                className="btn rounded-pill d-flex align-items-center justify-content-center"
                                onClick={() => {
                                    dispatch(toggleWishlist(product));
                                    toast.success(wishlist.find(x => x.id === product.id) ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích!");
                                }}
                                style={{ 
                                    width: '50px', height: '50px',
                                    border: '1px solid #e0e0e0', background: '#fff',
                                    color: wishlist?.find(x => x.id === product.id) ? '#722f37' : '#999',
                                    transition: 'all 0.3s'
                                }}
                                title="Yêu thích"
                            >
                                <i className={`fa fs-5 ${wishlist?.find(x => x.id === product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                            </button>
                            <button className="btn btn-outline-gold flex-grow-1 py-3 rounded-pill fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2" 
                                    onClick={() => handleAddToCart()} disabled={product.stock <= 0} style={{ letterSpacing: '1px', fontSize: '14px' }}>
                                <i className="fa fa-cart-plus"></i> THÊM VÀO GIỎ
                            </button>
                        </div>
                        <div className="col-12 mt-2">
                            <button className="btn btn-burgundy btn-lg w-100 py-3 rounded-pill fw-bold text-uppercase shadow-sm" 
                                    onClick={handleBuyNow} disabled={product.stock <= 0} style={{ letterSpacing: '1px', fontSize: '14px' }}>
                                MUA NGAY TẠI NHÀ
                            </button>
                        </div>
                    </div>
                </div>

                {/* CAM KẾT */}
                <div className="row g-3 py-4 border-top mt-2">
                    {[
                        {icon: "fa-shield", text: "Chính hãng 100%"},
                        {icon: "fa-truck", text: "Giao nhanh 2H"},
                        {icon: "fa-certificate", text: "Đầy đủ CO/CQ"},
                        {icon: "fa-headphones", text: "Hỗ trợ 24/7"}
                    ].map((item, idx) => (
                        <div key={idx} className="col-6 col-sm-3 text-center">
                            <div className="mb-2" style={{ color: '#d4af37', fontSize: '1.2rem' }}><i className={`fa ${item.icon}`}></i></div>
                            <div className="small text-muted fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>{item.text}</div>
                        </div>
                    ))}
                </div>

                {/* FOOD PAIRING */}
                {product.foodPairing && (
                    <div className="mt-4 p-4 rounded-4 bg-white shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                        <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: '#722f37', letterSpacing: '0.5px' }}>
                            <i className="fa fa-cutlery me-2"></i> GỢI Ý KẾT HỢP MÓN ĂN
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                            {product.foodPairing.split(',').map((item, index) => {
                                const pairingStr = item.trim();
                                let icon = "fa-utensils";
                                if (pairingStr.toLowerCase().includes("steak") || pairingStr.toLowerCase().includes("thịt đỏ")) icon = "fa-cutlery";
                                else if (pairingStr.toLowerCase().includes("seafood") || pairingStr.toLowerCase().includes("hải sản")) icon = "fa-anchor";
                                else if (pairingStr.toLowerCase().includes("cheese") || pairingStr.toLowerCase().includes("phô mai")) icon = "fa-cube";
                                else if (pairingStr.toLowerCase().includes("dessert") || pairingStr.toLowerCase().includes("ngọt")) icon = "fa-birthday-cake";
                                
                                return (
                                    <span key={index} className="badge rounded-pill px-3 py-2 d-flex align-items-center fw-normal shadow-sm" style={{ background: 'rgba(114,47,55,0.05)', color: '#722f37', border: '1px solid rgba(114,47,55,0.1)' }}>
                                        <i className={`fa ${icon} me-2`} style={{ color: '#d4af37' }}></i> {pairingStr}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* TỔ HỢP TAB THÔNG TIN */}
        <div className="row mt-5">
            <div className="col-12">
                <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0" style={{ border: '1px solid #f0f0f0' }}>
                    <ul className="nav nav-pills mb-4 border-bottom pb-3 gap-2">
                        {[
                            {id: 'description', label: 'MÔ TẢ HƯƠNG VỊ'},
                            {id: 'specs', label: 'THÔNG SỐ CHI TIẾT'},
                            {id: 'reviews', label: `ĐÁNH GIÁ (${feedbacks.length})`}
                        ].map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <button 
                                    className={`nav-link rounded-pill px-4 fw-bold transition-all ${activeTab === tab.id ? 'shadow-sm' : 'text-muted'}`}
                                    style={{ 
                                        background: activeTab === tab.id ? '#722f37' : 'transparent',
                                        color: activeTab === tab.id ? '#fff' : 'inherit',
                                        letterSpacing: '0.5px',
                                        fontSize: '13px'
                                    }}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content min-vh-25">
                        {activeTab === 'description' && (
                            <div className="px-md-3 text-muted" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                                    <div style={{ width: '4px', height: '20px', background: '#d4af37', marginRight: '10px', borderRadius: '2px' }}></div>
                                    Ghi chú từ Sommelier (Chuyên gia rượu)
                                </h5>
                                {product.description}
                            </div>
                        )}
                        {activeTab === 'specs' && (
                            <div className="row g-4 px-md-3">
                                {[
                                    {l: 'Quốc gia', v: product.country || product.origin},
                                    {l: 'Vùng làm rượu', v: product.region || 'Không có thông tin'},
                                    {l: 'Thương hiệu', v: product.brand},
                                    {l: 'Danh mục', v: product.category},
                                    {l: 'Năm thu hoạch', v: product.vintageYear || 'NV'},
                                    {l: 'Giống nho', v: product.grapeVariety || 'Phối trộn (Blend)'},
                                    {l: 'Dung tích', v: product.volume || '750ml'},
                                    {l: 'Nồng độ cồn', v: product.alcoholContent ? `${product.alcoholContent}%` : 'Đang cập nhật'},
                                    {l: 'Độ ngọt', v: product.sweetnessLevel || 'Đang cập nhật'},
                                    {l: 'Nhiệt độ phục vụ', v: product.servingTemperature || '16-18°C'}
                                ].map((spec, i) => (
                                    <div key={i} className="col-md-6 py-3 border-bottom d-flex justify-content-between align-items-center">
                                        <span className="text-muted small text-uppercase" style={{ letterSpacing: '1px' }}>{spec.l}:</span>
                                        <span className="fw-bold text-dark text-end">{spec.v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="px-md-3">
                                <div className="row mb-5 p-4 rounded-4 shadow-sm" style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
                                    <div className="col-md-5 text-center border-end-md d-flex flex-column justify-content-center pe-md-4">
                                        <h1 className="display-3 fw-bold mb-0" style={{ color: '#722f37' }}>
                                            {feedbacks.length > 0 
                                                ? (feedbacks.reduce((acc, fb) => {
                                                    const match = fb.message?.match(/\[(\d+)\s+SAO\]/);
                                                    return acc + (match ? parseInt(match[1]) : 5);
                                                  }, 0) / feedbacks.length).toFixed(1)
                                                : "5.0"}
                                        </h1>
                                        <div className="mb-2 fs-5" style={{ color: '#d4af37' }}>
                                            <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i>
                                        </div>
                                        <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{feedbacks.length} Đánh giá thực tế</div>
                                        
                                        {/* RATING BREAKDOWN */}
                                        <div className="mt-4 text-start">
                                            {[5,4,3,2,1].map(star => {
                                                const count = feedbacks.filter(fb => {
                                                    const match = fb.message?.match(/\[(\d+)\s+SAO\]/);
                                                    return (match ? parseInt(match[1]) : 5) === star;
                                                }).length;
                                                const percent = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
                                                return (
                                                    <div key={star} className="d-flex align-items-center mb-2 small">
                                                        <div className="text-muted me-2" style={{ width: '35px' }}>{star} <i className="fa fa-star text-warning"></i></div>
                                                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                            <div className="progress-bar" style={{ width: `${percent}%`, background: '#722f37' }}></div>
                                                        </div>
                                                        <div className="ms-2 text-muted" style={{ width: '30px', textAlign: 'right' }}>{count}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="col-md-7 ps-md-5 mt-4 mt-md-0">
                                        <h5 className="fw-bold mb-3 text-dark">Gửi đánh giá của bạn</h5>
                                        <div className="p-4 rounded-4" style={{ background: 'rgba(114,47,55,0.03)' }}>
                                            <form onSubmit={handlePostFeedback}>
                                                <div className="mb-3 d-flex align-items-center gap-2">
                                                    <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Đánh giá:</span>
                                                    <div>
                                                        {[1,2,3,4,5].map(s => (
                                                            <i key={s} 
                                                                className={`fa fa-star cursor-pointer ms-1 fs-5 ${userRating >= s ? 'text-warning' : 'text-muted'}`}
                                                                onClick={() => setUserRating(s)}
                                                                style={{cursor: 'pointer', color: userRating >= s ? '#d4af37' : '#e9ecef', transition: 'color 0.2s'}}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea className="form-control rounded-3 mb-3 p-3 bg-white" rows="3" placeholder="Chia sẻ cảm nhận của bạn về hương vị, dịch vụ, giao hàng..." style={{ border: '1px solid #e0e0e0', resize: 'none' }} value={userComment} onChange={(e) => setUserComment(e.target.value)}></textarea>
                                                <button className="btn btn-burgundy rounded-pill px-5 py-2 fw-bold text-uppercase w-100 w-md-auto shadow-sm" style={{ letterSpacing: '1px', fontSize: '13px' }} type="submit" disabled={submitting}>Gửi nhận xét</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* FEEDBACK LIST & SORTING */}
                                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                    <h5 className="fw-bold mb-0 text-dark">Tất cả đánh giá</h5>
                                    <select className="form-select form-select-sm w-auto rounded-pill px-3 shadow-none border" style={{ cursor: 'pointer' }} value={reviewSort} onChange={e => setReviewSort(e.target.value)}>
                                        <option value="newest">Mới nhất</option>
                                        <option value="oldest">Cũ nhất</option>
                                    </select>
                                </div>

                                {feedbacks.length > 0 ? [...feedbacks].sort((a, b) => {
                                    if(reviewSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
                                    return new Date(a.createdAt) - new Date(b.createdAt);
                                }).map(fb => {
                                    const match = fb.message?.match(/\[(\d+)\s+SAO\]/);
                                    const rating = match ? parseInt(match[1]) : 5;
                                    const cleanMessage = fb.message?.replace(/\[\d+\s+SAO\]\s*-\s*/, '');
                                    
                                    return (
                                        <div key={fb.id} className="mb-4 pb-4 border-bottom">
                                            <div className="d-flex justify-content-between mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold shadow-sm" style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #722f37, #a04050)', color: '#fff', fontSize: '18px' }}>
                                                        {fb.fullName ? fb.fullName.charAt(0).toUpperCase() : 'G'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                                            {fb.fullName || 'Khách hàng'}
                                                            <span className="badge rounded-pill bg-success" style={{ fontSize: '9px', padding: '3px 6px' }}><i className="fa fa-check-circle me-1"></i>Đã mua hàng</span>
                                                        </div>
                                                        <div className="small mt-1" style={{ color: '#d4af37' }}>
                                                            {[...Array(5)].map((_, i) => <i key={i} className={`fa ${i < rating ? 'fa-star' : 'fa-star-o'} me-1`}></i>)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="small text-muted">{new Date(fb.createdAt).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                            <div className="ps-5 ms-3 mt-2 text-dark" style={{ lineHeight: '1.6' }}>{cleanMessage}</div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-5">
                                        <div className="mb-3 d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: '60px', height: '60px', background: 'rgba(114,47,55,0.05)' }}>
                                            <i className="fa fa-comment-o fa-2x" style={{ color: '#722f37' }}></i>
                                        </div>
                                        <h6 className="fw-bold text-dark mb-1">Chưa có đánh giá nào</h6>
                                        <p className="text-muted small">Hãy trở thành người đầu tiên đánh giá sản phẩm này.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-5 pt-4 border-top">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '1px' }}>CÓ THỂ BẠN CŨNG THÍCH</h4>
            <Link to="/product" className="fw-bold text-decoration-none small text-uppercase" style={{ color: '#722f37', letterSpacing: '0.5px' }}>Khám phá thêm <i className="fa fa-arrow-right ms-1"></i></Link>
          </div>
          <Marquee pauseOnHover={true} speed={50} gradient={false} className="py-3">
            {similarProducts.map(item => (
              <div key={item.id} className="card mx-3 bg-white luxury-card-related h-100" style={{ width: '260px' }}>
                <div className="p-4 bg-light rounded-top d-flex justify-content-center align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                  <img src={item.imageUrl || DEFAULT_IMAGE} className="card-img-top mx-auto img-hover-zoom" style={{ height: '200px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} alt={item.name} />
                </div>
                <div className="card-body text-center p-4">
                  <h6 className="fw-bold text-truncate mb-2 text-dark">{item.name}</h6>
                  <p className="fw-bold mb-3" style={{ color: '#722f37' }}>{item.price?.toLocaleString()} đ</p>
                  <Link to={`/product/${item.id}`} className="btn btn-outline-dark btn-sm rounded-pill px-4 w-100 py-2 fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Xem chi tiết</Link>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
