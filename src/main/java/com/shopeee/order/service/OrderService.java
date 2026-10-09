package com.shopeee.order.service;

import com.shopeee.cart.model.CartItem;
import com.shopeee.cart.repository.CartItemRepository;
import com.shopeee.cart.service.CartService;
import com.shopeee.exception.BusinessException;
import com.shopeee.exception.ResourceNotFoundException;
import com.shopeee.order.dto.CheckoutRequest;
import com.shopeee.order.dto.OrderResponse;
import com.shopeee.order.model.*;
import com.shopeee.order.repository.OrderRepository;
import com.shopeee.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final CartItemRepository cartRepo;
    private final CartService cartService;
    private final ProductRepository productRepo;

    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(30000);
    private static final BigDecimal FREE_SHIP_THRESHOLD = BigDecimal.valueOf(200000);

    @Transactional
    public OrderResponse checkout(CheckoutRequest req) {
        List<CartItem> cartItems = cartRepo.findBySessionId(req.getSessionId());
        if (cartItems.isEmpty()) throw new BusinessException("Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");

        // Validate stock
        cartItems.forEach(item -> {
            productRepo.findById(item.getProductId()).ifPresent(p -> {
                if (p.getStock() != null && p.getStock() < item.getQuantity())
                    throw new BusinessException("Sản phẩm '" + p.getName() + "' không đủ hàng. Còn lại: " + p.getStock());
            });
        });

        BigDecimal subtotal = cartItems.stream()
                .map(i -> i.getProductPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shipping = subtotal.compareTo(FREE_SHIP_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_FEE;
        BigDecimal total = subtotal.add(shipping);

        // Build order
        String code = generateOrderCode();
        Order order = Order.builder()
                .orderCode(code)
                .customerName(req.getCustomerName())
                .customerPhone(req.getCustomerPhone())
                .customerEmail(req.getCustomerEmail())
                .shippingAddress(req.getShippingAddress())
                .shippingCity(req.getShippingCity())
                .shippingDistrict(req.getShippingDistrict())
                .shippingWard(req.getShippingWard())
                .subtotal(subtotal)
                .shippingFee(shipping)
                .total(total)
                .paymentMethod(req.getPaymentMethod())
                .notes(req.getNotes())
                .build();

        Order saved = orderRepo.save(order);

        // Build order items + update stock — use ArrayList (mutable) so cascade works
        List<OrderItem> items = new ArrayList<>();
        for (CartItem ci : cartItems) {
            productRepo.findById(ci.getProductId()).ifPresent(p -> {
                if (p.getStock() != null) p.setStock(p.getStock() - ci.getQuantity());
                p.setSold((p.getSold() == null ? 0 : p.getSold()) + ci.getQuantity());
                productRepo.save(p);
            });
            items.add(OrderItem.builder()
                    .order(saved)
                    .productId(ci.getProductId())
                    .productName(ci.getProductName())
                    .productImage(ci.getProductImage())
                    .unitPrice(ci.getProductPrice())
                    .quantity(ci.getQuantity())
                    .lineTotal(ci.getProductPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
                    .build());
        }

        saved.setItems(items);

        // COD → mark as CONFIRMED immediately
        if (req.getPaymentMethod() == PaymentMethod.COD) {
            saved.setPaymentStatus(PaymentStatus.PENDING);
            saved.setOrderStatus(OrderStatus.CONFIRMED);
        }

        orderRepo.save(saved);
        cartService.clearCart(req.getSessionId());


        // Mock VNPay URL
        String paymentUrl = null;
        if (req.getPaymentMethod() == PaymentMethod.VNPAY) {
            paymentUrl = "http://localhost:5173/payment/vnpay-return?orderCode=" + code + "&status=success";
        } else if (req.getPaymentMethod() == PaymentMethod.MOMO) {
            paymentUrl = "http://localhost:5173/payment/momo-return?orderCode=" + code + "&status=success";
        }

        return toResponse(saved, paymentUrl);
    }

    public OrderResponse getByCode(String code) {
        Order o = orderRepo.findByOrderCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng: " + code));
        return toResponse(o, null);
    }

    public List<OrderResponse> getByPhone(String phone) {
        return orderRepo.findByCustomerPhoneOrderByCreatedAtDesc(phone)
                .stream().map(o -> toResponse(o, null)).toList();
    }

    @Transactional
    public OrderResponse confirmPayment(String orderCode) {
        Order order = orderRepo.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại: " + orderCode));
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepo.save(order);
        return toResponse(order, null);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));
        if (order.getOrderStatus() == OrderStatus.SHIPPING || order.getOrderStatus() == OrderStatus.DELIVERED)
            throw new BusinessException("Không thể hủy đơn hàng đang giao hoặc đã giao");
        order.setOrderStatus(OrderStatus.CANCELLED);
        return toResponse(orderRepo.save(order), null);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    private String generateOrderCode() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uid = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return String.format("SHP-%s-%s", date, uid);
    }

    private OrderResponse toResponse(Order o, String paymentUrl) {
        return OrderResponse.builder()
                .id(o.getId())
                .orderCode(o.getOrderCode())
                .customerName(o.getCustomerName())
                .customerPhone(o.getCustomerPhone())
                .shippingAddress(o.getShippingAddress())
                .shippingCity(o.getShippingCity())
                .items(o.getItems())
                .subtotal(o.getSubtotal())
                .shippingFee(o.getShippingFee())
                .total(o.getTotal())
                .paymentMethod(o.getPaymentMethod())
                .paymentStatus(o.getPaymentStatus())
                .orderStatus(o.getOrderStatus())
                .paymentUrl(paymentUrl)
                .notes(o.getNotes())
                .createdAt(o.getCreatedAt())
                .build();
    }
}
