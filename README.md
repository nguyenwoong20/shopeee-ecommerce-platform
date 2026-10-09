# Shopeee E-Commerce Platform

Shopeee is a full-stack e-commerce learning project built to practice a
service-oriented architecture with Spring Boot, React, PostgreSQL and Docker.
The current version is an MVP with a product catalog, cart, checkout and order
tracking flow.

## Features

- Product listing, detail pages, search, categories, featured products and flash sale
- Session-based shopping cart
- Checkout with stock validation and shipping-fee calculation
- COD checkout and mock VNPay/MoMo payment redirects
- Order lookup by phone number and order cancellation
- Seed data for products, categories and sample orders
- REST API documentation through Swagger UI
- Docker Compose setup for PostgreSQL, backend and frontend

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Java 17, Spring Boot 3.3, Spring Web, Spring Data JPA, Lombok |
| Database | PostgreSQL 16 |
| Frontend | React 19, TypeScript, Vite |
| Deployment | Docker, Docker Compose, Nginx |

## AWS architecture

The repository includes the AWS architecture diagram used to plan the
production deployment:

- [Open the AWS architecture diagram](docs/architecture/ecommerce-platform.drawio)
- Diagram type: three-tier e-commerce platform with VPC, public/private
  subnets, load balancing, container workloads, PostgreSQL and supporting AWS
  services

Open the `.drawio` file with [diagrams.net](https://app.diagrams.net/) to
inspect or edit the architecture. The deployed design is intentionally kept
separate from the local Docker Compose setup so the project can demonstrate
both local development and cloud architecture thinking.

## Run locally

### Backend and database

Create a `.env` file from `.env.example`, then start the services:

```bash
docker compose up --build
```

The application will be available at:

- Frontend: <http://localhost:30092>
- Backend API: <http://localhost:8080>
- Swagger UI: <http://localhost:8080/swagger-ui.html>

To run the backend without Docker, start PostgreSQL on port `5432` and use:

```bash
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run`.

### Frontend development server

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8080/api`.

## Project structure

```text
src/main/java/com/shopeee/
├── cart/          # Cart API, model, repository and service
├── config/        # CORS, OpenAPI and seed data
├── exception/     # Business errors and global error handling
├── order/         # Checkout, payment and order tracking
└── product/       # Products and categories

frontend/src/
├── api/           # Backend API clients
├── components/    # Shared UI components
├── contexts/      # Cart and toast state
└── pages/         # Storefront pages
```

## Validation

```bash
cd frontend
npm run build
npm run lint
```

The backend tests require PostgreSQL to be running with the configured
environment variables.

## Project status

This is an educational MVP. Payment gateways are mocked, authentication and
an admin dashboard are not implemented yet, and the next step toward
production would be splitting the bounded domains into independently
deployable services.
