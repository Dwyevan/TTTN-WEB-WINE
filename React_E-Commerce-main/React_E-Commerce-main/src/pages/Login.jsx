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
      <div className="container my-5 py-5">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "15px" }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark text-uppercase">Đăng Nhập</h2>
                <p className="text-muted small">Vui lòng nhập thông tin của bạn</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control border-0 bg-light shadow-none"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                  <label htmlFor="username">Tên đăng nhập</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control border-0 bg-light shadow-none"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                  <label htmlFor="password">Mật khẩu</label>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label small text-muted" htmlFor="remember">
                      Ghi nhớ
                    </label>
                  </div>
                  <Link to="/register" className="small text-dark fw-bold text-decoration-none">
                    Tạo tài khoản?
                  </Link>
                </div>

                <button 
                  className="btn btn-dark w-100 py-3 fw-bold shadow-sm" 
                  type="submit"
                  disabled={loading}
                  style={{ borderRadius: "10px", transition: "all 0.3s" }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    "ĐĂNG NHẬP"
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/" className="text-muted small text-decoration-none">
                  <i className="fa fa-arrow-left me-1"></i> Trở về trang chủ
                </Link>
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