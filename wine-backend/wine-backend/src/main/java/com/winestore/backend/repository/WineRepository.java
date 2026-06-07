package com.winestore.backend.repository;

import com.winestore.backend.entity.Wine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface WineRepository extends JpaRepository<Wine, Long> {
    
    // 1. Tìm kiếm theo tên (Đã có của bạn)
    List<Wine> findByNameContainingIgnoreCase(String name);
    
    // 2. Tìm theo xuất xứ (Đã có của bạn)
    List<Wine> findByOrigin(String origin);

    // --- CẬP NHẬT MỚI CHO CATEGORY ---

    // 3. Tìm chính xác theo Category (Dùng cho các nút bấm lọc cố định)
    List<Wine> findByCategory(String category);

    // 4. Tìm theo Category không phân biệt hoa thường (An toàn hơn khi nhận tham số từ URL)
    List<Wine> findByCategoryIgnoreCase(String category);

    // 5. Lấy danh sách tất cả Category hiện có trong DB (Dùng để hiển thị Menu lọc tự động)
    @Query("SELECT DISTINCT w.category FROM Wine w WHERE w.category IS NOT NULL")
    List<String> findAllDistinctCategories();

    // 6. Kết hợp: Lọc theo Category VÀ Tên (Dùng cho tính năng Search nâng cao)
    List<Wine> findByCategoryAndNameContainingIgnoreCase(String category, String name);

    // --- CẬP NHẬT MỚI: THỐNG KÊ TỒN KHO THEO YÊU CẦU ---

    /**
     * Lấy tổng số lượng chai rượu còn trong kho của TỪNG loại.
     * Trả về danh sách các mảng Object, trong đó:
     * index [0]: Tên loại (category)
     * index [1]: Tổng số lượng tồn kho (sum of stock)
     */
    @Query("SELECT w.category, SUM(w.stockQuantity) FROM Wine w GROUP BY w.category")
    List<Object[]> countStockByCategory();

    /**
     * Lấy tổng số lượng tất cả sản phẩm đang có trong kho
     */
    @Query("SELECT SUM(w.stockQuantity) FROM Wine w")
    Long getTotalStockCount();

    // --- DASHBOARD: Sản phẩm bán chạy nhất ---
    List<Wine> findTop5ByOrderBySoldCountDesc();

    // --- DASHBOARD: Đếm sản phẩm sắp hết hàng (stockQuantity <= minimumStock) ---
    @Query("SELECT COUNT(w) FROM Wine w WHERE w.stockQuantity IS NOT NULL AND w.stockQuantity <= w.minimumStock AND w.stockQuantity > 0")
    Long countLowStock();

    // --- DASHBOARD: Đếm sản phẩm hết hàng (stockQuantity = 0 hoặc NULL) ---
    @Query("SELECT COUNT(w) FROM Wine w WHERE w.stockQuantity IS NULL OR w.stockQuantity = 0")
    Long countOutOfStock();
}