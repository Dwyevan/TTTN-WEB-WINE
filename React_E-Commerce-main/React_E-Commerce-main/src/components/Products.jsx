import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addCart, toggleWishlist } from "../redux/action";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(20000000);

  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.handleWishlist);
  const location = useLocation();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/wines");
        setData(res.data || []);
        setFilter(res.data || []);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("search");
    if(searchParam) setSearchQuery(searchParam);
    const catParam = new URLSearchParams(location.search).get("category");
    if(catParam) setSelectedCategory(catParam);
  }, [location.search]);

  // LOGIC LỌC TỔNG HỢP
  useEffect(() => {
    const searchStr = searchQuery.toLowerCase();

    let result = data.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchStr) || (p.brand && p.brand.toLowerCase().includes(searchStr));
      const matchCategory = selectedCategory ? p.category === selectedCategory : true;
      const matchPrice = p.price <= maxPrice;
      const matchOrigin = selectedOrigin ? p.origin === selectedOrigin : true;
      
      const stock = p.stock ?? p.stockQuantity ?? 0;
      let matchAvailability = true;
      if (availability === "in_stock") matchAvailability = stock > 0;
      else if (availability === "out_of_stock") matchAvailability = stock === 0;

      return matchSearch && matchCategory && matchPrice && matchOrigin && matchAvailability;
    });

    if (sortOrder === "price_asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price_desc") {
        result.sort((a, b) => b.price - a.price);
    } else {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilter(result);
  }, [searchQuery, selectedCategory, selectedOrigin, maxPrice, availability, sortOrder, data]);

  const origins = [...new Set(data.map(p => p.origin))].filter(Boolean);
  const categories = [...new Set(data.map(p => p.category))].filter(Boolean);

  return (
    <div className="container my-5 px-3">
      <style>{`
        .wine-card {
          border: 1px solid #f0f0f0;
          border-radius: 16px !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background: #fff;
          overflow: hidden;
        }
        .wine-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(114,47,55,0.12);
          border-color: rgba(212,175,55,0.3);
        }
        .luxury-filter-box {
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
        }
        .luxury-select {
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          padding: 10px 15px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .luxury-select:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
        }
        .custom-range::-webkit-slider-thumb {
          background: #722f37;
        }
        .custom-range::-webkit-slider-thumb:active {
          background: #d4af37;
        }
        .btn-burgundy {
          background-color: #722f37;
          color: #fff;
          transition: all 0.2s ease;
        }
        .btn-burgundy:hover {
          background-color: #5c242c;
          color: #fff;
        }
        .btn-burgundy:disabled {
          background-color: #ccc;
          border-color: #ccc;
        }
      `}</style>
      
      {/* 1. BỘ LỌC CẢI TIẾN */}
      <div className="bg-white p-4 luxury-filter-box mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-3 gap-3">
            <div>
                <h3 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>Khám Phá Rượu Vang</h3>
                <span className="text-muted small">
                    <i className="fa fa-th-large me-2"></i> Hiển thị {filter.length} sản phẩm
                </span>
            </div>
            {/* SEARCH INPUT */}
            <div className="position-relative" style={{ minWidth: '280px' }}>
                <input 
                    type="text" 
                    className="form-control rounded-pill px-4 py-2 pe-5" 
                    placeholder="Tìm kiếm rượu vang..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ border: '1px solid #e0e0e0', boxShadow: 'none' }}
                />
                {searchQuery ? (
                    <i className="fa fa-times position-absolute top-50 translate-middle-y end-0 me-3 text-muted cursor-pointer" 
                       style={{ cursor: 'pointer' }}
                       onClick={() => setSearchQuery("")}></i>
                ) : (
                    <i className="fa fa-search position-absolute top-50 translate-middle-y end-0 me-3 text-muted"></i>
                )}
            </div>
        </div>

        <div className="row g-3 align-items-end">
          {/* Lọc Danh mục */}
          <div className="col-6 col-md-2">
            <label className="small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px', color: '#722f37', fontSize: '11px' }}>Loại rượu</label>
            <select className="form-select luxury-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Tất cả loại</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Lọc Xuất xứ */}
          <div className="col-6 col-md-2">
            <label className="small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px', color: '#722f37', fontSize: '11px' }}>Xuất xứ</label>
            <select className="form-select luxury-select" value={selectedOrigin} onChange={(e) => setSelectedOrigin(e.target.value)}>
              <option value="">Tất cả quốc gia</option>
              {origins.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Availability */}
          <div className="col-6 col-md-2">
            <label className="small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px', color: '#722f37', fontSize: '11px' }}>Trạng thái</label>
            <select className="form-select luxury-select" value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="in_stock">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="col-6 col-md-2">
            <label className="small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px', color: '#722f37', fontSize: '11px' }}>Sắp xếp</label>
            <select className="form-select luxury-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp - Cao</option>
              <option value="price_desc">Giá: Cao - Thấp</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="col-12 col-md-4">
            <div className="d-flex justify-content-between small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px', color: '#722f37', fontSize: '11px' }}>
              <span>Khoảng giá</span>
              <span style={{ color: '#d4af37' }}>Dưới {Number(maxPrice).toLocaleString()} đ</span>
            </div>
            <input 
              type="range" className="form-range custom-range" min="0" max="20000000" step="500000" 
              value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* 2. LƯỚI SẢN PHẨM */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12">
            <LoadingSpinner message="Đang tải bộ sưu tập rượu..." />
          </div>
        ) : (
          filter.map((product) => {
            const stock = product.stock ?? product.stockQuantity ?? 0;
            const minStock = product.minimumStock || 5;
            const isOutOfStock = stock === 0;
            const isLowStock = stock > 0 && stock <= minStock;
            
            return (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="product-item wine-card h-100 d-flex flex-column p-3 position-relative">
                  {/* Nút yêu thích */}
                  <button 
                    onClick={() => {
                        dispatch(toggleWishlist(product));
                        toast.success(wishlist.find(x => x.id === product.id) ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích!");
                    }}
                    className="btn position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ 
                        width: '36px', height: '36px', 
                        background: '#fff', zIndex: 10, border: 'none',
                        color: wishlist.find(x => x.id === product.id) ? '#722f37' : '#ccc'
                    }}
                  >
                    <i className={`fa ${wishlist.find(x => x.id === product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                  </button>
                  {/* Stock Badges */}
                  {isOutOfStock ? (
                    <span className="badge position-absolute top-0 start-0 m-3 z-3" style={{ background: 'rgba(220,53,69,0.9)', color: '#fff', fontSize: '10px' }}>
                      HẾT HÀNG
                    </span>
                  ) : isLowStock ? (
                    <span className="badge position-absolute top-0 start-0 m-3 z-3" style={{ background: 'rgba(241,196,15,0.9)', color: '#000', fontSize: '10px' }}>
                      SẮP HẾT
                    </span>
                  ) : null}

                  {/* Discount Badge */}
                  {product.discountPercent > 0 && (
                    <span className="badge position-absolute top-0 end-0 m-3 z-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #d4af37, #f1c40f)', color: '#1a1a1a', fontSize: '11px', fontWeight: 'bold' }}>
                      -{product.discountPercent}%
                    </span>
                  )}

                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div className="img-container mb-3 bg-white d-flex align-items-center justify-content-center rounded" 
                         style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transition: "transform 0.5s ease" }}
                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </div>
                  </Link>

                  <div className="text-center flex-grow-1 px-1 mt-2">
                    <h6 className="fw-bold mb-2 text-dark" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }} title={product.name}>
                      {product.name}
                    </h6>
                    <div className="text-muted small mb-2 d-flex justify-content-center gap-2">
                      <span><i className="fa fa-globe me-1" style={{ color: '#d4af37' }}></i>{product.origin}</span>
                      <span><i className="fa fa-percent me-1" style={{ color: '#d4af37' }}></i>{product.alcoholContent}%</span>
                    </div>
                    
                    <div className="mb-3">
                      {product.discountPercent > 0 ? (
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-muted text-decoration-line-through small">{product.price?.toLocaleString()} đ</span>
                          <span className="fw-bold fs-5" style={{ color: '#722f37' }}>
                            {((product.price * (100 - product.discountPercent)) / 100).toLocaleString()} đ
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold fs-5" style={{ color: '#722f37' }}>{product.price?.toLocaleString()} đ</span>
                      )}
                    </div>
                  </div>

                  <button 
                    className="btn btn-burgundy w-100 mt-auto py-2 fw-bold text-uppercase"
                    style={{ fontSize: '12px', letterSpacing: '1px', borderRadius: '8px' }}
                    onClick={() => { dispatch(addCart(product)); toast.success("Đã thêm vào giỏ hàng!"); }}
                    disabled={isOutOfStock}
                  >
                    <i className="fa fa-cart-plus me-2"></i> {isOutOfStock ? "Tạm Hết Hàng" : "Thêm Vào Giỏ"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. NẾU KHÔNG CÓ SẢN PHẨM */}
      {!loading && filter.length === 0 && (
        <div className="mt-4">
          <EmptyState 
            title="Không tìm thấy chai rượu nào" 
            message="Rất tiếc, không tìm thấy sản phẩm khớp với bộ lọc. Vui lòng thử lại." 
            icon="fa-wine-bottle"
          />
          <div className="text-center mt-3">
            <button className="btn btn-outline-dark px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => {
              setMaxPrice(20000000);
              setSelectedOrigin("");
              setSelectedCategory("");
              setAvailability("all");
              setSortOrder("newest");
              setSearchQuery("");
            }}>
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;