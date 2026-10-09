package com.shopeee.order.dto;

import com.shopeee.order.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotBlank(message = "sessionId không được trống")
    private String sessionId;

    @NotBlank(message = "Tên người nhận không được trống")
    private String customerName;

    @NotBlank(message = "Số điện thoại không được trống")
    private String customerPhone;

    private String customerEmail;

    @NotBlank(message = "Địa chỉ không được trống")
    private String shippingAddress;

    @NotBlank(message = "Thành phố không được trống")
    private String shippingCity;

    private String shippingDistrict;
    private String shippingWard;
    private String notes;

    @NotNull(message = "Phương thức thanh toán không được trống")
    private PaymentMethod paymentMethod;
}
