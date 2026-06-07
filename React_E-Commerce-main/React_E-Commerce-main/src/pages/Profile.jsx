import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null); // Trạng thái cho modal chi tiết đơn hàng
    const [loadingOrder, setLoadingOrder] = useState(false);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setFormData(userData);
            fetchUserOrders(userData.id);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchUserOrders = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi lấy lịch sử đơn hàng:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        if(e) e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8080/api/users/${user.id}`, formData);
            if (res.status === 200) {
                const updatedUser = res.data;
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setIsEditing(false);
                toast.success("Cập nhật thông tin thành công!");
            }
        } catch (err) {
            toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
            console.error(err);
        }
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        toast.success("Đã gửi yêu cầu đổi mật khẩu. Vui lòng kiểm tra email!");
        // Mocking the password change API call
    };

    const fetchOrderDetails = async (orderId) => {
        setLoadingOrder(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
            setSelectedOrder(res.data);
            const modal = new window.bootstrap.Modal(document.getElementById('orderDetailModal'));
            modal.show();
        } catch (err) {
            toast.error("Không thể lấy chi tiết đơn hàng.");
        } finally {
            setLoadingOrder(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return <span className="badge" style={{ background: '#e6a700', color: '#fff' }}>Chờ thanh toán</span>;
            case 'CONFIRMED': return <span className="badge" style={{ background: '#0069d9', color: '#fff' }}>Đã xác nhận</span>;
            case 'SHIPPING': return <span className="badge" style={{ background: '#17a2b8', color: '#fff' }}>Đang giao hàng</span>;
            case 'DELIVERED': return <span className="badge" style={{ background: '#28a745', color: '#fff' }}>Hoàn tất</span>;
            case 'CANCELLED': return <span className="badge" style={{ background: '#dc3545', color: '#fff' }}>Đã hủy</span>;
            case 'PAID': return <span className="badge" style={{ background: '#28a745', color: '#fff' }}>Đã thanh toán</span>;
            case 'FAILED': return <span className="badge" style={{ background: '#dc3545', color: '#fff' }}>Thanh toán lỗi</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="bg-light min-vh-100 py-5">
                <style>{`
                    .profile-sidebar .nav-link {
                        color: #666;
                        padding: 15px 20px;
                        border-radius: 12px;
                        margin-bottom: 5px;
                        transition: all 0.3s;
                        font-weight: 600;
                    }
                    .profile-sidebar .nav-link:hover {
                        background: rgba(114,47,55,0.05);
                        color: #722f37;
                    }
                    .profile-sidebar .nav-link.active {
                        background: #722f37;
                        color: #fff;
                        box-shadow: 0 5px 15px rgba(114,47,55,0.2);
                    }
                    .luxury-input {
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        padding: 12px 15px;
                        transition: all 0.3s;
                        background: #fcfcfc;
                    }
                    .luxury-input:focus {
                        border-color: #d4af37;
                        box-shadow: 0 0 0 0.2rem rgba(212,175,55,0.15);
                        background: #fff;
                    }
                    .btn-burgundy {
                        background-color: #722f37;
                        color: #fff;
                        transition: all 0.3s;
                    }
                    .btn-burgundy:hover {
                        background-color: #5c242c;
                        color: #fff;
                        box-shadow: 0 5px 15px rgba(114,47,55,0.2);
                    }
                    .card-luxury {
                        border: none;
                        border-radius: 16px;
                        box-shadow: 0 5px 25px rgba(0,0,0,0.03);
                    }
                `}</style>
                <div className="container">
                    <div className="row g-4">
                        {/* SIDEBAR NAVIGATION */}
                        <div className="col-lg-3">
                            <div className="card card-luxury p-4 sticky-top" style={{ top: '100px' }}>
                                <div className="text-center mb-4 pb-4 border-bottom">
                                    <div className="position-relative d-inline-block">
                                        <img 
                                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                                            alt="Profile" 
                                            className="img-fluid rounded-circle border p-1" 
                                            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h5 className="mt-3 fw-bold text-dark">{user.fullName}</h5>
                                    <p className="text-muted small mb-0">{user.email}</p>
                                </div>
                                <div className="nav flex-column nav-pills profile-sidebar">
                                    <button className={`nav-link text-start ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                        <i className="fa fa-shopping-bag me-3 w-20 text-center"></i> Lịch Sử Đơn Hàng
                                    </button>
                                    <button className={`nav-link text-start ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                                        <i className="fa fa-user me-3 w-20 text-center"></i> Hồ Sơ Cá Nhân
                                    </button>
                                    <button className={`nav-link text-start ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                                        <i className="fa fa-map-marker me-3 w-20 text-center"></i> Sổ Địa Chỉ
                                    </button>
                                    <button className={`nav-link text-start ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                                        <i className="fa fa-lock me-3 w-20 text-center"></i> Đổi Mật Khẩu
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="col-lg-9">
                            <div className="card card-luxury p-4 p-md-5 h-100">
                                
                                {/* TAB 1: LỊCH SỬ ĐƠN HÀNG */}
                                {activeTab === 'orders' && (
                                    <div>
                                        <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Lịch Sử Đơn Hàng</h4>
                                        {orders.length > 0 ? (
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle">
                                                    <thead style={{ background: 'rgba(114,47,55,0.05)' }}>
                                                        <tr className="small text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>
                                                            <th className="rounded-start ps-4 py-3 border-0">Mã đơn</th>
                                                            <th className="py-3 border-0">Ngày mua</th>
                                                            <th className="py-3 border-0">Tổng tiền</th>
                                                            <th className="py-3 border-0">Trạng thái</th>
                                                            <th className="rounded-end py-3 border-0 text-center">Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map((order) => (
                                                            <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => fetchOrderDetails(order.id)}>
                                                                <td className="ps-4 py-3 fw-bold" style={{ color: '#722f37' }}>#{order.id}</td>
                                                                <td className="text-muted small">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                                                <td className="fw-bold text-dark">{order.totalAmount?.toLocaleString()} đ</td>
                                                                <td>{getStatusBadge(order.status)}</td>
                                                                <td className="text-center">
                                                                    <button className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold" onClick={(e) => { e.stopPropagation(); fetchOrderDetails(order.id); }}>
                                                                        Chi tiết
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <div className="mb-4 d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: '80px', height: '80px', background: 'rgba(114,47,55,0.05)' }}>
                                                    <i className="fa fa-receipt fa-3x" style={{ color: '#722f37' }}></i>
                                                </div>
                                                <h5 className="fw-bold text-dark mb-2">Chưa có đơn hàng nào</h5>
                                                <p className="text-muted mb-4">Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
                                                <button onClick={() => navigate('/product')} className="btn btn-burgundy rounded-pill px-4 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                                    Tiếp tục mua sắm
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: HỒ SƠ CÁ NHÂN */}
                                {activeTab === 'profile' && (
                                    <div>
                                        <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Hồ Sơ Cá Nhân</h4>
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Họ và tên</label>
                                                    <input type="text" className="form-control luxury-input" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Số điện thoại</label>
                                                    <input type="text" className="form-control luxury-input" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Email đăng nhập</label>
                                                    <input type="email" className="form-control luxury-input bg-light" value={user.email} disabled />
                                                    <div className="form-text mt-2"><i className="fa fa-info-circle me-1"></i> Email không thể thay đổi để đảm bảo bảo mật.</div>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-burgundy rounded-pill px-5 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Lưu Hồ Sơ</button>
                                        </form>
                                    </div>
                                )}

                                {/* TAB 3: SỔ ĐỊA CHỈ */}
                                {activeTab === 'address' && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h4 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>Sổ Địa Chỉ</h4>
                                        </div>
                                        <form onSubmit={handleUpdateProfile}>
                                            <div className="mb-4">
                                                <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Địa chỉ giao hàng mặc định</label>
                                                <textarea className="form-control luxury-input" name="address" rows="3" value={formData.address || ''} onChange={handleInputChange} placeholder="Ví dụ: 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM"></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-burgundy rounded-pill px-5 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Cập Nhật Địa Chỉ</button>
                                        </form>
                                    </div>
                                )}

                                {/* TAB 4: ĐỔI MẬT KHẨU */}
                                {activeTab === 'password' && (
                                    <div>
                                        <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Đổi Mật Khẩu</h4>
                                        <form onSubmit={handleChangePassword}>
                                            <div className="row g-4 mb-4">
                                                <div className="col-md-12">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Mật khẩu hiện tại</label>
                                                    <input type="password" className="form-control luxury-input" required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Mật khẩu mới</label>
                                                    <input type="password" className="form-control luxury-input" required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Xác nhận mật khẩu mới</label>
                                                    <input type="password" className="form-control luxury-input" required />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-burgundy rounded-pill px-5 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Đổi Mật Khẩu</button>
                                        </form>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CHI TIẾT ĐƠN HÀNG */}
            <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-labelledby="orderDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="modal-header text-white p-4" style={{ background: 'linear-gradient(135deg, #722f37, #a04050)' }}>
                            <div>
                                <h5 className="modal-title fw-bold mb-1" id="orderDetailModalLabel">Chi tiết đơn hàng #{selectedOrder?.id}</h5>
                                <span className="small opacity-75">{selectedOrder ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : ''}</span>
                            </div>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4 bg-light">
                            {selectedOrder && (
                                <div className="row g-4">
                                    <div className="col-lg-8">
                                        <div className="card border-0 shadow-sm rounded-4 mb-3">
                                            <div className="card-header bg-white border-bottom p-3 fw-bold text-uppercase small text-muted" style={{ letterSpacing: '1px' }}>
                                                Sản phẩm đã mua
                                            </div>
                                            <div className="card-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table align-middle mb-0">
                                                        <tbody>
                                                            {selectedOrder.items?.map((item, idx) => (
                                                                <tr key={idx} className="border-bottom">
                                                                    <td className="ps-3 py-3">
                                                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{item.name}</div>
                                                                        <div className="small text-muted">{item.price?.toLocaleString()} đ x {item.quantity}</div>
                                                                    </td>
                                                                    <td className="pe-3 py-3 text-end fw-bold" style={{ color: '#722f37' }}>
                                                                        {(item.price * item.quantity).toLocaleString()} đ
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="card border-0 shadow-sm rounded-4 mb-3">
                                            <div className="card-body p-3">
                                                <h6 className="fw-bold mb-3 small text-uppercase text-muted border-bottom pb-2">Thông tin thanh toán</h6>
                                                <div className="d-flex justify-content-between mb-2 small">
                                                    <span className="text-muted">Tạm tính</span>
                                                    <span className="fw-bold text-dark">{(selectedOrder.totalAmount - (selectedOrder.totalAmount > 2000000 ? 0 : 35000)).toLocaleString()} đ</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3 small">
                                                    <span className="text-muted">Phí giao</span>
                                                    <span className="fw-bold text-dark">{selectedOrder.totalAmount > 2000000 ? "0 đ" : "35.000 đ"}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3 p-2 rounded" style={{ background: 'rgba(114,47,55,0.05)' }}>
                                                    <span className="fw-bold text-dark">Tổng tiền</span>
                                                    <span className="fw-bold" style={{ color: '#722f37' }}>{selectedOrder.totalAmount?.toLocaleString()} đ</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <span className="text-muted small me-2">Trạng thái:</span>
                                                    {getStatusBadge(selectedOrder.status)}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-outline-dark w-100 rounded-pill fw-bold py-2" data-bs-dismiss="modal">ĐÓNG</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;