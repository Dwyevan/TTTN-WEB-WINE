import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import API_BASE_URL from '../config';
const Footer = () => {
  const [storeInfo, setStoreInfo] = useState({
    STORE_NAME: 'Wine Store',
    STORE_ADDRESS: '123 Đường Rượu Vang, Quận 1, TP. Hồ Chí Minh, Việt Nam',
    STORE_PHONE: '0972.778.480',
    STORE_EMAIL: 'contact@winestore.com'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/settings`);
        if (res.data) {
          setStoreInfo({
            STORE_NAME: res.data.STORE_NAME || 'Wine Store',
            STORE_ADDRESS: res.data.STORE_ADDRESS || '123 Đường Rượu Vang, Quận 1, TP. Hồ Chí Minh, Việt Nam',
            STORE_PHONE: res.data.STORE_PHONE || '0972.778.480',
            STORE_EMAIL: res.data.STORE_EMAIL || 'contact@winestore.com'
          });
        }
      } catch (error) {
        console.error("Lỗi tải thông tin cửa hàng:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <footer className="mt-5 pt-5 pb-4" style={{ background: '#1a1a1a', color: '#e0e0e0', borderTop: '4px solid #722f37' }}>
        <div className="container">
          <div className="row g-4">
            {/* Column 1: About */}
            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="fw-bold mb-4 text-uppercase" style={{ color: '#d4af37', letterSpacing: '2px' }}>{storeInfo.STORE_NAME}</h5>
              <p className="small mb-4" style={{ lineHeight: '1.8' }}>
                Nơi hội tụ những dòng rượu vang thượng hạng từ các hầm rượu danh tiếng nhất thế giới. Chúng tôi mang đến trải nghiệm thưởng thức đẳng cấp và phong cách sống tinh tế cho giới mộ điệu.
              </p>
              <div className="d-flex gap-3">
                <a href="https://www.facebook.com/nhat.duy.123600" target="_blank" rel="noreferrer" className="text-white text-decoration-none" style={{ transition: 'color 0.3s ease' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                  <i className="fa fa-facebook-f fs-5"></i>
                </a>
                <a href="https://zalo.me/0972778480" target="_blank" rel="noreferrer" className="text-white text-decoration-none" style={{ transition: 'color 0.3s ease' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                  <strong style={{ fontFamily: 'sans-serif' }}>Zalo</strong>
                </a>
                <a href="#" className="text-white text-decoration-none" style={{ transition: 'color 0.3s ease' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>
                  <i className="fa fa-instagram fs-5"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="fw-bold mb-4 text-uppercase" style={{ color: '#d4af37', letterSpacing: '2px' }}>Khám Phá</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <Link to="/" className="text-decoration-none text-white small" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>Trang chủ</Link>
                </li>
                <li className="mb-3">
                  <Link to="/product" className="text-decoration-none text-white small" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>Cửa hàng vang</Link>
                </li>
                <li className="mb-3">
                  <Link to="/about" className="text-decoration-none text-white small" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>Về chúng tôi</Link>
                </li>
                <li className="mb-3">
                  <Link to="/contact" className="text-decoration-none text-white small" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#d4af37'} onMouseOut={e => e.currentTarget.style.color = '#fff'}>Liên hệ</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="fw-bold mb-4 text-uppercase" style={{ color: '#d4af37', letterSpacing: '2px' }}>Liên Hệ</h5>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-3 d-flex">
                  <i className="fa fa-map-marker-alt me-3 mt-1" style={{ color: '#d4af37' }}></i>
                  <span>{storeInfo.STORE_ADDRESS}</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="fa fa-phone-alt me-3" style={{ color: '#d4af37' }}></i>
                  <span>{storeInfo.STORE_PHONE}</span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="fa fa-envelope me-3" style={{ color: '#d4af37' }}></i>
                  <span>{storeInfo.STORE_EMAIL}</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="fw-bold mb-4 text-uppercase" style={{ color: '#d4af37', letterSpacing: '2px' }}>Bản Tin Ưu Đãi</h5>
              <p className="small mb-3">Đăng ký để nhận thông tin về các dòng vang mới và ưu đãi độc quyền.</p>
              <form className="d-flex flex-column gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  className="form-control rounded-0 border-0 p-2" 
                  placeholder="Nhập email của bạn..." 
                  style={{ background: '#333', color: '#fff' }}
                  required
                />
                <button 
                  type="submit" 
                  className="btn w-100 rounded-0 fw-bold" 
                  style={{ background: '#d4af37', color: '#1a1a1a' }}
                >
                  ĐĂNG KÝ
                </button>
              </form>
            </div>
          </div>

          <hr className="my-4" style={{ borderColor: '#333' }} />

          {/* Bottom Footer */}
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 small" style={{ color: '#888' }}>
                &copy; {new Date().getFullYear()} <strong>{storeInfo.STORE_NAME}</strong>. Bản quyền thuộc về {storeInfo.STORE_NAME}.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" height="20" className="me-2" style={{ filter: 'grayscale(100%) brightness(200%)' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" height="15" className="me-2" style={{ filter: 'grayscale(100%) brightness(200%)' }} />
              <span className="small fw-bold" style={{ color: '#888' }}>VNPAY</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;