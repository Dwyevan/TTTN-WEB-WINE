import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import API_BASE_URL from '../config';
const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);
  const [wine, setWine] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    origin: "",
    alcoholContent: "",
    imageUrl: "",
    category: "",
    stockQuantity: "",
    discountPercent: "",
    minimumStock: "5",
    country: "",
    region: "",
    vintageYear: "",
    volume: "750ml",
    grapeVariety: "",
    sweetnessLevel: "",
    servingTemperature: "",
    foodPairing: "",
  });

  const handleChange = (e) => {
    setWine({ ...wine, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories`);
        setDbCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Đang lưu sản phẩm...");
    try {
      const payload = {
        ...wine,
        price: wine.price ? parseFloat(wine.price) : null,
        alcoholContent: wine.alcoholContent ? parseFloat(wine.alcoholContent) : null,
        stock: wine.stockQuantity ? parseInt(wine.stockQuantity) : 0,
        discountPercent: wine.discountPercent ? parseInt(wine.discountPercent) : 0,
        minimumStock: wine.minimumStock ? parseInt(wine.minimumStock) : 5,
      };
      await axios.post(`${API_BASE_URL}/api/wines`, payload);
      toast.success("Thêm rượu mới thành công!", { id: loadingToast });
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi: Không thể lưu sản phẩm!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setWine({ name: "", brand: "", price: "", description: "", origin: "", alcoholContent: "", imageUrl: "", category: "", stockQuantity: "", discountPercent: "", minimumStock: "5" });
  };

  const buildCategoryTree = (cats, parentId = null, level = 0) => {
    let result = [];
    const children = cats.filter(c => (c.parentId || null) === parentId);
    for (let child of children) {
      result.push({ ...child, level });
      result = result.concat(buildCategoryTree(cats, child.id, level + 1));
    }
    return result;
  };

  const categoriesList = dbCategories.length > 0 ? buildCategoryTree(dbCategories) : [];
  const quickOrigins = ["Pháp", "Scotland", "Nhật Bản", "Mỹ", "Ý", "Chile", "Úc", "Tây Ban Nha"];

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
              <h2 className="fw-bold text-white mb-1"><i className="fa fa-plus-circle me-2"></i>Thêm Sản Phẩm Mới</h2>
              <p className="text-white-50 mb-0 small">Nhập đầy đủ thông tin để thêm sản phẩm vào kho</p>
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
                  <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="name" value={wine.name} onChange={handleChange} placeholder="Ví dụ: Château Margaux 2015" required />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Thương hiệu</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="brand" value={wine.brand} onChange={handleChange} placeholder="Château Margaux, Hennessy..." />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Danh mục <span className="text-danger">*</span></label>
                    <select className="form-select py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="category" value={wine.category} onChange={handleChange} required>
                      <option value="">-- Chọn danh mục --</option>
                      {categoriesList.length > 0 ? categoriesList.map(c => (
                        <option key={c.id} value={c.name}>
                          {'\u00A0'.repeat(c.level * 4)}{c.name}
                        </option>
                      )) : (
                        ["Rượu vang đỏ", "Rượu vang trắng", "Rượu sâm panh", "Whisky"].map(c => <option key={c} value={c}>{c}</option>)
                      )}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Xuất xứ</label>
                    <select className="form-select py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="origin" value={wine.origin} onChange={(e) => setWine({...wine, origin: e.target.value})}>
                      <option value="">-- Chọn xuất xứ --</option>
                      {quickOrigins.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Nồng độ cồn (%)</label>
                    <div className="position-relative">
                      <input type="number" step="0.1" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="alcoholContent" value={wine.alcoholContent} onChange={handleChange} placeholder="13.5" />
                      <span className="position-absolute" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}>%</span>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Quốc gia</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="country" value={wine.country} onChange={handleChange} placeholder="Pháp" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Vùng làm rượu</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="region" value={wine.region} onChange={handleChange} placeholder="Bordeaux" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Năm thu hoạch</label>
                    <input type="number" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="vintageYear" value={wine.vintageYear} onChange={handleChange} placeholder="2015" />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Dung tích</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="volume" value={wine.volume} onChange={handleChange} placeholder="750ml" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Giống nho</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="grapeVariety" value={wine.grapeVariety} onChange={handleChange} placeholder="Cabernet Sauvignon" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Độ ngọt</label>
                    <select className="form-select py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="sweetnessLevel" value={wine.sweetnessLevel} onChange={handleChange}>
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
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="servingTemperature" value={wine.servingTemperature} onChange={handleChange} placeholder="16-18°C" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Kết hợp món ăn (Food Pairing)</label>
                    <input type="text" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="foodPairing" value={wine.foodPairing} onChange={handleChange} placeholder="Steak, Seafood, Cheese..." />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold text-dark">Mô tả chi tiết</label>
                  <textarea className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="description" rows="4" value={wine.description} onChange={handleChange} placeholder="Hương vị, năm sản xuất, quy trình ủ..."></textarea>
                  <small className="text-muted"><i className="fa fa-pen me-1"></i>{wine.description.length} ký tự</small>
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
                      <input type="number" className="form-control py-2 ps-5 pe-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="price" value={wine.price} onChange={handleChange} placeholder="1000000" required />
                    </div>
                    {wine.price && <small className="text-muted"><i className="fa fa-info-circle me-1"></i>{parseInt(wine.price).toLocaleString()} đồng</small>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Giảm giá (%)</label>
                    <input type="number" min="0" max="100" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="discountPercent" value={wine.discountPercent} onChange={handleChange} placeholder="0" />
                    {wine.price && wine.discountPercent > 0 && (
                      <small className="text-success"><i className="fa fa-tag me-1"></i>Giá sau giảm: {(parseInt(wine.price) * (1 - parseInt(wine.discountPercent)/100)).toLocaleString()} đ</small>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Số lượng tồn kho</label>
                    <input type="number" min="0" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="stockQuantity" value={wine.stockQuantity} onChange={handleChange} placeholder="100" />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">Mức tồn kho tối thiểu</label>
                    <input type="number" min="0" className="form-control py-2 px-3" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="minimumStock" value={wine.minimumStock} onChange={handleChange} placeholder="5" />
                    <small className="text-muted"><i className="fa fa-bell me-1"></i>Cảnh báo khi dưới mức này</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Image preview */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ borderRadius: '16px', top: '20px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4"><i className="fa fa-image me-2" style={{ color: '#722f37' }}></i>Hình Ảnh</h5>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small">URL hình ảnh</label>
                  <input type="text" className="form-control py-2 px-3 small" style={{ borderRadius: '10px', border: '2px solid #e9ecef' }} name="imageUrl" value={wine.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                </div>

                <div className="position-relative rounded-3 overflow-hidden" style={{
                  minHeight: "300px", background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  border: '3px dashed #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {wine.imageUrl ? (
                    <img src={wine.imageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "320px", objectFit: "contain", borderRadius: '8px' }} onError={(e) => { e.target.src = "https://placehold.co/400x600?text=Link+Ảnh+Lỗi"; }} />
                  ) : (
                    <div className="text-center p-4">
                      <div className="d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(114,47,55,0.08)' }}>
                        <i className="fa fa-image" style={{ fontSize: '24px', color: '#722f37' }}></i>
                      </div>
                      <p className="text-muted mb-0">Nhập URL để xem trước</p>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {wine.name && (
                  <div className="mt-3 p-3" style={{ background: 'rgba(114,47,55,0.05)', borderRadius: '12px', borderLeft: '4px solid #722f37' }}>
                    <div className="small fw-bold mb-2 text-dark"><i className="fa fa-eye me-1" style={{ color: '#722f37' }}></i>Tóm tắt sản phẩm</div>
                    <div className="small text-muted">
                      <div><strong>{wine.name}</strong></div>
                      {wine.brand && <div>Thương hiệu: {wine.brand}</div>}
                      {wine.category && <div>Danh mục: {wine.category}</div>}
                      {wine.price && <div>Giá: {parseInt(wine.price).toLocaleString()} đ</div>}
                      {wine.stockQuantity && <div>Tồn kho: {wine.stockQuantity} chai</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small"><i className="fa fa-info-circle me-1"></i>Kiểm tra thông tin trước khi lưu</div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light px-4 py-2" style={{ borderRadius: '10px' }} onClick={resetForm}>
                  <i className="fa fa-redo me-2"></i>Xóa trắng
                </button>
                <button type="submit" className="btn px-5 py-2" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #722f37, #a04050)', color: '#fff', border: 'none', fontWeight: '600' }} disabled={loading}>
                  {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Đang lưu...</>) : (<><i className="fa fa-save me-2"></i>Lưu vào hệ thống</>)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;