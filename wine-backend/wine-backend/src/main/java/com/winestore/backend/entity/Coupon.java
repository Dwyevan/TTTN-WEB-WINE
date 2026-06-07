package com.winestore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
@Data
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // Ví dụ: GIAM20

    @Column(nullable = false)
    private String discountType = "PERCENTAGE"; // "PERCENTAGE" hoặc "FIXED"

    @Column(name = "discount_percent", nullable = false)
    private Double discountValue; // Giá trị giảm (Ví dụ: 20 hoặc 50000)

    // Trường dummy để thỏa mãn cột NOT NULL bị tạo nhầm bởi Hibernate trong DB
    @Column(name = "discount_value", nullable = false)
    private Double legacyDiscountValue = 0.0;

    private Double minimumOrder; // Giá trị đơn hàng tối thiểu để áp dụng

    private LocalDate startDate; // Ngày bắt đầu

    @Column(name = "expiry_date")
    private LocalDate endDate; // Ngày kết thúc (map với cột cũ để giữ dữ liệu nếu có)

    @Column(name = "max_usage")
    private Integer usageLimit; // Số lần dùng tối đa

    private Integer usedCount = 0; // Số lần đã dùng

    private Boolean active = true; // Trạng thái kích hoạt
}