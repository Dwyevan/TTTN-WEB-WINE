package com.winestore.backend.controller;

import com.winestore.backend.entity.Coupon;
import com.winestore.backend.repository.CouponRepository;
import com.winestore.backend.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin("*")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CouponService couponService;

    // API: Admin lấy danh sách mã
    @GetMapping
    public List<Coupon> getAll() {
        return couponRepository.findAll();
    }

    // API: Admin tạo mã mới
    @PostMapping
    public Coupon create(@RequestBody Coupon coupon) {
        if (coupon.getDiscountType() == null) {
            coupon.setDiscountType("PERCENTAGE");
        }
        return couponRepository.save(coupon);
    }

    // API: Admin cập nhật mã
    @PutMapping("/{id}")
    public ResponseEntity<Coupon> update(@PathVariable Long id, @RequestBody Coupon couponDetails) {
        return couponRepository.findById(id).map(coupon -> {
            coupon.setCode(couponDetails.getCode());
            coupon.setDiscountType(couponDetails.getDiscountType());
            coupon.setDiscountValue(couponDetails.getDiscountValue());
            coupon.setMinimumOrder(couponDetails.getMinimumOrder());
            coupon.setStartDate(couponDetails.getStartDate());
            coupon.setEndDate(couponDetails.getEndDate());
            coupon.setUsageLimit(couponDetails.getUsageLimit());
            if (couponDetails.getActive() != null) {
                coupon.setActive(couponDetails.getActive());
            }
            return ResponseEntity.ok(couponRepository.save(coupon));
        }).orElse(ResponseEntity.notFound().build());
    }

    // API: Admin xóa mã
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return couponRepository.findById(id).map(coupon -> {
            couponRepository.delete(coupon);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // API MỚI: Khách hàng áp dụng mã (An toàn)
    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody ValidateRequest request) {
        try {
            Map<String, Object> result = couponService.validateAndCalculateDiscount(request.getCode(), request.getOrderTotal());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API: Tăng số lượt sử dụng sau khi thanh toán thành công
    @PostMapping("/{id}/use")
    public ResponseEntity<?> useCoupon(@PathVariable Long id) {
        return couponRepository.findById(id).map(c -> {
            c.setUsedCount((c.getUsedCount() != null ? c.getUsedCount() : 0) + 1);
            couponRepository.save(c);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // DTO hứng dữ liệu từ frontend
    public static class ValidateRequest {
        private String code;
        private Double orderTotal;

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public Double getOrderTotal() { return orderTotal; }
        public void setOrderTotal(Double orderTotal) { this.orderTotal = orderTotal; }
    }
}