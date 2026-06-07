import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [product, setProduct] = useState({
    name: "", brand: "", price: "", description: "", origin: "",
    alcoholContent: "", imageUrl: "", category: "", stockQuantity: "",
    discountPercent: "", minimumStock: "", country: "", region: "", vintageYear: "",
    volume: "", grapeVariety: "", sweetnessLevel: "", servingTemperature: "", foodPairing: "",
  });

  const categories = ["Rượu vang đỏ", "Rượu vang trắng", "Rượu vang hồng", "Rượu sâm panh", "Whisky", "Vodka", "Brandy", "Liqueur"];
  const origins = ["Pháp", "Scotland", "Nhật Bản", "Mỹ", "Ý", "Chile", "Úc", "Tây Ban Nha"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const response = await axios.get(`http://localhost:8080/api/wines/${id}`);
        if (response.data) {
          setProduct({
            ...response.data,
            stockQuantity: response.data.stock ?? response.data.stockQuantity ?? "",
            minimumStock: response.data.minimumStock ?? "5",
            discountPercent: response.data.discountPercent ?? "0",
          });
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        toast.error("Không tìm thấy sản phẩm!");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Đang cập nhật...");
    try {
      const payload = {
        ...product,
        price: product.price ? parseFloat(product.price) : null,
        alcoholContent: product.alcoholContent ? parseFloat(product.alcoholContent) : null,
        stock: product.stockQuantity ? parseInt(product.stockQuantity) : 0,
        discountPercent: product.discountPercent ? parseInt(product.discountPercent) : 0,
        minimumStock: product.minimumStock ? parseInt(product.minimumStock) : 5,
      };
      await axios.put(`http://localhost:8080/api/wines/${id}`, payload);
      toast.success("Cập nhật thành công!", { id: loadingToast });
      navigate("/admin/products");
    } catch (error) {
      toast.error("Cập nhật thất bại!", { id: loadingToast });
      console.error("Update Error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem', color: '#722f37' }} role="status"></div>
      <h5 className="fw-bold" style={{ color: '#722f37' }}>Đang tải sản phẩm...</h5>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <div className="card border-0 mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 60%, #c4666e 100%)', boxShadow: '0 8px 32px rgba(114,47,55,0.25)' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button className="btn btn-sm px-3 py-2 mb-3" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }} onClick={() => navigate(-1)}>
                <i className="fa fa-arrow-left me-2"></i>Quay lại
              </button>
              <h2 className="fw-bold text-white mb-1">
                <i className="fa fa-edit me-2"></i>Chỉnh Sửa Sản Phẩm
              </h2>
              <p className="text-white-50 mb-0 small">
                Mã sản phẩm: <span className="badge px-2 py-1" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }}>#{id}</span>
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)' }}>
              <i className="fa fa-wine-bottle text-white" style={{ fontSize: '28px' }}></i>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* LEFT: Form fields */}
          <div className="col-lg-8">
            {/* Basic Info */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"><i className="fa fa-info-circle me-2" style={{ color: '#722f37' }}></i>Thông Tin Cơ Bản</h5>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">Tên sản phẩm <span className="text-danger">*</span></label>
                  <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="name" value={product.name || ""} onChange={handleChange} required />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Thương hiệu</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="brand" value={product.brand || ""} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Danh mục</label>
                    <select className="form-select py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="category" value={product.category || ""} onChange={handleChange}>
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Xuất xứ</label>
                    <select className="form-select py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="origin" value={product.origin || ""} onChange={handleChange}>
                      <option value="">-- Chọn xuất xứ --</option>
                      {origins.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Nồng độ cồn (%)</label>
                    <input type="number" step="0.1" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="alcoholContent" value={product.alcoholContent || ""} onChange={handleChange} />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Quốc gia</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="country" value={product.country || ""} onChange={handleChange} placeholder="Pháp" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Vùng làm rượu</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="region" value={product.region || ""} onChange={handleChange} placeholder="Bordeaux" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Năm thu hoạch</label>
                    <input type="number" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="vintageYear" value={product.vintageYear || ""} onChange={handleChange} placeholder="2015" />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Dung tích</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="volume" value={product.volume || ""} onChange={handleChange} placeholder="750ml" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Giống nho</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="grapeVariety" value={product.grapeVariety || ""} onChange={handleChange} placeholder="Cabernet Sauvignon" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Độ ngọt</label>
                    <select className="form-select py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="sweetnessLevel" value={product.sweetnessLevel || ""} onChange={handleChange}>
                      <option value="">-- Chọn --</option>
                      <option value="Dry">Dry (Ít ngọt)</option>
                      <option value="Semi-Sweet">Semi-Sweet (Bán ngọt)</option>
                      <option value="Sweet">Sweet (Ngọt)</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Nhiệt độ phục vụ</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="servingTemperature" value={product.servingTemperature || ""} onChange={handleChange} placeholder="16-18°C" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Kết hợp món ăn (Food Pairing)</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="foodPairing" value={product.foodPairing || ""} onChange={handleChange} placeholder="Steak, Seafood, Cheese..." />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold text-dark">Mô tả</label>
                  <textarea className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="description" rows="4" value={product.description || ""} onChange={handleChange}></textarea>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"><i className="fa fa-tags me-2" style={{ color: '#722f37' }}></i>Giá & Tồn Kho</h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Giá bán (VNĐ) <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <span className="position-absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#722f37', fontWeight: 'bold' }}>đ</span>
                      <input type="number" className="form-control py-2 ps-5 pe-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="price" value={product.price || ""} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Giảm giá (%)</label>
                    <input type="number" min="0" max="100" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="discountPercent" value={product.discountPercent || ""} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Tồn kho</label>
                    <input type="number" min="0" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="stockQuantity" value={product.stockQuantity || ""} onChange={handleChange} />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Mức tồn kho tối thiểu</label>
                    <input type="number" min="0" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="minimumStock" value={product.minimumStock || ""} onChange={handleChange} />
                    <small className="text-muted"><i className="fa fa-bell me-1"></i>Cảnh báo khi dưới mức này</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ borderRadius: '16px', top: '20px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"><i className="fa fa-image me-2" style={{ color: '#722f37' }}></i>Hình Ảnh</h5>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">URL hình ảnh</label>
                  <input type="text" className="form-control py-2 px-3 small" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="imageUrl" value={product.imageUrl || ""} onChange={handleChange} />
                </div>
                <div className="position-relative rounded-3 overflow-hidden" style={{ minHeight: "280px", background: '#f8f9fa', border: '3px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: '8px' }} onError={(e) => { e.target.src = "https://placehold.co/400x600?text=Link+Ảnh+Lỗi"; }} />
                  ) : (
                    <div className="text-center p-4">
                      <i className="fa fa-image fa-3x mb-2" style={{ color: '#722f37', opacity: 0.2 }}></i>
                      <p className="text-muted mb-0 small">Chưa có hình ảnh</p>
                    </div>
                  )}
                </div>

                {/* Product status info */}
                <div className="mt-3 p-3" style={{ background: 'rgba(114,47,55,0.05)', borderRadius: '12px', borderLeft: '4px solid #722f37' }}>
                  <div className="small fw-bold mb-2 text-dark"><i className="fa fa-chart-bar me-1" style={{ color: '#722f37' }}></i>Thống kê</div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Đã bán:</span>
                    <span className="fw-bold text-dark">{product.soldCount || 0} chai</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Trạng thái:</span>
                    <span className={`badge px-2 py-1 ${product.enabled !== false ? 'text-success' : 'text-danger'}`} style={{ background: product.enabled !== false ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', borderRadius: '6px', fontSize: '11px' }}>
                      {product.enabled !== false ? "Đang bán" : "Đã ẩn"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small"><i className="fa fa-info-circle me-1"></i>Kiểm tra kỹ trước khi lưu thay đổi</div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light px-4 py-2" style={{ borderRadius: '10px' }} onClick={() => navigate("/admin/products")}>
                  <i className="fa fa-times me-2"></i>Hủy
                </button>
                <button type="submit" className="btn px-5 py-2" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #722f37, #a04050)', color: '#fff', border: 'none', fontWeight: '600' }} disabled={loading}>
                  {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Đang lưu...</>) : (<><i className="fa fa-save me-2"></i>Lưu thay đổi</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;