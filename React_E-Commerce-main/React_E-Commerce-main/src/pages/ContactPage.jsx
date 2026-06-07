import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import axios from "axios";
import toast from "react-hot-toast";

const ContactPage = () => {
  // 1. Khởi tạo dữ liệu đúng với Entity Backend (fullName, email, phone, subject, message)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Tư vấn mua lẻ",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Cập nhật dữ liệu khi người dùng nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. Gửi dữ liệu về Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra tính hợp lệ cơ bản
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi API Backend thực tế (Lưu ý: /api/feedbacks)
      await axios.post("http://localhost:8080/api/feedbacks", formData);
      
      toast.success("Yêu cầu của bạn đã được gửi thành công! Wine Store sẽ liên hệ sớm.");
      
      // Xóa trắng form sau khi gửi thành công
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "Tư vấn mua lẻ",
        message: "",
      });
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      toast.error("Hệ thống đang bận hoặc lỗi kết nối. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center fw-bold text-uppercase">Liên Hệ Với Wine Store</h1>
        <p className="text-center text-muted">Chúng tôi luôn sẵn sàng lắng nghe và tư vấn cho bạn những dòng vang tuyệt vời nhất.</p>
        <hr />
        
        <div className="row my-4 h-100">
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <div className="col-md-5 col-lg-4 mb-4 mb-md-0">
            <div className="card shadow border-0 p-4 bg-dark text-white rounded-4 h-100">
              <h4 className="fw-bold mb-4 border-bottom pb-2 text-warning">Hỗ Trợ Khách Hàng</h4>
              
              <div className="d-flex mb-4">
                <i className="fa fa-map-marker mt-1 me-3 text-warning fs-5"></i>
                <div>
                  <strong className="d-block">Địa chỉ hầm rượu:</strong>
                  <small className="text-light opacity-75">123 Đường Rượu Vang, Quận 1, TP. Hồ Chí Minh</small>
                </div>
              </div>

              <div className="d-flex mb-4">
                <i className="fa fa-phone mt-1 me-3 text-warning fs-5"></i>
                <div>
                  <strong className="d-block">Hotline đặt hàng:</strong>
                  <small className="text-light opacity-75">090 123 4567 (8:00 - 22:00)</small>
                </div>
              </div>

              <div className="d-flex mb-4">
                <i className="fa fa-envelope mt-1 me-3 text-warning fs-5"></i>
                <div>
                  <strong className="d-block">Email tư vấn:</strong>
                  <small className="text-light opacity-75">contact@winestore.com</small>
                </div>
              </div>

              <div className="d-flex mb-4">
                <i className="fa fa-clock-o mt-1 me-3 text-warning fs-5"></i>
                <div>
                  <strong className="d-block">Giờ mở cửa:</strong>
                  <small className="text-light opacity-75">Thứ 2 - CN: 09:00 - 23:00</small>
                </div>
              </div>

              <div className="mt-auto p-3 bg-secondary bg-opacity-25 rounded-3 border border-secondary">
                <h6 className="small fw-bold text-warning mb-2">
                    <i className="fa fa-briefcase me-2"></i>Dành cho doanh nghiệp:
                </h6>
                <p className="small text-light mb-0" style={{fontStyle: 'italic'}}>
                  Cần báo giá số lượng lớn hoặc quà tặng Tết? Vui lòng để lại tin nhắn hoặc gọi trực tiếp Hotline.
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI YÊU CẦU */}
          <div className="col-md-7 col-lg-8">
            <form className="p-4 border-0 shadow rounded-4 bg-white h-100" onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control py-2 shadow-sm" 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Nguyễn Văn A" 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                  <input 
                    type="email" 
                    className="form-control py-2 shadow-sm" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label fw-bold">Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control py-2 shadow-sm" 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="09xx xxx xxx" 
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="subject" className="form-label fw-bold">Bạn quan tâm đến:</label>
                  <select className="form-select py-2 shadow-sm" id="subject" value={formData.subject} onChange={handleChange}>
                    <option value="Tư vấn mua lẻ">Tư vấn mua lẻ</option>
                    <option value="Quà tặng doanh nghiệp">Quà tặng doanh nghiệp (Sỉ)</option>
                    <option value="Sự kiện">Đặt hầm tiệc / Sự kiện</option>
                    <option value="Góp ý">Góp ý dịch vụ</option>
                  </select>
                </div>
                <div className="col-12">
                  <label htmlFor="message" className="form-label fw-bold">Nội dung tin nhắn <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control shadow-sm" 
                    id="message" 
                    rows="5" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Hãy cho chúng tôi biết yêu cầu cụ thể của bạn..." 
                    required
                  ></textarea>
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-dark btn-lg px-5 rounded-pill shadow" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span> ĐANG GỬI...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-paper-plane me-2"></i> GỬI YÊU CẦU NGAY
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* BẢN ĐỒ GOOGLE MAPS */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="rounded-4 overflow-hidden shadow border" style={{ height: "450px" }}>
              <iframe
                title="Google Maps Wine Store"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.44791054522!2d106.698717875703!3d10.773123859183416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4743648f3d%3A0x5452c92448d0510!2zTmjDoCBoYcyAbmggVmluaCBExrDGoW5n!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;