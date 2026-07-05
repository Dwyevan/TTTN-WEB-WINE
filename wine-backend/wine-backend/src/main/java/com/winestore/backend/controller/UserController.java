package com.winestore.backend.controller;

import com.winestore.backend.entity.User;
import com.winestore.backend.repository.UserRepository;
import com.winestore.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Cho phép React truy cập
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final com.winestore.backend.service.EmailService emailService;

    // Đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Lỗi: Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email đã tồn tại hoặc có người đăng ký email này!");
        }

        // Mặc định vai trò là CUSTOMER nếu không chỉ định
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // Đăng nhập (Logic cơ bản)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());

        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            User loggedInUser = user.get();
            
            // Kiểm tra trạng thái khóa tài khoản
            if (loggedInUser.getActive() != null && !loggedInUser.getActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản của bạn đã bị khóa bởi Admin!");
            }
            
            String token = jwtUtil.generateToken(loggedInUser.getUsername(), loggedInUser.getRole());
            loggedInUser.setToken(token);
            return ResponseEntity.ok(loggedInUser);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tên đăng nhập hoặc mật khẩu!");
    }

    // Lấy tất cả người dùng (Cho Admin)
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Khóa / Mở khóa tài khoản
    @PatchMapping("/{id}/toggle-lock")
    public ResponseEntity<?> toggleUserLock(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                 return ResponseEntity.badRequest().body("Lỗi: Không thể khóa tài khoản Quản trị viên (ADMIN)!");
            }
            boolean currentStatus = user.getActive() == null ? true : user.getActive();
            user.setActive(!currentStatus);
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName()); // Cập nhật tên mới
            user.setPhone(userDetails.getPhone());
            user.setAddress(userDetails.getAddress());
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        return userRepository.findById(id).map(user -> {
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");
            
            if (!user.getPassword().equals(oldPassword)) {
                return ResponseEntity.badRequest().body("Lỗi: Mật khẩu hiện tại không đúng!");
            }
            
            user.setPassword(newPassword);
            userRepository.save(user);
            return ResponseEntity.ok().body("Đổi mật khẩu thành công!");
        }).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Email không tồn tại trong hệ thống!");
        }
        
        User user = userOpt.get();
        String newPassword = "WS" + (int)(Math.random() * 900000 + 100000);
        user.setPassword(newPassword);
        userRepository.save(user);
        
        try {
            emailService.sendNewPasswordEmail(email, newPassword);
            return ResponseEntity.ok().body("Mật khẩu mới đã được gửi đến email của bạn.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: Không thể gửi email, vui lòng kiểm tra cấu hình SMTP.");
        }
    }
}
