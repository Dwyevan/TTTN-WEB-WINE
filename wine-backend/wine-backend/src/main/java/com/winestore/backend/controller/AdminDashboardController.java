package com.winestore.backend.controller;

import com.winestore.backend.DTO.DashboardStatsDTO;
import com.winestore.backend.entity.Order;
import com.winestore.backend.entity.Wine;
import com.winestore.backend.repository.OrderRepository;
import com.winestore.backend.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller tổng hợp dữ liệu Dashboard Admin
 * Trả về TẤT CẢ metrics trong 1 lần gọi API duy nhất
 */
@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final OrderRepository orderRepository;
    private final WineRepository wineRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * GET /api/admin/dashboard/stats
     * Trả về toàn bộ thống kê dashboard trong 1 API call
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {

        // 1. Thống kê tổng quan
        Double revenue = orderRepository.calculateTotalRevenue();
        Long totalOrders = orderRepository.count();
        Long totalProducts = wineRepository.count();
        Long lowStockCount = wineRepository.countLowStock();
        Long outOfStockCount = wineRepository.countOutOfStock();

        // 2. Đếm đơn hàng theo trạng thái
        Long pendingCount = orderRepository.countByStatus("PENDING");
        Long confirmedCount = orderRepository.countByStatus("CONFIRMED");
        Long shippingCount = orderRepository.countByStatus("SHIPPING");
        Long deliveredCount = orderRepository.countByStatus("DELIVERED");
        Long cancelledCount = orderRepository.countByStatus("CANCELLED");
        // Tương thích ngược với trạng thái cũ
        Long shippedCount = orderRepository.countByStatus("SHIPPED");

        // 3. Sản phẩm bán chạy (Top 5)
        List<Wine> topWines = wineRepository.findTop5ByOrderBySoldCountDesc();
        List<DashboardStatsDTO.BestSellerDTO> bestSellers = topWines.stream()
                .map(w -> DashboardStatsDTO.BestSellerDTO.builder()
                        .id(w.getId())
                        .name(w.getName())
                        .imageUrl(w.getImageUrl())
                        .category(w.getCategory())
                        .price(w.getPrice() != null ? w.getPrice().doubleValue() : 0.0)
                        .soldCount(w.getSoldCount() != null ? w.getSoldCount() : 0)
                        .stock(w.getStockQuantity() != null ? w.getStockQuantity() : 0)
                        .build())
                .collect(Collectors.toList());

        // 4. Đơn hàng gần đây (10 đơn mới nhất)
        List<Order> latestOrders = orderRepository.findTop10ByOrderByOrderDateDesc();
        List<DashboardStatsDTO.RecentOrderDTO> recentOrders = latestOrders.stream()
                .map(o -> DashboardStatsDTO.RecentOrderDTO.builder()
                        .id(o.getId())
                        .customerName(o.getCustomerName())
                        .customerEmail(o.getCustomerEmail())
                        .totalAmount(o.getTotalAmount())
                        .status(o.getStatus())
                        .orderDate(o.getOrderDate() != null ? o.getOrderDate().format(DATE_FORMAT) : "N/A")
                        .itemCount(o.getItems() != null ? o.getItems().size() : 0)
                        .build())
                .collect(Collectors.toList());

        // 5. Build response
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .lowStockCount(lowStockCount != null ? lowStockCount : 0L)
                .outOfStockCount(outOfStockCount != null ? outOfStockCount : 0L)
                .pendingOrdersCount(pendingCount != null ? pendingCount : 0L)
                .confirmedOrdersCount(confirmedCount != null ? confirmedCount : 0L)
                .shippingOrdersCount((shippingCount != null ? shippingCount : 0L) + (shippedCount != null ? shippedCount : 0L))
                .deliveredOrdersCount(deliveredCount != null ? deliveredCount : 0L)
                .cancelledOrdersCount(cancelledCount != null ? cancelledCount : 0L)
                .bestSellers(bestSellers)
                .recentOrders(recentOrders)
                .build();

        return ResponseEntity.ok(stats);
    }
}
