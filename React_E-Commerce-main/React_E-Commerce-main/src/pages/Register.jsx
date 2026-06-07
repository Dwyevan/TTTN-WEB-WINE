import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
            
            const response = await axios.post("http://localhost:8080/api/users/register", dataToSend);
            
            if (response.status === 201 || response.status === 200) {
                toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
                navigate("/login");
            }
        } catch (error) {
            const message = error.response?.data || "Đăng ký thất bại, tên đăng nhập hoặc email đã tồn tại!";
            toast.error(message);
            console.error("Register Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-5 py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "15px" }}>
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark text-uppercase">Đăng Ký</h2>
                                <p className="text-muted small">Tạo tài khoản để trải nghiệm dịch vụ rượu cao cấp</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light shadow-none"
                                        id="fullName"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <label htmlFor="fullName">Họ và Tên</label>
                                </div>

                                {/* Username */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control border-0 bg-light shadow-none"
                                        id="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <label htmlFor="username">Tên đăng nhập</label>
                                </div>

                                {/* Email */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control border-0 bg-light shadow-none"
                                        id="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <label htmlFor="email">Địa chỉ Email</label>
                                </div>

                                {/* Password */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control border-0 bg-light shadow-none"
                                        id="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <label htmlFor="password">Mật khẩu</label>
                                </div>

                                {/* Confirm Password */}
                                <div className="form-floating mb-4">
                                    <input
                                        type="password"
                                        className="form-control border-0 bg-light shadow-none"
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                </div>

                                <button 
                                    className="btn btn-dark w-100 py-3 fw-bold shadow-sm" 
                                    type="submit"
                                    disabled={loading}
                                    style={{ borderRadius: "10px" }}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        "TẠO TÀI KHOẢN"
                                    )}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                <p className="small text-muted">
                                    Đã có tài khoản?{" "}
                                    <Link to="/login" className="text-dark fw-bold text-decoration-none">
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                                <Link to="/" className="text-muted small text-decoration-none">
                                    <i className="fa fa-arrow-left me-1"></i> Về trang chủ
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

export default Register;