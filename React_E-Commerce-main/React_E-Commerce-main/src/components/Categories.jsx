import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import API_BASE_URL from '../config';
const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/categories`);
                setCategories(res.data || []);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (searchTerm) => {
        navigate(`/product?category=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <section className="categories-section py-5 bg-white">
            <div className="container py-4">
                <div className="text-center mb-5">
                    <span className="text-uppercase fw-bold" style={{ color: '#d4af37', letterSpacing: '2px', fontSize: '0.9rem' }}>Khám Phá Hương Vị</span>
                    <h2 className="fw-bold mt-2 mb-3" style={{ color: '#1a1a1a', letterSpacing: '1px', fontFamily: "'Playfair Display', serif" }}>DANH MỤC RƯỢU VANG</h2>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <div style={{ height: '1px', width: '50px', background: '#d4af37' }}></div>
                        <i className="fa fa-gem" style={{ color: '#d4af37' }}></i>
                        <div style={{ height: '1px', width: '50px', background: '#d4af37' }}></div>
                    </div>
                </div>
                <div className="row justify-content-center g-4">
                    {loading ? (
                        <div className="text-center py-5 text-muted">Đang tải danh mục...</div>
                    ) : (
                        categories.slice(0, 4).map((cat) => (
                            <div key={cat.id} className="col-6 col-md-3">
                                <div 
                                    className="text-center category-item" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleCategoryClick(cat.name)}
                                >
                                    <div 
                                        className="category-img-wrapper mx-auto mb-3 overflow-hidden shadow-sm" 
                                        style={{ width: '140px', height: '140px', borderRadius: '24px', background: '#f5f5f5' }}
                                    >
                                        {cat.imageUrl ? (
                                            <img 
                                                src={cat.imageUrl} 
                                                alt={cat.name} 
                                                className="w-100 h-100 object-fit-cover category-img"
                                            />
                                        ) : (
                                            <div className="w-100 h-100 d-flex justify-content-center align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <h5 className="fw-bold mb-1 category-title" style={{ color: '#1a1a1a', fontSize: '1rem', transition: 'color 0.3s ease' }}>{cat.name}</h5>
                                    <p className="text-muted small mb-0 px-2" style={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {cat.description || 'Khám phá ngay'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .category-item {
                    transition: all 0.3s ease;
                }
                .category-item:hover {
                    transform: translateY(-8px);
                }
                .category-img {
                    transition: transform 0.6s ease;
                }
                .category-item:hover .category-img {
                    transform: scale(1.1);
                }
                .category-item:hover .category-title {
                    color: #d4af37 !important;
                }
            `}</style>
        </section>
    );
};

export default Categories;
