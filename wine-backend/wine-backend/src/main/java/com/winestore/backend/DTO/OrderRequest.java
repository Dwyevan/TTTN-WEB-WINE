package com.winestore.backend.DTO;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    private String customerEmail;
    private String address;
    private String phone;
    private Double totalAmount;
    private String status;
    private Long userId;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private String name;
        private Integer quantity;
        private Double price;
        private Long wineId; // Quan trọng: Chỉ nhận ID, không nhận object Wine
    }
}