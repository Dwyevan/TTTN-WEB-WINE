package com.winestore.backend.controller;

import com.winestore.backend.config.VNPayConfig;
import com.winestore.backend.entity.Order;
import com.winestore.backend.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PaymentController {

    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;

    public PaymentController(VNPayConfig vnPayConfig, OrderService orderService) {
        this.vnPayConfig = vnPayConfig;
        this.orderService = orderService;
    }

    @GetMapping("/create-url")
    public ResponseEntity<?> createPaymentUrl(
            @RequestParam("amount") long amount,
            @RequestParam("orderId") String orderId,
            HttpServletRequest request) throws UnsupportedEncodingException {

        long amountInVND = amount * 100; // VNPay requires amount * 100

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.getVnp_Version());
        vnp_Params.put("vnp_Command", vnPayConfig.getVnp_Command());
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getVnp_TmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amountInVND));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", orderId);
        // LOẠI BỎ KHOẢNG TRẮNG BẰNG DẤU GẠCH DƯỚI ĐỂ TRÁNH LỖI MÃ HÓA URL
        vnp_Params.put("vnp_OrderInfo", "Thanh_toan_don_hang_" + orderId);
        vnp_Params.put("vnp_OrderType", "other"); // LỖI 03 LÀ DO THIẾU PARAM NÀY
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
        
        String vnp_IpAddr = request.getRemoteAddr();
        // IPv6 loopback check
        if (vnp_IpAddr.equals("0:0:0:0:0:0:0:1")) {
            vnp_IpAddr = "127.0.0.1";
        }
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        
        // Build the URL hash
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Sử dụng lại chuẩn US-ASCII của VNPAY
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());
                String encodedName = URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString());

                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(encodedValue);
                
                query.append(encodedName);
                query.append('=');
                query.append(encodedValue);
                
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        
        Map<String, String> result = new HashMap<>();
        result.put("url", paymentUrl);
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestParam Map<String, String> queryParams) {
        String vnp_SecureHash = queryParams.get("vnp_SecureHash");
        queryParams.remove("vnp_SecureHash");
        queryParams.remove("vnp_SecureHashType");

        // Calculate expected hash
        String expectedHash = VNPayConfig.hashAllFields(queryParams, vnPayConfig.getSecretKey());

        if (expectedHash.equals(vnp_SecureHash)) {
            // Payment valid
            String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
            String vnp_TxnRef = queryParams.get("vnp_TxnRef");
            
            if ("00".equals(vnp_ResponseCode)) {
                // Success
                try {
                    Long orderId = Long.parseLong(vnp_TxnRef);
                    // Update order status to PAID
                    Order updatedOrder = orderService.updateOrderStatus(orderId, "PAID");
                    // TODO: Stock deduction logic should be handled here or inside OrderService 
                    // when status changes to PAID. We will add that in Phase 2.
                    return ResponseEntity.ok(updatedOrder);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật đơn hàng: " + e.getMessage());
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Giao dịch không thành công. Mã lỗi: " + vnp_ResponseCode);
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Chữ ký không hợp lệ!");
        }
    }
}
