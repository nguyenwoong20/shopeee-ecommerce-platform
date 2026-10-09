package com.shopeee.config;

import com.shopeee.order.model.Order;
import com.shopeee.order.model.OrderItem;
import com.shopeee.order.model.OrderStatus;
import com.shopeee.order.model.PaymentMethod;
import com.shopeee.order.model.PaymentStatus;
import com.shopeee.order.repository.OrderRepository;
import com.shopeee.product.model.Category;
import com.shopeee.product.model.Product;
import com.shopeee.product.repository.CategoryRepository;
import com.shopeee.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;

    @Override
    public void run(String... args) {
        if (categoryRepo.count() > 0) {
            seedOrdersIfEmpty();
            return;
        }

        // ── Categories ──────────────────────────────────────────────────────────
        Category electronics = save(Category.builder().name("Điện tử").icon("📱").slug("dien-tu").sortOrder(1).build());
        Category fashion     = save(Category.builder().name("Thời trang").icon("👗").slug("thoi-trang").sortOrder(2).build());
        Category beauty      = save(Category.builder().name("Làm đẹp").icon("💄").slug("lam-dep").sortOrder(3).build());
        Category food        = save(Category.builder().name("Thực phẩm").icon("🍎").slug("thuc-pham").sortOrder(4).build());
        Category home        = save(Category.builder().name("Nhà cửa").icon("🏠").slug("nha-cua").sortOrder(5).build());
        Category sports      = save(Category.builder().name("Thể thao").icon("⚽").slug("the-thao").sortOrder(6).build());
        Category books       = save(Category.builder().name("Sách").icon("📚").slug("sach").sortOrder(7).build());
        Category toys        = save(Category.builder().name("Đồ chơi").icon("🎮").slug("do-choi").sortOrder(8).build());

        // ── Flash Sale end time ──────────────────────────────────────────────────
        LocalDateTime flashEnd = LocalDateTime.now().plusHours(8);

        // ── Electronics ─────────────────────────────────────────────────────────
        seedProduct("iPhone 15 Pro Max 256GB", "Điện thoại Apple flagship 2024, chip A17 Pro", bd("29990000"), bd("34990000"), 10, 1523, 4.9, 892, "https://images.unsplash.com/photo-1696446702183-cbd30ee4e1b4?w=400", electronics, "Apple", true, true, bd("27990000"), flashEnd);
        seedProduct("Samsung Galaxy S24 Ultra", "Galaxy AI, camera 200MP, S Pen tích hợp", bd("28990000"), bd("32000000"), 15, 987, 4.8, 567, "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", electronics, "Samsung", true, false, null, null);
        seedProduct("MacBook Air M3 13 inch", "Laptop siêu mỏng chip M3, pin 18h", bd("27990000"), bd("31990000"), 8, 345, 4.9, 234, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", electronics, "Apple", true, true, bd("25990000"), flashEnd);
        seedProduct("AirPods Pro 2", "Chống ồn chủ động, âm thanh 3D", bd("5990000"), bd("6990000"), 50, 2341, 4.8, 1205, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400", electronics, "Apple", false, true, bd("4990000"), flashEnd);
        seedProduct("iPad Air 11 M2", "Màn hình Liquid Retina 11 inch, chip M2", bd("16990000"), bd("19990000"), 20, 678, 4.7, 345, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", electronics, "Apple", false, false, null, null);
        seedProduct("Sony WH-1000XM5", "Tai nghe chống ồn hàng đầu thế giới", bd("7490000"), bd("8990000"), 30, 1234, 4.8, 678, "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400", electronics, "Sony", false, true, bd("6490000"), flashEnd);
        seedProduct("Xiaomi 14 Ultra", "Camera Leica chuyên nghiệp, Snapdragon 8 Gen 3", bd("19990000"), bd("22000000"), 25, 456, 4.7, 234, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", electronics, "Xiaomi", false, false, null, null);
        seedProduct("ASUS ROG Phone 8 Pro", "Gaming phone 165Hz, làm mát Active Cooling", bd("22990000"), bd("26000000"), 12, 234, 4.6, 123, "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400", electronics, "ASUS", false, false, null, null);

        // ── Fashion ──────────────────────────────────────────────────────────────
        seedProduct("Áo thun Polo nam cao cấp", "Chất liệu cotton Pima, form regular fit, 6 màu", bd("299000"), bd("450000"), 200, 5678, 4.7, 2341, "https://images.unsplash.com/photo-1625910513502-d0f6c2dbef6d?w=400", fashion, "OWEN", false, true, bd("199000"), flashEnd);
        seedProduct("Đầm maxi hoa nữ dự tiệc", "Vải lụa cao cấp, dài 140cm, form A-line", bd("459000"), bd("650000"), 150, 3456, 4.6, 1234, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", fashion, "Elise", false, false, null, null);
        seedProduct("Quần jeans slim fit nam", "Denim stretch co giãn 4 chiều, wash xanh đậm", bd("389000"), bd("550000"), 180, 4567, 4.8, 2109, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", fashion, "Levi's", false, true, bd("289000"), flashEnd);
        seedProduct("Áo khoác bomber unisex", "Vải dù nhẹ, 2 lớp, phù hợp mọi giới tính", bd("549000"), bd("750000"), 100, 2345, 4.7, 987, "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", fashion, "H&M", true, false, null, null);
        seedProduct("Váy công sở thanh lịch", "Linen cao cấp, dài ngang gối, 4 màu cơ bản", bd("425000"), bd("600000"), 120, 1890, 4.6, 876, "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400", fashion, "IVY moda", false, false, null, null);
        seedProduct("Giày sneaker Nike Air Force 1", "Cổ thấp, đế Air cushion, màu trắng classic", bd("2290000"), bd("2790000"), 80, 6789, 4.9, 3456, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", fashion, "Nike", true, true, bd("1890000"), flashEnd);
        seedProduct("Túi tote canvas thời trang", "Canvas dày, in hình nghệ thuật, có khóa kéo", bd("189000"), bd("280000"), 300, 8901, 4.5, 4567, "https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=400", fashion, "Local Brand", false, false, null, null);

        // ── Beauty ───────────────────────────────────────────────────────────────
        seedProduct("Son môi lì Dior Rouge", "Finish matte, 72 màu, giữ màu 12h", bd("890000"), bd("1100000"), 200, 12345, 4.8, 6789, "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", beauty, "Dior", true, true, bd("690000"), flashEnd);
        seedProduct("Kem chống nắng Anessa SPF50+", "Chống UVA/UVB, chịu nước, hương chanh tươi", bd("490000"), bd("650000"), 500, 23456, 4.9, 12345, "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", beauty, "Anessa", true, true, bd("390000"), flashEnd);
        seedProduct("Toner dưỡng ẩm Some By Mi", "AHA BHA PHA, trị mụn, làm sáng da 30 ngày", bd("399000"), bd("550000"), 350, 34567, 4.7, 18901, "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", beauty, "Some By Mi", false, false, null, null);
        seedProduct("Serum Vitamin C La Roche-Posay", "Vitamin C 10%, làm sáng, chống oxy hóa", bd("690000"), bd("890000"), 180, 8765, 4.8, 4321, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", beauty, "La Roche-Posay", false, false, null, null);
        seedProduct("Mascara Maybelline Sky High", "Làm dài mi tối đa, không lem, thấm nước", bd("189000"), bd("280000"), 400, 45678, 4.6, 23456, "https://images.unsplash.com/photo-1631214500004-a5f0faa23ab2?w=400", beauty, "Maybelline", false, true, bd("149000"), flashEnd);

        // ── Food ─────────────────────────────────────────────────────────────────
        seedProduct("Cà phê rang xay Trung Nguyên Legend", "500g, rang vừa, hương chocolate-caramel", bd("175000"), bd("220000"), 1000, 56789, 4.9, 34567, "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400", food, "Trung Nguyên", true, true, bd("135000"), flashEnd);
        seedProduct("Trà matcha Nhật Bản premium", "100g bột matcha grade A, từ Uji Kyoto", bd("289000"), bd("380000"), 300, 12345, 4.8, 6789, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", food, "Ippodo", false, false, null, null);
        seedProduct("Yến mạch Quaker hộp 1kg", "Cán dẹt, nấu nhanh 3 phút, giàu Beta-glucan", bd("129000"), bd("180000"), 800, 78901, 4.7, 45678, "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400", food, "Quaker", false, false, null, null);
        seedProduct("Hạt điều rang muối Dakfood", "500g hạt điều W180 Bình Phước, ít muối", bd("145000"), bd("200000"), 600, 34567, 4.8, 20000, "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400", food, "Dakfood", false, true, bd("115000"), flashEnd);

        // ── Home ─────────────────────────────────────────────────────────────────
        seedProduct("Nồi chiên không dầu Philips 4.1L", "Digital, 7 chương trình, timer 60 phút", bd("2590000"), bd("3290000"), 60, 5678, 4.8, 3456, "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400", home, "Philips", true, true, bd("2090000"), flashEnd);
        seedProduct("Robot hút bụi Xiaomi S10+", "Tự đổ rác, lực hút 4000Pa, lập bản đồ AI", bd("8990000"), bd("11000000"), 25, 1234, 4.7, 678, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", home, "Xiaomi", false, false, null, null);
        seedProduct("Đèn ngủ LED cảm ứng", "Điều chỉnh độ sáng, 3 chế độ màu, sạc USB", bd("189000"), bd("280000"), 500, 23456, 4.6, 12345, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", home, "Xiaomi", false, false, null, null);
        seedProduct("Bộ nồi inox Supor 5 chiếc", "Inox 304, đế từ 5 lớp, phù hợp bếp từ", bd("1290000"), bd("1890000"), 100, 3456, 4.7, 1890, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", home, "Supor", false, true, bd("990000"), flashEnd);

        // ── Sports ───────────────────────────────────────────────────────────────
        seedProduct("Đạp xe thể thao Galaxy MTB26", "26 inch, 21 tốc độ Shimano, phuộc dầu", bd("3990000"), bd("5200000"), 30, 567, 4.6, 234, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", sports, "Galaxy", false, false, null, null);
        seedProduct("Thảm yoga TPE 6mm Boldfit", "Chống trơn 2 mặt, kích thước 183x61cm", bd("389000"), bd("550000"), 200, 7890, 4.8, 4321, "https://images.unsplash.com/photo-1601925228184-8c2cc5e3f4e2?w=400", sports, "Boldfit", false, true, bd("299000"), flashEnd);
        seedProduct("Tạ tay 5kg điều chỉnh được", "Cao su phủ tay cầm, set 2 tạ", bd("459000"), bd("650000"), 150, 4567, 4.7, 2345, "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", sports, "PowerTrain", true, false, null, null);

        // ── Books ────────────────────────────────────────────────────────────────
        seedProduct("Đắc Nhân Tâm - Dale Carnegie", "Bản dịch mới nhất, bìa cứng sang trọng", bd("89000"), bd("120000"), 1000, 34567, 4.9, 20000, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", books, "NXB Tổng Hợp", true, true, bd("69000"), flashEnd);
        seedProduct("Nhà Giả Kim - Paulo Coelho", "Bản giới hạn bìa cứng, có chữ ký tác giả in lại", bd("95000"), bd("135000"), 800, 23456, 4.8, 12000, "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400", books, "NXB Hội Nhà Văn", false, false, null, null);
        seedProduct("Clean Code - Robert C. Martin", "Tiếng Việt, bìa mềm, kỹ năng code sạch", bd("179000"), bd("250000"), 500, 8765, 4.9, 4567, "https://images.unsplash.com/photo-1491841651911-c44c30c34548?w=400", books, "NXB Dân Trí", false, false, null, null);

        // ── Toys ─────────────────────────────────────────────────────────────────
        seedProduct("Lego Creator 3-in-1 31150", "650 mảnh, xây 3 mô hình khác nhau", bd("890000"), bd("1200000"), 80, 1234, 4.8, 678, "https://images.unsplash.com/photo-1587654780291-39c9098d39a6?w=400", toys, "LEGO", false, true, bd("690000"), flashEnd);
        seedProduct("Đồ chơi robot biến hình", "Transformers, kim loại + nhựa ABS, 22cm", bd("349000"), bd("490000"), 120, 2345, 4.5, 1234, "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400", toys, "Hasbro", false, false, null, null);

        System.out.println("✅ DataSeeder: seeded " + productRepo.count() + " products in " + categoryRepo.count() + " categories");
        seedOrdersIfEmpty();
    }

    private void seedOrdersIfEmpty() {
        if (orderRepo.count() > 0) return;

        Order o1 = Order.builder()
                .orderCode("SHP-20260812-00001")
                .customerName("Nguyễn Văn A")
                .customerPhone("0901234567")
                .customerEmail("nguyenvana@gmail.com")
                .shippingAddress("123 Nguyễn Huệ, Phường Bến Nghé")
                .shippingCity("TP. Hồ Chí Minh")
                .subtotal(bd("32980000"))
                .shippingFee(bd("0"))
                .total(bd("32980000"))
                .paymentMethod(PaymentMethod.COD)
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.SHIPPING)
                .notes("Giao giờ hành chính giúp mình")
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .items(new ArrayList<>())
                .build();

        OrderItem i1 = OrderItem.builder()
                .order(o1)
                .productId(1L)
                .productName("iPhone 15 Pro Max 256GB")
                .productImage("https://images.unsplash.com/photo-1696446702183-cbd30ee4e1b4?w=400")
                .unitPrice(bd("27990000"))
                .quantity(1)
                .lineTotal(bd("27990000"))
                .build();

        OrderItem i2 = OrderItem.builder()
                .order(o1)
                .productId(4L)
                .productName("AirPods Pro 2")
                .productImage("https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400")
                .unitPrice(bd("4990000"))
                .quantity(1)
                .lineTotal(bd("4990000"))
                .build();

        o1.getItems().add(i1);
        o1.getItems().add(i2);
        orderRepo.save(o1);

        Order o2 = Order.builder()
                .orderCode("SHP-20260812-00002")
                .customerName("Nguyễn Văn A")
                .customerPhone("0901234567")
                .customerEmail("nguyenvana@gmail.com")
                .shippingAddress("123 Nguyễn Huệ, Phường Bến Nghé")
                .shippingCity("TP. Hồ Chí Minh")
                .subtotal(bd("270000"))
                .shippingFee(bd("0"))
                .total(bd("270000"))
                .paymentMethod(PaymentMethod.VNPAY)
                .paymentStatus(PaymentStatus.PAID)
                .orderStatus(OrderStatus.DELIVERED)
                .notes("Đã nhận hàng đầy đủ")
                .createdAt(LocalDateTime.now().minusDays(3))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .items(new ArrayList<>())
                .build();

        OrderItem i3 = OrderItem.builder()
                .order(o2)
                .productId(18L)
                .productName("Cà phê rang xay Trung Nguyên Legend")
                .productImage("https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400")
                .unitPrice(bd("135000"))
                .quantity(2)
                .lineTotal(bd("270000"))
                .build();

        o2.getItems().add(i3);
        orderRepo.save(o2);

        System.out.println("✅ DataSeeder: seeded " + orderRepo.count() + " sample orders for phone 0901234567");
    }

    private Category save(Category c) { return categoryRepo.save(c); }

    private void seedProduct(String name, String desc, BigDecimal price, BigDecimal origPrice,
                             int stock, int sold, double rating, int reviews,
                             String imageUrl, Category category, String brand,
                             boolean featured, boolean flashSale, BigDecimal flashSalePrice, LocalDateTime flashEnd) {
        productRepo.save(Product.builder()
                .name(name).description(desc)
                .price(price).originalPrice(origPrice)
                .stock(stock).sold(sold)
                .rating(rating).reviewCount(reviews)
                .imageUrl(imageUrl)
                .category(category).brand(brand)
                .featured(featured)
                .flashSale(flashSale)
                .flashSalePrice(flashSalePrice)
                .flashSaleEnd(flashEnd)
                .active(true)
                .build());
    }

    private BigDecimal bd(String val) { return new BigDecimal(val); }
}
