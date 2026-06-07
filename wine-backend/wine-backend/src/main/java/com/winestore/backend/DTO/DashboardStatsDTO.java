package com.winestore.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    // === TỔNG QUAN ===
    private Double totalRevenue;        // Tổng doanh thu (đơn đã xác nhận/giao)
    private Long totalOrders;           // Tổng số đơn hàng
    private Long totalProducts;         // Tổng số sản phẩm
    private Long lowStockCount;         // Số sản phẩm sắp hết hàng
    private Long outOfStockCount;       // Số sản phẩm hết hàng
    private Long pendingOrdersCount;    // Số đơn chờ xử lý

    // === THỐNG KÊ THEO TRẠNG THÁI ĐƠN HÀNG ===
    private Long confirmedOrdersCount;
    private Long shippingOrdersCount;
    private Long deliveredOrdersCount;
    private Long cancelledOrdersCount;

    // === SẢN PHẨM BÁN CHẠY (Top 5) ===
    private List<BestSellerDTO> bestSellers;

    // === ĐƠN HÀNG GẦN ĐÂY (10 đơn mới nhất) ===
    private List<RecentOrderDTO> recentOrders;

    // --- Inner DTOs ---

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BestSellerDTO {
        private Long id;
        private String name;
        private String imageUrl;
        private String category;
        private Double price;
        private Integer soldCount;
        private Integer stock;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrderDTO {
        private Long id;
        private String customerName;
        private String customerEmail;
        private Double totalAmount;
        private String status;
        private String orderDate;
        private Integer itemCount;
    }
}
