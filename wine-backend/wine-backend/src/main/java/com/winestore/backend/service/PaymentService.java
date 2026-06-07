package com.winestore.backend.service;

import com.winestore.backend.entity.Order;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface PaymentService {
    /**
     * Tạo URL thanh toán cho đơn hàng
     * @param order Đơn hàng
     * @param amount Số tiền thanh toán
     * @param request HTTP Request (chủ yếu dùng cho VNPay để lấy IP)
     * @return URL thanh toán
     */
    String createPaymentUrl(Order order, long amount, HttpServletRequest request) throws Exception;

    /**
     * Xác minh chữ ký sau khi thanh toán
     * @param queryParams Tham số trả về từ Gateway
     * @return true nếu chữ ký hợp lệ
     */
    boolean verifyPayment(Map<String, String> queryParams);
}
