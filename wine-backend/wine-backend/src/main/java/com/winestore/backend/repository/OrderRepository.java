package com.winestore.backend.repository;

import com.winestore.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Đảm bảo viết đúng từng chữ: findAll + By + OrderBy + Id + Desc
    List<Order> findAllByOrderByIdDesc(); 
    
    List<Order> findByCustomerEmailOrderByOrderDateDesc(String email);
    List<Order> findByCustomerEmail(String customerEmail);
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    // Tính tổng doanh thu của các đơn hàng đã xác nhận trở lên
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN ('CONFIRMED', 'SHIPPING', 'DELIVERED', 'SHIPPED', 'PAID')")
    Double calculateTotalRevenue();

    // --- DASHBOARD: Đếm đơn hàng theo trạng thái ---
    Long countByStatus(String status);

    // --- DASHBOARD: 10 đơn hàng mới nhất ---
    List<Order> findTop10ByOrderByOrderDateDesc();
}