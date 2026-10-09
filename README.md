# Shopeee E-Commerce Platform

Shopeee là dự án thương mại điện tử full-stack được xây dựng để thực hành
kiến trúc hướng dịch vụ với Spring Boot, React, PostgreSQL và Docker. Phiên
bản hiện tại là MVP, tập trung vào danh mục sản phẩm, giỏ hàng, thanh toán và
theo dõi đơn hàng.

## Tính năng

- Danh sách, tìm kiếm, chi tiết sản phẩm và lọc theo danh mục
- Sản phẩm nổi bật và chương trình Flash Sale
- Giỏ hàng theo session: thêm, xóa, tăng và giảm số lượng
- Checkout với kiểm tra tồn kho và tính phí vận chuyển
- Thanh toán COD và mô phỏng chuyển hướng VNPay/MoMo
- Tra cứu đơn hàng bằng số điện thoại
- Hủy đơn hàng khi đơn chưa bắt đầu giao
- Dữ liệu mẫu cho sản phẩm, danh mục và đơn hàng
- REST API và tài liệu Swagger UI
- Docker Compose cho PostgreSQL, backend và frontend

## Công nghệ sử dụng

| Tầng | Công nghệ |
| --- | --- |
| Backend | Java 17, Spring Boot 3.3, Spring Web, Spring Data JPA, Lombok |
| Database | PostgreSQL 16 |
| Frontend | React 19, TypeScript, Vite |
| Triển khai local | Docker, Docker Compose, Nginx |
| Kiến trúc cloud | AWS VPC, ALB, ECS, ECR, RDS, ElastiCache/Redis, S3 |

## Kiến trúc AWS

Sơ đồ dưới đây là bản tóm tắt kiến trúc AWS được GitHub render trực tiếp:

```mermaid
flowchart TB
    user["Người dùng<br/>Web / Mobile"] --> cdn["Cloudflare CDN"]
    cdn --> alb["AWS ALB<br/>Load Balancer"]

    subgraph aws["AWS - Region ap-southeast-1 (Singapore)"]
        subgraph vpc["VPC 10.0.0.0/16"]
            subgraph public["Public Subnet"]
                alb
                nginx["NGINX<br/>Reverse Proxy"]
            end

            subgraph app["Private Subnet - Application Tier"]
                product["Product Service<br/>ECS Task"]
                cart["Cart Service<br/>ECS Task"]
                order["Order Service<br/>ECS Task"]
            end

            subgraph data["Private Subnet - Data Tier"]
                redis["Redis<br/>Session Cache"]
                rds["PostgreSQL RDS<br/>Orders / Products"]
            end

            alb --> nginx
            nginx --> product
            nginx --> cart
            nginx --> order
            product --> rds
            cart --> redis
            order --> rds
        end

        s3["Amazon S3<br/>Static Assets"]
        ecr["AWS ECR<br/>Docker Registry"]
    end

    cdn --> s3
    ecr -. "Container images" .-> product
    ecr -. "Container images" .-> cart
    ecr -. "Container images" .-> order

    github["GitHub"] --> actions["GitHub Actions<br/>Build & Test"]
    actions --> ecr
```

Sơ đồ đầy đủ có thể mở và chỉnh sửa tại:

- [Mở sơ đồ AWS trên diagrams.net](docs/architecture/ecommerce-platform.drawio)
- [Tài liệu thư mục kiến trúc](docs/architecture/README.md)

Sơ đồ `.drawio` là bản chi tiết dùng để xem các subnet, luồng mạng và thành
phần triển khai. Sơ đồ Mermaid phía trên là bản tóm tắt để nhà tuyển dụng có
thể xem nhanh ngay trên GitHub.

## Chạy dự án

### Backend và database bằng Docker

Tạo file `.env` từ file mẫu:

```bash
copy .env.example .env
```

Sau đó khởi động toàn bộ hệ thống:

```bash
docker compose up --build
```

Các địa chỉ truy cập:

- Frontend: <http://localhost:30092>
- Backend API: <http://localhost:8080>
- Swagger UI: <http://localhost:8080/swagger-ui.html>

### Chạy backend không dùng Docker

Khởi động PostgreSQL ở port `5432`, cấu hình biến môi trường trong file `.env`,
sau đó chạy:

```bash
./mvnw spring-boot:run
```

Trên Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### Chạy frontend ở chế độ phát triển

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định gọi API tại `http://localhost:8080/api`.

## Cấu trúc dự án

```text
src/main/java/com/shopeee/
├── cart/          # API, model, repository và service của giỏ hàng
├── config/        # CORS, OpenAPI và dữ liệu mẫu
├── exception/     # Business exception và xử lý lỗi tập trung
├── order/         # Checkout, thanh toán và theo dõi đơn hàng
└── product/       # Sản phẩm và danh mục

frontend/src/
├── api/           # Client gọi backend API
├── components/    # Các thành phần giao diện dùng chung
├── contexts/      # State của giỏ hàng và thông báo
└── pages/         # Các trang của storefront
```

## Kiểm tra

```bash
cd frontend
npm run build
npm run lint
```

Backend test cần PostgreSQL đang chạy với các biến môi trường đã cấu hình.

## Trạng thái dự án

Đây là MVP phục vụ mục đích học tập. Cổng thanh toán hiện đang được mô phỏng;
authentication, admin dashboard và việc tách các bounded context thành các
service deploy độc lập là những hướng phát triển tiếp theo.
