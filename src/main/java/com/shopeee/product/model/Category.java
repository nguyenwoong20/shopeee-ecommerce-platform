package com.shopeee.product.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String icon;   // emoji hoặc icon code
    private String slug;   // URL-friendly
    private Integer sortOrder;
}
