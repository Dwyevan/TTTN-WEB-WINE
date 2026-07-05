package com.winestore.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendNewPasswordEmail(String toEmail, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("winestore@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Yêu cầu cấp lại mật khẩu - WineStore");
        message.setText("Xin chào,\n\n" +
                "Bạn đã yêu cầu cấp lại mật khẩu cho tài khoản tại WineStore.\n" +
                "Mật khẩu mới của bạn là: " + newPassword + "\n\n" +
                "Vui lòng đăng nhập và đổi lại mật khẩu ngay để đảm bảo an toàn.\n\n" +
                "Trân trọng,\nĐội ngũ WineStore");
        
        mailSender.send(message);
    }
}
