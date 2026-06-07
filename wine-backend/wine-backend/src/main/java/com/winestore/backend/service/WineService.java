package com.winestore.backend.service;

import com.winestore.backend.entity.Wine;
import com.winestore.backend.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WineService {

    private final WineRepository wineRepository;

    // --- CẬP NHẬT: Lấy danh sách rượu (Có hỗ trợ lọc theo Category) ---
    public List<Wine> getAllWines(String category) {
        if (category != null && !category.isEmpty()) {
            return wineRepository.findByCategoryIgnoreCase(category);
        }
        return wineRepository.findAll();
    }

    // --- THÊM MỚI: Lấy danh sách các Category duy nhất để làm Menu lọc ---
    public List<String> getAllCategories() {
        return wineRepository.findAllDistinctCategories();
    }

    // --- THÊM MỚI: Tìm kiếm theo tên ---
    public List<Wine> searchWinesByName(String name) {
        return wineRepository.findByNameContainingIgnoreCase(name);
    }

    // Lấy chi tiết một chai rượu theo ID (Giữ nguyên)
    public Optional<Wine> getWineById(Long id) {
        return wineRepository.findById(id);
    }

    // Lưu hoặc cập nhật thông tin rượu (Giữ nguyên)
    public Wine saveWine(Wine wine) {
        return wineRepository.save(wine);
    }

    // Xóa rượu theo ID (Giữ nguyên)
    public void deleteWine(Long id) {
        wineRepository.deleteById(id);
    }

    // --- CẬP NHẬT MỚI: NGHIỆP VỤ THỐNG KÊ TỒN KHO ---

    /**
     * Lấy thống kê số lượng chai rượu theo từng loại
     * Kết quả trả về từ Repository: List<[categoryName, sumStock]>
     */
    public List<Object[]> getStockStatistics() {
        return wineRepository.countStockByCategory();
    }

    /**
     * Lấy tổng tất cả số lượng chai rượu có trong kho
     */
    public Long getTotalStockCount() {
        return wineRepository.getTotalStockCount();
    }
}