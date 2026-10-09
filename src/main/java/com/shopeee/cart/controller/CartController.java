package com.shopeee.cart.controller;

import com.shopeee.cart.dto.CartItemRequest;
import com.shopeee.cart.dto.CartSummary;
import com.shopeee.cart.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart Service", description = "Quản lý giỏ hàng")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{sessionId}")
    @Operation(summary = "Lấy giỏ hàng theo sessionId")
    public ResponseEntity<CartSummary> getCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @GetMapping("/{sessionId}/count")
    @Operation(summary = "Số lượng item trong giỏ")
    public ResponseEntity<Map<String, Integer>> getCount(@PathVariable String sessionId) {
        return ResponseEntity.ok(Map.of("count", cartService.getCartCount(sessionId)));
    }

    @PostMapping("/add")
    @Operation(summary = "Thêm sản phẩm vào giỏ")
    public ResponseEntity<CartSummary> addItem(@Valid @RequestBody CartItemRequest req) {
        return ResponseEntity.ok(cartService.addItem(req));
    }

    @PatchMapping("/{sessionId}/items/{itemId}")
    @Operation(summary = "Cập nhật số lượng")
    public ResponseEntity<CartSummary> updateQty(
            @PathVariable String sessionId,
            @PathVariable Long itemId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(sessionId, itemId, quantity));
    }

    @DeleteMapping("/{sessionId}/items/{itemId}")
    @Operation(summary = "Xóa item khỏi giỏ")
    public ResponseEntity<CartSummary> removeItem(
            @PathVariable String sessionId,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(sessionId, itemId));
    }

    @DeleteMapping("/{sessionId}/clear")
    @Operation(summary = "Xóa toàn bộ giỏ hàng")
    public ResponseEntity<Void> clearCart(@PathVariable String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.noContent().build();
    }
}
