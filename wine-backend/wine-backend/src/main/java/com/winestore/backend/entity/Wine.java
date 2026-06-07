package com.winestore.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "wines")
@Data 
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Thêm dòng này vào Wine
public class Wine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand; // Hãng sản xuất

    private BigDecimal price; // Giá gốc niêm yết

    @Column(columnDefinition = "int default 0")
    private Integer discountPercent; 
    
    @Column(name = "stock")
    @com.fasterxml.jackson.annotation.JsonProperty("stock")
    private Integer stockQuantity; // NGHIỆP VỤ: Số lượng còn trong kho (Rất quan trọng)

    @Column(columnDefinition = "int default 5")
    private Integer minimumStock = 5; // Cảnh báo khi tồn kho dưới mức này

    @Column(columnDefinition = "int default 0")
    private Integer soldCount = 0; // Số lượng đã bán ra

    private String category; // Đỏ, Trắng, Hồng, Vang nổ...

    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String imageUrl;
    
    private String origin; // Xuất xứ (Pháp, Ý, Chile...)
    
    private Double alcoholContent; // Nồng độ cồn (%)

    @Column(columnDefinition = "boolean default true")
    private Boolean enabled = true; // Trạng thái kích hoạt (ẩn/hiện)

    // --- WINE METADATA FIELDS ---
    private String country;
    private String region;
    private Integer vintageYear;
    private String volume;
    private String grapeVariety;
    private String sweetnessLevel;
    private String servingTemperature;
    private String foodPairing; // e.g. "Steak, Seafood, Cheese"
    // ----------------------------

    // Tự động lưu ngày tạo sản phẩm
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // NGHIỆP VỤ: Hàm tính giá bán thực tế (Sale Price)
    public BigDecimal getSalePrice() {
        if (price == null) return BigDecimal.ZERO;
        if (discountPercent == null || discountPercent <= 0) {
            return price;
        }
        BigDecimal discountRate = BigDecimal.valueOf(discountPercent).divide(BigDecimal.valueOf(100));
        BigDecimal discountAmount = price.multiply(discountRate);
        return price.subtract(discountAmount).setScale(0, RoundingMode.HALF_UP);
    }
}