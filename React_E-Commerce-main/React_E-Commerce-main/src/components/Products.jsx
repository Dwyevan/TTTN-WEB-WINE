import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addCart, toggleWishlist } from "../redux/action";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const Products = ({ isHome = false }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [alcoholLevel, setAlcoholLevel] = useState("all");

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
      const matchOrigin = selectedOrigin ? p.origin === selectedOrigin : true;
      const matchBrand = selectedBrand ? p.brand === selectedBrand : true;
      
      let matchPrice = true;
      if (priceRange === "under_1m") matchPrice = p.price < 1000000;
      else if (priceRange === "1m_to_5m") matchPrice = p.price >= 1000000 && p.price <= 5000000;
      else if (priceRange === "5m_to_10m") matchPrice = p.price > 5000000 && p.price <= 10000000;
      else if (priceRange === "over_10m") matchPrice = p.price > 10000000;

      let matchAlcohol = true;
      const alcohol = p.alcoholContent || 0;
      if (alcoholLevel === "light") matchAlcohol = alcohol > 0 && alcohol < 12.5;
      else if (alcoholLevel === "medium") matchAlcohol = alcohol >= 12.5 && alcohol <= 14;
      else if (alcoholLevel === "strong") matchAlcohol = alcohol > 14;

      const stock = p.stock ?? p.stockQuantity ?? 0;
      let matchAvailability = true;
      if (availability === "in_stock") matchAvailability = stock > 0;
      else if (availability === "out_of_stock") matchAvailability = stock === 0;

      return matchSearch && matchCategory && matchPrice && matchOrigin && matchBrand && matchAvailability && matchAlcohol;
    });

    if (sortOrder === "price_asc") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price_desc") {
        result.sort((a, b) => b.price - a.price);
    } else {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilter(result);
  }, [searchQuery, selectedCategory, selectedOrigin, selectedBrand, priceRange, availability, sortOrder, alcoholLevel, data]);

  const origins = [...new Set(data.map(p => p.origin))].filter(Boolean);
  const categories = [...new Set(data.map(p => p.category))].filter(Boolean);
  const brands = [...new Set(data.map(p => p.brand))].filter(Boolean);

  const clearAllFilters = () => {
      setSearchQuery("");
      setSelectedCategory("");
      setSelectedOrigin("");
      setSelectedBrand("");
      setPriceRange("all");
      setAlcoholLevel("all");
      setAvailability("all");
      setSortOrder("newest");
  };

  const renderProductCard = (product, colClasses) => {
    const stock = product.stock ?? product.stockQuantity ?? 0;
    const minStock = product.minimumStock || 5;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock <= minStock;
    
    return (
      <div key={product.id} className={colClasses}>
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
            <span className="badge position-absolute top-0 end-0 m-3 z-3 shadow-sm" style={{ background: 'linear-gradient(135deg, #d4af37, #f1c40f)', color: '#1a1a1a', fontSize: '11px', fontWeight: 'bold', marginTop: '50px !important' }}>
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
            <div className="text-muted small mb-2 d-flex justify-content-center flex-wrap gap-2">
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
  };

  if (isHome) {
      return (
          <div className="container my-5 px-3">
              <style>{`
                .wine-card { border: 1px solid #f0f0f0; border-radius: 16px !important; transition: all 0.3s; background: #fff; overflow: hidden; }
                .wine-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(114,47,55,0.12); border-color: rgba(212,175,55,0.3); }
                .btn-burgundy { background-color: #722f37; color: #fff; transition: all 0.2s ease; }
                .btn-burgundy:hover { background-color: #5c242c; color: #fff; }
                .btn-burgundy:disabled { background-color: #ccc; border-color: #ccc; }
              `}</style>
              <div className="text-center mb-5">
                 <h2 className="fw-bold mb-3" style={{ color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '2px' }}>Sản Phẩm Nổi Bật</h2>
                 <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Khám phá những chai vang đẳng cấp được yêu thích nhất từ bộ sưu tập của chúng tôi.</p>
                 <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '20px auto' }}></div>
              </div>
              <div className="row g-4">
                  {loading ? (
                      <div className="col-12"><LoadingSpinner message="Đang tải bộ sưu tập rượu..." /></div>
                  ) : (
                      filter.slice(0, 8).map(product => renderProductCard(product, "col-12 col-sm-6 col-md-4 col-lg-3"))
                  )}
              </div>
              <div className="text-center mt-5">
                 <Link to="/product" className="btn px-4 py-2 fw-bold text-uppercase shadow-sm" style={{ borderRadius: '30px', letterSpacing: '1px', border: '2px solid #722f37', color: '#722f37' }} onMouseOver={e => { e.currentTarget.style.background = '#722f37'; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#722f37'; }}>
                    Xem Tất Cả Sản Phẩm <i className="fa fa-arrow-right ms-2"></i>
                 </Link>
              </div>
          </div>
      );
  }

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
      
      <div className="row g-4">
        {/* 1. SIDEBAR BỘ LỌC (CỘT TRÁI) */}
        <div className="col-12 col-lg-3">
          <div className="bg-white p-4 rounded-4 shadow-sm position-sticky" style={{ border: '1px solid #f0f0f0', top: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h5 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>
                  <i className="fa fa-filter me-2" style={{ color: '#722f37' }}></i>Lọc Sản Phẩm
              </h5>
              {(searchQuery || selectedCategory || selectedOrigin || selectedBrand || priceRange !== 'all' || availability !== 'all' || alcoholLevel !== 'all') && (
                  <button onClick={clearAllFilters} className="btn btn-sm btn-link text-danger text-decoration-none p-0 fw-bold small">
                      Xóa bộ lọc
                  </button>
              )}
            </div>

            {/* Tìm kiếm */}
            <div className="mb-4">
                <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-search me-1"></i> Tìm kiếm</label>
                <div className="position-relative">
                    <input 
                        type="text" 
                        className="form-control rounded-3 py-2 pe-4 bg-light border-0" 
                        placeholder="Tên hoặc thương hiệu..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <i className="fa fa-times position-absolute top-50 translate-middle-y end-0 me-3 text-muted cursor-pointer" 
                           onClick={() => setSearchQuery("")} style={{ cursor: 'pointer' }}></i>
                    )}
                </div>
            </div>

            {/* Loại rượu */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-glass me-1"></i> Loại rượu</label>
              <select className="form-select bg-light border-0 rounded-3" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Tất cả</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Mức giá */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-money me-1"></i> Mức giá</label>
              <div className="d-flex flex-column gap-2">
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under_1m', label: 'Dưới 1 triệu' },
                  { id: '1m_to_5m', label: 'Từ 1 - 5 triệu' },
                  { id: '5m_to_10m', label: 'Từ 5 - 10 triệu' },
                  { id: 'over_10m', label: 'Trên 10 triệu' }
                ].map((item) => (
                  <div className="form-check" key={item.id}>
                    <input className="form-check-input" type="radio" name="priceRange" id={`price_${item.id}`} value={item.id} checked={priceRange === item.id} onChange={(e) => setPriceRange(e.target.value)} style={{ accentColor: '#722f37' }} />
                    <label className="form-check-label small" htmlFor={`price_${item.id}`}>{item.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Nồng độ cồn */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-fire me-1"></i> Nồng độ cồn</label>
              <div className="d-flex flex-column gap-2">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'light', label: 'Nhẹ (Dưới 12.5%)' },
                  { id: 'medium', label: 'Vừa (12.5% - 14%)' },
                  { id: 'strong', label: 'Mạnh (Trên 14%)' }
                ].map((item) => (
                  <div className="form-check" key={item.id}>
                    <input className="form-check-input" type="radio" name="alcoholLevel" id={`alc_${item.id}`} value={item.id} checked={alcoholLevel === item.id} onChange={(e) => setAlcoholLevel(e.target.value)} style={{ accentColor: '#722f37' }} />
                    <label className="form-check-label small" htmlFor={`alc_${item.id}`}>{item.label}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Xuất xứ */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-globe me-1"></i> Quốc gia</label>
              <select className="form-select bg-light border-0 rounded-3" value={selectedOrigin} onChange={(e) => setSelectedOrigin(e.target.value)}>
                <option value="">Tất cả</option>
                {origins.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Thương hiệu */}
            <div className="mb-4">
              <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-tag me-1"></i> Thương hiệu</label>
              <select className="form-select bg-light border-0 rounded-3" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">Tất cả</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="mb-0">
              <label className="fw-bold small text-uppercase text-muted mb-2"><i className="fa fa-check-circle me-1"></i> Trạng thái</label>
              <select className="form-select bg-light border-0 rounded-3" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. KHU VỰC HIỂN THỊ SẢN PHẨM (CỘT PHẢI) */}
        <div className="col-12 col-lg-9">
          {/* Top Bar Sort & Count */}
          <div className="bg-white p-3 rounded-4 shadow-sm mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-center" style={{ border: '1px solid #f0f0f0' }}>
            <div className="mb-3 mb-sm-0 text-center text-sm-start">
              <h4 className="fw-bold mb-1" style={{ color: '#1a1a1a', letterSpacing: '-0.5px' }}>Khám Phá Rượu Vang</h4>
              <span className="text-muted small fw-bold">
                  Hiển thị <span style={{ color: '#722f37', fontSize: '14px' }}>{filter.length}</span> sản phẩm
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span className="small fw-bold text-muted me-3 text-nowrap"><i className="fa fa-sort me-1"></i> Sắp xếp:</span>
              <select className="form-select bg-light border-0 rounded-pill fw-semibold" style={{ width: '200px' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp - Cao</option>
                <option value="price_desc">Giá: Cao - Thấp</option>
              </select>
            </div>
          </div>

          {/* Grid Sản Phẩm */}
          <div className="row g-4">
            {loading ? (
              <div className="col-12">
                <LoadingSpinner message="Đang tải bộ sưu tập rượu..." />
              </div>
            ) : filter.length === 0 ? (
              <div className="col-12 mt-4">
                <EmptyState 
                  title="Không tìm thấy chai rượu nào" 
                  message="Rất tiếc, không tìm thấy sản phẩm khớp với bộ lọc của bạn bên trái." 
                  icon="fa-wine-bottle"
                />
              </div>
            ) : (
              filter.map(product => renderProductCard(product, "col-12 col-sm-6 col-md-4"))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;