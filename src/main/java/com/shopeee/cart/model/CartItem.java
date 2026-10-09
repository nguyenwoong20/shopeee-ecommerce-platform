package com.shopeee.cart.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "cart_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sessionId;   // guest cart bằng sessionId

    private Long userId;        // nếu đã login

    @Column(nullable = false)
    private Long productId;

    private String productName;
    private String productImage;
    private BigDecimal productPrice;

    @Column(nullable = false)
    private Integer quantity;

    private LocalDateTime addedAt;

    @PrePersist
    public void prePersist() {
        if (addedAt == null) addedAt = LocalDateTime.now();
    }
}
