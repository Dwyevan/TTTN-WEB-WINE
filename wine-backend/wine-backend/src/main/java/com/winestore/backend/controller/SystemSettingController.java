package com.winestore.backend.controller;

import com.winestore.backend.entity.SystemSetting;
import com.winestore.backend.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingRepository systemSettingRepository;

    // Seed default data if empty
    @PostConstruct
    public void initDefaultSettings() {
        if (systemSettingRepository.count() == 0) {
            systemSettingRepository.save(new SystemSetting("SHIPPING_FEE", "35000", "Phí vận chuyển mặc định (VNĐ)"));
            systemSettingRepository.save(new SystemSetting("FREE_SHIPPING_THRESHOLD", "2000000", "Ngưỡng miễn phí vận chuyển (VNĐ)"));
            systemSettingRepository.save(new SystemSetting("STORE_NAME", "Wine Store", "Tên cửa hàng hiển thị ở Footer"));
            systemSettingRepository.save(new SystemSetting("STORE_ADDRESS", "123 Đường Rượu Vang, Quận 1, TP. Hồ Chí Minh", "Địa chỉ cửa hàng"));
            systemSettingRepository.save(new SystemSetting("STORE_PHONE", "0972.778.480", "Số điện thoại Hotline"));
            systemSettingRepository.save(new SystemSetting("STORE_EMAIL", "contact@winestore.com", "Email liên hệ"));
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllSettings() {
        List<SystemSetting> settings = systemSettingRepository.findAll();
        Map<String, String> response = new HashMap<>();
        for (SystemSetting setting : settings) {
            response.put(setting.getKey(), setting.getValue());
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> updateSettings(@RequestBody Map<String, String> newSettings) {
        newSettings.forEach((key, value) -> {
            systemSettingRepository.findById(key).ifPresent(setting -> {
                setting.setValue(value);
                systemSettingRepository.save(setting);
            });
        });
        return ResponseEntity.ok(newSettings);
    }
}
