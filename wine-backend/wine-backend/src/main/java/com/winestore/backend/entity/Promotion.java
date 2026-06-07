package com.winestore.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // Ví dụ: KM2025, TETNGUYENDAN

    @Column(nullable = false)
    private Double discountPercentage; // Phần trăm giảm giá (ví dụ: 10.0 cho 10%)

    private String description; // Mô tả chương trình khuyến mãi

    private LocalDateTime startDate; // Ngày bắt đầu có hiệu lực

    private LocalDateTime endDate; // Ngày hết hạn

    @Column(nullable = false)
    private boolean active = true; // Trạng thái kích hoạt (true/false)

    private Double minOrderAmount; // Số tiền tối thiểu để được áp dụng mã
}