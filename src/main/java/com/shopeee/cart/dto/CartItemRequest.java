package com.shopeee.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "productId không được trống")
    private Long productId;

    @Min(value = 1, message = "Số lượng phải ≥ 1")
    private int quantity;

    private String sessionId;
}
