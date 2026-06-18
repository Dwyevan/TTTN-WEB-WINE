import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import axios from "axios";
import { toast } from "react-hot-toast"; // Dùng toast thay alert để chuyên nghiệp hơn

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Trạng thái chờ khi bấm đăng nhập
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading

    try {
      const response = await axios.post("http://localhost:8080/api/users/login", credentials);
      
      if (response.status === 200) {
        // Lưu toàn bộ data (bao gồm cả role) vào localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        
        toast.success(`Chào mừng trở lại, ${response.data.fullName || response.data.username}!`);
        
        // Điều hướng thông minh: Nếu là ADMIN thì vào thẳng trang quản trị
        if (response.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const message = error.response?.data || "Tên đăng nhập hoặc mật khẩu không đúng!";
      toast.error(message);
      console.error("Login Error:", error);
    } finally {
      setLoading(false); // Kết thúc loading
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
        paddingTop: '80px',
        paddingBottom: '50px'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
              <div className="card border-0 shadow-lg" style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)',
                borderRadius: "20px",
                overflow: 'hidden'
              }}>
                <div className="p-4 p-md-5">
                  <div className="text-center mb-4 pb-2">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)', color: '#fff' }}>
                        <i className="fa fa-wine-glass-alt fs-2"></i>
                    </div>
                    <h3 className="fw-bold text-dark text-uppercase" style={{ letterSpacing: '2px' }}>Đăng Nhập</h3>
                    <p className="text-muted small">Chào mừng trở lại thế giới vang thượng hạng</p>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "12px", border: '1px solid #eee' }}
                      />
                      <label htmlFor="username" className="text-muted"><i className="fa fa-user me-2"></i>Tên đăng nhập</label>
                    </div>

                    <div className="form-floating mb-4">
                      <input
                        type="password"
                        className="form-control bg-light"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: "12px", border: '1px solid #eee' }}
                      />
                      <label htmlFor="password" className="text-muted"><i className="fa fa-lock me-2"></i>Mật khẩu</label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember" style={{ accentColor: '#722f37', cursor: 'pointer' }} />
                        <label className="form-check-label small text-muted" htmlFor="remember" style={{ cursor: 'pointer' }}>
                          Ghi nhớ
                        </label>
                      </div>
                      <Link to="#" className="small text-decoration-none" style={{ color: '#722f37', fontWeight: '600' }}>Quên mật khẩu?</Link>
                    </div>

                    <button 
                      className="btn w-100 py-3 fw-bold text-white shadow mb-3" 
                      type="submit"
                      disabled={loading}
                      style={{ 
                        borderRadius: "12px", 
                        background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)',
                        border: 'none',
                        letterSpacing: '1px',
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(114,47,55,0.3)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        "ĐĂNG NHẬP"
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="small text-muted mb-0">
                      Chưa có tài khoản?{" "}
                      <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#722f37' }}>
                        Tạo tài khoản mới
                      </Link>
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

export default Login;