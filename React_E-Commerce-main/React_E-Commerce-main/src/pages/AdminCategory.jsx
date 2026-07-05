import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import API_BASE_URL from '../config';
const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', parentId: '', imageUrl: '' });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/categories`);
            setCategories(res.data || []);
        } catch (err) {
            toast.error("Không thể tải danh mục!");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '', parentId: category.parentId || '', imageUrl: category.imageUrl || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', parentId: '', imageUrl: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`${API_BASE_URL}/api/categories/${editingCategory.id}`, formData);
                toast.success("Cập nhật danh mục thành công!");
            } else {
                await axios.post(`${API_BASE_URL}/api/categories`, formData);
                toast.success("Thêm danh mục thành công!");
            }
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            toast.error(err.response?.data || "Có lỗi xảy ra!");
        }
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataFile = new FormData();
        formDataFile.append("file", file);

        setUploadingImage(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/upload`, formDataFile, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormData({ ...formData, imageUrl: res.data.url });
            toast.success("Tải ảnh lên thành công!");
        } catch (error) {
            toast.error("Không thể tải ảnh lên!");
        } finally {
            setUploadingImage(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
                toast.success("Xóa danh mục thành công!");
                fetchCategories();
            } catch (err) {
                toast.error("Không thể xóa danh mục!");
            }
        }
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

    const displayCategories = buildCategoryTree(categories);
    const totalPages = Math.ceil(displayCategories.length / itemsPerPage);
    const paginatedCategories = displayCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-dark"><i className="fa fa-tags me-2 text-burgundy"></i> Quản Lý Danh Mục Sản Phẩm</h4>
                <button className="btn btn-burgundy fw-bold shadow-sm" onClick={() => handleOpenModal()}>
                    <i className="fa fa-plus me-2"></i>Thêm Danh Mục
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-bottom-0 text-muted small text-uppercase fw-bold">ID</th>
                                <th className="px-4 py-3 border-bottom-0 text-muted small text-uppercase fw-bold">Hình Ảnh</th>
                                <th className="px-4 py-3 border-bottom-0 text-muted small text-uppercase fw-bold">Tên Danh Mục</th>
                                <th className="px-4 py-3 border-bottom-0 text-muted small text-uppercase fw-bold">Mô tả</th>
                                <th className="px-4 py-3 border-bottom-0 text-muted small text-uppercase fw-bold text-end">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-5">Đang tải dữ liệu...</td></tr>
                            ) : paginatedCategories.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-5 text-muted">Chưa có danh mục nào. Hãy tạo mới!</td></tr>
                            ) : (
                                paginatedCategories.map(cat => (
                                    <tr key={cat.id}>
                                        <td className="px-4 py-3 fw-bold text-muted">#{cat.id}</td>
                                        <td className="px-4 py-3">
                                            {cat.imageUrl ? (
                                                <img src={cat.imageUrl} alt={cat.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                            ) : (
                                                <div className="bg-light d-flex justify-content-center align-items-center text-muted" style={{ width: '50px', height: '50px', borderRadius: '8px', fontSize: '10px' }}>No Image</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 fw-bold text-dark">
                                            <div style={{ marginLeft: `${cat.level * 20}px` }}>
                                                {cat.level > 0 && <i className="fa fa-level-up-alt fa-rotate-90 text-muted me-2"></i>}
                                                {cat.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted">{cat.description || '-'}</td>
                                        <td className="px-4 py-3 text-end">
                                            <button className="btn btn-sm btn-light text-primary me-2 shadow-sm" onClick={() => handleOpenModal(cat)} title="Sửa">
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger shadow-sm" onClick={() => handleDelete(cat.id)} title="Xóa">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    totalItems={displayCategories.length} 
                    itemsPerPage={itemsPerPage} 
                />
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 rounded-4 shadow-lg">
                                <div className="modal-header border-bottom-0 pt-4 pb-0 px-4">
                                    <h5 className="modal-title fw-bold">{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Tên Danh Mục <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control bg-light border-0" 
                                                    required 
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                    placeholder="VD: Vang Đỏ..."
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold small text-muted text-uppercase">Danh Mục Cha</label>
                                                <select 
                                                    className="form-select bg-light border-0"
                                                    value={formData.parentId}
                                                    onChange={e => setFormData({...formData, parentId: e.target.value ? Number(e.target.value) : ''})}
                                                >
                                                    <option value="">-- Không có --</option>
                                                    {displayCategories.filter(c => c.id !== editingCategory?.id).map(c => (
                                                        <option key={c.id} value={c.id}>
                                                            {'\u00A0'.repeat(c.level * 4)}{c.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3 p-3 bg-light rounded-3 border-0">
                                            <label className="form-label fw-bold small text-muted text-uppercase mb-3">Hình Ảnh (URL hoặc Tải Lên)</label>
                                            <div className="d-flex align-items-start gap-3">
                                                {formData.imageUrl ? (
                                                    <img src={formData.imageUrl} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }} />
                                                ) : (
                                                    <div className="bg-white d-flex justify-content-center align-items-center text-muted shadow-sm" style={{ width: '80px', height: '80px', borderRadius: '12px' }}>
                                                        <i className="fa fa-image fs-3"></i>
                                                    </div>
                                                )}
                                                <div className="flex-grow-1">
                                                    <input 
                                                        type="text" 
                                                        className="form-control border-0 shadow-sm mb-2" 
                                                        placeholder="Nhập link URL ảnh..."
                                                        value={formData.imageUrl}
                                                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                                    />
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="small fw-bold text-muted" style={{fontSize: '11px'}}>HOẶC:</span>
                                                        <input 
                                                            type="file" 
                                                            className="form-control form-control-sm border-0 shadow-sm" 
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            disabled={uploadingImage}
                                                        />
                                                    </div>
                                                    {uploadingImage && <small className="text-primary mt-1 d-block"><i className="fa fa-spinner fa-spin me-1"></i>Đang tải...</small>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold small text-muted text-uppercase">Mô Tả Chi Tiết</label>
                                            <textarea 
                                                className="form-control bg-light border-0" 
                                                rows="3"
                                                value={formData.description}
                                                onChange={e => setFormData({...formData, description: e.target.value})}
                                                placeholder="Mô tả về loại rượu này..."
                                            ></textarea>
                                        </div>
                                        <div className="d-flex gap-2 justify-content-end border-top pt-3">
                                            <button type="button" className="btn btn-light fw-bold px-4" onClick={handleCloseModal}>Hủy</button>
                                            <button type="submit" className="btn btn-burgundy fw-bold px-4">{editingCategory ? 'Lưu Thay Đổi' : 'Tạo Mới'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                .btn-burgundy { background-color: #722f37; color: #fff; transition: all 0.2s; }
                .btn-burgundy:hover { background-color: #5c242c; color: #fff; }
                .text-burgundy { color: #722f37; }
            `}</style>
        </div>
    );
};

export default AdminCategory;
