package com.winestore.backend.controller;

import com.winestore.backend.entity.Feedback;
import com.winestore.backend.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity; // Thêm mới
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @GetMapping("/product")
    public List<Feedback> getFeedbacksByProduct(@RequestParam String name) {
        return feedbackRepository.findBySubjectContaining(name);
    }

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackRepository.deleteById(id);
    }

    // --- NGHIỆP VỤ MỚI: SỬA LỖI 405 VÀ GỬI PHẢN HỒI ---
    
    @PostMapping("/reply")
    public ResponseEntity<?> replyToFeedback(@RequestBody ReplyDTO replyDTO) {
        try {
            // Tại đây bạn có thể thêm logic gửi Email thật sự
            // Ví dụ: emailService.sendSimpleMessage(replyDTO.getEmail(), replyDTO.getSubject(), replyDTO.getMessage());
            
            System.out.println("Đang gửi phản hồi tới: " + replyDTO.getEmail());
            System.out.println("Nội dung: " + replyDTO.getMessage());

            return ResponseEntity.ok().body("{\"message\": \"Phản hồi đã được gửi thành công!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi hệ thống khi gửi phản hồi");
        }
    }

    // Lớp DTO để hứng dữ liệu từ Frontend gửi lên
    public static class ReplyDTO {
        private String email;
        private String subject;
        private String message;

        // Getters and Setters (Bắt buộc phải có để Spring Boot đọc được JSON)
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}