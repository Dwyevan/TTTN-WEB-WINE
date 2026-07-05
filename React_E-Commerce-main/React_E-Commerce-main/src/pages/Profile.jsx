import React, { useEffect, useState } from 'react';
import { Navbar, Footer, Pagination } from '../components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCart } from '../redux/action';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import API_BASE_URL from '../config';
const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelReasonType, setCancelReasonType] = useState("");
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    
    // Password Visibility States
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [expandedOrders, setExpandedOrders] = useState([]);
    
    // Review States
    const [reviewOrder, setReviewOrder] = useState(null);
    const [reviews, setReviews] = useState({});

    // Profile Edit States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const closeModal = (modalId) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            try {
                if (window.bootstrap?.Modal?.getInstance) {
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                        return;
                    }
                }
            } catch (e) {}
            
            // Fallback manual hide for Bootstrap
            modalElement.classList.remove('show');
            setTimeout(() => {
                modalElement.style.display = 'none';
            }, 150);
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const [activeTab, setActiveTab] = useState('orders');
    const [shippingConfig, setShippingConfig] = useState({
        SHIPPING_THRESHOLD: 2000000,
        SHIPPING_FEE: 35000
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/settings`);
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

    const toggleOrderExpand = (orderId) => {
        setExpandedOrders(prev => 
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const fetchUserOrders = async (userId) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders/user/${userId}`);
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
            const res = await axios.put(`${API_BASE_URL}/api/users/${user.id}`, formData);
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
            await axios.patch(`${API_BASE_URL}/api/users/${user.id}/password`, {
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
            const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
            setSelectedOrder(res.data);
            setCancelReason(""); 
            setCancelReasonType("");
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
        const finalReason = cancelReasonType === 'other' ? cancelReason : cancelReasonType;
        if (!finalReason || !finalReason.trim()) {
            toast.error("Vui lòng chọn hoặc nhập lý do hủy đơn hàng!");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/orders/user/${selectedOrder.id}/cancel`, {
                reason: finalReason
            });
            
            if (res.status === 200) {
                toast.success("Đã gửi yêu cầu hủy đơn hàng!");
                fetchUserOrders(user.id);
                closeModal('orderDetailModal');
            }
        } catch (err) {
            toast.error(err.response?.data || "Không thể hủy đơn hàng!");
            console.error(err);
        }
    };

    const openReviewModal = (order) => {
        setReviewOrder(order);
        const initialReviews = {};
        if (order.items) {
            order.items.forEach(item => {
                initialReviews[item.id] = { rating: 5, comment: '' };
            });
        }
        setReviews(initialReviews);
        
        const modalElement = document.getElementById('reviewModal');
        if (modalElement) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const handleReviewChange = (itemId, field, value) => {
        setReviews(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    const handlePostReview = async () => {
        try {
            let hasComment = false;
            const promises = reviewOrder.items.map(item => {
                const rev = reviews[item.id];
                if (!rev || !rev.comment.trim()) return Promise.resolve();
                
                hasComment = true;
                const fbData = {
                    fullName: user?.fullName || "Khách hàng",
                    email: user?.email || "guest@winestore.com",
                    subject: item.name || "Sản phẩm WineStore",
                    message: `[${rev.rating} SAO] - ${rev.comment}`
                };
                return axios.post(`${API_BASE_URL}/api/feedbacks`, fbData);
            });

            if (!hasComment) {
                toast.error("Vui lòng nhập ít nhất 1 đánh giá!");
                return;
            }

            await Promise.all(promises);
            toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
            
            closeModal('reviewModal');
            setReviewOrder(null);
        } catch (err) {
            toast.error("Có lỗi xảy ra khi gửi đánh giá!");
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

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ thanh toán';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'SHIPPING': return 'Đang giao hàng';
            case 'DELIVERED': return 'Hoàn tất';
            case 'CANCELLED': return 'Đã hủy';
            case 'PAID': return 'Đã thanh toán';
            case 'FAILED': return 'Thanh toán lỗi';
            default: return status;
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': case 'PAID': return 'fa-check-circle text-success';
            case 'SHIPPING': return 'fa-truck text-info';
            case 'CANCELLED': return 'fa-times-circle text-danger';
            default: return 'fa-clock-o text-warning';
        }
    };

    const handleReorder = () => {
        if (!selectedOrder || !selectedOrder.items) return;
        selectedOrder.items.forEach(item => {
            if (item.wine) {
                for(let i=0; i<item.quantity; i++) {
                    dispatch(addCart(item.wine));
                }
            }
        });
        toast.success("Đã thêm lại các sản phẩm vào giỏ hàng!");
        
        const modalElement = document.getElementById('orderDetailModal');
        if (modalElement) {
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
        
        setTimeout(() => {
            navigate("/cart");
        }, 500);
    };

    const handleSignOut = () => {
        localStorage.removeItem('user');
        toast.success("Đăng xuất thành công!");
        navigate('/login');
    };

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="bg-light min-vh-100 py-5">
                <style>{`
                    .profile-container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .profile-sidebar {
                        background: #fff;
                        border-radius: 8px;
                        border: 1px solid #e0e0e0;
                    }
                    .profile-sidebar .nav-title {
                        font-weight: 700;
                        font-size: 1.25rem;
                        padding: 1.5rem 1.5rem 0.5rem;
                        color: #1a1a1a;
                    }
                    .profile-sidebar .nav-subtitle {
                        font-size: 0.85rem;
                        color: #666;
                        padding: 0 1.5rem 1.5rem;
                        border-bottom: 1px solid #f0f0f0;
                    }
                    .profile-sidebar .nav-link {
                        color: #333;
                        padding: 12px 24px;
                        border-radius: 0;
                        margin-bottom: 0;
                        transition: all 0.2s;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        border-left: 3px solid transparent;
                    }
                    .profile-sidebar .nav-link:hover {
                        background: rgba(114,47,55,0.05);
                        color: #722f37;
                    }
                    .profile-sidebar .nav-link.active {
                        background: rgba(114,47,55,0.05);
                        color: #722f37;
                        border-left: 3px solid #722f37;
                        font-weight: 600;
                    }
                    .profile-sidebar .nav-link i {
                        width: 24px;
                        text-align: center;
                        margin-right: 12px;
                        font-size: 1.1rem;
                    }
                    
                    .order-card {
                        background: #fff;
                        border-radius: 8px;
                        border: 1px solid #e0e0e0;
                        margin-bottom: 24px;
                        overflow: hidden;
                    }
                    .order-card-header {
                        background: #f8f9fa;
                        border-bottom: 1px solid #e0e0e0;
                        padding: 16px 24px;
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        gap: 16px;
                    }
                    .order-header-item {
                        display: flex;
                        flex-direction: column;
                    }
                    .order-header-label {
                        font-size: 0.75rem;
                        text-transform: uppercase;
                        color: #666;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    }
                    .order-header-value {
                        font-size: 0.9rem;
                        color: #1a1a1a;
                        font-weight: 500;
                    }
                    .order-card-body {
                        padding: 24px;
                    }
                    .order-status {
                        font-weight: 700;
                        font-size: 1.1rem;
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .btn-view-details {
                        background: #1a1a1a;
                        color: #fff;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 0.85rem;
                        transition: all 0.2s;
                    }
                    .btn-view-details:hover {
                        background: #333;
                        color: #fff;
                    }
                    .btn-track {
                        background: #fff;
                        color: #1a1a1a;
                        border: 1px solid #d0d0d0;
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 0.85rem;
                        transition: all 0.2s;
                    }
                    .btn-track:hover {
                        background: #f0f0f0;
                    }

                    .luxury-input {
                        border: 1px solid #d0d0d0;
                        border-radius: 4px;
                        padding: 10px 15px;
                        transition: all 0.3s;
                        background: #fff;
                    }
                    .luxury-input:focus {
                        border-color: #722f37;
                        box-shadow: 0 0 0 0.2rem rgba(114,47,55,0.1);
                        background: #fff;
                    }
                    .btn-burgundy {
                        background-color: #722f37;
                        color: #fff;
                        transition: all 0.3s;
                        border-radius: 4px;
                    }
                    .btn-burgundy:hover {
                        background-color: #5c242c;
                        color: #fff;
                    }

                    .timeline-wrapper {
                        position: relative;
                        padding: 30px 0 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .timeline-line {
                        position: absolute;
                        top: 44px;
                        left: 10%;
                        right: 10%;
                        height: 4px;
                        background: #f0f0f0;
                        z-index: 1;
                        border-radius: 4px;
                    }
                    .timeline-line-progress {
                        position: absolute;
                        top: 44px;
                        left: 10%;
                        height: 4px;
                        background: #722f37;
                        z-index: 2;
                        border-radius: 4px;
                        transition: width 1s ease-in-out;
                    }
                    .timeline-step {
                        position: relative;
                        z-index: 3;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 25%;
                    }
                    .timeline-icon {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background: #fff;
                        border: 3px solid #f0f0f0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                        margin-bottom: 12px;
                        color: #ccc;
                    }
                    .timeline-step.completed .timeline-icon {
                        background: #722f37;
                        border-color: #722f37;
                        color: #fff;
                    }
                    .timeline-step.active .timeline-icon {
                        background: #fff;
                        border-color: #722f37;
                        color: #722f37;
                        box-shadow: 0 0 0 6px rgba(114, 47, 55, 0.15);
                        animation: pulse-ring 2s infinite;
                    }
                    .timeline-step.completed .timeline-icon i {
                        font-size: 14px;
                    }
                    .timeline-step.active .timeline-icon i {
                        font-size: 14px;
                    }
                    @keyframes pulse-ring {
                        0% { box-shadow: 0 0 0 0 rgba(114, 47, 55, 0.4); }
                        70% { box-shadow: 0 0 0 10px rgba(114, 47, 55, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(114, 47, 55, 0); }
                    }
                    .timeline-label {
                        font-size: 13px;
                        font-weight: 600;
                        color: #999;
                        text-align: center;
                    }
                    .timeline-step.completed .timeline-label,
                    .timeline-step.active .timeline-label {
                        color: #1a1a1a;
                    }

                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1; 
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #ccc; 
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #999; 
                    }

                    .animation-fade-in {
                        animation: fadeIn 0.3s ease-in-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .star-rating i {
                        cursor: pointer;
                        color: #ddd;
                        transition: color 0.2s, transform 0.2s;
                        font-size: 24px;
                        margin-right: 6px;
                    }
                    .star-rating i.active {
                        color: #ffc107;
                    }
                    .star-rating i:hover {
                        transform: scale(1.15);
                    }
                `}</style>
                <div className="profile-container px-3">
                    <div className="row g-4">
                        {/* SIDEBAR NAVIGATION */}
                        <div className="col-lg-3">
                            <div className="profile-sidebar sticky-top" style={{ top: '100px' }}>
                                <div className="nav-title">Tài Khoản Của Tôi</div>
                                <div className="nav-subtitle">Quản lý đơn hàng & cài đặt</div>
                                
                                <div className="nav flex-column nav-pills py-3">
                                    <button className={`nav-link text-start ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                                        <i className="fa fa-user-o"></i> Chi Tiết Hồ Sơ
                                    </button>
                                    <button className={`nav-link text-start ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                        <i className="fa fa-shopping-bag"></i> Đơn Hàng Của Tôi
                                    </button>
                                    <button className={`nav-link text-start ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => navigate('/wishlist')}>
                                        <i className="fa fa-heart-o"></i> Danh Sách Yêu Thích
                                    </button>
                                    <div className="border-top my-2"></div>
                                    <button className="nav-link text-start text-danger" onClick={handleSignOut}>
                                        <i className="fa fa-sign-out"></i> Đăng Xuất
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="col-lg-9">
                            
                            {/* TAB 1: LỊCH SỬ ĐƠN HÀNG */}
                            {activeTab === 'orders' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                        <h4 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>Lịch Sử Đơn Hàng</h4>
                                        <div className="d-flex gap-2">
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0"><i className="fa fa-search text-muted"></i></span>
                                                <input type="text" className="form-control border-start-0 ps-0" placeholder="Tìm kiếm đơn hàng..." style={{ boxShadow: 'none' }}/>
                                            </div>
                                            <button className="btn btn-outline-secondary"><i className="fa fa-filter"></i></button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-muted mb-4">Theo dõi, quản lý và xem lại các giao dịch trước đây của bạn.</p>

                                    {(() => {
                                        const indexOfLastOrder = currentPage * ordersPerPage;
                                        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
                                        const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
                                        const totalPages = Math.ceil(orders.length / ordersPerPage);
                                        
                                        return (
                                            <>
                                                {currentOrders.length > 0 ? (
                                                    currentOrders.map((order) => (
                                            <div key={order.id} className="order-card">
                                                <div className="order-card-header">
                                                    <div className="d-flex gap-4 gap-md-5 flex-wrap">
                                                        <div className="order-header-item">
                                                            <span className="order-header-label">Ngày Đặt Hàng</span>
                                                            <span className="order-header-value">{new Date(order.orderDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                        </div>
                                                        <div className="order-header-item">
                                                            <span className="order-header-label">Tổng Cộng</span>
                                                            <span className="order-header-value">{order.totalAmount?.toLocaleString()} đ</span>
                                                        </div>
                                                        <div className="order-header-item">
                                                            <span className="order-header-label">Giao Đến</span>
                                                            <span className="order-header-value">{user.fullName}</span>
                                                        </div>
                                                    </div>
                                                    <div className="order-header-item text-md-end mt-2 mt-md-0">
                                                        <span className="order-header-label">Mã Đơn Hàng #</span>
                                                        <span className="order-header-value">WS-{order.id.toString().padStart(6, '0')}</span>
                                                    </div>
                                                </div>
                                                <div className="order-card-body">
                                                    <div className="d-flex justify-content-between flex-wrap gap-3">
                                                        <div>
                                                            <div className="order-status">
                                                                <i className={`fa ${getStatusIcon(order.status)}`}></i>
                                                                {getStatusText(order.status)}
                                                            </div>
                                                            <p className="small text-muted mb-4">
                                                                {order.status === 'DELIVERED' ? 'Đã giao hàng thành công.' : 'Cập nhật trạng thái tự động từ hệ thống.'}
                                                            </p>
                                                            
                                                            <div className="d-flex flex-column gap-2" style={{ maxWidth: '500px' }}>
                                                                {order.items && order.items.length > 0 ? (
                                                                    <>
                                                                        <div className="d-flex align-items-center p-3 rounded" style={{ border: '1px solid #f0f0f0', background: '#fff' }}>
                                                                            <div className="bg-light rounded border d-flex justify-content-center align-items-center overflow-hidden" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                                                                {order.items[0].wine?.imageUrl ? (
                                                                                    <img src={order.items[0].wine.imageUrl} alt={order.items[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/60x60?text=🍷" }} />
                                                                                ) : (
                                                                                    <i className="fa fa-wine-bottle text-muted fs-4"></i>
                                                                                )}
                                                                            </div>
                                                                            <div className="ms-3 flex-grow-1" style={{ minWidth: 0 }}>
                                                                                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.95rem' }}>{order.items[0].name}</div>
                                                                                <div className="small text-muted mt-1">Số lượng: {order.items[0].quantity}</div>
                                                                            </div>
                                                                            <div className="fw-bold ms-2 flex-shrink-0" style={{ color: '#722f37', fontSize: '0.95rem' }}>
                                                                                {(order.items[0].price * order.items[0].quantity).toLocaleString()} đ
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {expandedOrders.includes(order.id) && order.items.slice(1).map((item, idx) => (
                                                                            <div key={idx} className="d-flex align-items-center p-3 rounded mt-2" style={{ border: '1px solid #f0f0f0', background: '#fff' }}>
                                                                                <div className="bg-light rounded border d-flex justify-content-center align-items-center overflow-hidden" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                                                                    {item.wine?.imageUrl ? (
                                                                                        <img src={item.wine.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/60x60?text=🍷" }} />
                                                                                    ) : (
                                                                                        <i className="fa fa-wine-bottle text-muted fs-4"></i>
                                                                                    )}
                                                                                </div>
                                                                                <div className="ms-3 flex-grow-1" style={{ minWidth: 0 }}>
                                                                                    <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.95rem' }}>{item.name}</div>
                                                                                    <div className="small text-muted mt-1">Số lượng: {item.quantity}</div>
                                                                                </div>
                                                                                <div className="fw-bold ms-2 flex-shrink-0" style={{ color: '#722f37', fontSize: '0.95rem' }}>
                                                                                    {(item.price * item.quantity).toLocaleString()} đ
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        
                                                                        {order.items.length > 1 && (
                                                                            <div 
                                                                                className="text-center mt-1 py-2 text-muted" 
                                                                                style={{ cursor: 'pointer', fontSize: '0.85rem', border: '1px dashed #e0e0e0', borderRadius: '4px', background: '#fafafa', transition: 'background 0.2s' }}
                                                                                onClick={() => toggleOrderExpand(order.id)}
                                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                                                                                onMouseLeave={(e) => e.currentTarget.style.background = '#fafafa'}
                                                                            >
                                                                                {expandedOrders.includes(order.id) ? (
                                                                                    <span className="fw-semibold"><i className="fa fa-chevron-up me-1"></i> Thu gọn</span>
                                                                                ) : (
                                                                                    <span className="fw-semibold"><i className="fa fa-chevron-down me-1"></i> Xem thêm {order.items.length - 1} sản phẩm</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <div className="d-flex align-items-center p-3 rounded" style={{ border: '1px solid #f0f0f0', background: '#fafafa' }}>
                                                                        <div className="bg-white rounded border d-flex justify-content-center align-items-center" style={{ width: '60px', height: '60px' }}>
                                                                            <i className="fa fa-wine-bottle text-muted fs-4"></i>
                                                                        </div>
                                                                        <div className="ms-3">
                                                                            <div className="fw-bold" style={{ fontSize: '0.95rem' }}>Chi tiết sản phẩm</div>
                                                                            <div className="small text-muted">Nhấn vào "Xem Chi Tiết" để xem đơn hàng.</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column gap-2" style={{ minWidth: '150px' }}>
                                                            <button className="btn-view-details w-100" onClick={() => fetchOrderDetails(order.id)}>
                                                                Xem Chi Tiết
                                                            </button>
                                                            {(order.status === 'DELIVERED' || order.status === 'PAID') && (
                                                                <button className="btn-track w-100" onClick={() => openReviewModal(order)}>
                                                                    Đánh Giá
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-5 bg-white border rounded">
                                            <div className="mb-4 d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: '80px', height: '80px', background: 'rgba(114,47,55,0.05)' }}>
                                                <i className="fa fa-receipt fa-3x" style={{ color: '#722f37' }}></i>
                                            </div>
                                            <h5 className="fw-bold text-dark mb-2">Chưa có đơn hàng nào</h5>
                                            <p className="text-muted mb-4">Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
                                            <button onClick={() => navigate('/product')} className="btn btn-burgundy px-4 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                                                Tiếp tục mua sắm
                                            </button>
                                        </div>
                                    )}
                                    
                                    {orders.length > 0 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                            totalItems={orders.length}
                                            itemsPerPage={ordersPerPage}
                                        />
                                    )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* TAB 2: HỒ SƠ CÁ NHÂN (DASHBOARD STYLE) */}
                            {activeTab === 'profile' && (
                                <div className="animation-fade-in">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className="fw-bold mb-0" style={{ color: '#1a1a1a', letterSpacing: '0.5px' }}>Thông Tin Cá Nhân</h4>
                                    </div>
                                    <p className="text-muted mb-4 pb-2 border-bottom">Quản lý thông tin chi tiết, địa chỉ giao hàng và cài đặt bảo mật của bạn.</p>
                                    
                                    <div className="row g-4">
                                        {/* Basic Details Card */}
                                        <div className="col-lg-6">
                                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px', background: '#ffffff', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                                <div className="card-body p-4 p-xl-5">
                                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                                        <h5 className="fw-bold mb-0 text-dark"><i className="fa fa-id-card-o me-2" style={{ color: '#722f37' }}></i>Thông Tin Cơ Bản</h5>
                                                        <button 
                                                            className="btn btn-sm text-decoration-none fw-bold" 
                                                            style={{ color: '#722f37', background: 'rgba(114, 47, 55, 0.1)', borderRadius: '8px', padding: '6px 12px' }}
                                                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                                                        >
                                                            {isEditingProfile ? <><i className="fa fa-times me-1"></i>Hủy</> : <><i className="fa fa-pencil me-1"></i>Chỉnh sửa</>}
                                                        </button>
                                                    </div>
                                                    {isEditingProfile ? (
                                                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(e); setIsEditingProfile(false); }} className="animation-fade-in">
                                                                <div className="mb-3">
                                                                    <label className="small text-muted fw-bold mb-1">Tên đăng nhập (Username)</label>
                                                                    <div className="input-group">
                                                                        <span className="input-group-text bg-light border-0"><i className="fa fa-user-circle text-muted"></i></span>
                                                                        <input type="text" className="form-control bg-light border-0" value={user.username} disabled style={{ borderRadius: '0 10px 10px 0', fontSize: '0.95rem' }} />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="small text-muted fw-bold mb-1">Email</label>
                                                                    <div className="input-group">
                                                                        <span className="input-group-text bg-light border-0"><i className="fa fa-envelope text-muted"></i></span>
                                                                        <input type="text" className="form-control bg-light border-0" value={user.email} disabled style={{ borderRadius: '0 10px 10px 0', fontSize: '0.95rem' }} />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="small text-muted fw-bold mb-1">Họ và Tên</label>
                                                                    <div className="input-group">
                                                                        <span className="input-group-text bg-light border-0"><i className="fa fa-address-card text-muted"></i></span>
                                                                        <input type="text" className="form-control bg-light border-0" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} required style={{ borderRadius: '0 10px 10px 0', fontSize: '0.95rem' }} />
                                                                    </div>
                                                                </div>
                                                                <div className="mb-4">
                                                                    <label className="small text-muted fw-bold mb-1">Số Điện Thoại</label>
                                                                    <div className="input-group">
                                                                        <span className="input-group-text bg-light border-0"><i className="fa fa-phone text-muted"></i></span>
                                                                        <input type="text" className="form-control bg-light border-0" name="phone" value={formData.phone || ''} onChange={handleInputChange} style={{ borderRadius: '0 10px 10px 0', fontSize: '0.95rem' }} />
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex gap-2">
                                                                    <button type="submit" className="btn btn-burgundy flex-grow-1 fw-bold" style={{ borderRadius: '10px', padding: '10px 0' }}>Lưu Thay Đổi</button>
                                                                    <button type="button" className="btn btn-light fw-bold" onClick={() => setIsEditingProfile(false)} style={{ borderRadius: '10px', padding: '10px 20px', background: '#f0f0f0' }}>Hủy</button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                        <div className="animation-fade-in">
                                                            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                                                <div className="d-flex justify-content-center align-items-center rounded-circle text-white fw-bold fs-3 me-4 shadow-sm" style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)', border: '3px solid #f8f9fa' }}>
                                                                    {(formData.fullName || user.username).charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <h4 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '0.5px' }}>{formData.fullName || user.username}</h4>
                                                                    <span className="badge bg-light text-dark border px-2 py-1"><i className="fa fa-star text-warning me-1"></i>Thành viên thân thiết</span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="d-flex flex-column gap-3">
                                                                <div className="d-flex align-items-center p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                                                                    <div className="bg-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                                        <i className="fa fa-user text-muted"></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="small text-muted fw-semibold mb-1" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tên đăng nhập</div>
                                                                        <div className="fw-bold text-dark fs-6">{user.username}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex align-items-center p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                                                                    <div className="bg-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                                        <i className="fa fa-envelope text-muted"></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="small text-muted fw-semibold mb-1" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Địa chỉ Email</div>
                                                                        <div className="fw-bold text-dark fs-6">{user.email}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex align-items-center p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                                                                    <div className="bg-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                                        <i className="fa fa-phone text-muted"></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="small text-muted fw-semibold mb-1" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số điện thoại</div>
                                                                        <div className="fw-bold text-dark fs-6">{formData.phone || <span className="text-muted fw-normal fst-italic">Chưa cập nhật</span>}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex align-items-center p-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                                                                    <div className="bg-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '40px', height: '40px' }}>
                                                                        <i className="fa fa-shield text-success"></i>
                                                                    </div>
                                                                    <div className="d-flex justify-content-between align-items-center w-100">
                                                                        <div>
                                                                            <div className="small text-muted fw-semibold mb-1" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trạng thái tài khoản</div>
                                                                            <div className="fw-bold text-success fs-6">Đã xác thực an toàn</div>
                                                                        </div>
                                                                        <i className="fa fa-check-circle text-success fs-4"></i>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Card */}
                                        <div className="col-lg-6">
                                            <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px', background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                                <div className="card-body p-4 p-xl-5 d-flex flex-column">
                                                    <div className="mb-4 border-bottom pb-3">
                                                        <h5 className="fw-bold mb-0 text-dark"><i className="fa fa-shield me-2" style={{ color: '#722f37' }}></i>Bảo Mật</h5>
                                                    </div>
                                                    
                                                    {isEditingPassword ? (
                                                        <form onSubmit={async (e) => {
                                                            e.preventDefault();
                                                            await handleChangePassword(e);
                                                            setIsEditingPassword(false);
                                                        }} className="animation-fade-in flex-grow-1 d-flex flex-column justify-content-center">
                                                            <div className="mb-3 position-relative">
                                                                <input type={showOldPassword ? "text" : "password"} placeholder="Mật khẩu hiện tại" value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} className="form-control form-control-lg bg-light border-0 pe-5" required style={{ borderRadius: '10px', fontSize: '0.95rem' }} />
                                                                <i className={`fa ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute text-muted`} style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setShowOldPassword(!showOldPassword)}></i>
                                                            </div>
                                                            <div className="mb-3 position-relative">
                                                                <input type={showNewPassword ? "text" : "password"} placeholder="Mật khẩu mới (ít nhất 6 ký tự)" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="form-control form-control-lg bg-light border-0 pe-5" required style={{ borderRadius: '10px', fontSize: '0.95rem' }} />
                                                                <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute text-muted`} style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setShowNewPassword(!showNewPassword)}></i>
                                                            </div>
                                                            <div className="mb-4 position-relative">
                                                                <input type={showConfirmPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu mới" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="form-control form-control-lg bg-light border-0 pe-5" required style={{ borderRadius: '10px', fontSize: '0.95rem' }} />
                                                                <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute text-muted`} style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                                                            </div>
                                                            <div className="d-flex gap-2 mt-auto">
                                                                <button type="submit" disabled={changingPassword} className="btn btn-burgundy btn-lg fw-bold flex-grow-1" style={{ borderRadius: '10px', fontSize: '0.95rem' }}>
                                                                    {changingPassword ? "Đang xử lý..." : "Cập Nhật"}
                                                                </button>
                                                                <button type="button" className="btn btn-light btn-lg fw-bold text-dark border-0 bg-secondary-subtle" onClick={() => setIsEditingPassword(false)} style={{ borderRadius: '10px', fontSize: '0.95rem' }}>Hủy</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div className="animation-fade-in flex-grow-1 d-flex flex-column">
                                                            <div className="mb-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center p-4 rounded" style={{ background: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                                                                <div className="bg-white rounded-circle d-flex justify-content-center align-items-center mb-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
                                                                    <i className="fa fa-lock fs-3" style={{ color: '#722f37' }}></i>
                                                                </div>
                                                                <div className="small text-muted fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Mật Khẩu Đăng Nhập</div>
                                                                <div className="fw-bold text-dark fs-3 mb-2" style={{ letterSpacing: '4px', lineHeight: '1' }}>••••••••••••</div>
                                                                <div className="small text-muted" style={{ maxWidth: '250px' }}>Mật khẩu của bạn được mã hóa an toàn. Khuyến nghị thay đổi định kỳ.</div>
                                                            </div>
                                                            <button 
                                                                className="btn fw-bold w-100 mt-auto shadow-sm" 
                                                                onClick={() => setIsEditingPassword(true)}
                                                                style={{ color: '#fff', background: '#722f37', borderRadius: '10px', padding: '12px 0', fontSize: '0.95rem', transition: 'all 0.3s' }}
                                                                onMouseEnter={(e) => e.target.style.background = '#5c242c'}
                                                                onMouseLeave={(e) => e.target.style.background = '#722f37'}
                                                            >
                                                                <i className="fa fa-key me-2"></i>Đổi Mật Khẩu
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Default Shipping Address Card */}
                                        <div className="col-12">
                                            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '16px', background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                                <div className="card-body p-0">
                                                    <div className="d-flex flex-column flex-md-row">
                                                        <div className="bg-light p-4 d-flex justify-content-center align-items-center border-end-md position-relative" style={{ minWidth: '320px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                                                            <div className="text-center">
                                                                <div className="bg-white rounded-circle shadow d-inline-flex justify-content-center align-items-center mb-3 position-relative" style={{ width: '80px', height: '80px' }}>
                                                                    <i className="fa fa-map-marker fa-3x" style={{ color: '#722f37' }}></i>
                                                                </div>
                                                                <h6 className="fw-bold text-dark mb-1">Vị Trí Giao Hàng</h6>
                                                                <div className="small text-muted">Đã lưu mặc định</div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 p-xl-5 flex-grow-1">
                                                            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                                                                <h5 className="fw-bold mb-0 text-dark"><i className="fa fa-truck me-2" style={{ color: '#722f37' }}></i>Địa Chỉ Giao Hàng</h5>
                                                                <button 
                                                                    className="btn btn-sm text-decoration-none fw-bold shadow-sm" 
                                                                    style={{ color: '#722f37', background: '#fff', border: '1px solid #722f37', borderRadius: '8px', padding: '6px 16px', transition: 'all 0.2s' }}
                                                                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                                                                    onMouseEnter={(e) => { e.target.style.background = '#722f37'; e.target.style.color = '#fff'; }}
                                                                    onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#722f37'; }}
                                                                >
                                                                    {isEditingAddress ? <><i className="fa fa-times me-1"></i>Hủy</> : <><i className="fa fa-pencil me-1"></i>Chỉnh sửa</>}
                                                                </button>
                                                            </div>
                                                            
                                                            {isEditingAddress ? (
                                                                <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(e); setIsEditingAddress(false); }} className="animation-fade-in">
                                                                    <div className="mb-4">
                                                                        <label className="small text-muted fw-bold mb-2">Địa chỉ chi tiết</label>
                                                                        <textarea className="form-control form-control-lg bg-light border-0" name="address" rows="3" value={formData.address || ''} onChange={handleInputChange} placeholder="VD: 123 Đường ABC, Phường X, Quận Y, TP Z" style={{ borderRadius: '10px', fontSize: '0.95rem', resize: 'none' }}></textarea>
                                                                    </div>
                                                                    <button type="submit" className="btn btn-burgundy btn-lg fw-bold px-4" style={{ borderRadius: '10px', fontSize: '0.95rem' }}><i className="fa fa-save me-2"></i>Lưu Địa Chỉ</button>
                                                                </form>
                                                            ) : (
                                                                <div className="animation-fade-in p-4 rounded" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                                        <span className="badge shadow-sm" style={{ background: '#343a40', letterSpacing: '0.5px', padding: '6px 10px' }}><i className="fa fa-home me-1"></i>NHÀ RIÊNG</span>
                                                                        <span className="badge bg-success shadow-sm" style={{ letterSpacing: '0.5px', padding: '6px 10px' }}><i className="fa fa-check me-1"></i>MẶC ĐỊNH</span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <h5 className="fw-bold text-dark mb-0 me-3">{formData.fullName || user.username}</h5>
                                                                        <div className="fw-semibold px-2 py-1 bg-white rounded border text-dark small">
                                                                            <i className="fa fa-phone me-2" style={{ color: '#722f37' }}></i>{formData.phone || 'Chưa có SĐT'}
                                                                        </div>
                                                                    </div>
                                                                    <hr className="my-3 opacity-25" />
                                                                    <p className="text-muted mb-0 fs-6 d-flex align-items-start">
                                                                        <i className="fa fa-map-marker mt-1 me-2" style={{ color: '#722f37' }}></i>
                                                                        <span style={{ lineHeight: '1.6' }}>{formData.address || 'Bạn chưa cập nhật địa chỉ giao hàng. Vui lòng thêm địa chỉ để thuận tiện cho việc đặt hàng.'}</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CHI TIẾT ĐƠN HÀNG PREMIUM */}
            <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '850px' }}>
                    <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        
                        {/* Header Gradient */}
                        <div className="modal-header p-4 border-bottom position-relative bg-white">
                            <div className="position-relative w-100" style={{ zIndex: 1 }}>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="d-flex align-items-center">
                                        <span className="fw-bold fs-5 text-dark me-3" style={{ letterSpacing: '0.5px' }}>
                                            Đơn hàng #WS-{selectedOrder?.id?.toString().padStart(6, '0')}
                                        </span>
                                        <div>
                                            {selectedOrder && getStatusBadge(selectedOrder.status)}
                                        </div>
                                    </div>
                                    <button type="button" className="btn-close" onClick={() => closeModal('orderDetailModal')} aria-label="Close"></button>
                                </div>
                                <div className="text-muted small mt-2">
                                    <i className="fa fa-calendar-o me-2"></i> 
                                    {selectedOrder ? new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        </div>

                        <div className="modal-body p-4 p-md-5 bg-white">
                            {selectedOrder && (() => {
                                // Timeline Logic
                                const isCancelled = selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'FAILED';
                                const steps = [
                                    { key: 'PENDING', label: 'Chờ duyệt', icon: 'fa-file-text' },
                                    { key: 'CONFIRMED', label: 'Đã xác nhận', icon: 'fa-box' },
                                    { key: 'SHIPPING', label: 'Đang giao', icon: 'fa-truck' },
                                    { key: 'DELIVERED', label: 'Hoàn tất', icon: 'fa-check' }
                                ];
                                
                                let currentProgress = 0;
                                if (selectedOrder.status === 'CONFIRMED') currentProgress = 1;
                                else if (selectedOrder.status === 'SHIPPING') currentProgress = 2;
                                else if (selectedOrder.status === 'DELIVERED') currentProgress = 3;
                                
                                const progressWidth = currentProgress * (80 / 3) + '%';

                                return (
                                <>
                                {!isCancelled && (
                                    <div className="mb-5 pb-3 border-bottom">
                                        <div className="timeline-wrapper">
                                            <div className="timeline-line"></div>
                                            <div className="timeline-line-progress" style={{ width: progressWidth }}></div>
                                            {steps.map((step, index) => {
                                                const isCompleted = index < currentProgress || (index === 3 && selectedOrder.status === 'DELIVERED');
                                                const isActive = index === currentProgress && selectedOrder.status !== 'DELIVERED';
                                                
                                                return (
                                                    <div key={index} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                                        <div className="timeline-icon">
                                                            <i className={`fa ${step.icon}`}></i>
                                                        </div>
                                                        <div className="timeline-label">{step.label}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="row g-5">
                                    {/* Left Column: Products & Info */}
                                    <div className="col-lg-7">
                                        
                                        {/* Customer Info Box */}
                                        <div className="mb-4 p-4 rounded shadow-sm" style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}>
                                            <h6 className="fw-bold mb-3 text-dark d-flex align-items-center" style={{ fontSize: '15px' }}>
                                                <i className="fa fa-map-marker me-2" style={{ color: '#722f37', fontSize: '18px' }}></i> Thông Tin Nhận Hàng
                                            </h6>
                                            <div className="d-flex flex-column gap-2 small text-dark">
                                                <div><span className="text-muted d-inline-block" style={{ width: '90px' }}>Người nhận:</span> <span className="fw-semibold">{selectedOrder.customerName || user.fullName}</span></div>
                                                <div><span className="text-muted d-inline-block" style={{ width: '90px' }}>Điện thoại:</span> <span className="fw-semibold">{selectedOrder.phone || user.phone}</span></div>
                                                <div><span className="text-muted d-inline-block" style={{ width: '90px' }}>Địa chỉ:</span> <span className="fw-semibold">{selectedOrder.address || user.address}</span></div>
                                            </div>
                                        </div>

                                        <h6 className="fw-bold mb-4 text-dark d-flex align-items-center" style={{ fontSize: '15px' }}>
                                            <div className="bg-light d-flex justify-content-center align-items-center rounded-circle me-3" style={{ width: '40px', height: '40px' }}>
                                                <i className="fa fa-shopping-bag" style={{ color: '#722f37' }}></i>
                                            </div>
                                            Sản Phẩm Đã Mua ({selectedOrder.items?.length})
                                        </h6>
                                        <div className="d-flex flex-column gap-3 pe-2 custom-scrollbar" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                            {selectedOrder.items?.map((item, idx) => (
                                                <div key={idx} className="d-flex align-items-center p-3 rounded shadow-sm" style={{ border: '1px solid #f0f0f0', background: '#fff' }}>
                                                    <div className="d-flex justify-content-center align-items-center rounded overflow-hidden" style={{ width: '70px', height: '70px', flexShrink: 0, background: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                                                        {item.wine?.imageUrl ? (
                                                            <img src={item.wine.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/70x70?text=🍷" }} />
                                                        ) : (
                                                            <i className="fa fa-wine-bottle fs-3 text-muted"></i>
                                                        )}
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>{item.name}</h6>
                                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                                            <span className="small text-muted">{item.price?.toLocaleString()} đ <span className="mx-1">x</span> <span className="badge bg-light text-dark border">{item.quantity}</span></span>
                                                            <span className="fw-bold" style={{ fontSize: '15px', color: '#722f37' }}>{(item.price * item.quantity).toLocaleString()} đ</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cancellation Reason if any */}
                                        {selectedOrder.cancellationReason && (
                                            <div className="mt-4 p-4 rounded shadow-sm" style={{ background: '#fff8f8', border: '1px solid #ffcdd2', borderLeft: '4px solid #dc3545' }}>
                                                <div className="d-flex align-items-center mb-2 text-danger fw-bold">
                                                    <i className="fa fa-exclamation-circle me-2 fs-5"></i>Lý do hủy đơn
                                                </div>
                                                <div className="small text-danger opacity-75" style={{ lineHeight: '1.6' }}>{selectedOrder.cancellationReason}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Summary & Actions */}
                                    <div className="col-lg-5">
                                        <div className="p-4 rounded shadow-sm" style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}>
                                            <h6 className="fw-bold mb-4 text-dark d-flex align-items-center" style={{ fontSize: '15px' }}>
                                                <div className="bg-white border d-flex justify-content-center align-items-center rounded-circle me-3" style={{ width: '40px', height: '40px' }}>
                                                    <i className="fa fa-receipt text-dark"></i>
                                                </div>
                                                Thanh Toán
                                            </h6>
                                            
                                            <div className="d-flex justify-content-between mb-3 small">
                                                <span className="text-muted">Tạm tính</span>
                                                <span className="fw-semibold text-dark">{(selectedOrder.totalAmount - (selectedOrder.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? 0 : shippingConfig.SHIPPING_FEE)).toLocaleString()} đ</span>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between mb-3 small">
                                                <span className="text-muted">Phí giao hàng</span>
                                                <span className="fw-semibold text-success">{selectedOrder.totalAmount > shippingConfig.SHIPPING_THRESHOLD ? "Miễn phí" : `${shippingConfig.SHIPPING_FEE.toLocaleString()} đ`}</span>
                                            </div>

                                            <hr className="my-3 opacity-25" />

                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-bold text-dark">Tổng tiền</span>
                                                <span className="fw-bold fs-4" style={{ color: '#722f37' }}>{selectedOrder.totalAmount?.toLocaleString()} <span className="fs-6 text-muted">đ</span></span>
                                            </div>
                                            <div className="text-end small text-muted mb-4">(Đã bao gồm VAT)</div>

                                            {/* Action Buttons */}
                                            <div className="d-flex flex-column gap-3 mt-4">
                                                <button 
                                                    className="btn w-100 fw-bold py-3 shadow-sm d-flex justify-content-center align-items-center gap-2" 
                                                    style={{ background: '#722f37', color: '#fff', letterSpacing: '0.5px', fontSize: '14px', border: 'none', borderRadius: '8px', transition: 'all 0.3s' }}
                                                    onClick={handleReorder}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#5c242c'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#722f37'}
                                                >
                                                    <i className="fa fa-refresh"></i> MUA LẠI ĐƠN NÀY
                                                </button>
                                                <button className="btn btn-light border w-100 fw-bold py-3" data-bs-dismiss="modal" style={{ letterSpacing: '0.5px', fontSize: '14px', borderRadius: '8px' }}>
                                                    ĐÓNG LẠI
                                                </button>
                                            </div>
                                        </div>

                                        {/* Cancel Order Form */}
                                        {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'PAID') && (
                                            <div className="mt-4 p-4 rounded shadow-sm border" style={{ background: '#fff' }}>
                                                <h6 className="fw-bold mb-2 text-danger d-flex align-items-center" style={{ fontSize: '14px' }}>
                                                    <i className="fa fa-ban me-2"></i> Yêu Cầu Hủy Đơn
                                                </h6>
                                                <p className="small text-muted mb-3" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                                    {selectedOrder.status === 'PAID' 
                                                        ? "Đơn hàng đã thanh toán. Hệ thống sẽ ghi nhận và Admin sẽ hoàn tiền lại cho bạn trong vòng 24h." 
                                                        : "Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."}
                                                </p>
                                                <select 
                                                    className="form-select mb-3"
                                                    value={cancelReasonType}
                                                    onChange={(e) => setCancelReasonType(e.target.value)}
                                                    style={{ fontSize: '13px', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '10px 12px' }}
                                                >
                                                    <option value="" disabled>-- Chọn lý do hủy --</option>
                                                    <option value="Thay đổi ý định mua hàng">Thay đổi ý định mua hàng</option>
                                                    <option value="Tìm thấy giá rẻ hơn ở nơi khác">Tìm thấy giá rẻ hơn ở nơi khác</option>
                                                    <option value="Thời gian giao hàng quá lâu">Thời gian giao hàng quá lâu</option>
                                                    <option value="Đặt nhầm sản phẩm/số lượng">Đặt nhầm sản phẩm/số lượng</option>
                                                    <option value="other">Lý do khác (Nhập tay)</option>
                                                </select>
                                                
                                                {cancelReasonType === 'other' && (
                                                    <textarea 
                                                        className="form-control mb-3" 
                                                        rows="2" 
                                                        placeholder="Nhập chi tiết lý do hủy..."
                                                        value={cancelReason}
                                                        onChange={(e) => setCancelReason(e.target.value)}
                                                        style={{ fontSize: '13px', resize: 'none', borderRadius: '8px', border: '1px solid #e0e0e0' }}
                                                    ></textarea>
                                                )}

                                                <button 
                                                    className="btn w-100 fw-bold py-2"
                                                    disabled={!cancelReasonType || (cancelReasonType === 'other' && !cancelReason.trim())}
                                                    style={{ background: '#fff', color: '#dc3545', border: '1px solid #dc3545', transition: 'all 0.2s', fontSize: '13px', borderRadius: '8px' }}
                                                    onMouseEnter={(e) => { e.target.style.background = '#dc3545'; e.target.style.color = '#fff'; }}
                                                    onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#dc3545'; }}
                                                    onClick={handleCancelOrder}
                                                >
                                                    XÁC NHẬN HỦY ĐƠN HÀNG
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL ĐÁNH GIÁ SẢN PHẨM */}
            <div className="modal fade" id="reviewModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                        <div className="modal-header p-4 border-bottom bg-white">
                            <h5 className="fw-bold mb-0 text-dark">
                                <i className="fa fa-star me-2 text-warning"></i>Đánh giá sản phẩm
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4 bg-white custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {reviewOrder && reviewOrder.items?.map(item => (
                                <div key={item.id} className="mb-4 p-4 rounded shadow-sm" style={{ border: '1px solid #f0f0f0', background: '#fafafa' }}>
                                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                        <div className="bg-white rounded border d-flex justify-content-center align-items-center overflow-hidden" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                            {item.wine?.imageUrl ? (
                                                <img src={item.wine.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="fa fa-wine-bottle text-muted fs-4"></i>
                                            )}
                                        </div>
                                        <div className="ms-3 flex-grow-1" style={{ minWidth: 0 }}>
                                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '1rem' }}>{item.name}</div>
                                        </div>
                                    </div>
                                    <div className="mb-4 d-flex align-items-center justify-content-center gap-3 flex-wrap">
                                        <div className="fw-bold text-dark">Chất lượng:</div>
                                        <div className="star-rating d-flex align-items-center">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <i 
                                                    key={num} 
                                                    className={`fa fa-star ${reviews[item.id]?.rating >= num ? 'active' : ''}`}
                                                    onClick={() => handleReviewChange(item.id, 'rating', num)}
                                                ></i>
                                            ))}
                                        </div>
                                        <span className="badge" style={{ background: '#722f37', fontSize: '0.85rem' }}>
                                            {reviews[item.id]?.rating === 5 ? "Tuyệt vời 😍" : 
                                             reviews[item.id]?.rating === 4 ? "Rất tốt 😃" : 
                                             reviews[item.id]?.rating === 3 ? "Bình thường 😐" : 
                                             reviews[item.id]?.rating === 2 ? "Kém 🙁" : "Rất tệ 😡"}
                                        </span>
                                    </div>
                                    <textarea 
                                        className="form-control" 
                                        rows="3" 
                                        placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..."
                                        value={reviews[item.id]?.comment || ''}
                                        onChange={(e) => handleReviewChange(item.id, 'comment', e.target.value)}
                                        style={{ fontSize: '14px', resize: 'none', borderRadius: '8px', padding: '15px' }}
                                    ></textarea>
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer p-4 bg-white border-top">
                            <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} data-bs-dismiss="modal">HỦY</button>
                            <button type="button" className="btn btn-burgundy fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={handlePostReview}>GỬI ĐÁNH GIÁ</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Profile;