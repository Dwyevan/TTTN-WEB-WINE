import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <>
      <div className="hero position-relative" style={{ background: '#0a0a0a' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          
          .hero-overlay {
            background: linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.8) 100%);
          }
          .premium-title {
            font-family: 'Playfair Display', serif;
            letter-spacing: 1px;
          }
          .gold-accent {
            color: #d4af37;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 0.85rem;
            font-weight: 600;
          }
          .btn-primary-premium {
            background-color: #5c1621;
            color: #fff;
            border: 1px solid #5c1621;
            transition: all 0.3s ease;
          }
          .btn-primary-premium:hover {
            background-color: #420f17;
            color: #fff;
            border-color: #420f17;
          }
          .btn-outline-premium {
            background-color: transparent;
            color: #fff;
            border: 1px solid rgba(255,255,255,0.6);
            transition: all 0.3s ease;
          }
          .btn-outline-premium:hover {
            background-color: rgba(255,255,255,0.1);
            color: #fff;
            border-color: #fff;
          }
        `}</style>
        
        <div className="card text-white border-0 rounded-0" style={{ minHeight: '90vh' }}>
          <img
            className="card-img rounded-0"
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop"
            alt="Premium Wine Cellar"
            style={{ height: '90vh', objectFit: 'cover' }}
          />
          <div className="card-img-overlay hero-overlay d-flex flex-column justify-content-center align-items-center text-center px-3">
            
            <p className="gold-accent mb-4">Vintage & Vine</p>
            
            <h1 className="card-title premium-title fw-bold mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', maxWidth: '900px', lineHeight: '1.2' }}>
              Tuyệt Tác Từ Những Vườn Nho Huyền Thoại
            </h1>
            
            <p className="card-text mb-5" style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', lineHeight: '1.8', fontWeight: '300' }}>
              Hành trình khám phá hương vị tinh tế qua bộ sưu tập rượu vang hiếm có, được tuyển chọn khắt khe bởi các chuyên gia hàng đầu dành riêng cho giới mộ điệu.
            </p>
            
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link to="/product" className="btn btn-primary-premium rounded-0 px-5 py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                Khám Phá Ngay
              </Link>
              <Link to="/contact" className="btn btn-outline-premium rounded-0 px-5 py-3 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                Tư Vấn Chọn Vang
              </Link>
            </div>
            
            {/* Scroll indicator */}
            <div className="position-absolute bottom-0 mb-4 opacity-50" style={{ animation: 'bounce 2s infinite' }}>
              <style>{`@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-10px);} 60% {transform: translateY(-5px);} }`}</style>
              <i className="fa fa-chevron-down fs-5"></i>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;