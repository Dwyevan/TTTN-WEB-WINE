package com.winestore.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Import mới
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// THÊM DÒNG NÀY: Bỏ qua các trường rác của Hibernate để tránh lỗi Serialize
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer quantity;
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore // Giữ nguyên cái này để cắt đứt vòng lặp vô tận với Order
    private Order order;

    // QUAN TRỌNG: Đổi sang EAGER để khi React gửi ID lên, Java map được ngay
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "wine_id", nullable = true)
    private Wine wine;
}