package com.winestore.backend.controller;

import com.winestore.backend.entity.Order;
import com.winestore.backend.service.OrderService;
import com.winestore.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class UnifiedPaymentController {

    private final OrderService orderService;
    private final ApplicationContext applicationContext;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {
        
        try {
            Long orderId = Long.valueOf(requestBody.get("orderId").toString());
            String paymentMethod = requestBody.getOrDefault("paymentMethod", "VNPAY").toString();

            // Lấy Order từ DB để lấy amount
            // Lưu ý: service getOrderById có thể trả về Order hoặc Optional
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
            }
            long amount = Math.round(order.getTotalAmount());

            // Strategy Pattern: Lấy đúng service dựa vào paymentMethod
            PaymentService paymentService = applicationContext.getBean(paymentMethod.toUpperCase(), PaymentService.class);
            String paymentUrl = paymentService.createPaymentUrl(order, amount, request);

            Map<String, String> result = new HashMap<>();
            result.put("url", paymentUrl);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi tạo thanh toán: " + e.getMessage());
        }
    }

    @GetMapping("/verify/{method}")
    public ResponseEntity<?> verifyPayment(
            @PathVariable("method") String method,
            @RequestParam Map<String, String> queryParams) {
        try {
            PaymentService paymentService = applicationContext.getBean(method.toUpperCase(), PaymentService.class);
            
            boolean isValid = paymentService.verifyPayment(queryParams);
            if (isValid) {
                String responseCode = method.equalsIgnoreCase("VNPAY") 
                        ? queryParams.get("vnp_ResponseCode") 
                        : queryParams.get("resultCode");
                
                String orderRef = method.equalsIgnoreCase("VNPAY") 
                        ? queryParams.get("vnp_TxnRef") 
                        : queryParams.get("orderId").split("_")[0]; // Cắt requestId của MoMo ra

                if ("00".equals(responseCode) || "0".equals(responseCode)) {
                    Order updatedOrder = orderService.updateOrderStatus(Long.parseLong(orderRef), "PAID");
                    return ResponseEntity.ok(updatedOrder);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Giao dịch không thành công. Mã lỗi: " + responseCode);
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Chữ ký không hợp lệ!");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật đơn hàng: " + e.getMessage());
        }
    }
}
