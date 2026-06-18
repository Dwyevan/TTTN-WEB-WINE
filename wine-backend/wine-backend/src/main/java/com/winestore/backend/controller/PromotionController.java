package com.winestore.backend.controller;

import com.winestore.backend.entity.Promotion;
import com.winestore.backend.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionRepository promotionRepository;

    // Lấy tất cả mã khuyến mãi đang hoạt động (Hiển thị trên trang chủ/Banner)
    @GetMapping("/active")
    public List<Promotion> getActivePromotions() {
        return promotionRepository.findAllByActiveTrue();
    }

    // Kiểm tra một mã giảm giá cụ thể (Dùng khi khách nhập mã vào ô Coupon)
    @GetMapping("/check")
    public ResponseEntity<Promotion> checkPromotion(@RequestParam String code) {
        return promotionRepository.findByCodeAndActiveTrue(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Thêm mã khuyến mãi mới (Dành cho trang Admin)
    @PostMapping
    public Promotion createPromotion(@RequestBody Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    // Lấy toàn bộ danh sách (Admin quản lý)
    @GetMapping
    public List<Promotion> getAll() {
        return promotionRepository.findAll();
    }
}
