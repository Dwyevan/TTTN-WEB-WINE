import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <>
      <div className="hero position-relative mb-5" style={{ background: '#1a1a1a' }}>
        <style>{`
          .hero-overlay {
            background: linear-gradient(135deg, rgba(114,47,55,0.85) 0%, rgba(20,20,20,0.9) 100%);
          }
          .gold-text {
            color: #d4af37;
          }
          .btn-gold {
            background-color: #d4af37;
            color: #1a1a1a;
            border: 1px solid #d4af37;
            transition: all 0.3s ease;
          }
          .btn-gold:hover {
            background-color: transparent;
            color: #d4af37;
            box-shadow: 0 0 15px rgba(212,175,55,0.5);
          }
          .btn-outline-gold {
            background-color: transparent;
            color: #d4af37;
            border: 1px solid #d4af37;
            transition: all 0.3s ease;
          }
          .btn-outline-gold:hover {
            background-color: #d4af37;
            color: #1a1a1a;
          }
        `}</style>
        
        <div className="card text-white border-0 rounded-0" style={{ minHeight: '80vh' }}>
          <img
            className="card-img rounded-0"
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Wine Cellar"
            style={{ height: '80vh', objectFit: 'cover' }}
          />
          <div className="card-img-overlay hero-overlay d-flex align-items-center">
            <div className="container">
              <div className="row justify-content-center justify-content-md-start">
                <div className="col-12 col-md-8 col-lg-6 text-center text-md-start">
                  <span className="badge mb-3 py-2 px-3 gold-text" style={{ background: 'rgba(212,175,55,0.1)', letterSpacing: '2px', border: '1px solid rgba(212,175,55,0.3)' }}>
                    BỘ SƯU TẬP CAO CẤP 2026
                  </span>
                  
                  <h1 className="card-title fw-bold text-uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.2', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Tinh Hoa <br/> <span className="gold-text">Rượu Vang</span> Thế Giới
                  </h1>
                  
                  <p className="card-text fs-5 mb-5 fw-light" style={{ color: '#e0e0e0', maxWidth: '500px', lineHeight: '1.6' }}>
                    Khám phá những hương vị thượng hạng được tuyển chọn khắt khe từ các hầm rượu danh tiếng nhất trên thế giới. Nâng tầm phong cách sống của bạn.
                  </p>
                  
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
                    <Link to="/product" className="btn btn-gold btn-lg rounded-0 px-5 py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '14px' }}>
                      Khám Phá Ngay
                    </Link>
                    <a href="#featured-section" className="btn btn-outline-gold btn-lg rounded-0 px-5 py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '14px' }}>
                      Sản Phẩm Nổi Bật
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* SECTION HEADER FOR PRODUCTS */}
      <div id="featured-section" className="container text-center mb-5 mt-5 pt-4">
        <h2 className="fw-bold text-uppercase mb-3" style={{ color: '#1a1a1a', letterSpacing: '3px' }}>Bộ Sưu Tập Tuyển Chọn</h2>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div style={{ height: '1px', width: '60px', background: '#d4af37' }}></div>
          <i className="fa fa-wine-glass-alt gold-text fs-4"></i>
          <div style={{ height: '1px', width: '60px', background: '#d4af37' }}></div>
        </div>
        <p className="text-muted mt-3 mx-auto" style={{ maxWidth: '600px' }}>
          Những chai vang độc bản mang hương vị vượt thời gian, được giới mộ điệu săn lùng nhiều nhất.
        </p>
      </div>
    </>
  );
};

export default Main;