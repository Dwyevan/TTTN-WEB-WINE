import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Dán Key mới vừa copy vào đây
const genAI = new GoogleGenerativeAI("AIzaSyASStKmIvP06n3yVN4Kc6p3sxWRo_anYUE");

export const askSommelier = async (userQuestion, products) => {
  try {
    // 2. THAY ĐỔI QUAN TRỌNG: Đổi 'gemini-pro' thành 'gemini-1.5-flash'
    // Model 1.5-flash nhanh hơn và ổn định hơn cho bản v1beta hiện tại
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // ĐỔI TÊN MODEL TRONG aiService.js
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const wineData = products && products.length > 0 
      ? products.map(w => `- ${w.name}: Giá ${w.price}đ`).join("\n")
      : "Hiện không có dữ liệu sản phẩm.";

    const prompt = `Bạn là chuyên gia tư vấn WinePro. Danh sách rượu: ${wineData}. Trả lời: ${userQuestion}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Lỗi AI:", error);
    return "WinePro đang bảo trì, vui lòng thử lại!";
  }
};