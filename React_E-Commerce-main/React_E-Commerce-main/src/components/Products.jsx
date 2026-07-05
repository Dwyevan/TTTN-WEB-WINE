import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addCart, toggleWishlist } from "../redux/action";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import API_BASE_URL from '../config';

import Pagination from "./Pagination";

const Products = ({ isHome = false }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [alcoholLevel, setAlcoholLevel] = useState("all");
  const [pairingContext, setPairingContext] = useState(null);

  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.handleWishlist);
  const location = useLocation();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/wines`);
        setData(res.data || []);
        setFilter(res.data || []);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    
    const getCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
        setDbCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };

    getProducts();
    getCategories();
  }, []);

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("search");
    if(searchParam) setSearchQuery(searchParam);
    const catParam = new URLSearchParams(location.search).get("category");
    if(catParam) setSelectedCategory(catParam);
    const pairParam = new URLSearchParams(location.search).get("pairing");
    if(pairParam) setPairingContext(pairParam);
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
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, selectedCategory, selectedOrigin, selectedBrand, priceRange, availability, sortOrder, alcoholLevel, data]);

  const buildCategoryTree = (cats, parentId = null, level = 0) => {
    let result = [];
    const children = cats.filter(c => (c.parentId || null) === parentId);
    for (let child of children) {
      result.push({ ...child, level });
      result = result.concat(buildCategoryTree(cats, child.id, level + 1));
    }
    return result;
  };

  const origins = [...new Set(data.map(p => p.origin))].filter(Boolean);
  const categoriesList = dbCategories.length > 0 ? buildCategoryTree(dbCategories) : [];
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

  
  const renderProductCard = (product, colClass) => {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= (product.minimumStock || 5);
    const hasDiscount = product.discountPercent > 0;
    
    return (
      <div className={colClass} key={product.id}>
        <div className="card luxury-card h-100 rounded-4 overflow-hidden position-relative p-3">
          <button className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
            style={{ width: '38px', height: '38px', background: '#fff', zIndex: 10, border: 'none', color: wishlist.find(x=>x.id===product.id) ? '#d4af37' : '#ccc' }}
            onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist(product)); }}
          >
            <i className={`fa ${wishlist.find(x=>x.id===product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
          </button>
          
          {hasDiscount && (
            <span className="badge position-absolute top-0 start-0 m-3 z-3 shadow-sm px-2 py-1" style={{ background: '#d4af37', color: '#fff', letterSpacing: '1px' }}>
              -{product.discountPercent}%
            </span>
          )}
          {isOutOfStock ? (
             <span className="badge position-absolute top-0 start-0 m-3 z-3 px-2 py-1" style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', marginTop: hasDiscount ? '45px !important' : '1rem !important' }}>HẾT HÀNG</span>
          ) : isLowStock ? (
             <span className="badge position-absolute top-0 start-0 m-3 z-3 px-2 py-1" style={{ background: 'rgba(212,175,55,0.9)', color: '#fff', marginTop: hasDiscount ? '45px !important' : '1rem !important' }}>SẮP HẾT</span>
          ) : null}

          <Link to={`/product/${product.id}`} className="text-decoration-none text-center d-block mb-3" style={{ height: '240px' }}>
             <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: 'multiply', transition: 'transform 0.5s ease' }} onMouseOver={e => e.currentTarget.style.transform="scale(1.08)"} onMouseOut={e => e.currentTarget.style.transform="scale(1)"} />
          </Link>

          <div className="text-center mt-auto">
            <div className="mb-2 text-muted small text-uppercase" style={{ letterSpacing: '1px', fontSize: '10px' }}>
              <span className="gold-text"><i className="fa fa-globe me-1"></i>{product.origin}</span>
              <span className="mx-2">|</span>
              <span><i className="fa fa-tint gold-text me-1"></i>{product.alcoholContent}%</span>
            </div>
            
            <Link to={`/product/${product.id}`} className="text-decoration-none">
                <h5 className="premium-font text-dark mb-3 fw-bold" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '48px', lineHeight: '1.4' }}>
                  {product.name}
                </h5>
            </Link>

            <div className="mb-4">
               {hasDiscount ? (
                 <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="text-muted text-decoration-line-through small">{product.price?.toLocaleString()}đ</span>
                    <span className="fw-bold fs-5" style={{ color: '#5c1621' }}>{((product.price * (100 - product.discountPercent)) / 100).toLocaleString()}đ</span>
                 </div>
               ) : (
                 <span className="fw-bold fs-5" style={{ color: '#5c1621' }}>{product.price?.toLocaleString()}đ</span>
               )}
            </div>

            <button 
              className="btn btn-luxury w-100 py-2 rounded-3"
              onClick={() => { dispatch(addCart(product)); toast.success("Đã thêm vào giỏ hàng!"); }}
              disabled={isOutOfStock}
            >
               {isOutOfStock ? "TẠM HẾT HÀNG" : "THÊM VÀO GIỎ"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isHome) {
      return (
          <div className="container my-5 px-3">
              <style>{`
                .luxury-card { border: 1px solid rgba(212,175,55,0.15); border-radius: 16px !important; transition: all 0.4s ease; background: #fff; overflow: hidden; }
                .luxury-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(114,47,55,0.12); border-color: rgba(212,175,55,0.4); }
                .btn-luxury { background-color: #5c1621; color: #fff; transition: all 0.3s ease; border: 1px solid #5c1621; font-weight: 600; letter-spacing: 1px; }
                .btn-luxury:hover { background-color: #fff; color: #5c1621; }
                .btn-luxury:disabled { background-color: #ccc; border-color: #ccc; color: #666; }
                .premium-font { font-family: 'Playfair Display', serif; }
                .gold-text { color: #d4af37; }
              `}</style>
              <div className="text-center mb-5">
                 <h2 className="fw-bold mb-3 premium-font" style={{ color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '2px' }}>Sản Phẩm Nổi Bật</h2>
                 <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Khám phá những chai vang đẳng cấp được yêu thích nhất từ bộ sưu tập của chúng tôi.</p>
                 <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '20px auto' }}></div>
              </div>
              <div className="row g-4">
                  {loading ? (
                      <div className="col-12"><LoadingSpinner message="Đang tải bộ sưu tập..." /></div>
                  ) : (
                      filter.slice(0, 8).map(product => renderProductCard(product, "col-12 col-sm-6 col-md-4 col-lg-3"))
                  )}
              </div>
              <div className="text-center mt-5">
                 <Link to="/product" className="btn btn-luxury px-5 py-3 rounded-0">
                    Xem Toàn Bộ Bộ Sưu Tập <i className="fa fa-arrow-right ms-2"></i>
                 </Link>
              </div>
          </div>
      );
  }

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filter.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filter.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .products-hero-overlay { background: linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 100%); }
        .premium-font { font-family: 'Playfair Display', serif; }
        .gold-text { color: #d4af37; }
        .luxury-card { transition: all 0.4s ease; border: 1px solid rgba(212,175,55,0.15); background: #fff; }
        .luxury-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(114,47,55,0.08); border-color: rgba(212,175,55,0.4); }
        .btn-luxury { background: #5c1621; color: #fff; border: 1px solid #5c1621; transition: all 0.3s ease; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .btn-luxury:hover { background: #fff; color: #5c1621; border-color: #5c1621; }
        .btn-luxury:disabled { background-color: #ccc; border-color: #ccc; color: #666; }
        
        .filter-section { background: #fcfbf9; border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; }
        .filter-title { font-family: 'Playfair Display', serif; color: #5c1621; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 12px; margin-bottom: 24px; font-weight: 600; font-size: 1.2rem; }
        .filter-label { font-size: 0.75rem; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
        .custom-input { border: 1px solid rgba(212,175,55,0.3); background: #fff; border-radius: 6px; box-shadow: none !important; }
        .custom-input:focus { border-color: #d4af37; }
        
        .filter-section::-webkit-scrollbar { width: 5px; }
        .filter-section::-webkit-scrollbar-track { background: transparent; }
        .filter-section::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.5); border-radius: 10px; }
        .filter-section::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.8); }

        @media (min-width: 992px) {
            .filter-sticky {
                position: sticky;
                top: 100px;
                z-index: 1010;
            }
        }
      `}</style>

      {/* Hero Banner */}
      <div className="products-hero position-relative mb-5" style={{ background: '#0a0a0a' }}>
        <div className="card text-white border-0 rounded-0" style={{ minHeight: '35vh' }}>
          <img 
            src={
                pairingContext === 'meat' ? 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop' :
                pairingContext === 'seafood' ? 'https://images.unsplash.com/photo-1559841644-08984562005a?q=80&w=2070&auto=format&fit=crop' :
                pairingContext === 'winter' ? 'https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=2070&auto=format&fit=crop' :
                pairingContext === 'summer' ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop' :
                'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop'
            }
            alt="Wines" style={{ height: '35vh', objectFit: 'cover' }} 
          />
          <div className="card-img-overlay products-hero-overlay d-flex flex-column justify-content-center px-4 px-md-5">
            <p className="gold-text text-uppercase mb-2" style={{ letterSpacing: '3px', fontWeight: '600', fontSize: '0.9rem' }}>
                {pairingContext ? 'Gợi Ý Kết Hợp' : 'Bộ Sưu Tập'}
            </p>
            <h1 className="premium-font fw-bold text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                {pairingContext === 'meat' ? 'Vang Đỏ & Thịt Đỏ' :
                 pairingContext === 'seafood' ? 'Vang Trắng & Hải Sản' :
                 pairingContext === 'winter' ? 'Vang Đỏ Mùa Đông' :
                 pairingContext === 'summer' ? 'Vang Cho Mùa Hè' :
                 'Tuyệt Tác Rượu Vang'}
            </h1>
            <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', fontWeight: '300', lineHeight: '1.6' }}>
                {pairingContext === 'meat' ? 'Hương vị đậm đà, chát nhẹ từ Vang Đỏ sẽ làm mềm các thớ thịt và bung toả hương vị tuyệt đỉnh của các món thịt bò bít tết.' :
                 pairingContext === 'seafood' ? 'Độ chua thanh mát của Vang Trắng sẽ khử tanh hoàn hảo và đánh thức sự tươi ngọt của các món hải sản biển.' :
                 pairingContext === 'winter' ? 'Một ly Vang Đỏ đậm đà ở nhiệt độ 15-18°C sẽ sưởi ấm và mang lại cảm giác thư giãn tuyệt đối trong ngày đông lạnh.' :
                 pairingContext === 'summer' ? 'Khám phá sự tươi mát, sảng khoái tức thì cùng những dòng Vang Trắng ướp lạnh, đánh bay mọi cái oi bức mùa hè.' :
                 'Khám phá những hương vị độc bản được tuyển chọn khắt khe từ các vùng nho danh tiếng nhất thế giới.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row">
          {/* Sidebar Filters */}
          <div className="col-lg-3 mb-4 mb-lg-0">
             <div className="filter-section p-4 shadow-sm filter-sticky" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <h5 className="filter-title"><i className="fa fa-filter me-2 gold-text"></i>Bộ Lọc Sản Phẩm</h5>
                
                <div className="mb-4">
                   <label className="filter-label"><i className="fa fa-search me-2 text-muted"></i>Tìm Kiếm</label>
                   <input type="text" className="form-control custom-input py-2" placeholder="Tên hoặc thương hiệu..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} />
                </div>

                <div className="mb-4">
                   <label className="filter-label"><i className="fa fa-glass me-2 text-muted"></i>Loại Rượu</label>
                   <select className="form-select custom-input py-2" value={selectedCategory} onChange={(e) => {setSelectedCategory(e.target.value); setCurrentPage(1);}}>
                      <option value="">Tất cả danh mục</option>
                      {dbCategories.map(c => (
                         <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                   </select>
                </div>

                <div className="mb-4">
                   <label className="filter-label"><i className="fa fa-money me-2 text-muted"></i>Mức Giá</label>
                   <div className="d-flex flex-column gap-2">
                      {[
                        { val: "", label: "Tất cả mức giá" },
                        { val: "under_1m", label: "Dưới 1 triệu" },
                        { val: "1m_to_5m", label: "Từ 1 - 5 triệu" },
                        { val: "5m_to_10m", label: "Từ 5 - 10 triệu" },
                        { val: "over_10m", label: "Trên 10 triệu" }
                      ].map(opt => (
                        <div className="form-check" key={opt.val}>
                          <input className="form-check-input" type="radio" name="priceFilter" id={`price_${opt.val}`} value={opt.val} checked={priceRange === opt.val} onChange={(e) => {setPriceRange(e.target.value); setCurrentPage(1);}} />
                          <label className="form-check-label text-muted small" htmlFor={`price_${opt.val}`}>{opt.label}</label>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mb-4">
                   <label className="filter-label"><i className="fa fa-tint me-2 text-muted"></i>Nồng Độ Cồn</label>
                   <div className="d-flex flex-column gap-2">
                      {[
                        { val: "", label: "Tất cả" },
                        { val: "light", label: "Nhẹ (Dưới 12.5%)" },
                        { val: "medium", label: "Vừa (12.5% - 14%)" },
                        { val: "heavy", label: "Mạnh (Trên 14%)" }
                      ].map(opt => (
                        <div className="form-check" key={opt.val}>
                          <input className="form-check-input" type="radio" name="alcoholFilter" id={`alc_${opt.val}`} value={opt.val} checked={alcoholLevel === opt.val} onChange={(e) => {setAlcoholLevel(e.target.value); setCurrentPage(1);}} />
                          <label className="form-check-label text-muted small" htmlFor={`alc_${opt.val}`}>{opt.label}</label>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mb-4">
                   <label className="filter-label"><i className="fa fa-globe me-2 text-muted"></i>Quốc Gia</label>
                   <select className="form-select custom-input py-2" value={selectedOrigin} onChange={(e) => {setSelectedOrigin(e.target.value); setCurrentPage(1);}}>
                      <option value="">Tất cả quốc gia</option>
                      {[...new Set(data.map(item => item.origin))].filter(Boolean).map(origin => (
                         <option key={origin} value={origin}>{origin}</option>
                      ))}
                   </select>
                </div>

                <div className="mb-4">
                   <label className="filter-label"><i className="fa fa-tag me-2 text-muted"></i>Thương Hiệu</label>
                   <select className="form-select custom-input py-2" value={selectedBrand} onChange={(e) => {setSelectedBrand(e.target.value); setCurrentPage(1);}}>
                      <option value="">Tất cả thương hiệu</option>
                      {[...new Set(data.map(item => item.brand))].filter(Boolean).map(brand => (
                         <option key={brand} value={brand}>{brand}</option>
                      ))}
                   </select>
                </div>

                <div className="mb-2">
                   <label className="filter-label"><i className="fa fa-check-circle me-2 text-muted"></i>Trạng Thái</label>
                   <select className="form-select custom-input py-2" value={availability} onChange={(e) => {setAvailability(e.target.value); setCurrentPage(1);}}>
                      <option value="">Tất cả</option>
                      <option value="in_stock">Còn hàng</option>
                      <option value="out_of_stock">Hết hàng</option>
                      <option value="discount">Đang giảm giá</option>
                   </select>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
             <div className="d-flex flex-wrap justify-content-between align-items-end border-bottom pb-3 mb-4 gap-3">
                <div>
                   <h2 className="premium-font fw-bold mb-1" style={{ color: '#5c1621' }}>Danh Mục Vang</h2>
                   <p className="text-muted small mb-0">Hiển thị <span className="fw-bold gold-text">{filter.length}</span> sản phẩm</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                   <span className="small text-muted fw-bold text-uppercase"><i className="fa fa-sort me-1"></i>Sắp xếp:</span>
                   <select className="form-select custom-input py-2" style={{ width: 'auto', minWidth: '200px' }} value={sortOrder} onChange={(e) => {
                      setSortOrder(e.target.value);
                   }}>
                      <option value="newest">Mới nhất</option>
                      <option value="price_asc">Giá: Thấp đến Cao</option>
                      <option value="price_desc">Giá: Cao đến Thấp</option>
                      <option value="name_asc">Tên: A-Z</option>
                      <option value="name_desc">Tên: Z-A</option>
                      <option value="alcohol_desc">Nồng độ cồn: Giảm dần</option>
                   </select>
                </div>
             </div>

             {loading ? (
                <div className="py-5"><LoadingSpinner message="Đang tải bộ sưu tập rượu..." /></div>
             ) : filter.length === 0 ? (
                <div className="py-5"><EmptyState message="Không tìm thấy sản phẩm phù hợp." /></div>
             ) : (
                <>
                   <div className="row g-4 mb-5">
                      {currentProducts.map(product => renderProductCard(product, "col-md-6 col-xl-4"))}
                   </div>
                   
                   <div className="d-flex justify-content-center mt-5">
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                        totalItems={filter.length}
                        itemsPerPage={productsPerPage}
                      />
                   </div>
                </>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
