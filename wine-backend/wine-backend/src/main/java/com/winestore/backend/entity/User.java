package com.winestore.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data // Tự động tạo Getter, Setter, toString...
@NoArgsConstructor // Tạo constructor không tham số
@AllArgsConstructor // Tạo constructor đầy đủ tham số
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private String fullName;

    private String phone;

    private String address;

    // Phân quyền: Mặc định là 'CUSTOMER', có thể đổi thành 'ADMIN' trong DB
    @Column(nullable = false)
    private String role = "CUSTOMER"; 

    @Transient
    private String token;
}