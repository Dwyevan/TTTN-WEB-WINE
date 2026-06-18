import React, { useEffect, useState } from 'react';
import { Navbar, Footer } from '../components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null); // Trạng thái cho modal chi tiết đơn hàng
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('orders');
    const [shippingConfig, setShippingConfig] = useState({
        SHIPPING_THRESHOLD: 2000000,
        SHIPPING_FEE: 35000
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/settings");
                if (res.data) {
                    setShippingConfig({
                        SHIPPING_THRESHOLD: parseInt(res.data.FREE_SHIPPING_THRESHOLD) || 2000000,
                        SHIPPING_FEE: parseInt(res.data.SHIPPING_FEE) || 35000
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy cài đặt phí vận chuyển:", error);
            }
        };
        fetchSettings();

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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Mật khẩu mới không khớp!");
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
        }

        setChangingPassword(true);
        const loadingToast = toast.loading("Đang đổi mật khẩu...");
        try {
            await axios.patch(`http://localhost:8080/api/users/${user.id}/password`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Đổi mật khẩu thành công!", { id: loadingToast });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data || "Đổi mật khẩu thất bại!", { id: loadingToast });
        } finally {
            setChangingPassword(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        setLoadingOrder(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
            setSelectedOrder(res.data);
            setCancelReason(""); // Reset lý do hủy
            // Sử dụng modal của bootstrap
            const modalElement = document.getElementById('orderDetailModal');
            if (modalElement) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        } catch (err) {
            toast.error("Không thể tải chi tiết đơn hàng!");
            console.error(err);
        } finally {
            setLoadingOrder(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng nhập lý do hủy đơn hàng!");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:8080/api/orders/user/${selectedOrder.id}/cancel`, {
                reason: cancelReason
            });
            
            if (res.status === 200) {
                toast.success("Đã gửi yêu cầu hủy đơn hàng!");
                // Cập nhật lại list orders
                fetchUserOrders(user.id);
                // Đóng modal
                const modalElement = document.getElementById('orderDetailModal');
                if (modalElement) {
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                }
            }
        } catch (err) {
            toast.error(err.response?.data || "Không thể hủy đơn hàng!");
            console.error(err);
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

    const handleReorder = () => {
        if (!selectedOrder || !selectedOrder.items) return;
        selectedOrder.items.forEach(item => {
            if (item.wine) {
                // Add exact quantity from previous order
                for(let i=0; i<item.quantity; i++) {
                    dispatch(addCart(item.wine));
                }
            }
        });
        toast.success("Đã thêm lại các sản phẩm vào giỏ hàng!");
        
        // Đóng modal
        const modalElement = document.getElementById('orderDetailModal');
        if (modalElement) {
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
        
        // Chuyển hướng đến giỏ hàng
        setTimeout(() => {
            navigate("/cart");
        }, 500);
    };

    const totalOrders = orders.length;
    const totalSpent = orders.filter(o => o.status === 'DELIVERED' || o.status === 'PAID').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

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
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <h4 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>Lịch Sử Đơn Hàng</h4>
                                        </div>
                                        
                                        {/* THỐNG KÊ NHANH */}
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <div className="p-3 rounded-4 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02))', border: '1px solid rgba(212,175,55,0.2)' }}>
                                                    <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '50px', height: '50px', background: 'rgba(212,175,55,0.2)', color: '#d4af37' }}>
                                                        <i className="fa fa-shopping-bag fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <div className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>Tổng số đơn hàng</div>
                                                        <div className="fw-bold fs-4 text-dark">{totalOrders} <span className="fs-6 text-muted fw-normal">đơn</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="p-3 rounded-4 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, rgba(114,47,55,0.1), rgba(114,47,55,0.02))', border: '1px solid rgba(114,47,55,0.2)' }}>
                                                    <div className="rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '50px', height: '50px', background: 'rgba(114,47,55,0.2)', color: '#722f37' }}>
                                                        <i className="fa fa-money fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <div className="small text-muted text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>Tổng tiền tích lũy</div>
                                                        <div className="fw-bold fs-4" style={{ color: '#722f37' }}>{totalSpent.toLocaleString()} <span className="fs-6 text-muted fw-normal">đ</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

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
                                                    <input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} className="form-control luxury-input" required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Mật khẩu mới</label>
                                                    <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="form-control luxury-input" required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="small fw-bold text-muted mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Xác nhận mật khẩu mới</label>
                                                    <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="form-control luxury-input" required />
                                                </div>
                                            </div>
                                            <button type="submit" disabled={changingPassword} className="btn btn-burgundy rounded-pill px-5 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                                {changingPassword ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                                            </button>
                                        </form>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CHI TIẾT ĐƠN HÀNG PREMIUM */}
            <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '850px' }}>
                    <div className="modal-content border-0" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        
                        {/* Header Gradient */}
                        <div className="modal-header p-4 border-0 position-relative" style={{ background: 'linear-gradient(135deg, #4a1c23 0%, #722f37 50%, #9e4350 100%)' }}>
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                <div className="d-flex align-items-center mb-1">
                                    <span className="badge bg-white text-dark me-2 rounded-pill px-3 py-2 fw-bold shadow-sm" style={{ color: '#722f37 !important', fontSize: '14px' }}>
                                        Đơn hàng #{selectedOrder?.id}
                                    </span>
                                    <div style={{ transform: 'scale(1.1)', transformOrigin: 'left center' }}>
                                        {selectedOrder && getStatusBadge(selectedOrder.status)}
                                    </div>
                                </div>
                                <div className="text-white opacity-75 small mt-2 ms-1">
                                    <i className="fa fa-clock me-1"></i> {selectedOrder ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : ''}
                                </div>
                            </div>
                            <button type="button" className="btn-close btn-close-white position-absolute" style={{ top: '24px', right: '24px', zIndex: 1 }} data-bs-dismiss="modal" aria-label="Close"></button>
                            {/* Decorative Circle */}
                            <div className="position-absolute" style={{ width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', top: '-50px', right: '-20px', zIndex: 0 }}></div>
                            <div className="position-absolute" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', bottom: '-30px', left: '20%', zIndex: 0 }}></div>
                        </div>

                        <div className="modal-body p-4 p-md-5 bg-white">
                            {selectedOrder && (
                                <div className="row g-5">
                                    {/* Left Column: Products */}
                                    <div className="col-lg-7">
                                        <h6 className="fw-bold mb-4 text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '13px' }}>
                                            <i className="fa fa-shopping-bag me-2"></i>Sản phẩm đã mua ({selectedOrder.items?.length})
                                        </h6>
                                        <div className="d-flex flex-column gap-3">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <div key={idx} className="d-flex align-items-center p-3 rounded-4" style={{ border: '1px solid #f0f0f0', transition: 'all 0.2s', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                                    <div className="d-flex justify-content-center align-items-center rounded-3 overflow-hidden shadow-sm" style={{ width: '70px', height: '70px', flexShrink: 0, background: 'rgba(114,47,55,0.05)', border: '1px solid #f0f0f0' }}>
                                                        {item.wine?.imageUrl ? (
                                                            <img src={item.wine.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/70x70?text=🍷" }} />
                                                        ) : (
                                                            <i className="fa fa-wine-bottle fs-3" style={{ color: '#722f37', opacity: 0.8 }}></i>
                                                        )}
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>{item.name}</h6>
                                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                                            <span className="small text-muted">{item.price?.toLocaleString()} đ <span className="mx-1">x</span> <span className="badge rounded-pill" style={{ background: '#f8f9fa', color: '#333', border: '1px solid #ddd' }}>{item.quantity}</span></span>
                                                            <span className="fw-bold" style={{ color: '#722f37', fontSize: '15px' }}>{(item.price * item.quantity).toLocaleString()} đ</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cancellation Reason if any */}
                                        {selectedOrder.cancellationReason && (
                                            <div className="mt-4 p-4 rounded-4" style={{ background: '#fff8f8', border: '1px dashed #ffcdd2' }}>
                                                <div className="d-flex align-items-center mb-2 text-danger fw-bold">
                                                    <i className="fa fa-exclamation-circle me-2 fs-5"></i>Lý do hủy đơn
                                                </div>
                                                <div className="small text-danger opacity-75" style={{ lineHeight: '1.6' }}>{selectedOrder.cancellationReason}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Summary & Actions */}
                                    <div className="col-lg-5">
                                        <div className="p-4 rounded-4" style={{ background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                                            <h6 className="fw-bold mb-4 text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '13px' }}>
                                                <i className="fa fa-receipt me-2"></i>Thanh toán
                                            </h6>
                                            
                                            <div className="d-flex justify-content-between mb-3 small">
                                                <span className="text-muted">Tạm tính</span>
                                                <span className="fw-semibold text-dark">{(selectedOrder.totalAmount - (selectedOrder.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? 0 : shippingConfig.SHIPPING_FEE)).toLocaleString()} đ</span>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between mb-3 small">
                                                <span className="text-muted">Phí giao hàng</span>
                                                <span className="fw-semibold text-success">{selectedOrder.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? "Miễn phí" : `${shippingConfig.SHIPPING_FEE.toLocaleString()} đ`}</span>
                                            </div>

                                            <hr className="my-3 opacity-10" />

                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <span className="fw-bold text-dark">Tổng tiền</span>
                                                <span className="fw-bold fs-4" style={{ color: '#722f37' }}>{selectedOrder.totalAmount?.toLocaleString()} <span className="fs-6">đ</span></span>
                                            </div>

                                            {/* Cancel Order Form */}
                                            {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'PAID') && (
                                                <div className="mt-4 pt-4 border-top">
                                                    <h6 className="fw-bold mb-2 small text-danger"><i className="fa fa-ban me-1"></i> Yêu cầu hủy đơn</h6>
                                                    <p className="small text-muted mb-3" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                                                        {selectedOrder.status === 'PAID' 
                                                            ? "Đơn hàng đã thanh toán. Hệ thống sẽ ghi nhận và Admin sẽ hoàn tiền lại cho bạn." 
                                                            : "Bạn có chắc chắn muốn hủy đơn hàng này?"}
                                                    </p>
                                                    <textarea 
                                                        className="form-control mb-3 luxury-input" 
                                                        rows="2" 
                                                        placeholder="Nhập lý do hủy (bắt buộc)..."
                                                        value={cancelReason}
                                                        onChange={(e) => setCancelReason(e.target.value)}
                                                        style={{ fontSize: '13px', resize: 'none', background: '#fff' }}
                                                    ></textarea>
                                                    <button 
                                                        className="btn w-100 rounded-pill fw-bold py-2 shadow-sm"
                                                        style={{ background: '#fff', color: '#dc3545', border: '1px solid #dc3545', transition: 'all 0.2s', fontSize: '14px', letterSpacing: '0.5px' }}
                                                        onMouseEnter={(e) => { e.target.style.background = '#dc3545'; e.target.style.color = '#fff'; }}
                                                        onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#dc3545'; }}
                                                        onClick={handleCancelOrder}
                                                    >
                                                        XÁC NHẬN HỦY
                                                    </button>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="d-flex gap-2 mt-3">
                                                <button 
                                                    className="btn flex-grow-1 rounded-pill fw-bold py-3 shadow-sm d-flex align-items-center justify-content-center gap-2" 
                                                    style={{ background: '#d4af37', color: '#1a1a1a', letterSpacing: '0.5px', fontSize: '14px', border: 'none' }}
                                                    onClick={handleReorder}
                                                >
                                                    <i className="fa fa-refresh"></i> MUA LẠI ĐƠN NÀY
                                                </button>
                                            </div>

                                            <button className="btn btn-dark w-100 rounded-pill fw-bold py-3 mt-3 shadow-sm" data-bs-dismiss="modal" style={{ letterSpacing: '1px', fontSize: '14px', background: '#1a1a1a' }}>
                                                ĐÓNG LẠI
                                            </button>
                                        </div>
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