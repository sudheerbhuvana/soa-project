# HarborFlow Backend

Spring Boot multi-module microservices backend for HarborFlow Operations.

## Modules

| Module | Port | Responsibility |
|---|---|---|
| `eureka-server` | 8761 | Service discovery registry |
| `api-gateway` | 8080 | Spring Cloud Gateway, JWT validation, CORS, load balancer |
| `auth-service` | 8081 | JWT issuance, bcrypt password hashing |
| `carrier-service` | 8082 | CRUD for shipping carriers (Postgres schema `carrier`) |
| `container-service` | 8083 | CRUD for containers (Postgres schema `container`) |
| `yard-service` | 8084 | Yard slot allocation (Postgres schema `yard`) |
| `gate-service` | 8085 | Truck check-in / check-out log (Postgres schema `gate`) |

## Build

```bash
mvn clean package -DskipTests
```

Each module produces a Spring Boot fat jar in `target/`.

## Run order

Start Eureka first; wait ~15s for it to settle. Then start gateway, then
business services in any order.

```bash
java -jar eureka-server/target/eureka-server-1.0.0.jar
java -jar api-gateway/target/api-gateway-1.0.0.jar
java -jar auth-service/target/auth-service-1.0.0.jar
java -jar carrier-service/target/carrier-service-1.0.0.jar
java -jar container-service/target/container-service-1.0.0.jar
java -jar yard-service/target/yard-service-1.0.0.jar
java -jar gate-service/target/gate-service-1.0.0.jar
```

## Database

Connects to Neon Postgres at:
`jdbc:postgresql://ep-flat-breeze-b5j4ye6o-pooler.c-7.us-east-2.aws.neon.tech:5432/soa-postgres`

One shared DB; each service owns its schema (`auth`, `carrier`, `container`,
`yard`, `gate`) via `hibernate.default_schema`. JPA `ddl-auto: update` creates
the tables on first boot.

## Security

- `app.jwt.secret` shared by auth-service and api-gateway.
- Tokens are HS256, 24h expiry.
- All `/api/**` routes except `/api/auth/login` and `/api/auth/register`
  require `Authorization: Bearer <token>` — verified at the gateway.

## API docs

Per-service Swagger UI at `http://localhost:<port>/swagger-ui.html`. OpenAPI
spec at `/v3/api-docs`.
