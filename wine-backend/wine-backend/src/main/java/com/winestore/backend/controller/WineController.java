package com.winestore.backend.controller;

import com.winestore.backend.entity.Wine;
import com.winestore.backend.service.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Thêm để dùng cho thống kê

@RestController
@RequestMapping("/api/wines")
@CrossOrigin(origins = "http://localhost:3000") 
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    // 1. Lấy danh sách sản phẩm (Hỗ trợ lọc theo ?category=...)
    @GetMapping
    public ResponseEntity<List<Wine>> getWines(@RequestParam(required = false) String category) {
        List<Wine> wines = wineService.getAllWines(category);
        return ResponseEntity.ok(wines);
    }

    // 2. Lấy danh sách tất cả các Category duy nhất
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = wineService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // 3. Lấy chi tiết 1 sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<Wine> getWineById(@PathVariable Long id) {
        return wineService.getWineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Thêm mới sản phẩm
    @PostMapping
    public ResponseEntity<Wine> createWine(@RequestBody Wine wine) {
        Wine savedWine = wineService.saveWine(wine);
        return new ResponseEntity<>(savedWine, HttpStatus.CREATED);
    }

    // 5. Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Wine> updateWine(@PathVariable Long id, @RequestBody Wine wineDetails) {
        return wineService.getWineById(id)
                .map(wine -> {
                    wine.setName(wineDetails.getName());
                    wine.setBrand(wineDetails.getBrand());
                    wine.setPrice(wineDetails.getPrice());
                    wine.setDescription(wineDetails.getDescription());
                    wine.setOrigin(wineDetails.getOrigin());
                    wine.setAlcoholContent(wineDetails.getAlcoholContent());
                    wine.setImageUrl(wineDetails.getImageUrl());
                    wine.setStockQuantity(wineDetails.getStockQuantity()); 
                    wine.setCategory(wineDetails.getCategory());
                    wine.setDiscountPercent(wineDetails.getDiscountPercent());
                    
                    // Thêm mapping cho các trường Metadata MỚI
                    wine.setCountry(wineDetails.getCountry());
                    wine.setRegion(wineDetails.getRegion());
                    wine.setVintageYear(wineDetails.getVintageYear());
                    wine.setVolume(wineDetails.getVolume());
                    wine.setGrapeVariety(wineDetails.getGrapeVariety());
                    wine.setSweetnessLevel(wineDetails.getSweetnessLevel());
                    wine.setServingTemperature(wineDetails.getServingTemperature());
                    wine.setFoodPairing(wineDetails.getFoodPairing());
                    
                    // Cập nhật thêm 2 field mới
                    if (wineDetails.getMinimumStock() != null) {
                        wine.setMinimumStock(wineDetails.getMinimumStock());
                    }
                    
                    return ResponseEntity.ok(wineService.saveWine(wine));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWine(@PathVariable Long id) {
        if (wineService.getWineById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        wineService.deleteWine(id);
        return ResponseEntity.noContent().build();
    }

    // 7. Tìm kiếm theo tên
    @GetMapping("/search")
    public ResponseEntity<List<Wine>> searchWines(@RequestParam String name) {
        List<Wine> results = wineService.searchWinesByName(name);
        return ResponseEntity.ok(results);
    }

    // --- CẬP NHẬT MỚI: NGHIỆP VỤ THỐNG KÊ KHO HÀNG ---

    /**
     * Endpoint: GET /api/wines/stats/inventory
     * Mục đích: Lấy tổng số chai rượu còn lại cho từng Category
     * Trả về: List các mảng [CategoryName, TotalStock]
     */
    @GetMapping("/stats/inventory")
    public ResponseEntity<List<Object[]>> getInventoryStats() {
        // Bạn cần thêm hàm getStockStatistics() vào WineService
        List<Object[]> stats = wineService.getStockStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Endpoint: GET /api/wines/stats/total-stock
     * Mục đích: Lấy tổng số lượng tất cả các chai rượu có trong kho
     */
    @GetMapping("/stats/total-stock")
    public ResponseEntity<Long> getTotalStock() {
        // Bạn cần thêm hàm getTotalStockCount() vào WineService
        Long total = wineService.getTotalStockCount();
        return ResponseEntity.ok(total != null ? total : 0L);
    }
}