package com.winestore.backend.service;

import com.winestore.backend.DTO.OrderRequest;
import com.winestore.backend.entity.Order;
import com.winestore.backend.entity.OrderItem;
import com.winestore.backend.entity.Wine;
import com.winestore.backend.entity.InventoryLog;
import com.winestore.backend.entity.User;
import com.winestore.backend.repository.OrderRepository;
import com.winestore.backend.repository.WineRepository;
import com.winestore.backend.repository.InventoryLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final WineRepository wineRepository; 
    private final InventoryLogRepository inventoryLogRepository;

    // Giữ nguyên các hàm lấy danh sách (getAllOrders, deleteOrder...) cũ của bạn ở
    // đây
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Double getTotalRevenue() {
        return orderRepository.calculateTotalRevenue();
    }

    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email); // Giả sử repo đã có hàm này
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id).orElseThrow(
            () -> new RuntimeException("Không tìm thấy đơn hàng #" + id)
        );
        
        String currentStatus = order.getStatus();
        
        // Validate status transition
        validateStatusTransition(currentStatus, newStatus);
        
        // Trừ kho khi thanh toán (PAID) hoặc xác nhận (CONFIRMED) nếu trước đó đang là PENDING
        boolean isCurrentPending = "PENDING".equals(currentStatus);
        boolean isNewPaidOrConfirmed = "PAID".equals(newStatus) || "CONFIRMED".equals(newStatus);
        if (isCurrentPending && isNewPaidOrConfirmed) {
            deductStockForOrder(order);
        }
        
        // Hoàn kho khi hủy đơn đã bị trừ kho trước đó
        boolean isCurrentDeducted = "PAID".equals(currentStatus) || "CONFIRMED".equals(currentStatus) || "SHIPPING".equals(currentStatus) || "REFUND_PENDING".equals(currentStatus);
        if (isCurrentDeducted && "CANCELLED".equals(newStatus)) {
            restoreStockForOrder(order);
        }
        
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Validate trạng thái chuyển đổi hợp lệ:
     * PENDING → CONFIRMED | CANCELLED
     * CONFIRMED → SHIPPING | CANCELLED
     * SHIPPING → DELIVERED
     * DELIVERED → (terminal)
     * CANCELLED → (terminal)
     * 
     * Backward compatible: SHIPPED vẫn được chấp nhận
     */
    private void validateStatusTransition(String from, String to) {
        // Backward compatibility
        if ("SHIPPED".equals(from)) from = "DELIVERED";
        if ("SHIPPED".equals(to)) to = "DELIVERED";
        
        boolean valid = false;
        switch (from) {
            case "PENDING":
                valid = "CONFIRMED".equals(to) || "CANCELLED".equals(to) || "DELIVERED".equals(to) || "PAID".equals(to);
                break;
            case "PAID":
                valid = "CONFIRMED".equals(to) || "CANCELLED".equals(to) || "REFUND_PENDING".equals(to);
                break;
            case "REFUND_PENDING":
                valid = "CANCELLED".equals(to);
                break;
            case "CONFIRMED":
                valid = "SHIPPING".equals(to) || "CANCELLED".equals(to);
                break;
            case "SHIPPING":
                valid = "DELIVERED".equals(to);
                break;
            case "DELIVERED":
            case "CANCELLED":
                valid = false; // Terminal states
                break;
            default:
                valid = true; // Allow unknown current states to transition freely
                break;
        }
        if (!valid) {
            throw new RuntimeException("Không thể chuyển từ " + from + " sang " + to);
        }
    }

    /**
     * Trừ kho khi xác nhận đơn hàng
     */
    private void deductStockForOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            Wine wine = item.getWine();
            if (wine != null) {
                int currentStock = wine.getStockQuantity() != null ? wine.getStockQuantity() : 0;
                if (currentStock >= item.getQuantity()) {
                    int newStock = currentStock - item.getQuantity();
                    wine.setStockQuantity(newStock);
                    wine.setSoldCount((wine.getSoldCount() != null ? wine.getSoldCount() : 0) + item.getQuantity());
                    wineRepository.save(wine);
                    
                    InventoryLog log = InventoryLog.builder()
                            .wineId(wine.getId())
                            .actionType("SALE")
                            .previousStock(currentStock)
                            .quantityChanged(-item.getQuantity())
                            .newStock(newStock)
                            .orderId(order.getId())
                            .note("Xuất kho - Đơn hàng #" + order.getId() + " đã xác nhận")
                            .build();
                    inventoryLogRepository.save(log);
                } else {
                    throw new RuntimeException("Sản phẩm '" + wine.getName() + "' không đủ tồn kho! (Còn: " + currentStock + ", Cần: " + item.getQuantity() + ")");
                }
            }
        }
    }

    /**
     * Hoàn kho khi hủy đơn hàng đã xác nhận
     */
    private void restoreStockForOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            Wine wine = item.getWine();
            if (wine != null) {
                int currentStock = wine.getStockQuantity() != null ? wine.getStockQuantity() : 0;
                int newStock = currentStock + item.getQuantity();
                wine.setStockQuantity(newStock);
                wine.setSoldCount(Math.max(0, (wine.getSoldCount() != null ? wine.getSoldCount() : 0) - item.getQuantity()));
                wineRepository.save(wine);
                
                InventoryLog log = InventoryLog.builder()
                        .wineId(wine.getId())
                        .actionType("CANCEL_ORDER")
                        .previousStock(currentStock)
                        .quantityChanged(item.getQuantity())
                        .newStock(newStock)
                        .orderId(order.getId())
                        .note("Hoàn kho - Đơn hàng #" + order.getId() + " đã hủy")
                        .build();
                inventoryLogRepository.save(log);
            }
        }
    }

    // --- ĐÂY LÀ PHẦN QUAN TRỌNG ĐỂ SỬA LỖI 415 ---
    @Transactional
    public Order createOrderFromDto(OrderRequest request) {
        // 1. Tạo vỏ đơn hàng
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("PENDING");

        if (request.getUserId() != null) {
            User user = new User();
            user.setId(request.getUserId());
            order.setUser(user);
        }

        // 2. Xử lý từng món hàng
        List<OrderItem> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
                OrderItem item = new OrderItem();
                item.setName(itemReq.getName());
                item.setQuantity(itemReq.getQuantity());
                item.setPrice(itemReq.getPrice());
                item.setOrder(order); // Gán cha con

                // 3. Tìm rượu từ Database bằng ID
                if (itemReq.getWineId() != null) {
                    Wine wine = wineRepository.findById(itemReq.getWineId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy rượu ID: " + itemReq.getWineId()));
                            
                    // Validate stock
                    int currentStock = wine.getStockQuantity() != null ? wine.getStockQuantity() : 0;
                    if (currentStock < itemReq.getQuantity()) {
                        throw new RuntimeException("Sản phẩm '" + wine.getName() + "' không đủ số lượng trong kho! (Còn lại: " + currentStock + ")");
                    }
                    
                    item.setWine(wine);
                }
                items.add(item);
            }
        }
        order.setItems(items);

        // 4. Lưu tất cả xuống DB
        // 4. Lưu tất cả xuống DB
        return orderRepository.save(order);
    }

    @Transactional
    public Order userCancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id).orElseThrow(
            () -> new IllegalArgumentException("Không tìm thấy đơn hàng #" + id)
        );

        String currentStatus = order.getStatus();

        if ("PENDING".equals(currentStatus)) {
            order.setStatus("CANCELLED");
            order.setCancellationReason(reason);
        } else if ("PAID".equals(currentStatus)) {
            order.setStatus("REFUND_PENDING");
            order.setCancellationReason(reason);
        } else {
            throw new IllegalArgumentException("Chỉ có thể hủy đơn khi ở trạng thái Chờ xử lý hoặc Đã thanh toán.");
        }

        return orderRepository.save(order);
    }
}