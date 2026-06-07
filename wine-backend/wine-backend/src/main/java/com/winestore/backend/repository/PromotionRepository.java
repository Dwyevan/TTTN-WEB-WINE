package com.winestore.backend.repository;

import com.winestore.backend.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    
    // Tìm mã khuyến mãi theo Code và mã đó phải còn đang kích hoạt (active = true)
    Optional<Promotion> findByCodeAndActiveTrue(String code);

    // Tìm tất cả các mã khuyến mãi đang hoạt động
    java.util.List<Promotion> findAllByActiveTrue();
}