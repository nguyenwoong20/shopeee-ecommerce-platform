package com.shopeee.cart.dto;

import com.shopeee.cart.model.CartItem;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class CartSummary {
    private List<CartItem> items;
    private int totalItems;
    private BigDecimal subtotal;
    private BigDecimal shipping;
    private BigDecimal total;
}
