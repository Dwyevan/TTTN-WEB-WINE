package com.winestore.backend.service;

import com.winestore.backend.entity.InventoryLog;
import com.winestore.backend.entity.Wine;
import com.winestore.backend.repository.InventoryLogRepository;
import com.winestore.backend.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final WineRepository wineRepository;
    private final InventoryLogRepository inventoryLogRepository;

    public List<Wine> getLowStockWines() {
        List<Wine> allWines = wineRepository.findAll();
        return allWines.stream()
                .filter(w -> w.getStockQuantity() != null && w.getStockQuantity() <= (w.getMinimumStock() != null ? w.getMinimumStock() : 5) && w.getStockQuantity() > 0)
                .collect(Collectors.toList());
    }

    public List<InventoryLog> getInventoryLogs(Long wineId) {
        return inventoryLogRepository.findByWineIdOrderByCreatedAtDesc(wineId);
    }

    @Transactional
    public Wine restockWine(Long wineId, Integer quantity, String note) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng nhập kho phải lớn hơn 0");
        }

        Wine wine = wineRepository.findById(wineId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        int currentStock = wine.getStockQuantity() != null ? wine.getStockQuantity() : 0;
        int newStock = currentStock + quantity;

        wine.setStockQuantity(newStock);
        wine = wineRepository.save(wine);

        InventoryLog log = InventoryLog.builder()
                .wineId(wine.getId())
                .actionType("RESTOCK")
                .previousStock(currentStock)
                .quantityChanged(quantity)
                .newStock(newStock)
                .note(note)
                .build();

        inventoryLogRepository.save(log);

        return wine;
    }

    @Transactional
    public Wine updateMinimumStock(Long wineId, Integer minimumStock) {
        if (minimumStock < 0) {
            throw new IllegalArgumentException("Mức tồn kho tối thiểu không được âm");
        }
        Wine wine = wineRepository.findById(wineId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        wine.setMinimumStock(minimumStock);
        return wineRepository.save(wine);
    }

    @Transactional
    public Wine toggleWineStatus(Long wineId, Boolean enabled) {
        Wine wine = wineRepository.findById(wineId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        wine.setEnabled(enabled);
        return wineRepository.save(wine);
    }
}
