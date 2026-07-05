package com.winestore.backend.repository;

import com.winestore.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Tìm kiếm người dùng theo username để kiểm tra đăng nhập
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    // Kiểm tra xem Email đã tồn tại trong hệ thống chưa (dùng cho Đăng ký)
    Boolean existsByEmail(String email);

    // Kiểm tra xem Username đã tồn tại chưa
    Boolean existsByUsername(String username);
}