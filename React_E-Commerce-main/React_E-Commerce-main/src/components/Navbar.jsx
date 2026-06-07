import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const wishlist = useSelector(state => state.handleWishlist);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null); 
    const productDropdownRef = useRef(null); // Ref riêng cho menu Sản phẩm

    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showProductMenu, setShowProductMenu] = useState(false); // Trạng thái menu Sản phẩm

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            // Đóng menu sản phẩm khi click ra ngoài
            if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
                setShowProductMenu(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);

        setShowUserMenu(false);
        setShowProductMenu(false); // Đóng menu khi đổi trang
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [location.pathname]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        setUser(null);
        setShowUserMenu(false);
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    return (
        <>
        <style>{`
            .luxury-nav {
                transition: all 0.4s ease;
                min-height: 80px;
                display: flex;
                align-items: center;
            }
            .luxury-nav.scrolled {
                background-color: #722f37 !important;
            }
            .luxury-nav .nav-item {
                margin: 0 10px;
            }
            .luxury-nav .nav-link {
                transition: color 0.3s ease;
                position: relative;
                padding: 10px 15px !important;
            }
            .luxury-nav.scrolled .nav-link {
                color: #fff !important;
            }
            .luxury-nav.scrolled .nav-link:hover,
            .luxury-nav.scrolled .nav-link.active {
                color: #d4af37 !important;
            }
            .luxury-nav:not(.scrolled) .nav-link {
                color: #333 !important;
            }
            .luxury-nav:not(.scrolled) .nav-link:hover,
            .luxury-nav:not(.scrolled) .nav-link.active {
                color: #722f37 !important;
            }
            .nav-link::after {
                content: '';
                position: absolute;
                width: 0;
                height: 2px;
                bottom: 0;
                left: 50%;
                background-color: #d4af37;
                transition: all 0.3s ease;
                transform: translateX(-50%);
            }
            .nav-link:hover::after,
            .nav-link.active::after {
                width: 70%;
            }
            .luxury-search {
                border: 1px solid #e0e0e0;
                transition: all 0.3s ease;
            }
            .luxury-search:focus-within {
                border-color: #d4af37;
                box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
            }
            .luxury-toggler {
                border-color: rgba(255, 255, 255, 0.5) !important;
            }
            .luxury-toggler-icon {
                filter: brightness(0) invert(1);
            }
            
            /* LUXURY DROPDOWN MENU */
            .luxury-dropdown {
                background: #ffffff;
                border: 1px solid #f0f0f0;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(114, 47, 55, 0.08);
                padding: 8px 0;
                min-width: 220px;
                animation: fadeIn 0.2s ease-in-out;
            }
            .luxury-dropdown-item {
                padding: 12px 20px;
                color: #333;
                font-weight: 500;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                background: transparent;
            }
            .luxury-dropdown-item:hover {
                background: rgba(212, 175, 55, 0.1);
                color: #722f37;
            }
            .luxury-dropdown-item i {
                color: #722f37;
                width: 24px;
                text-align: center;
                transition: transform 0.2s ease;
            }
            .luxury-dropdown-item:hover i {
                transform: scale(1.1);
            }
            .dropdown-divider {
                border-top: 1px solid #f0f0f0;
                margin: 4px 0;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
        <nav className={`navbar navbar-expand-lg sticky-top luxury-nav ${isScrolled ? 'scrolled shadow-lg' : 'bg-white shadow-sm'}`}>
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-3 d-flex align-items-center" to="/">
                    <span className={isScrolled ? 'text-white' : 'text-dark'}>WINE</span>
                    <span className="fw-light" style={{ color: isScrolled ? '#d4af37' : '#722f37' }}>STORE</span>
                </NavLink>
                
                <button className={`navbar-toggler ${isScrolled ? 'luxury-toggler' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className={`navbar-toggler-icon ${isScrolled ? 'luxury-toggler-icon' : ''}`}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto mb-2 mb-lg-0 fw-semibold text-uppercase small align-items-center">
                        <li className="nav-item"><NavLink className="nav-link" to="/">Trang Chủ</NavLink></li>
                        
                        {/* --- MENU CẤP 2 SẢN PHẨM --- */}
                        <li 
                            className="nav-item dropdown position-relative" 
                            ref={productDropdownRef}
                            onMouseEnter={() => setShowProductMenu(true)}
                            onMouseLeave={() => setShowProductMenu(false)}
                        >
                            <NavLink 
                                className="nav-link dropdown-toggle" 
                                to="/product"
                                onClick={(e) => {
                                    if (window.innerWidth <= 991) {
                                        e.preventDefault();
                                        setShowProductMenu(!showProductMenu);
                                    }
                                }}
                            >
                                Sản Phẩm
                            </NavLink>
                            {showProductMenu && (
                                <div className="dropdown-menu luxury-dropdown position-absolute mt-2" style={{ display: 'block', top: '100%', left: 0 }}>
                                    <NavLink className="dropdown-item luxury-dropdown-item" to="/product">
                                        <i className="fa fa-wine-bottle me-2"></i> Tất cả rượu
                                    </NavLink>
                                    <div className="dropdown-divider"></div>
                                    <NavLink className="dropdown-item luxury-dropdown-item" to="/product?category=Accessories">
                                        <i className="fa fa-tools me-2"></i> Phụ kiện rượu
                                    </NavLink>
                                    <NavLink className="dropdown-item luxury-dropdown-item" to="/product?category=Glassware">
                                        <i className="fa fa-glass-martini-alt me-2"></i> Ly & Bình thở
                                    </NavLink>
                                </div>
                            )}
                        </li>

                        <li className="nav-item"><NavLink className="nav-link" to="/about">Câu Chuyện</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/contact">Liên Hệ</NavLink></li>
                    </ul>

                    <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
                        <form className="d-flex" onSubmit={handleSearch}>
                            <div className="input-group input-group-sm rounded-pill overflow-hidden bg-white luxury-search">
                                <input className="form-control border-0 bg-white px-3 shadow-none" type="search" placeholder="Tìm rượu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ color: '#333' }} />
                                <button className="btn btn-white border-0 px-3" type="submit" style={{ background: '#fff' }}><i className="fa fa-search text-muted"></i></button>
                            </div>
                        </form>

                        {!user ? (
                            <div className="d-flex gap-2">
                                <NavLink to="/login" className={`btn btn-sm rounded-pill px-3 fw-bold ${isScrolled ? 'text-white border-white' : 'btn-outline-dark'}`} style={{ transition: 'all 0.3s' }}>Đăng nhập</NavLink>
                                <NavLink to="/register" className="btn btn-sm rounded-pill px-3 text-dark fw-bold" style={{ background: '#d4af37', border: '1px solid #d4af37', transition: 'all 0.3s' }}>Đăng ký</NavLink>
                            </div>
                        ) : (
                            <div className="dropdown position-relative" ref={dropdownRef}>
                                <button 
                                    className={`btn btn-sm fw-bold shadow-none d-flex align-items-center gap-2 border-0 bg-transparent ${isScrolled ? 'text-white' : 'text-dark'}`} 
                                    type="button"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    <i className="fa fa-user-circle fs-5"></i> 
                                    <span>{user.fullName || user.username}</span>
                                    <i className="fa fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                                </button>
                                
                                {showUserMenu && (
                                    <div className="dropdown-menu luxury-dropdown position-absolute mt-2 show" 
                                        style={{ right: 0, display: 'block' }}>
                                        <NavLink className="dropdown-item luxury-dropdown-item" to="/profile" onClick={() => setShowUserMenu(false)}>
                                            <i className="fa fa-id-card me-2"></i> Hồ sơ
                                        </NavLink>
                                        {user.role === 'ADMIN' && (
                                            <NavLink className="dropdown-item luxury-dropdown-item" to="/admin" onClick={() => setShowUserMenu(false)}>
                                                <i className="fa fa-unlock-alt me-2"></i> Quản trị
                                            </NavLink>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item luxury-dropdown-item text-danger" onClick={handleLogout}>
                                            <i className="fa fa-sign-out-alt me-2 text-danger"></i> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <NavLink to="/wishlist" className={`btn btn-sm rounded-circle position-relative shadow-sm d-flex align-items-center justify-content-center me-2 ${isScrolled ? 'text-dark' : 'btn-dark'}`} style={{ background: isScrolled ? '#f8f9fa' : '#1a1a1a', border: 'none', width: '32px', height: '32px' }}>
                            <i className="fa fa-heart"></i> 
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#722f37', color: '#fff', fontSize: '10px', border: '2px solid #fff' }}>
                                {wishlist.length}
                            </span>
                        </NavLink>

                        <NavLink to="/cart" className={`btn btn-sm rounded-pill px-3 position-relative shadow-sm d-flex align-items-center gap-2 ${isScrolled ? 'text-dark' : 'btn-dark'}`} style={{ background: isScrolled ? '#f8f9fa' : '#1a1a1a', border: 'none', height: '32px' }}>
                            <i className="fa fa-shopping-bag"></i> 
                            <span className="d-none d-md-inline fw-bold">Giỏ hàng</span>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#d4af37', color: '#1a1a1a', fontSize: '11px', border: '2px solid #fff' }}>
                                {state.length}
                            </span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
        </>
    )
}

export default Navbar