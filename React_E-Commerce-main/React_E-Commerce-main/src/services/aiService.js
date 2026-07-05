import axios from "axios";

import API_BASE_URL from '../config';
// Lấy sessionId từ localStorage (nếu chưa có thì tự sinh ra)
const getSessionId = () => {
  let sessionId = localStorage.getItem("chatbot_session");
  if (!sessionId) {
    sessionId = "session-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("chatbot_session", sessionId);
  }
  return sessionId;
};

export const askSommelier = async (userQuestion, products) => {
  try {
    const sessionId = getSessionId();
    
    // Gọi API sang Backend Spring Boot (Dialogflow)
    const response = await axios.post(`${API_BASE_URL}/api/chatbot/ask`, {
      sessionId: sessionId,
      message: userQuestion
    });

    return response.data.response;

  } catch (error) {
    console.error("Lỗi kết nối Backend AI:", error);
    return "WinePro đang bảo trì (hoặc chưa cấu hình xong Dialogflow), vui lòng thử lại!";
  }
};