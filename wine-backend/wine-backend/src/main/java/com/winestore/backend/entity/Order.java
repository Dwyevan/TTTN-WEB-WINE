package com.winestore.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wine_orders") 
@Getter // Thay @Data bằng Getter/Setter riêng biệt để tránh lỗi đệ quy ngầm của Lombok
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String phone;

    private Double totalAmount;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(length = 20)
    private String status = "PENDING";

    @Column(columnDefinition = "TEXT")
    private String cancellationReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @com.fasterxml.jackson.annotation.JsonIgnore // Prevent infinite recursion when serializing
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference // Phía quản lý - Sẽ được hiển thị trong JSON
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<OrderItem> items = new ArrayList<>(); // Khởi tạo danh sách trống để tránh NullPointerException

    @PrePersist
    protected void onCreate() {
        if (this.orderDate == null) {
            this.orderDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}