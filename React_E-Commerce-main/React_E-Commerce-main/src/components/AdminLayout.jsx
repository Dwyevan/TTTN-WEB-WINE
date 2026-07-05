import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // NGHIỆP VỤ 1: BẢO VỆ ĐƯỜNG DẪN (Auth Guard)
    useEffect(() => {
        if (!user) {
            toast.error("Vui lòng đăng nhập với quyền Admin!");
            navigate("/login");
        }
    }, [user, navigate]);

    // Hàm đăng xuất nhanh cho Admin
    const handleLogout = () => {
        localStorage.removeItem("user");
        toast.success("Đã đăng xuất khỏi trang quản trị");
        navigate("/login");
    };

    // Hàm kiểm tra link đang active
    const isActive = (path) => location.pathname === path;

    // Menu items chia theo nhóm
    const menuGroups = [
        {
            title: "TỔNG QUAN",
            items: [
                { path: "/admin", icon: "fa-chart-line", label: "Dashboard", gradient: "linear-gradient(135deg, #722f37 0%, #a04050 100%)" }
            ]
        },
        {
            title: "BÁN HÀNG",
            items: [
                { path: "/admin/orders", icon: "fa-shopping-cart", label: "Đơn hàng", gradient: "linear-gradient(135deg, #e07c24 0%, #f4a261 100%)" },
                { path: "/admin/users", icon: "fa-users", label: "Khách hàng", gradient: "linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)" },
                { path: "/admin/feedbacks", icon: "fa-comments", label: "Phản hồi", gradient: "linear-gradient(135deg, #457b9d 0%, #a8dadc 100%)" }
            ]
        },
        {
            title: "SẢN PHẨM",
            items: [
                { path: "/admin/products", icon: "fa-wine-bottle", label: "Sản phẩm", gradient: "linear-gradient(135deg, #5a189a 0%, #7b2cbf 100%)" },
                { path: "/admin/add-product", icon: "fa-plus-circle", label: "Thêm sản phẩm", gradient: "linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)" },
                { path: "/admin/categories", icon: "fa-tags", label: "Danh mục", gradient: "linear-gradient(135deg, #d90429 0%, #ef233c 100%)" },
                { path: "/admin/inventory", icon: "fa-warehouse", label: "Kho hàng", gradient: "linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)" },
                { path: "/admin/coupons", icon: "fa-tags", label: "Khuyến mãi", gradient: "linear-gradient(135deg, #d4a373 0%, #e9c46a 100%)" }
            ]
        },
        {
            title: "HỆ THỐNG",
            items: [
                { path: "/admin/settings", icon: "fa-cogs", label: "Cài đặt", gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }
            ]
        }
    ];

    return (
        <div className="d-flex" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            {/* --- SIDEBAR --- */}
            <nav 
                className="position-fixed shadow-lg"
                style={{
                    width: sidebarCollapsed ? '80px' : '280px',
                    height: '100vh',
                    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                {/* Logo Section */}
                <div className="p-4 border-bottom border-secondary">
                    <div className="d-flex align-items-center justify-content-between">
                        {!sidebarCollapsed && (
                            <div>
                                <h4 className="text-white fw-bold mb-0 d-flex align-items-center">
                                    <i className="fa fa-wine-glass-alt me-2" style={{ 
                                        fontSize: '24px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}></i>
                                    WINE ADMIN
                                </h4>
                                <small className="text-white-50">Hệ thống quản lý</small>
                            </div>
                        )}
                        <button 
                            className="btn btn-sm btn-outline-light rounded-circle p-2"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            style={{ width: '36px', height: '36px' }}
                        >
                            <i className={`fa fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
                        </button>
                    </div>
                </div>

                {/* User Info */}
                {!sidebarCollapsed && (
                    <div className="p-4">
                        <div className="d-flex align-items-center p-3 rounded" style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div className="position-relative">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                                    alt="Admin" 
                                    className="rounded-circle"
                                    style={{ width: '48px', height: '48px', border: '3px solid #667eea' }}
                                />
                                <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-dark rounded-circle"></span>
                            </div>
                            <div className="ms-3 flex-grow-1">
                                <div className="text-white fw-semibold">{user?.fullName || "Admin"}</div>
                                <div className="text-white-50 small">Quản trị viên</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <div className="px-3 py-2">
                    {menuGroups.map((group, gIndex) => (
                        <div key={gIndex} className="mb-3">
                            {!sidebarCollapsed && (
                                <div className="text-white-50 small text-uppercase px-3 mb-2 fw-semibold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                    {group.title}
                                </div>
                            )}
                            <ul className="nav flex-column">
                                {group.items.map((item, index) => (
                                    <li className="nav-item mb-1" key={index}>
                                        <Link 
                                            className="nav-link d-flex align-items-center position-relative"
                                            to={item.path}
                                            style={{
                                                color: isActive(item.path) ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                                background: isActive(item.path) ? item.gradient : 'transparent',
                                                borderRadius: '12px',
                                                padding: sidebarCollapsed ? '12px' : '10px 16px',
                                                transition: 'all 0.3s ease',
                                                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive(item.path)) {
                                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                                    e.currentTarget.style.color = '#fff';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive(item.path)) {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                                }
                                            }}
                                        >
                                            <i className={`fa ${item.icon}`} style={{ 
                                                fontSize: '18px',
                                                minWidth: '20px',
                                                textAlign: 'center'
                                            }}></i>
                                            {!sidebarCollapsed && (
                                                <span className="ms-3 fw-medium">{item.label}</span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto p-3 border-top border-secondary">
                    <Link 
                        className="nav-link d-flex align-items-center mb-2"
                        to="/"
                        style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: '12px',
                            padding: sidebarCollapsed ? '12px' : '12px 16px',
                            transition: 'all 0.3s ease',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
                            e.currentTarget.style.color = '#ffc107';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                        }}
                    >
                        <i className="fa fa-store" style={{ fontSize: '18px', minWidth: '20px' }}></i>
                        {!sidebarCollapsed && <span className="ms-3">Quay về Shop</span>}
                    </Link>
                    
                    <button 
                        className="nav-link border-0 bg-transparent w-100 d-flex align-items-center"
                        onClick={handleLogout}
                        style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            borderRadius: '12px',
                            padding: sidebarCollapsed ? '12px' : '12px 16px',
                            transition: 'all 0.3s ease',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
                            e.currentTarget.style.color = '#dc3545';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                        }}
                    >
                        <i className="fa fa-sign-out-alt" style={{ fontSize: '18px', minWidth: '20px' }}></i>
                        {!sidebarCollapsed && <span className="ms-3">Đăng xuất</span>}
                    </button>
                </div>
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main 
                className="flex-grow-1"
                style={{
                    marginLeft: sidebarCollapsed ? '80px' : '280px',
                    transition: 'margin-left 0.3s ease'
                }}
            >
                {/* TOP NAVBAR */}
                <div className="sticky-top shadow-sm" style={{
                    background: '#fff',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <div className="d-flex align-items-center justify-content-between px-4 py-3">
                        <div>
                            <h5 className="mb-0 fw-bold text-dark">
                                {menuGroups.flatMap(g => g.items).find(item => isActive(item.path))?.label || 'Dashboard'}
                            </h5>
                            <small className="text-muted">
                                <i className="fa fa-calendar-alt me-1"></i>
                                {new Date().toLocaleDateString('vi-VN', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </small>
                        </div>
                        
                        <div className="d-flex align-items-center gap-3">
                            {/* Notification */}
                            <button className="btn position-relative" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: '#f8f9fa',
                                border: 'none'
                            }}>
                                <i className="fa fa-bell text-dark"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{
                                    fontSize: '10px'
                                }}>
                                    3
                                </span>
                            </button>

                            {/* User Avatar */}
                            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}>
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                                    alt="Admin" 
                                    className="rounded-circle"
                                    style={{ width: '32px', height: '32px', border: '2px solid #fff' }}
                                />
                                <span className="text-white small fw-semibold d-none d-md-block">
                                    {user?.fullName || "Admin"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;