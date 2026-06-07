package com.winestore.backend.repository;

import com.winestore.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // QUAN TRỌNG: Phải có import này

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Tìm kiếm các phản hồi mà chủ đề (subject) có chứa từ khóa (tên sản phẩm)
    // Spring Boot sẽ tự động chuyển thành câu lệnh: SELECT * FROM feedbacks WHERE subject LIKE %subject%
    List<Feedback> findBySubjectContaining(String subject);
}