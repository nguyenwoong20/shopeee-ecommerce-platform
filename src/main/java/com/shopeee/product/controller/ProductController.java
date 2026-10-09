package com.shopeee.product.controller;

import com.shopeee.product.dto.PagedResponse;
import com.shopeee.product.dto.ProductDTO;
import com.shopeee.product.model.Category;
import com.shopeee.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Product Service", description = "Quản lý sản phẩm và danh mục")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    @Operation(summary = "Danh sách sản phẩm (có phân trang, sort)")
    public ResponseEntity<PagedResponse<ProductDTO>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "bestseller") String sort) {
        return ResponseEntity.ok(productService.getAll(page, size, sort));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Chi tiết sản phẩm")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping("/products/search")
    @Operation(summary = "Tìm kiếm sản phẩm")
    public ResponseEntity<PagedResponse<ProductDTO>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.search(q, page, size));
    }

    @GetMapping("/products/flash-sale")
    @Operation(summary = "Sản phẩm Flash Sale")
    public ResponseEntity<List<ProductDTO>> getFlashSale() {
        return ResponseEntity.ok(productService.getFlashSale());
    }

    @GetMapping("/products/featured")
    @Operation(summary = "Sản phẩm nổi bật")
    public ResponseEntity<List<ProductDTO>> getFeatured() {
        return ResponseEntity.ok(productService.getFeatured());
    }

    @GetMapping("/categories")
    @Operation(summary = "Tất cả danh mục")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    @GetMapping("/categories/{id}/products")
    @Operation(summary = "Sản phẩm theo danh mục")
    public ResponseEntity<PagedResponse<ProductDTO>> getByCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "bestseller") String sort) {
        return ResponseEntity.ok(productService.getByCategory(id, page, size, sort));
    }
}
