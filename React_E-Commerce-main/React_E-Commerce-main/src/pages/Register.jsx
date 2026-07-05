import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import API_BASE_URL from '../config';
const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '' // Thêm xác nhận mật khẩu để tăng nghiệp vụ
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Nghiệp vụ kiểm tra mật khẩu
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }

        if (formData.password.length < 6) {
            return toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
        }

        setLoading(true);
        try {
            // Loại bỏ confirmPassword trước khi gửi về Backend
            const { confirmPassword, ...dataToSend } = formData;
            
            const response = await axios.post(`${API_BASE_URL}/api/users/register`, dataToSend);
            
            if (response.status === 201 || response.status === 200) {
                toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
                navigate("/login");
            }
        } catch (error) {
            let errorMessage = "Đăng ký thất bại, tên đăng nhập hoặc email đã tồn tại!";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
            toast.error(errorMessage);
            console.error("Register Error:", error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(rgba(26, 26, 26, 0.8), rgba(114, 47, 55, 0.8)), url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover fixed`,
        display: 'flex',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '50px'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card border-0 shadow-lg" style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)',
                borderRadius: "20px",
                overflow: 'hidden'
              }}>
                <div className="p-4 p-md-5">
                  <div className="text-center mb-4 pb-2">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)', color: '#fff' }}>
                        <i className="fa fa-user-plus fs-3"></i>
                    </div>
                    <h3 className="fw-bold text-dark text-uppercase" style={{ letterSpacing: '2px' }}>Đăng Ký</h3>
                    <p className="text-muted small">Tạo tài khoản để trải nghiệm dịch vụ cao cấp</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="text" className="form-control bg-light" id="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={{ borderRadius: "12px", border: '1px solid #eee' }} />
                          <label htmlFor="fullName" className="text-muted"><i className="fa fa-id-card me-2"></i>Họ và Tên</label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="text" className="form-control bg-light" id="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={{ borderRadius: "12px", border: '1px solid #eee' }} />
                          <label htmlFor="username" className="text-muted"><i className="fa fa-user me-2"></i>Tên đăng nhập</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <input type="email" className="form-control bg-light" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ borderRadius: "12px", border: '1px solid #eee' }} />
                          <label htmlFor="email" className="text-muted"><i className="fa fa-envelope me-2"></i>Địa chỉ Email</label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="password" className="form-control bg-light" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ borderRadius: "12px", border: '1px solid #eee' }} />
                          <label htmlFor="password" className="text-muted"><i className="fa fa-lock me-2"></i>Mật khẩu</label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="password" className="form-control bg-light" id="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={{ borderRadius: "12px", border: '1px solid #eee' }} />
                          <label htmlFor="confirmPassword" className="text-muted"><i className="fa fa-check-circle me-2"></i>Xác nhận MK</label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 mb-3">
                        <small className="text-muted d-block text-center" style={{ fontSize: '12px' }}>
                          Bằng việc đăng ký, bạn đồng ý với <Link to="#" className="text-decoration-none" style={{ color: '#722f37' }}>Điều khoản dịch vụ</Link> và <Link to="#" className="text-decoration-none" style={{ color: '#722f37' }}>Chính sách bảo mật</Link> của chúng tôi.
                        </small>
                    </div>

                    <button className="btn w-100 py-3 fw-bold text-white shadow" type="submit" disabled={loading} style={{ borderRadius: "12px", background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)', border: 'none', letterSpacing: '1px', transition: "all 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(114,47,55,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "TẠO TÀI KHOẢN"}
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="small text-muted mb-0">
                      Đã có tài khoản?{" "}
                      <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#722f37' }}>Đăng nhập ngay</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;