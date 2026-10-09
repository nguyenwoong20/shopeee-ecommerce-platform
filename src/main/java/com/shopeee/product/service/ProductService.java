package com.shopeee.product.service;

import com.shopeee.exception.ResourceNotFoundException;
import com.shopeee.product.dto.PagedResponse;
import com.shopeee.product.dto.ProductDTO;
import com.shopeee.product.model.Category;
import com.shopeee.product.model.Product;
import com.shopeee.product.repository.CategoryRepository;
import com.shopeee.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    public PagedResponse<ProductDTO> getAll(int page, int size, String sort) {
        Sort s = switch (sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("sold").descending(); // bestseller
        };
        Page<Product> p = productRepo.findByActiveTrue(PageRequest.of(page, size, s));
        return toPagedResponse(p);
    }

    public PagedResponse<ProductDTO> getByCategory(Long categoryId, int page, int size, String sort) {
        Sort s = Sort.by("sold").descending();
        Page<Product> p = productRepo.findByCategoryIdAndActiveTrue(categoryId, PageRequest.of(page, size, s));
        return toPagedResponse(p);
    }

    public PagedResponse<ProductDTO> search(String q, int page, int size) {
        Page<Product> p = productRepo.search(q, PageRequest.of(page, size));
        return toPagedResponse(p);
    }

    public ProductDTO getById(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + id));
        return toDTO(p);
    }

    public List<ProductDTO> getFlashSale() {
        return productRepo.findByFlashSaleTrueAndActiveTrueOrderBySoldDesc()
                .stream().map(this::toDTO).toList();
    }

    public List<ProductDTO> getFeatured() {
        return productRepo.findByFeaturedTrueAndActiveTrueOrderBySoldDesc()
                .stream().map(this::toDTO).toList();
    }

    public List<Category> getCategories() {
        return categoryRepo.findAll(Sort.by("sortOrder"));
    }

    // ─── Mapping ────────────────────────────────────────────────────────────────
    private ProductDTO toDTO(Product p) {
        int discount = 0;
        if (p.getOriginalPrice() != null && p.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {
            discount = p.getOriginalPrice().subtract(p.getPrice())
                    .multiply(BigDecimal.valueOf(100))
                    .divide(p.getOriginalPrice(), RoundingMode.HALF_UP).intValue();
        }
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .discountPercent(discount)
                .stock(p.getStock())
                .sold(p.getSold())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .imageUrl(p.getImageUrl())
                .imageUrls(p.getImageUrls())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .brand(p.getBrand())
                .featured(p.getFeatured())
                .flashSale(p.getFlashSale())
                .flashSalePrice(p.getFlashSalePrice())
                .flashSaleEnd(p.getFlashSaleEnd())
                .build();
    }

    private PagedResponse<ProductDTO> toPagedResponse(Page<Product> p) {
        return PagedResponse.<ProductDTO>builder()
                .content(p.getContent().stream().map(this::toDTO).toList())
                .page(p.getNumber())
                .size(p.getSize())
                .totalElements(p.getTotalElements())
                .totalPages(p.getTotalPages())
                .last(p.isLast())
                .build();
    }
}
