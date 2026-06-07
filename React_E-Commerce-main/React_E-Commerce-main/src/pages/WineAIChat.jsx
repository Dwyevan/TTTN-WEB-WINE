import React, { useState, useEffect, useRef } from "react";
import { askSommelier } from "../services/aiService";

const WineAIChat = ({ products = [] }) => {
  const [messages, setMessages] = useState([
    { text: "Chào bạn, tôi là chuyên gia WinePro. Hôm nay bạn muốn tìm rượu cho bữa tiệc nào?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 
  
  const scrollRef = useRef(null);

  // Cuộn xuống mượt mà khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    // Ngăn gửi tin nhắn trống hoặc khi đang chờ AI trả lời
    if (!input.trim() || isTyping) return;

    const userMsg = { text: input.trim(), sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Đảm bảo truyền mảng products (nếu rỗng AI sẽ tư vấn chung)
      const currentProducts = Array.isArray(products) ? products : [];
      const aiResponse = await askSommelier(userMsg.text, currentProducts);
      
      setMessages(prev => [...prev, { text: aiResponse, sender: "ai" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        text: "Xin lỗi, WinePro đang bận xử lý dữ liệu. Bạn vui lòng thử lại sau giây lát nhé!", 
        sender: "ai" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Nút bấm nổi - Thêm hiệu ứng hover */}
      {!isOpen && (
        <button 
          className="btn btn-dark rounded-circle shadow-lg fixed-bottom end-0 m-4 d-flex align-items-center justify-content-center"
          style={{ width: "60px", height: "60px", zIndex: 1050, transition: "transform 0.2s" }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={() => setIsOpen(true)}
        >
          <i className="fa fa-commenting-o fs-3"></i>
        </button>
      )}

      {/* Khung Chatbox */}
      {isOpen && (
        <div className="fixed-bottom end-0 m-4 shadow-lg bg-white rounded-4 overflow-hidden d-flex flex-column" 
             style={{ width: "380px", height: "500px", zIndex: 1050, border: "1px solid #eee", animation: "fadeInUp 0.3s ease-out" }}>
          
          {/* Header */}
          <div className="bg-dark text-white p-3 d-flex align-items-center justify-content-between shadow-sm">
            <div className="d-flex align-items-center">
              <div className="position-relative me-2">
                <i className="fa fa-robot fs-4 text-info"></i>
                <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>
              </div>
              <div>
                <div className="fw-bold" style={{ lineHeight: "1.2" }}>WinePro AI</div>
                <small className="text-success" style={{ fontSize: "0.7rem" }}>Trực tuyến</small>
              </div>
            </div>
            <button className="btn btn-sm text-white-50 border-0 p-0" onClick={() => setIsOpen(false)}>
              <i className="fa fa-times fs-5"></i>
            </button>
          </div>
          
          {/* Nội dung tin nhắn */}
          <div className="p-3 overflow-auto flex-grow-1 bg-white" ref={scrollRef} style={{ fontSize: "0.95rem" }}>
            {messages.map((m, i) => (
              <div key={i} className={`mb-3 d-flex ${m.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`p-3 rounded-4 ${m.sender === "user" ? "bg-primary text-white" : "bg-light text-dark shadow-sm"}`}
                     style={{ 
                        maxWidth: "85%", 
                        whiteSpace: "pre-wrap", // Quan trọng để hiển thị xuống dòng từ AI
                        borderRadius: m.sender === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px"
                     }}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {/* Hiệu ứng đang soạn tin nhắn */}
            {isTyping && (
              <div className="text-start mb-3">
                <div className="bg-light d-inline-block p-2 rounded-4 px-3 shadow-sm">
                    <span className="small text-muted">
                        <i className="fa fa-spinner fa-spin me-2 text-primary"></i>WinePro đang suy nghĩ...
                    </span>
                </div>
              </div>
            )}
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 border-top bg-white">
            <div className="input-group bg-light rounded-pill px-3 py-1">
                <input 
                  className="form-control border-0 bg-transparent shadow-none" 
                  style={{ fontSize: "0.9rem" }}
                  placeholder="Bạn muốn tìm rượu gì?"
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                />
                <button 
                    className={`btn btn-link shadow-none p-0 ${isTyping || !input.trim() ? 'text-muted' : 'text-primary'}`} 
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                >
                <i className="fa fa-paper-plane fs-5"></i>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation đơn giản */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default WineAIChat;