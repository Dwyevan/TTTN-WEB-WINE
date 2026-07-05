import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ConfirmModal, Pagination, LoadingSpinner, EmptyState } from "../components";

import API_BASE_URL from '../config';
const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageModal, setImageModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const itemsPerPage = 10;

  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wines`);
      setProducts(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getProducts(); }, []);

  const triggerDelete = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const executeDelete = async () => {
    const { id, name } = deleteModal;
    if (!id) return;

    const loadingToast = toast.loading("Đang xóa...");
    try {
      await axios.delete(`${API_BASE_URL}/api/wines/${id}`);
      toast.success("Đã xóa thành công!", { id: loadingToast });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Xóa thất bại!", { id: loadingToast });
    }
  };

  // Toggle enabled
  const toggleEnabled = async (id, currentEnabled) => {
    const newState = !currentEnabled;
    const loadingToast = toast.loading(newState ? "Đang kích hoạt..." : "Đang ẩn...");
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/inventory/${id}/toggle-status?enabled=${newState}`);
      toast.success(newState ? "Đã kích hoạt sản phẩm" : "Đã ẩn sản phẩm", { id: loadingToast });
      setProducts(products.map(p => p.id === id ? { ...p, enabled: newState } : p));
    } catch (error) {
      toast.error("Lỗi cập nhật!", { id: loadingToast });
    }
  };

  // Filter & Search & Sort
  const filteredAndSorted = useMemo(() => {
    let result = products.filter(product => {
      const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || product.id?.toString().includes(searchTerm);
      const matchOrigin = filterOrigin === "ALL" || product.origin === filterOrigin;
      const matchCategory = filterCategory === "ALL" || product.category === filterCategory;
      return matchSearch && matchOrigin && matchCategory;
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "stock") { valA = a.stock || a.stockQuantity || 0; valB = b.stock || b.stockQuantity || 0; }
      if (sortField === "soldCount") { valA = a.soldCount || 0; valB = b.soldCount || 0; }
      if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = (valB || '').toLowerCase(); }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, filterOrigin, filterCategory, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedProducts = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterOrigin, filterCategory]);

  // Unique values
  const origins = ["ALL", ...new Set(products.map(p => p.origin).filter(Boolean))];
  const categories = ["ALL", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <i className="fa fa-sort ms-1" style={{ opacity: 0.3, fontSize: '10px' }}></i>;
    return <i className={`fa fa-sort-${sortDirection === "asc" ? "up" : "down"} ms-1`} style={{ color: '#722f37', fontSize: '10px' }}></i>;
  };

  // Stats
  const stats = {
    total: products.length,
    lowStock: products.filter(p => (p.stock || p.stockQuantity || 0) <= (p.minimumStock || 5) && (p.stock || p.stockQuantity || 0) > 0).length,
    outOfStock: products.filter(p => !(p.stock || p.stockQuantity)).length,
    totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || p.stockQuantity || 0)), 0),
    disabled: products.filter(p => p.enabled === false).length,
  };

  if (loading) return <LoadingSpinner message="Đang tải danh sách sản phẩm..." />;

  return (
    <div style={{ minHeight: '100vh' }}>
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })} 
        onConfirm={executeDelete} 
        title="Xóa Sản Phẩm" 
        message={`Bạn có chắc chắn muốn xóa "${deleteModal.name}"? Hành động này không thể hoàn tác.`}
      />

      {/* Image Modal */}
      {imageModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.7)', zIndex: 9999, cursor: 'pointer' }} onClick={() => setImageModal(null)}>
          <div style={{ maxWidth: '500px', maxHeight: '80vh' }}>
            <img src={imageModal} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="card border-0 mb-4" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 60%, #c4666e 100%)', boxShadow: '0 8px 32px rgba(114,47,55,0.25)' }}>
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <h2 className="fw-bold text-white mb-1"><i className="fa fa-wine-bottle me-2"></i>Quản Lý Sản Phẩm</h2>
              <p className="text-white-50 mb-0 small"><i className="fa fa-box me-1"></i>{products.length} sản phẩm trong hệ thống</p>
            </div>
            <Link to="/admin/add-product" className="btn mt-3 mt-md-0 px-4 py-2" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: '600' }}>
              <i className="fa fa-plus me-2"></i>Thêm sản phẩm
            </Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          { label: "Tổng sản phẩm", value: stats.total, icon: "fa-box", color: "#722f37" },
          { label: "Sắp hết hàng", value: stats.lowStock, icon: "fa-exclamation-triangle", color: "#e07c24" },
          { label: "Hết hàng", value: stats.outOfStock, icon: "fa-times-circle", color: "#c82333" },
          { label: "Giá trị kho", value: `${(stats.totalValue / 1000000).toFixed(1)}M`, icon: "fa-coins", color: "#2d6a4f" },
          { label: "Đã ẩn", value: stats.disabled, icon: "fa-eye-slash", color: "#6c757d" },
        ].map((s, i) => (
          <div className="col" key={i}>
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
              <div className="card-body p-3 text-center">
                <div className="d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}15` }}>
                  <i className={`fa ${s.icon}`} style={{ color: s.color, fontSize: '16px' }}></i>
                </div>
                <h4 className="fw-bold mb-0 text-dark">{s.value}</h4>
                <div className="text-muted" style={{ fontSize: '11px' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Tìm kiếm</label>
              <div className="position-relative">
                <i className="fa fa-search position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}></i>
                <input type="text" className="form-control ps-5 py-2 border-0" style={{ background: '#f8f9fa', borderRadius: '10px' }} placeholder="Tên sản phẩm hoặc ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Danh mục</label>
              <select className="form-select py-2 border-0" style={{ background: '#f8f9fa', borderRadius: '10px' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c === "ALL" ? "Tất cả danh mục" : c}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Xuất xứ</label>
              <select className="form-select py-2 border-0" style={{ background: '#f8f9fa', borderRadius: '10px' }} value={filterOrigin} onChange={e => setFilterOrigin(e.target.value)}>
                {origins.map(o => <option key={o} value={o}>{o === "ALL" ? "Tất cả xuất xứ" : o}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn w-100 py-2" style={{ borderRadius: '10px', background: '#f8f9fa', border: 'none', fontWeight: '600', fontSize: '13px' }} onClick={() => { setSearchTerm(""); setFilterOrigin("ALL"); setFilterCategory("ALL"); setSortField("id"); setSortDirection("desc"); }}>
                <i className="fa fa-redo me-1"></i>Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th className="py-3 ps-4 border-0 fw-semibold text-muted small text-uppercase" style={{ cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }} onClick={() => handleSort("id")}>
                  ID <SortIcon field="id" />
                </th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Hình</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }} onClick={() => handleSort("name")}>
                  Sản phẩm <SortIcon field="name" />
                </th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ fontSize: '11px' }}>Danh mục</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }} onClick={() => handleSort("price")}>
                  Giá <SortIcon field="price" />
                </th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }} onClick={() => handleSort("stock")}>
                  Tồn kho <SortIcon field="stock" />
                </th>
                <th className="border-0 fw-semibold text-muted small text-uppercase" style={{ cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }} onClick={() => handleSort("soldCount")}>
                  Đã bán <SortIcon field="soldCount" />
                </th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center" style={{ fontSize: '11px' }}>Trạng thái</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center pe-4" style={{ fontSize: '11px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="9"><EmptyState title="Không tìm thấy sản phẩm nào" message="Hãy thử thay đổi từ khóa hoặc bộ lọc danh mục/xuất xứ" /></td>
                </tr>
              ) : (
                paginatedProducts.map((item) => {
                  const stock = item.stock ?? item.stockQuantity ?? 0;
                  const minStock = item.minimumStock || 5;
                  const isLowStock = stock > 0 && stock <= minStock;
                  const isOutOfStock = stock === 0;

                  return (
                    <tr key={item.id} className="border-bottom" style={{ transition: 'background 0.15s ease' }}>
                      <td className="ps-4 py-3">
                        <span className="badge px-2 py-1" style={{ background: 'rgba(114,47,55,0.1)', color: '#722f37', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                          #{item.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #f0f0f0', cursor: 'pointer' }} onClick={() => setImageModal(item.imageUrl)}>
                          <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/52x52?text=🍷"; }} />
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{item.name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {item.origin && <><i className="fa fa-globe me-1" style={{ fontSize: '9px' }}></i>{item.origin}</>}
                          {item.brand && <> · {item.brand}</>}
                        </div>
                      </td>
                      <td>
                        <span className="badge px-2 py-1" style={{ background: 'rgba(114,47,55,0.08)', color: '#722f37', borderRadius: '6px', fontSize: '11px' }}>
                          {item.category || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: '#722f37', fontSize: '13px' }}>
                          {item.price?.toLocaleString()} đ
                        </span>
                        {item.discountPercent > 0 && (
                          <div><span className="badge px-1 py-0" style={{ background: 'rgba(220,53,69,0.1)', color: '#c82333', fontSize: '10px', borderRadius: '4px' }}>-{item.discountPercent}%</span></div>
                        )}
                      </td>
                      <td>
                        <span className={`badge px-2 py-1`} style={{
                          background: isOutOfStock ? 'rgba(220,53,69,0.1)' : isLowStock ? 'rgba(224,124,36,0.1)' : 'rgba(40,167,69,0.1)',
                          color: isOutOfStock ? '#c82333' : isLowStock ? '#e07c24' : '#218838',
                          borderRadius: '6px', fontSize: '12px', fontWeight: '600'
                        }}>
                          {isOutOfStock ? <><i className="fa fa-times-circle me-1" style={{ fontSize: '9px' }}></i>Hết hàng</> : `${stock} chai`}
                        </span>
                        {isLowStock && <div className="text-warning" style={{ fontSize: '10px' }}><i className="fa fa-exclamation-triangle me-1"></i>Sắp hết</div>}
                      </td>
                      <td>
                        <span className="fw-semibold" style={{ fontSize: '13px', color: '#555' }}>{item.soldCount || 0}</span>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-center mb-0">
                          <input className="form-check-input" type="checkbox" role="switch" checked={item.enabled !== false} onChange={() => toggleEnabled(item.id, item.enabled !== false)} style={{ width: '36px', height: '20px', cursor: 'pointer' }} title={item.enabled !== false ? "Đang bán — Nhấn để ẩn" : "Đã ẩn — Nhấn để kích hoạt"} />
                        </div>
                        <div style={{ fontSize: '10px', color: item.enabled !== false ? '#218838' : '#c82333' }}>
                          {item.enabled !== false ? "Đang bán" : "Đã ẩn"}
                        </div>
                      </td>
                      <td className="pe-4">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`/admin/edit-product/${item.id}`} className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(114,47,55,0.08)', color: '#722f37', border: 'none' }} title="Chỉnh sửa">
                            <i className="fa fa-edit" style={{ fontSize: '13px' }}></i>
                          </Link>
                          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(220,53,69,0.08)', color: '#c82333', border: 'none' }} onClick={() => triggerDelete(item.id, item.name)} title="Xóa">
                            <i className="fa fa-trash" style={{ fontSize: '13px' }}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={filteredAndSorted.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default AdminProductList;