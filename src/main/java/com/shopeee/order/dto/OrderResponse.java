package com.shopeee.order.dto;

import com.shopeee.order.model.*;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class OrderResponse {
    private Long id;
    private String orderCode;
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private String shippingCity;
    private List<OrderItem> items;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;
    private String paymentUrl;         // VNPay redirect URL (nếu dùng)
    private String notes;
    private LocalDateTime createdAt;
}
