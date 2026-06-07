package com.winestore.backend.service;

import com.winestore.backend.entity.Coupon;
import com.winestore.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public Map<String, Object> validateAndCalculateDiscount(String code, Double orderTotal) {
        Optional<Coupon> optionalCoupon = couponRepository.findByCode(code);
        
        if (optionalCoupon.isEmpty()) {
            throw new RuntimeException("Mã giảm giá không tồn tại");
        }

        Coupon coupon = optionalCoupon.get();

        // 1. Validate active
        if (coupon.getActive() != null && !coupon.getActive()) {
            throw new RuntimeException("Mã giảm giá đã bị vô hiệu hóa");
        }

        LocalDate today = LocalDate.now();
        // 2. Validate startDate
        if (coupon.getStartDate() != null && today.isBefore(coupon.getStartDate())) {
            throw new RuntimeException("Mã giảm giá chưa đến ngày áp dụng");
        }

        // 3. Validate endDate
        if (coupon.getEndDate() != null && today.isAfter(coupon.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn sử dụng");
        }

        // 4. Validate usage limit
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
        }

        // 5. Validate minimum order
        if (coupon.getMinimumOrder() != null && orderTotal < coupon.getMinimumOrder()) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã (" + coupon.getMinimumOrder() + "đ)");
        }

        // 6. Calculate discount securely
        double discountAmount = 0.0;
        if ("FIXED".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = coupon.getDiscountValue();
        } else if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = orderTotal * (coupon.getDiscountValue() / 100.0);
        }

        // Đảm bảo không giảm quá tổng đơn hàng
        if (discountAmount > orderTotal) {
            discountAmount = orderTotal;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("couponId", coupon.getId());
        result.put("code", coupon.getCode());
        result.put("discountAmount", discountAmount);
        result.put("newTotal", orderTotal - discountAmount);

        return result;
    }
}
