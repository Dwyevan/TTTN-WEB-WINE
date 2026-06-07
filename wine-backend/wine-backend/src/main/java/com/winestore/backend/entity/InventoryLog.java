package com.winestore.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long wineId;

    @Column(nullable = false)
    private String actionType; // "RESTOCK", "SALE", "ADJUST", "CANCEL_ORDER"

    private Integer previousStock;
    
    @Column(name = "quantity")
    private Integer quantityChanged; // Dương (+) nếu nhập, Âm (-) nếu xuất

    private Integer newStock;

    private Long orderId; // ID của đơn hàng nếu action là SALE hoặc CANCEL_ORDER

    private String note;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
