package com.winestore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private String status = "NEW"; // NEW, READ, REPLIED

    private LocalDateTime createdAt = LocalDateTime.now();
    private String replyMessage; // Lưu nội dung Admin đã phản hồi
    private LocalDateTime repliedAt; // Lưu thời gian phản hồi
}