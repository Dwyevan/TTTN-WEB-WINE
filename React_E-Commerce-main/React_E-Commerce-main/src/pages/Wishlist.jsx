import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Footer } from "../components";
import { Link } from "react-router-dom";
import { toggleWishlist, addCart } from "../redux/action";
import toast from "react-hot-toast";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.handleWishlist);
  const dispatch = useDispatch();

  const handleToggle = (product) => {
    dispatch(toggleWishlist(product));
    toast.success("Đã xóa khỏi danh sách yêu thích");
  };

  const handleAddToCart = (product) => {
    const discount = product.discountPercent || 0;
    const salePrice = product.price * (1 - discount / 100);
    const productToCart = { ...product, price: salePrice };
    dispatch(addCart(productToCart));
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const EmptyWishlist = () => {
    return (
      <div className="container my-5 py-5 text-center">
        <div className="mb-4 d-inline-flex justify-content-center align-items-center rounded-circle" style={{ width: '80px', height: '80px', background: 'rgba(114,47,55,0.05)' }}>
            <i className="fa fa-heart fa-3x" style={{ color: '#722f37' }}></i>
        </div>
        <h4 className="fw-bold mb-3" style={{ color: '#1a1a1a' }}>Danh Sách Yêu Thích Của Bạn Trống</h4>
        <p className="text-muted mb-4">Lưu lại những chai vang bạn yêu thích để dễ dàng tìm lại sau này.</p>
        <Link to="/product" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
          Khám Phá Ngay
        </Link>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="bg-light min-vh-100 pb-5">
        <style>{`
          .luxury-card {
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.03);
            background: #fff;
            transition: all 0.3s ease;
          }
          .luxury-card:hover {
            box-shadow: 0 10px 30px rgba(114,47,55,0.1);
            transform: translateY(-3px);
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
        `}</style>

        <div className="bg-white border-bottom mb-5">
          <div className="container py-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small fw-bold">
                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang Chủ</Link></li>
                <li className="breadcrumb-item active" style={{ color: '#722f37' }}>Danh Sách Yêu Thích</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          <h2 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>
            Sản Phẩm Yêu Thích <span className="text-muted fs-5">({wishlist.length})</span>
          </h2>

          {wishlist.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {wishlist.map((item) => (
                <div className="col" key={item.id}>
                  <div className="card luxury-card h-100 position-relative">
                    {/* Nút xóa khỏi wishlist */}
                    <button 
                      onClick={() => handleToggle(item)}
                      className="btn position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '36px', height: '36px', background: '#fff', color: '#722f37', zIndex: 10, border: 'none' }}
                      title="Xóa khỏi yêu thích"
                    >
                      <i className="fa fa-times"></i>
                    </button>

                    <Link to={`/product/${item.id}`} className="text-decoration-none">
                      <div className="p-4 bg-light d-flex justify-content-center align-items-center" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '240px' }}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="img-fluid"
                          style={{ maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
                        />
                      </div>
                    </Link>

                    <div className="card-body p-4 d-flex flex-column">
                      <div className="small mb-2 text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '10px' }}>
                        {item.brand}
                      </div>
                      <Link to={`/product/${item.id}`} className="text-decoration-none">
                        <h6 className="fw-bold text-dark text-truncate mb-2">{item.name}</h6>
                      </Link>
                      
                      <div className="mt-auto pt-3">
                        <div className="fw-bold mb-3" style={{ color: '#722f37', fontSize: '1.1rem' }}>
                          {item.price?.toLocaleString()} đ
                        </div>
                        <button 
                          className="btn btn-burgundy w-100 rounded-pill fw-bold text-uppercase" 
                          style={{ fontSize: '12px', letterSpacing: '0.5px' }}
                          onClick={() => handleAddToCart(item)}
                        >
                          <i className="fa fa-cart-plus me-2"></i>Thêm Giỏ Hàng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
