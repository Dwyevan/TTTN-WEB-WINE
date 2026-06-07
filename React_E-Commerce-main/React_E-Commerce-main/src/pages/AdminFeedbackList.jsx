import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmModal, LoadingSpinner, EmptyState } from "../components";

const AdminFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/feedbacks");
      setFeedbacks(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách phản hồi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const triggerDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const executeDelete = async () => {
    const { id } = deleteModal;
    if (!id) return;
    const loadingToast = toast.loading("Đang xóa...");
    try {
      await axios.delete(`http://localhost:8080/api/feedbacks/${id}`);
      toast.success("Đã xóa phản hồi thành công", { id: loadingToast });
      setFeedbacks(feedbacks.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Xóa thất bại!", { id: loadingToast });
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return toast.error("Vui lòng nhập nội dung phản hồi!");
    
    setSending(true);
    const loadingToast = toast.loading("Đang gửi phản hồi...");
    try {
      await axios.post(`http://localhost:8080/api/feedbacks/reply`, {
        id: selectedFeedback.id,
        email: selectedFeedback.email,
        subject: `Phản hồi từ WineStore về: ${selectedFeedback.subject}`,
        message: replyMessage
      });

      toast.success(`Đã phản hồi thành công đến ${selectedFeedback.email}`, { id: loadingToast });
      setReplyMessage("");
      setSelectedFeedback(null);
      fetchFeedbacks();
    } catch (err) {
      toast.error("Gửi phản hồi thất bại! Vui lòng kiểm tra cấu hình Mail.", { id: loadingToast });
    } finally {
      setSending(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (filterStatus === "ALL") return true;
    return fb.status === filterStatus;
  });

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(fb => fb.status !== "REPLIED").length,
    replied: feedbacks.filter(fb => fb.status === "REPLIED").length
  };

  if (loading) return <LoadingSpinner message="Đang tải danh sách phản hồi..." />;

  return (
    <div className="container-fluid py-4" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null })} 
        onConfirm={executeDelete} 
        title="Xóa Phản Hồi" 
        message="Bạn có chắc chắn muốn xóa vĩnh viễn phản hồi này không?"
      />
      {/* HEADER */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-white mb-1">
                <i className="fa fa-comments me-2"></i>
                Quản Lý Phản Hồi Khách Hàng
              </h2>
              <p className="text-white-50 mb-0 small">
                <i className="fa fa-envelope me-1"></i>
                Hộp thư góp ý và phản hồi từ khách hàng
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <i className="fa fa-inbox text-white" style={{ fontSize: '32px' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '16px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="d-flex align-items-center justify-content-center" style={{
                  width: '48px', height: '48px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px'
                }}>
                  <i className="fa fa-envelope text-white" style={{ fontSize: '20px' }}></i>
                </div>
                <div className="ms-auto">
                  <span className="badge px-2 py-1" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', fontSize: '10px', borderRadius: '6px' }}>
                    Tổng
                  </span>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">{stats.total}</h3>
              <p className="text-muted small mb-0">Tổng phản hồi</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '16px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #ffc107 0%, #ff9800 100%)' }}></div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="d-flex align-items-center justify-content-center" style={{
                  width: '48px', height: '48px',
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  borderRadius: '12px'
                }}>
                  <i className="fa fa-clock text-white" style={{ fontSize: '20px' }}></i>
                </div>
                <div className="ms-auto">
                  <span className="badge px-2 py-1" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', fontSize: '10px', borderRadius: '6px' }}>
                    Chờ
                  </span>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">{stats.pending}</h3>
              <p className="text-muted small mb-0">Chờ xử lý</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '16px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)' }}></div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="d-flex align-items-center justify-content-center" style={{
                  width: '48px', height: '48px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  borderRadius: '12px'
                }}>
                  <i className="fa fa-check-circle text-white" style={{ fontSize: '20px' }}></i>
                </div>
                <div className="ms-auto">
                  <span className="badge px-2 py-1" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', fontSize: '10px', borderRadius: '6px' }}>
                    Hoàn thành
                  </span>
                </div>
              </div>
              <h3 className="fw-bold mb-1 text-dark">{stats.replied}</h3>
              <p className="text-muted small mb-0">Đã trả lời</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
          <div className="d-flex gap-2 flex-wrap">
            {[
              { key: 'ALL', label: 'Tất cả', icon: 'fa-list', color: '#667eea' },
              { key: 'PENDING', label: 'Chờ xử lý', icon: 'fa-clock', color: '#ffc107' },
              { key: 'REPLIED', label: 'Đã trả lời', icon: 'fa-check-circle', color: '#28a745' }
            ].map(status => (
              <button 
                key={status.key}
                className="btn px-3 py-2"
                style={{
                  borderRadius: '10px',
                  background: filterStatus === status.key ? status.color : '#fff',
                  color: filterStatus === status.key ? '#fff' : status.color,
                  border: `2px solid ${filterStatus === status.key ? status.color : '#e9ecef'}`,
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setFilterStatus(status.key)}
                onMouseEnter={(e) => {
                  if (filterStatus !== status.key) {
                    e.currentTarget.style.background = `${status.color}15`;
                    e.currentTarget.style.borderColor = status.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== status.key) {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }
                }}
              >
                <i className={`fa ${status.icon} me-1`}></i>
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEEDBACKS TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <tr className="text-white">
                <th className="py-3 ps-4 border-0 fw-semibold">Khách hàng</th>
                <th className="border-0 fw-semibold">Chủ đề</th>
                <th className="border-0 fw-semibold" style={{ minWidth: '300px' }}>Nội dung & Lịch sử</th>
                <th className="border-0 fw-semibold">Ngày nhận</th>
                <th className="border-0 fw-semibold text-center pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="5"><EmptyState title="Không có phản hồi nào" message="Chưa có phản hồi nào phù hợp với bộ lọc hiện tại." /></td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <tr key={fb.id} className="border-bottom">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center mb-2">
                        <div className="d-flex align-items-center justify-content-center flex-shrink-0 text-white fw-bold" style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                          fontSize: '16px'
                        }}>
                          {fb.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ms-3">
                          <div className="fw-semibold text-dark">{fb.fullName}</div>
                          <div className="small text-muted">{fb.email}</div>
                        </div>
                      </div>
                      {fb.status === "REPLIED" ? (
                        <span className="badge px-3 py-2" style={{
                          background: 'rgba(40, 167, 69, 0.1)',
                          color: '#28a745',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}>
                          <i className="fa fa-check-circle me-1"></i>Đã trả lời
                        </span>
                      ) : (
                        <span className="badge px-3 py-2" style={{
                          background: 'rgba(255, 193, 7, 0.1)',
                          color: '#ffc107',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}>
                          <i className="fa fa-clock me-1"></i>Chờ xử lý
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge px-3 py-2" style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}>
                        {fb.subject}
                      </span>
                    </td>
                    <td>
                      <div className="mb-2 p-2" style={{
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        borderLeft: '3px solid #6c757d'
                      }}>
                        <small className="text-muted d-block mb-1">
                          <i className="fa fa-comment-dots me-1"></i>
                          Khách hàng:
                        </small>
                        <div className="small text-dark">{fb.message}</div>
                      </div>
                      
                      {fb.replyMessage && (
                        <div className="p-2" style={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          borderRadius: '8px',
                          borderLeft: '3px solid #667eea'
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="fw-semibold" style={{ color: '#667eea' }}>
                              <i className="fa fa-reply me-1"></i>
                              Admin đã trả lời:
                            </small>
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              {new Date(fb.repliedAt).toLocaleString("vi-VN")}
                            </small>
                          </div>
                          <div className="small text-dark">{fb.replyMessage}</div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="small fw-semibold text-dark">
                        <i className="fa fa-calendar-alt me-1"></i>
                        {new Date(fb.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="small text-muted">
                        <i className="fa fa-clock me-1"></i>
                        {new Date(fb.createdAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="pe-4">
                      <div className="d-flex justify-content-center gap-2">
                        <button 
                          className="btn btn-sm d-flex align-items-center px-3 py-2"
                          style={{
                            borderRadius: '10px',
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '12px'
                          }}
                          onClick={() => setSelectedFeedback(fb)}
                        >
                          <i className={`fa ${fb.replyMessage ? 'fa-redo' : 'fa-reply'} me-2`}></i>
                          {fb.replyMessage ? "Gửi lại" : "Trả lời"}
                        </button>
                        <button 
                          className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{
                            width: '36px', height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(220, 53, 69, 0.1)',
                            color: '#dc3545',
                            border: 'none'
                          }}
                          onClick={() => triggerDelete(fb.id)}
                          title="Xóa"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INFO */}
      {filteredFeedbacks.length > 0 && (
        <div className="text-center mt-4">
          <small className="text-muted">
            Hiển thị {filteredFeedbacks.length} trong tổng số {feedbacks.length} phản hồi
          </small>
        </div>
      )}

      {/* REPLY MODAL */}
      {selectedFeedback && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="card border-0 shadow-lg" style={{ borderRadius: '16px', width: '90%', maxWidth: '600px' }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                  <i className="fa fa-reply me-2" style={{ color: '#667eea' }}></i>
                  Phản Hồi Khách Hàng
                </h5>
                <button 
                  className="btn-close" 
                  onClick={() => setSelectedFeedback(null)}
                  style={{ background: 'transparent', border: 'none' }}
                ></button>
              </div>

              <div className="mb-3 p-3" style={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: '12px'
              }}>
                <small className="text-muted text-uppercase fw-semibold d-block mb-2">Gửi đến:</small>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0 text-white fw-bold" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}>
                    {selectedFeedback.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ms-3">
                    <div className="fw-bold text-dark">{selectedFeedback.fullName}</div>
                    <div className="small text-muted">{selectedFeedback.email}</div>
                  </div>
                </div>
              </div>

              <div className="mb-3 p-3" style={{ 
                background: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #6c757d'
              }}>
                <small className="fw-semibold text-dark d-block mb-2">Khách hàng đã hỏi:</small>
                <p className="mb-0 small text-muted" style={{ fontStyle: 'italic' }}>"{selectedFeedback.message}"</p>
              </div>

              <div className="mb-4">
                <label className="fw-semibold mb-2 small" style={{ color: '#667eea' }}>
                  <i className="fa fa-pen me-1"></i>
                  Nội dung phản hồi của bạn:
                </label>
                <textarea 
                  className="form-control p-3" 
                  rows="5" 
                  placeholder="Nhập nội dung gửi mail cho khách hàng..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    resize: 'none'
                  }}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button 
                  className="btn btn-light px-4 py-2" 
                  style={{ borderRadius: '10px' }}
                  onClick={() => setSelectedFeedback(null)}
                >
                  Hủy
                </button>
                <button 
                  className="btn px-4 py-2"
                  style={{
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600'
                  }}
                  onClick={handleSendReply}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-paper-plane me-2"></i>
                      Gửi ngay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackList;