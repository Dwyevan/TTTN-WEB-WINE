import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmModal, LoadingSpinner, EmptyState } from "../components";

import API_BASE_URL from '../config';
const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, action: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerToggleLock = (id, currentStatus) => {
    setConfirmModal({ 
      isOpen: true, 
      id, 
      action: currentStatus === false ? "UNLOCK" : "LOCK" 
    });
  };

  const executeToggleLock = async () => {
    const { id } = confirmModal;
    if (!id) return;
    const loadingToast = toast.loading("Đang xử lý...");
    try {
      await axios.patch(`${API_BASE_URL}/api/users/${id}/toggle-lock`);
      toast.success("Đã cập nhật trạng thái tài khoản", { id: loadingToast });
      fetchUsers(); // Tải lại danh sách
    } catch (err) {
      toast.error(err.response?.data || "Thao tác thất bại!", { id: loadingToast });
    } finally {
      setConfirmModal({ isOpen: false, id: null, action: null });
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải danh sách tài khoản..." />;

  const stats = {
    total: users.length,
    active: users.filter(u => u.active !== false).length,
    locked: users.filter(u => u.active === false).length,
    admins: users.filter(u => u.role === "ADMIN").length
  };

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ isOpen: false, id: null, action: null })} 
        onConfirm={executeToggleLock} 
        title={confirmModal.action === "LOCK" ? "Khóa Tài Khoản" : "Mở Khóa Tài Khoản"} 
        message={confirmModal.action === "LOCK" 
          ? "Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ không thể đăng nhập."
          : "Bạn muốn mở khóa tài khoản này cho phép họ đăng nhập trở lại?"}
      />
      {/* HEADER */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-white mb-1">
                <i className="fa fa-users me-2"></i>
                Quản Lý Khách Hàng (CRM)
              </h2>
              <p className="text-white-50 mb-0 small" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Theo dõi, phân quyền và khóa các tài khoản vi phạm
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <i className="fa fa-user-shield text-white" style={{ fontSize: '32px' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderRadius: '16px', borderLeft: '4px solid #007bff' }}>
            <div className="text-muted small fw-bold text-uppercase mb-1">Tổng tài khoản</div>
            <h3 className="fw-bold text-primary mb-0">{stats.total}</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderRadius: '16px', borderLeft: '4px solid #28a745' }}>
            <div className="text-muted small fw-bold text-uppercase mb-1">Đang hoạt động</div>
            <h3 className="fw-bold text-success mb-0">{stats.active}</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderRadius: '16px', borderLeft: '4px solid #dc3545' }}>
            <div className="text-muted small fw-bold text-uppercase mb-1">Bị khóa</div>
            <h3 className="fw-bold text-danger mb-0">{stats.locked}</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100 p-3" style={{ borderRadius: '16px', borderLeft: '4px solid #6610f2' }}>
            <div className="text-muted small fw-bold text-uppercase mb-1">Quản trị viên (Admin)</div>
            <h3 className="fw-bold mb-0" style={{ color: '#6610f2' }}>{stats.admins}</h3>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th className="py-3 ps-4 border-0 fw-semibold text-muted small text-uppercase">Khách hàng</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase">Liên hệ</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center">Vai trò</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-center">Trạng thái</th>
                <th className="border-0 fw-semibold text-muted small text-uppercase text-end pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5"><EmptyState title="Không có dữ liệu" message="Chưa có khách hàng nào đăng ký." /></td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-bottom">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="d-flex align-items-center justify-content-center flex-shrink-0 text-white fw-bold shadow-sm" style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                          fontSize: '18px'
                        }}>
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ms-3">
                          <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{user.fullName || user.username}</div>
                          <div className="small text-muted">ID: #{user.id} · @{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small text-dark mb-1"><i className="fa fa-envelope me-2 text-muted"></i>{user.email}</div>
                      <div className="small text-dark"><i className="fa fa-phone me-2 text-muted"></i>{user.phone || "Chưa cập nhật"}</div>
                    </td>
                    <td className="text-center">
                      <span className="badge px-3 py-2" style={{
                        background: user.role === 'ADMIN' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(108, 117, 125, 0.1)',
                        color: user.role === 'ADMIN' ? '#667eea' : '#6c757d',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}>
                        {user.role === 'ADMIN' ? <><i className="fa fa-shield-alt me-1"></i> ADMIN</> : "CUSTOMER"}
                      </span>
                    </td>
                    <td className="text-center">
                      {user.active !== false ? (
                        <span className="badge px-3 py-2" style={{
                          background: 'rgba(40, 167, 69, 0.1)',
                          color: '#28a745',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}>
                          <i className="fa fa-check-circle me-1"></i>Đang hoạt động
                        </span>
                      ) : (
                        <span className="badge px-3 py-2" style={{
                          background: 'rgba(220, 53, 69, 0.1)',
                          color: '#dc3545',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}>
                          <i className="fa fa-lock me-1"></i>Đã bị khóa
                        </span>
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      {user.role !== 'ADMIN' && (
                        <button 
                          className="btn btn-sm px-3 py-2 fw-bold shadow-sm"
                          style={{
                            borderRadius: '10px',
                            background: user.active !== false ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)',
                            color: user.active !== false ? '#dc3545' : '#28a745',
                            border: '1px solid',
                            borderColor: user.active !== false ? 'rgba(220, 53, 69, 0.2)' : 'rgba(40, 167, 69, 0.2)',
                            fontSize: '12px',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => triggerToggleLock(user.id, user.active)}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <i className={`fa ${user.active !== false ? 'fa-lock' : 'fa-unlock'} me-1`}></i>
                          {user.active !== false ? "Khóa" : "Mở khóa"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
