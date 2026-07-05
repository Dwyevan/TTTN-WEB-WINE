import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";

import API_BASE_URL from '../config';
const FeaturedWine = () => {
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Get most expensive or a specific famous wine
                const res = await axios.get(`${API_BASE_URL}/api/wines`);
                let allWines = res.data || [];
                if (allWines.length > 0) {
                    // Try to find a premium one or just take the first
                    allWines.sort((a, b) => b.price - a.price);
                    setProduct(allWines[0]);
                }
            } catch (err) {
                console.error("Lỗi lấy sản phẩm nổi bật:", err);
            }
        };
        fetchProduct();
    }, []);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addCart(product));
            toast.success("Đã thêm vào giỏ hàng!");
        }
    };

    if (!product) return null;

    return (
        <section className="featured-wine py-5" style={{ background: '#f5efe6' }}>
            <div className="container py-5">
                <div className="row align-items-center g-5">
                    {/* Left: Big Image */}
                    <div className="col-md-6 text-center position-relative">
                        <div 
                            className="position-absolute top-50 start-50 translate-middle w-75 h-100" 
                            style={{ background: '#e9e3d9', zIndex: 0, right: '-20px', borderRadius: '4px' }}
                        ></div>
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="img-fluid position-relative shadow-lg" 
                            style={{ zIndex: 1, maxHeight: '600px', objectFit: 'cover', borderRadius: '2px' }}
                        />
                    </div>
                    
                    {/* Right: Info */}
                    <div className="col-md-6 px-4">
                        <div className="mb-3">
                            <span className="badge bg-warning text-dark py-2 px-3 fw-bold shadow-sm" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
                                <i className="fa fa-crown me-2"></i>SIÊU PHẨM ĐẮT GIÁ NHẤT
                            </span>
                        </div>
                        <span className="text-uppercase" style={{ color: '#888', letterSpacing: '2px', fontSize: '0.8rem' }}>Đại diện tinh hoa thương hiệu</span>
                        <h2 className="mt-2 mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#1a1a1a', lineHeight: '1.2' }}>
                            {product.name}
                        </h2>
                        
                        <div className="mb-4 fst-italic" style={{ color: '#555', borderLeft: '3px solid #d4af37', paddingLeft: '15px' }}>
                            "Tuyệt tác rượu vang mang giá trị cao nhất trong bộ sưu tập của chúng tôi. Cấu trúc tuyệt vời với hương thơm bung tỏa của quả mọng đen, hòa quyện với chút gia vị ngọt ngào. Lựa chọn khẳng định đẳng cấp."
                        </div>
                        
                        <div className="row mb-5">
                            <div className="col-6 mb-3">
                                <span className="text-uppercase" style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px' }}>Giống nho</span>
                                <div className="fw-bold text-dark">{product.grapeVariety || 'Cabernet Sauvignon Blend'}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <span className="text-uppercase" style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px' }}>Niên vụ</span>
                                <div className="fw-bold text-dark">{product.vintageYear || '2015'}</div>
                            </div>
                            <div className="col-6 mb-3">
                                <span className="text-uppercase" style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px' }}>Đánh giá</span>
                                <div className="fw-bold text-dark">100 pts Robert Parker</div>
                            </div>
                            <div className="col-6 mb-3">
                                <span className="text-uppercase" style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px' }}>Nồng độ</span>
                                <div className="fw-bold text-dark">{product.alcoholContent || '13.5'}%</div>
                            </div>
                        </div>
                        
                        <button 
                            className="btn rounded-0 px-5 py-3 fw-bold text-uppercase" 
                            style={{ background: '#3b0918', color: '#fff', letterSpacing: '1px', fontSize: '0.9rem', transition: 'all 0.3s ease' }}
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ hàng - {product.price?.toLocaleString()} đ
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .featured-wine .btn:hover {
                    background: #1a1a1a !important;
                }
            `}</style>
        </section>
    );
};

export default FeaturedWine;
