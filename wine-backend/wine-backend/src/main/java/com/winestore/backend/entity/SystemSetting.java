package com.winestore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSetting {
    
    @Id
    @Column(name = "setting_key", length = 100)
    private String key;

    @Column(name = "setting_value", length = 255)
    private String value;
    
    @Column(name = "description", length = 255)
    private String description;
}
