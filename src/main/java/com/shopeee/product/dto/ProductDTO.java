package com.shopeee.product.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountPercent;
    private Integer stock;
    private Integer sold;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private String imageUrls;
    private String categoryName;
    private Long categoryId;
    private String brand;
    private Boolean featured;
    private Boolean flashSale;
    private BigDecimal flashSalePrice;
    private LocalDateTime flashSaleEnd;
}
