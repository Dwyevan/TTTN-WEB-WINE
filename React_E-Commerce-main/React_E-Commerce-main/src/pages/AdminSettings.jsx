import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import API_BASE_URL from '../config';
const AdminSettings = () => {
    const [settings, setSettings] = useState({
        SHIPPING_FEE: '0',
        FREE_SHIPPING_THRESHOLD: '0',
        STORE_NAME: '',
        STORE_ADDRESS: '',
        STORE_PHONE: '',
        STORE_EMAIL: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/settings`);
            setSettings({
                SHIPPING_FEE: res.data.SHIPPING_FEE || '0',
                FREE_SHIPPING_THRESHOLD: res.data.FREE_SHIPPING_THRESHOLD || '0',
                STORE_NAME: res.data.STORE_NAME || '',
                STORE_ADDRESS: res.data.STORE_ADDRESS || '',
                STORE_PHONE: res.data.STORE_PHONE || '',
                STORE_EMAIL: res.data.STORE_EMAIL || ''
            });
        } catch (error) {
            console.error("Lỗi khi lấy cài đặt:", error);
            toast.error("Không thể tải cấu hình hệ thống!");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'SHIPPING_FEE' || name === 'FREE_SHIPPING_THRESHOLD') {
            if (value === '' || /^\d+$/.test(value)) {
                setSettings({ ...settings, [name]: value });
            }
        } else {
            setSettings({ ...settings, [name]: value });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const loadingToast = toast.loading("Đang lưu cài đặt...");
        try {
            await axios.put(`${API_BASE_URL}/api/settings`, settings);
            toast.success("Đã lưu cấu hình hệ thống thành công!", { id: loadingToast });
        } catch (error) {
            toast.error("Lưu cấu hình thất bại!", { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border" style={{ color: '#722f37' }}></div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '50px' }}>
            <div className="d-flex align-items-center mb-4">
                <div className="d-flex justify-content-center align-items-center rounded-3 me-3" style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #722f37 0%, #a04050 100%)', boxShadow: '0 4px 10px rgba(114,47,55,0.2)' }}>
                    <i className="fa fa-cogs text-white fs-4"></i>
                </div>
                <div>
                    <h3 className="fw-bold text-dark mb-0">Cài Đặt Hệ Thống</h3>
                    <p className="text-muted small mb-0">Quản lý các thông số vận hành của Website</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSave}>
                        <h5 className="fw-bold mb-4" style={{ color: '#722f37', borderBottom: '2px solid rgba(114,47,55,0.1)', paddingBottom: '10px' }}>
                            <i className="fa fa-info-circle me-2"></i>Thông Tin Cửa Hàng
                        </h5>
                        
                        <div className="row g-4 mb-5">
                            <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted text-uppercase">Tên Cửa Hàng</label>
                                <input type="text" className="form-control p-3 bg-light border-0" name="STORE_NAME" value={settings.STORE_NAME} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted text-uppercase">Số Điện Thoại</label>
                                <input type="text" className="form-control p-3 bg-light border-0" name="STORE_PHONE" value={settings.STORE_PHONE} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted text-uppercase">Email Liên Hệ</label>
                                <input type="email" className="form-control p-3 bg-light border-0" name="STORE_EMAIL" value={settings.STORE_EMAIL} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted text-uppercase">Địa Chỉ</label>
                                <input type="text" className="form-control p-3 bg-light border-0" name="STORE_ADDRESS" value={settings.STORE_ADDRESS} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <h5 className="fw-bold mb-4" style={{ color: '#722f37', borderBottom: '2px solid rgba(114,47,55,0.1)', paddingBottom: '10px' }}>
                            <i className="fa fa-truck me-2"></i>Cấu hình Vận chuyển
                        </h5>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                Phí vận chuyển mặc định (VNĐ)
                            </label>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light border-end-0"><i className="fa fa-money-bill text-success"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-0 fw-bold text-dark" 
                                    name="SHIPPING_FEE"
                                    value={settings.SHIPPING_FEE}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-group-text bg-light fw-bold">VNĐ</span>
                            </div>
                            <div className="form-text mt-2"><i className="fa fa-info-circle me-1"></i>Mức phí giao hàng áp dụng cho tất cả các đơn hàng chưa đạt điều kiện Freeship.</div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                Ngưỡng Miễn phí Vận chuyển - Freeship (VNĐ)
                            </label>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light border-end-0"><i className="fa fa-gift text-danger"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-0 fw-bold text-dark" 
                                    name="FREE_SHIPPING_THRESHOLD"
                                    value={settings.FREE_SHIPPING_THRESHOLD}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-group-text bg-light fw-bold">VNĐ</span>
                            </div>
                            <div className="form-text mt-2"><i className="fa fa-info-circle me-1"></i>Đơn hàng có tổng tiền vượt qua mức này sẽ được miễn phí giao hàng (Phí giao hàng = 0đ).</div>
                        </div>

                        <div className="d-flex justify-content-end border-top pt-4">
                            <button 
                                type="button" 
                                className="btn btn-light px-4 py-2 me-2 rounded-pill fw-bold"
                                onClick={fetchSettings}
                            >
                                Hủy Bỏ
                            </button>
                            <button 
                                type="submit" 
                                className="btn px-5 py-2 rounded-pill fw-bold text-white shadow-sm"
                                style={{ background: '#722f37', transition: 'all 0.3s' }}
                                disabled={saving}
                                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 15px rgba(114,47,55,0.3)'; }}
                                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                            >
                                {saving ? (
                                    <><i className="fa fa-spinner fa-spin me-2"></i>Đang lưu...</>
                                ) : (
                                    <><i className="fa fa-save me-2"></i>Lưu Thay Đổi</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
