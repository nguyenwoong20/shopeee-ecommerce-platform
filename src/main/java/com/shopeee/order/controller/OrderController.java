package com.shopeee.order.controller;

import com.shopeee.order.dto.CheckoutRequest;
import com.shopeee.order.dto.OrderResponse;
import com.shopeee.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Order Service", description = "Đặt hàng và theo dõi đơn hàng")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    @Operation(summary = "Đặt hàng (tạo đơn từ giỏ hàng)")
    public ResponseEntity<OrderResponse> checkout(@Valid @RequestBody CheckoutRequest req) {
        return ResponseEntity.ok(orderService.checkout(req));
    }

    @GetMapping("/orders/{code}")
    @Operation(summary = "Tra cứu đơn hàng theo mã")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String code) {
        return ResponseEntity.ok(orderService.getByCode(code));
    }

    @GetMapping("/orders")
    @Operation(summary = "Tra cứu đơn hàng theo SĐT")
    public ResponseEntity<List<OrderResponse>> getByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(orderService.getByPhone(phone));
    }

    @PostMapping("/payment/confirm")
    @Operation(summary = "Xác nhận thanh toán (callback từ VNPay/MoMo)")
    public ResponseEntity<OrderResponse> confirmPayment(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.confirmPayment(body.get("orderCode")));
    }

    @PatchMapping("/orders/{id}/cancel")
    @Operation(summary = "Hủy đơn hàng")
    public ResponseEntity<OrderResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}
