package com.shopeee.cart.service;

import com.shopeee.cart.dto.CartItemRequest;
import com.shopeee.cart.dto.CartSummary;
import com.shopeee.cart.model.CartItem;
import com.shopeee.cart.repository.CartItemRepository;
import com.shopeee.exception.BusinessException;
import com.shopeee.exception.ResourceNotFoundException;
import com.shopeee.product.model.Product;
import com.shopeee.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;
    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(30000);
    private static final BigDecimal FREE_SHIP_THRESHOLD = BigDecimal.valueOf(200000);

    public CartSummary getCart(String sessionId) {
        List<CartItem> items = cartRepo.findBySessionId(sessionId);
        return buildSummary(items);
    }

    @Transactional
    public CartSummary addItem(CartItemRequest req) {
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        if (!product.getActive()) throw new BusinessException("Sản phẩm đã ngừng kinh doanh");
        if (product.getStock() != null && product.getStock() < req.getQuantity())
            throw new BusinessException("Số lượng trong kho không đủ. Còn lại: " + product.getStock());

        // Xác định giá (flash sale hoặc giá thường)
        BigDecimal price = (product.getFlashSale() != null && product.getFlashSale() && product.getFlashSalePrice() != null)
                ? product.getFlashSalePrice() : product.getPrice();

        cartRepo.findBySessionIdAndProductId(req.getSessionId(), req.getProductId())
                .ifPresentOrElse(
                        existing -> existing.setQuantity(existing.getQuantity() + req.getQuantity()),
                        () -> cartRepo.save(CartItem.builder()
                                .sessionId(req.getSessionId())
                                .productId(req.getProductId())
                                .productName(product.getName())
                                .productImage(product.getImageUrl())
                                .productPrice(price)
                                .quantity(req.getQuantity())
                                .build())
                );

        return getCart(req.getSessionId());
    }

    @Transactional
    public CartSummary updateQuantity(String sessionId, Long itemId, int quantity) {
        CartItem item = cartRepo.findById(itemId)
                .filter(i -> i.getSessionId().equals(sessionId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ"));
        if (quantity <= 0) {
            cartRepo.delete(item);
        } else {
            item.setQuantity(quantity);
            cartRepo.save(item);
        }
        return getCart(sessionId);
    }

    @Transactional
    public CartSummary removeItem(String sessionId, Long itemId) {
        CartItem item = cartRepo.findById(itemId)
                .filter(i -> i.getSessionId().equals(sessionId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ"));
        cartRepo.delete(item);
        return getCart(sessionId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartRepo.deleteBySessionId(sessionId);
    }

    public int getCartCount(String sessionId) {
        return cartRepo.countBySessionId(sessionId);
    }

    private CartSummary buildSummary(List<CartItem> items) {
        BigDecimal subtotal = items.stream()
                .map(i -> i.getProductPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shipping = subtotal.compareTo(FREE_SHIP_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
        return CartSummary.builder()
                .items(items)
                .totalItems(items.stream().mapToInt(CartItem::getQuantity).sum())
                .subtotal(subtotal)
                .shipping(shipping)
                .total(subtotal.add(shipping))
                .build();
    }
}
