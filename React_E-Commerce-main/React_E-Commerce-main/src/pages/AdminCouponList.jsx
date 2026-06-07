import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmModal, LoadingSpinner, EmptyState } from "../components";

const AdminCouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state (dùng chung cho Create và Edit)
  const [formData, setFormData] = useState({
    id: null,
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrder: "",
    startDate: "",
    endDate: "",
    usageLimit: 100,
    active: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Filter & Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/coupons");
      setCoupons(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error("Mã giảm giá không được để trống!");
      return false;
    }
    if (formData.discountValue < 0) {
      toast.error("Giá trị giảm không được âm!");
      return false;
    }
    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      toast.error("Phần trăm giảm không được vượt quá 100%!");
      return false;
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
      return false;
    }
    if (formData.usageLimit && formData.usedCount && formData.usageLimit < formData.usedCount) {
      toast.error(`Giới hạn lượt dùng phải lớn hơn hoặc bằng lượt đã dùng (${formData.usedCount})!`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData, code: formData.code.toUpperCase() };

    const loadingToast = toast.loading(isEditing ? "Đang cập nhật mã..." : "Đang tạo mã giảm giá...");
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/coupons/${formData.id}`, payload);
        toast.success("Cập nhật mã thành công!", { id: loadingToast });
      } else {
        await axios.post("http://localhost:8080/api/coupons", payload);
        toast.success("Tạo mã giảm giá thành công!", { id: loadingToast });
      }
      fetchCoupons();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lưu mã giảm giá!", { id: loadingToast });
    }
  };

  const resetForm = () => {
    setFormData({
      id: null, code: "", discountType: "PERCENTAGE", discountValue: "", minimumOrder: "", startDate: "", endDate: "", usageLimit: 100, active: true, usedCount: 0
    });
    setIsEditing(false);
  };

  const handleEdit = (coupon) => {
    setFormData({
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType || "PERCENTAGE",
      discountValue: coupon.discountValue || "",
      minimumOrder: coupon.minimumOrder || "",
      startDate: coupon.startDate || "",
      endDate: coupon.endDate || "",
      usageLimit: coupon.usageLimit || "",
      active: coupon.active !== false,
      usedCount: coupon.usedCount || 0
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/coupons/${id}`, { active: !currentStatus });
      toast.success(currentStatus ? "Đã vô hiệu hóa mã" : "Đã kích hoạt mã");
      fetchCoupons();
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái!");
    }
  };

  const triggerDelete = (id) => setDeleteModal({ isOpen: true, id });

  const executeDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;
    const loadingToast = toast.loading("Đang xóa...");
    try {
      await axios.delete(`http://localhost:8080/api/coupons/${id}`);
      toast.success("Đã xóa mã giảm giá!", { id: loadingToast });
      setCoupons(coupons.filter(c => c.id !== id));
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      toast.error("Không thể xóa mã này!", { id: loadingToast });
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => c.code?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [coupons, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const currentCoupons = filteredCoupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.active).length,
    totalUsed: coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)
  };

  const getStatusColor = (coupon) => {
    if (!coupon.active) return { bg: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', label: 'Đã tắt' };
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Chỉ so sánh ngày
    if (coupon.endDate && new Date(coupon.endDate) < now) return { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', label: 'Hết hạn' };
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', label: 'Hết lượt' };
    return { bg: 'rgba(40, 167, 69, 0.1)', color: '#28a745', label: 'Hoạt động' };
  };

  if (loading) return <LoadingSpinner message="Đang tải danh sách mã giảm giá..." />;

  return (
    <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={executeDelete} 
        title="Xóa Mã Giảm Giá" 
        message="Bạn có chắc chắn muốn xóa vĩnh viễn mã giảm giá này?"
      />
      {/* HEADER */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
        <div className="card-body p-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-white mb-1"><i className="fa fa-tags me-2"></i>Quản Lý Mã Giảm Giá</h2>
            <p className="text-white-50 mb-0 small"><i className="fa fa-ticket me-1"></i>Tạo và quản lý các chương trình khuyến mãi</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '16px' }}>
            <h3 className="fw-bold text-primary">{stats.total}</h3>
            <p className="text-muted mb-0">Tổng số mã</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '16px' }}>
            <h3 className="fw-bold text-success">{stats.active}</h3>
            <p className="text-muted mb-0">Mã đang kích hoạt</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '16px' }}>
            <h3 className="fw-bold text-info">{stats.totalUsed}</h3>
            <p className="text-muted mb-0">Tổng lượt sử dụng</p>
          </div>
        </div>
      </div>

      {/* CREATE/EDIT FORM */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4" style={{ color: isEditing ? '#ffc107' : '#667eea' }}>
            <i className={`fa ${isEditing ? 'fa-edit' : 'fa-plus-circle'} me-2`}></i>
            {isEditing ? "Cập Nhật Mã Giảm Giá" : "Tạo Mã Giảm Giá Mới"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Mã code *</label>
                <input type="text" className="form-control text-uppercase" name="code" value={formData.code} onChange={handleInputChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Loại giảm giá</label>
                <select className="form-select" name="discountType" value={formData.discountType} onChange={handleInputChange}>
                  <option value="PERCENTAGE">Phần trăm (%)</option>
                  <option value="FIXED">Giá tiền (VNĐ)</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Giá trị giảm *</label>
                <input type="number" className="form-control" name="discountValue" value={formData.discountValue} onChange={handleInputChange} min="0" required />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Đơn hàng tối thiểu</label>
                <input type="number" className="form-control" name="minimumOrder" value={formData.minimumOrder} onChange={handleInputChange} min="0" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Ngày bắt đầu</label>
                <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Ngày kết thúc</label>
                <input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Lượt dùng tối đa</label>
                <input type="number" className="form-control" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} min="1" />
              </div>
              <div className="col-md-3 d-flex align-items-end gap-2">
                <button className={`btn w-100 ${isEditing ? 'btn-warning' : 'btn-primary'}`} type="submit">
                  {isEditing ? "Lưu thay đổi" : "Tạo mã"}
                </button>
                {isEditing && (
                  <button type="button" className="btn btn-secondary w-50" onClick={resetForm}>Hủy</button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Danh Sách Mã</h5>
          <div className="w-25">
            <input type="text" className="form-control form-control-sm" placeholder="Tìm kiếm mã..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
          </div>
        </div>
        <div className="card-body p-0 mt-3 table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Mã</th>
                <th>Giảm giá</th>
                <th>Tối thiểu</th>
                <th>Thời gian</th>
                <th>Đã dùng</th>
                <th>Trạng thái</th>
                <th className="pe-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentCoupons.length === 0 ? (
                <tr><td colSpan="7"><EmptyState title="Không tìm thấy mã" message="Thử từ khóa khác hoặc tạo mã mới" /></td></tr>
              ) : (
                currentCoupons.map(c => {
                  const status = getStatusColor(c);
                  const usagePercent = ((c.usedCount || 0) / (c.usageLimit || 1)) * 100;
                  return (
                    <tr key={c.id}>
                      <td className="ps-4 fw-bold text-dark">{c.code}</td>
                      <td>
                        <span className="badge bg-primary">
                          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `${c.discountValue?.toLocaleString()}đ`}
                        </span>
                      </td>
                      <td>{c.minimumOrder ? `${c.minimumOrder.toLocaleString()}đ` : '-'}</td>
                      <td className="small text-muted">
                        {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'Bất kỳ'} <br/>
                        Đến: {c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Vô thời hạn'}
                      </td>
                      <td>
                        <div className="small mb-1">{c.usedCount || 0} / {c.usageLimit || '∞'}</div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div className="progress-bar bg-info" style={{ width: `${Math.min(usagePercent, 100)}%` }}></div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                      </td>
                      <td className="pe-4 text-center">
                        <button className={`btn btn-sm me-1 ${c.active ? 'btn-outline-secondary' : 'btn-outline-success'}`} onClick={() => toggleActive(c.id, c.active)} title={c.active ? "Vô hiệu hóa" : "Kích hoạt"}>
                          <i className={`fa ${c.active ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-warning me-1" onClick={() => handleEdit(c)} title="Sửa">
                          <i className="fa fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => triggerDelete(c.id)} title="Xóa">
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-0 py-3 d-flex justify-content-center">
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>Trước</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>Sau</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCouponList;
