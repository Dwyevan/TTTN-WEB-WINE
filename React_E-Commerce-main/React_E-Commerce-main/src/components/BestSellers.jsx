import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addCart, toggleWishlist } from "../redux/action";
import toast from "react-hot-toast";

import API_BASE_URL from '../config';
const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlist = useSelector(state => state.handleWishlist) || [];
    const [activeTab, setActiveTab] = useState('bestseller'); // 'newest', 'bestseller', 'premium'

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/wines`);
                let allWines = res.data || [];
                
                // Simple logic for tabs
                let displayWines = [...allWines];
                if (activeTab === 'newest') {
                    displayWines.reverse(); // Mock newest
                } else if (activeTab === 'premium') {
                    displayWines.sort((a, b) => b.price - a.price); // Mock premium (highest price)
                }
                // default is bestseller (first 4 items)
                
                setProducts(displayWines.slice(0, 4)); // Design shows 4 items
                setLoading(false);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeTab]);

    const handleAddToCart = (product) => {
        dispatch(addCart(product));
        toast.success("Đã thêm vào giỏ hàng!");
    };

    const handleToggleWishlist = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
        if (wishlist.some(item => item.id === product.id)) {
            toast.error("Đã xóa khỏi danh sách yêu thích");
        } else {
            toast.success("Đã thêm vào danh sách yêu thích");
        }
    };

    if (loading) return null; // Or a spinner

    return (
        <section className="exclusive-collection py-5" style={{ background: '#fcfbf9' }}>
            <div className="container py-4">
                <div className="text-center mb-5">
                    <span className="text-uppercase" style={{ color: '#666', letterSpacing: '2px', fontSize: '0.8rem' }}>Tuyển tập được khao khát nhất</span>
                    <h2 className="mt-3 mb-4" style={{ color: '#1a1a1a', fontFamily: "'Playfair Display', serif", fontSize: '2.5rem' }}>Bộ Sưu Tập Độc Quyền</h2>
                    
                    {/* Tabs */}
                    <div className="d-flex justify-content-center gap-4 mt-4 mb-2">
                        <button 
                            className={`btn rounded-0 px-0 pb-1 ${activeTab === 'newest' ? 'active-tab' : 'inactive-tab'}`}
                            onClick={() => setActiveTab('newest')}
                        >MỚI NHẤT</button>
                        <button 
                            className={`btn rounded-0 px-0 pb-1 ${activeTab === 'bestseller' ? 'active-tab' : 'inactive-tab'}`}
                            onClick={() => setActiveTab('bestseller')}
                        >BÁN CHẠY NHẤT</button>
                        <button 
                            className={`btn rounded-0 px-0 pb-1 ${activeTab === 'premium' ? 'active-tab' : 'inactive-tab'}`}
                            onClick={() => setActiveTab('premium')}
                        >PHÂN HẠNG</button>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {products.map(product => {
                        const inWishlist = wishlist.some(item => item.id === product.id);
                        return (
                            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
                                <div className="card h-100 border-0 product-card shadow-sm" style={{ borderRadius: '12px', transition: 'all 0.3s ease' }}>
                                    
                                    {/* Best Seller Badge */}
                                    <div className="position-absolute top-0 start-0 mt-3 ms-3" style={{ zIndex: 2 }}>
                                        <span className="badge bg-danger px-2 py-1 shadow" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                                            <i className="fa fa-fire me-1"></i> HOT
                                        </span>
                                    </div>
                                    
                                    <button 
                                        className="btn btn-light rounded-circle position-absolute top-0 end-0 mt-3 me-3 shadow-sm wishlist-btn"
                                        style={{ width: '35px', height: '35px', zIndex: 2, padding: 0 }}
                                        onClick={(e) => handleToggleWishlist(e, product)}
                                    >
                                        <i className={`fa fa-heart ${inWishlist ? 'text-danger' : 'text-muted'}`}></i>
                                    </button>

                                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark d-block p-3">
                                        <div className="img-container position-relative mb-3" style={{ height: '220px', overflow: 'hidden' }}>
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name} 
                                                className="w-100 h-100 object-fit-contain product-img" 
                                            />
                                        </div>
                                        <div className="card-body p-0 text-center">
                                            <h6 className="card-title fw-bold text-truncate mb-2" title={product.name}>{product.name}</h6>
                                            <div className="small text-muted mb-2 d-flex justify-content-center align-items-center gap-2">
                                                <span><i className="fa fa-globe me-1 text-burgundy"></i> {product.origin || 'N/A'}</span>
                                                {product.alcoholContent && (
                                                    <span><i className="fa fa-percent me-1 text-burgundy"></i> {product.alcoholContent}%</span>
                                                )}
                                            </div>
                                            <div className="fw-bold fs-5 mb-3" style={{ color: '#722f37' }}>
                                                {product.price?.toLocaleString()} đ
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="card-footer bg-transparent border-0 p-3 pt-0">
                                        <button 
                                            className="btn btn-burgundy w-100 fw-bold rounded-3 py-2 add-cart-btn"
                                            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? 'Hết hàng' : <><i className="fa fa-shopping-cart me-2"></i>Thêm vào giỏ</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="text-center mt-5">
                    <button className="btn btn-outline-dark fw-bold px-5 py-2 text-uppercase" style={{ letterSpacing: '1px' }} onClick={() => navigate('/product')}>
                        Xem Tất Cả Sản Phẩm
                    </button>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
                
                .active-tab {
                    border: none;
                    border-bottom: 1px solid #1a1a1a;
                    color: #1a1a1a;
                    font-weight: 500;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                }
                .inactive-tab {
                    border: none;
                    color: #999;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                }
                .inactive-tab:hover {
                    color: #666;
                }
                
                .product-card {
                    background: transparent;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                }
                .product-img {
                    transition: transform 0.5s ease;
                }
                .product-card:hover .product-img {
                    transform: scale(1.05);
                }
                .add-cart-btn {
                    transition: all 0.3s ease;
                    background-color: #1a1a1a;
                    color: #fff;
                    border: 1px solid #1a1a1a;
                }
                .add-cart-btn:hover {
                    background-color: transparent;
                    color: #1a1a1a;
                }
                .wishlist-btn:hover {
                    background-color: #f8f9fa;
                    transform: scale(1.1);
                }
            `}</style>
        </section>
    );
};

export default BestSellers;
