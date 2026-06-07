package com.winestore.backend.controller;

import com.winestore.backend.DTO.OrderRequest;
import com.winestore.backend.entity.Order;
import com.winestore.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * TẠO ĐƠN HÀNG (POST)
     * Giải quyết lỗi 415 bằng cách định nghĩa rõ Consumes JSON
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        try {
            System.out.println(">>> Đang tạo đơn hàng cho: " + request.getCustomerName());
            Order savedOrder = orderService.createOrderFromDto(request);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo đơn: " + e.getMessage());
        }
    }

    /**
     * LẤY TẤT CẢ ĐƠN HÀNG (GET)
     * Phục vụ trang danh sách Admin
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * LẤY CHI TIẾT MỘT ĐƠN HÀNG (GET)
     * QUAN TRỌNG: Đây là phần bị thiếu khiến bạn gặp lỗi 405
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id); // Giả định service có hàm này
            if (order != null) {
                return ResponseEntity.ok(order);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng #" + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }

    /**
     * CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (PATCH)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể cập nhật trạng thái");
        }
    }

    /**
     * LẤY LỊCH SỬ ĐƠN HÀNG THEO EMAIL (GET)
     */
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Order>> getHistory(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerEmail(email));
    }

    /**
     * LẤY LỊCH SỬ ĐƠN HÀNG THEO USER ID (GET)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getHistoryByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    /**
     * XÓA ĐƠN HÀNG (DELETE)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * TÍNH TỔNG DOANH THU (GET)
     */
    @GetMapping("/stats/revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        // Chúng ta inject OrderRepository trực tiếp hoặc qua Service. 
        // Vì làm nhanh, có thể gọi orderService nếu có hàm, hoặc tạm để Service làm.
        // Tôi sẽ sửa OrderService để trả về.
        Double revenue = orderService.getTotalRevenue();
        return ResponseEntity.ok(revenue != null ? revenue : 0.0);
    }
}