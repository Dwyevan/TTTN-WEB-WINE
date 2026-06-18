package com.winestore.backend.controller;

import com.winestore.backend.entity.InventoryLog;
import com.winestore.backend.entity.Wine;
import com.winestore.backend.repository.InventoryLogRepository;
import com.winestore.backend.repository.WineRepository;
import com.winestore.backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/inventory")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminInventoryController {

    private final InventoryService inventoryService;

    // 1. Lấy danh sách cảnh báo tồn kho (những sản phẩm có stockQuantity <= minimumStock)
    @GetMapping("/low-stock")
    public ResponseEntity<List<Wine>> getLowStockWines() {
        return ResponseEntity.ok(inventoryService.getLowStockWines());
    }

    // 2. Lấy lịch sử nhập/xuất kho của 1 sản phẩm
    @GetMapping("/logs/{wineId}")
    public ResponseEntity<List<InventoryLog>> getInventoryLogs(@PathVariable Long wineId) {
        return ResponseEntity.ok(inventoryService.getInventoryLogs(wineId));
    }

    // 3. Nghiệp vụ: Nhập thêm hàng (Restock)
    @PostMapping("/restock/{wineId}")
    public ResponseEntity<?> restockWine(@PathVariable Long wineId, @RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("quantity")) {
            return ResponseEntity.badRequest().body("Thiếu trường quantity");
        }
        
        Integer quantity;
        try {
            quantity = Integer.parseInt(payload.get("quantity").toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Số lượng không hợp lệ");
        }

        String note = payload.containsKey("note") ? payload.get("note").toString() : "Admin nhập kho";

        try {
            Wine updatedWine = inventoryService.restockWine(wineId, quantity, note);
            return ResponseEntity.ok(updatedWine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Cập nhật mức tồn kho tối thiểu (minimum stock)
    @PutMapping("/minimum-stock/{wineId}")
    public ResponseEntity<?> updateMinimumStock(@PathVariable Long wineId, @RequestParam Integer minimumStock) {
        try {
            Wine updatedWine = inventoryService.updateMinimumStock(wineId, minimumStock);
            return ResponseEntity.ok(updatedWine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. Bật/Tắt trạng thái kinh doanh của sản phẩm (Disable out-of-stock products)
    @PatchMapping("/{wineId}/toggle-status")
    public ResponseEntity<?> toggleWineStatus(@PathVariable Long wineId, @RequestParam Boolean enabled) {
        try {
            Wine updatedWine = inventoryService.toggleWineStatus(wineId, enabled);
            return ResponseEntity.ok(updatedWine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
