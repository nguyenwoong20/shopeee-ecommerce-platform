package com.shopeee.product.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal originalPrice;  // giá gốc (để tính % giảm)
    private Integer stock;
    private Integer sold;              // số đã bán
    private Double rating;             // 0.0 - 5.0
    private Integer reviewCount;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;           // ảnh chính

    @Column(columnDefinition = "TEXT")
    private String imageUrls;          // JSON array ảnh phụ

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String brand;
    private Boolean featured;          // nổi bật trên homepage
    private Boolean flashSale;         // đang flash sale
    private BigDecimal flashSalePrice;
    private LocalDateTime flashSaleEnd;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (sold == null) sold = 0;
        if (rating == null) rating = 0.0;
        if (reviewCount == null) reviewCount = 0;
        if (featured == null) featured = false;
        if (flashSale == null) flashSale = false;
    }
}
