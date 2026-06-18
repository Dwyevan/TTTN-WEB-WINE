import React from 'react';
import { Footer, Navbar } from "../components";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <style>{`
        .parallax-header {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2000&auto=format&fit=crop');
          min-height: 70vh;
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }
        
        .story-section {
          padding: 100px 0;
          background-color: #fcfcfc;
        }

        .timeline-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .timeline-container::after {
          content: '';
          position: absolute;
          width: 4px;
          background-color: #d4af37;
          top: 0;
          bottom: 0;
          left: 50%;
          margin-left: -2px;
        }

        .timeline-item {
          padding: 10px 40px;
          position: relative;
          background-color: inherit;
          width: 50%;
        }

        .timeline-item.left { left: 0; }
        .timeline-item.right { left: 50%; }

        .timeline-item::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          right: -10px;
          background-color: white;
          border: 4px solid #722f37;
          top: 15px;
          border-radius: 50%;
          z-index: 1;
        }

        .timeline-item.right::after {
          left: -10px;
        }

        .timeline-content {
          padding: 30px;
          background-color: white;
          position: relative;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          transition: transform 0.3s ease;
        }

        .timeline-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(114,47,55,0.1);
        }

        .glass-feature {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 40px 20px;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          height: 100%;
          transition: all 0.3s ease;
        }

        .glass-feature:hover {
          transform: translateY(-10px);
          border-color: rgba(212,175,55,0.3);
        }

        .glass-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(114,47,55,0.1), rgba(114,47,55,0.05));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #722f37;
          font-size: 30px;
        }
      `}</style>

      {/* Hero Parallax */}
      <div className="parallax-header">
        <div className="container">
          <h1 className="display-2 fw-bold text-uppercase mb-4" style={{ letterSpacing: '4px', textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>
            Wine Store
          </h1>
          <p className="lead mx-auto fs-4" style={{ maxWidth: '800px', fontWeight: '300', textShadow: '1px 2px 5px rgba(0,0,0,0.5)' }}>
            Khởi nguồn từ niềm đam mê mãnh liệt, chúng tôi mang tinh hoa của những điền trang danh tiếng nhất thế giới đến ly rượu của bạn.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="story-section">
        <div className="container">
          <div className="text-center mb-5 pb-4">
            <h2 className="fw-bold text-uppercase" style={{ color: '#1a1a1a', letterSpacing: '2px' }}>Hành trình của chúng tôi</h2>
            <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '20px auto' }}></div>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
              Từ một hầm rượu nhỏ tại lòng thành phố, Wine Store đã vươn mình trở thành điểm đến tin cậy hàng đầu cho những người yêu vang đích thực tại Việt Nam.
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-item left">
              <div className="timeline-content">
                <h3 className="fw-bold" style={{ color: '#722f37' }}>2015</h3>
                <h5 className="fw-bold mt-2">Viên gạch đầu tiên</h5>
                <p className="text-muted mb-0">Cửa hàng nhỏ gọn với vỏn vẹn 50 nhãn chai vang Pháp và Ý được khai trương, phục vụ những người bạn cùng chung đam mê.</p>
              </div>
            </div>
            
            <div className="timeline-item right">
              <div className="timeline-content">
                <h3 className="fw-bold" style={{ color: '#722f37' }}>2018</h3>
                <h5 className="fw-bold mt-2">Mở rộng bộ sưu tập</h5>
                <p className="text-muted mb-0">Hợp tác trực tiếp với hơn 20 điền trang (Château) lớn trên thế giới, nâng tổng số nhãn vang lên 500+.</p>
              </div>
            </div>
            
            <div className="timeline-item left">
              <div className="timeline-content">
                <h3 className="fw-bold" style={{ color: '#722f37' }}>2021</h3>
                <h5 className="fw-bold mt-2">Chứng nhận chất lượng</h5>
                <p className="text-muted mb-0">Trở thành nhà phân phối độc quyền cho nhiều thương hiệu Grand Cru Classé danh giá và đạt chứng chỉ kho bảo quản tiêu chuẩn quốc tế.</p>
              </div>
            </div>
            
            <div className="timeline-item right">
              <div className="timeline-content">
                <h3 className="fw-bold" style={{ color: '#722f37' }}>2024</h3>
                <h5 className="fw-bold mt-2">Số hóa trải nghiệm</h5>
                <p className="text-muted mb-0">Ra mắt nền tảng thương mại điện tử hiện đại, tích hợp AI Sommelier tư vấn chọn rượu cá nhân hóa cho hàng triệu khách hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section (Parallax background 2) */}
      <div style={{
        backgroundImage: "linear-gradient(rgba(114, 47, 55, 0.85), rgba(114, 47, 55, 0.9)), url('https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        padding: '100px 0'
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white text-uppercase" style={{ letterSpacing: '2px' }}>Giá Trị Cốt Lõi</h2>
            <div style={{ width: '60px', height: '3px', background: '#d4af37', margin: '20px auto' }}></div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-feature">
                <div className="glass-icon"><i className="fa fa-gem"></i></div>
                <h4 className="fw-bold mb-3">100% Chính Hãng</h4>
                <p className="text-muted mb-0">Mỗi chai vang đều có đầy đủ chứng từ xuất xứ, hóa đơn đỏ. Cam kết hoàn tiền 300% nếu phát hiện hàng giả.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-feature">
                <div className="glass-icon"><i className="fa fa-thermometer-half"></i></div>
                <h4 className="fw-bold mb-3">Bảo Quản Chuẩn Mực</h4>
                <p className="text-muted mb-0">Hệ thống kho lạnh thông minh duy trì nhiệt độ 16°C và độ ẩm 70% liên tục 24/7 để giữ trọn hương vị.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-feature">
                <div className="glass-icon"><i className="fa fa-user-tie"></i></div>
                <h4 className="fw-bold mb-3">Chuyên Gia Tư Vấn</h4>
                <p className="text-muted mb-0">Đội ngũ tư vấn viên được đào tạo chuyên sâu bởi các Sommelier quốc tế, sẵn sàng hỗ trợ 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutPage;