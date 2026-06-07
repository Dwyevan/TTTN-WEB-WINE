package com.winestore.backend.repository;

import com.winestore.backend.entity.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    List<InventoryLog> findByWineIdOrderByCreatedAtDesc(Long wineId);
}
