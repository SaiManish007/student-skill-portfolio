# Student Skill & Project Portfolio System (Skillfolio)

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Academic-blue.svg)]()

> **B.Tech 3rd Year Academic Capstone Project**  
> A centralized, role-based platform for engineering students to curate academic & personal projects, verified technical/soft skills, certifications, achievements, and competitive coding profiles with public recruiter showcases and faculty/admin oversight.

---

## 1. System Architecture

Skillfolio is built on a decoupled, production-grade client-server architecture:

```mermaid
graph TD
    Client["React 18 SPA (Vite + Tailwind CSS + Lucide + Recharts)"]
    Gateway["REST API / Reverse Proxy"]
    Security["Spring Security 6 (Stateless JWT Filter Chain)"]
    ServiceLayer["Service Layer (Business Logic & Owner Isolation)"]
    DataLayer["Spring Data JPA / Hibernate"]
    Flyway["Flyway Migration Engine"]
    Database[("PostgreSQL 16 Database")]

    Client -->|HTTPS / JSON + Bearer JWT| Gateway
    Gateway --> Security
    Security --> ServiceLayer
    ServiceLayer --> DataLayer
    DataLayer --> Database
    Flyway -->|Versioned DDL Migrations| Database
```

### Architectural Highlights
- **Decoupled Frontend**: React 18 single-page application built with Vite, Tailwind CSS, Lucide React icons, and Recharts data visualization. All state is synchronized via RESTful JSON APIs.
- **Stateless Spring Security**: Implements JWT authentication via JJWT (`0.12.6`) using an HMAC-SHA256 signature key. Tokens are issued on login/registration and validated per-request via `JwtAuthenticationFilter`.
- **Database Migrations with Flyway**: Strict schema versioning using `V1__initial_schema.sql` rather than uncontrolled Hibernate auto-DDL.
- **Relational Integrity**: Foreign key constraints with `ON DELETE CASCADE` ensure that deleting a user or profile cleanly cleans up all associated projects, skills, certifications, and achievements.
- **Public Showcase Privacy**: Public portfolio route (`/p/:slug`) serves a privacy-hardened DTO that omits email, phone number, password hash, and internal user IDs.
- **Admin Governance**: Distinct `ROLE_ADMIN` role with administrative dashboard for student auditing, publication oversight, and system metrics.

---

## 2. Technology Stack

| Layer | Technologies Used | Description |
|---|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS, Lucide React, Recharts, Axios | Responsive UI, animated micro-interactions, dark navy/indigo palette |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Web, Spring Security 6, Spring Data JPA | REST APIs, validation, JWT security, transactional service layer |
| **Persistence** | PostgreSQL 16 (H2 in-memory for testing), Flyway 10 | Normalized schema, indexing on slugs/emails/foreign keys |
| **Build & Tooling**| Apache Maven 3.10+, Node.js 20+, Docker | Multi-stage Docker builds, Vite bundling |

---

## 3. Project Structure

```
student-portfolio/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skillfolio/
│   │   │   │   ├── config/             # CORS, Cloud DB URL parser, Admin bootstrap
│   │   │   │   ├── controller/         # REST Controllers (Auth, Profile, Skills, etc.)
│   │   │   │   ├── dto/                # Request & Response Data Transfer Objects
│   │   │   │   ├── entity/             # JPA Entities (User, Skill, Project, etc.)
│   │   │   │   ├── exception/          # Global Exception Handler & Custom Exceptions
│   │   │   │   ├── repository/         # Spring Data JPA Repositories
│   │   │   │   ├── security/           # JWT Provider, Auth Filter, UserPrincipal
│   │   │   │   └── service/            # Core business logic & owner-isolation rules
│   │   │   └── resources/
│   │   │       ├── db/migration/       # V1__initial_schema.sql (Flyway)
│   │   │       ├── application.yml     # Base configuration
│   │   │       ├── application-local.yml
│   │   │       └── application-prod.yml
│   │   └── test/                       # 18 Full Integration & Security Tests
│   ├── pom.xml                         # Maven dependencies & build configuration
│   ├── Dockerfile                      # Multi-stage production container build
│   └── .env.example                    # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/                 # Navbar, Sidebar, Layout, Modal, Toast, Skeleton
│   │   ├── context/                    # AuthContext (JWT session state)
│   │   ├── pages/                      # Landing, Dashboard, Skills, Projects, Admin, etc.
│   │   ├── services/                   # Axios API client with auth interceptor
│   │   ├── App.jsx                     # Route declarations & guards
│   │   ├── main.jsx                    # Application entry point
│   │   └── index.css                   # Custom scrollbars, glassmorphism, color variables
│   ├── package.json                    # Frontend dependencies & scripts
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Custom theme tokens
│   ├── vercel.json                     # SPA client-side routing rewrite rules
│   └── .env.example                    # Frontend environment template
├── .gitignore                          # Root ignore patterns
└── README.md                           # Project documentation & viva guide
```

---

## 4. Database Schema

```mermaid
erDiagram
    USERS ||--o| STUDENT_PROFILES : "has one"
    USERS ||--o{ SKILLS : "owns"
    USERS ||--o{ PROJECTS : "owns"
    USERS ||--o{ CERTIFICATIONS : "owns"
    USERS ||--o{ ACHIEVEMENTS : "owns"

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar role "STUDENT | ADMIN"
        timestamp created_at
        timestamp updated_at
    }

    STUDENT_PROFILES {
        bigint id PK
        bigint user_id FK,UK
        varchar headline
        text bio
        varchar department
        varchar year_of_study
        varchar roll_number
        varchar cgpa
        varchar phone
        varchar portfolio_slug UK
        boolean is_published
        varchar github_url
        varchar leetcode_url
        varchar codechef_url
        varchar linkedin_url
    }

    SKILLS {
        bigint id PK
        bigint user_id FK
        varchar name
        varchar category "TECHNICAL | SOFT | TOOL | DOMAIN"
        varchar proficiency_level "BEGINNER | INTERMEDIATE | ADVANCED | EXPERT"
    }

    PROJECTS {
        bigint id PK
        bigint user_id FK
        varchar title
        text description
        varchar tech_stack
        varchar project_type "ACADEMIC | PERSONAL | HACKATHON | INTERNSHIP"
        varchar github_url
        varchar live_demo_url
        boolean is_featured
    }

    CERTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar title
        varchar issuing_organization
        date issue_date
        varchar credential_url
        varchar certificate_id
    }

    ACHIEVEMENTS {
        bigint id PK
        bigint user_id FK
        varchar title
        varchar category "HACKATHON | COMPETITION | ACADEMIC | LEADERSHIP"
        text description
        date achievement_date
    }
```

---

## 5. Security & Isolation Model

### 1. Stateless Authentication & JWT Validation
- Client sends credentials (`email`, `password`) to `/api/auth/login`.
- Server validates BCrypt hash and generates a signed JWT token containing `userId`, `email`, and `role`.
- Client stores JWT in `localStorage` and includes it in all subsequent requests via the `Authorization: Bearer <token>` header.
- `JwtAuthenticationFilter` intercepts requests, validates the signature, extracts the `UserPrincipal`, and populates the `SecurityContextHolder`.

### 2. Multi-Tenant Owner Isolation
- All entity mutations (`PUT`, `DELETE`) inspect `UserPrincipal.getId()`.
- If an entity exists but belongs to a different student, the server rejects the request with HTTP `403 Forbidden`:
  ```java
  if (!entity.getUser().getId().equals(currentUser.getId())) {
      throw new UnauthorizedException("You are not authorized to modify this resource");
  }
  ```

### 3. Public Showcase Privacy Firewall
- The public route `/p/:slug` resolves via `/api/public/portfolio/{slug}`.
- Returns only published profiles (`is_published = true`).
- Strictly sanitizes output: phone numbers, emails, passwords, and database user IDs are never returned.

### 4. Admin Bootstrap & Escalation Protection
- Students cannot escalate their role during registration. Registration endpoint unconditionally sets `Role.STUDENT`.
- Initial admin is provisioned via secure environment variables:
  - `ADMIN_BOOTSTRAP_ENABLED=true`
  - `ADMIN_DEFAULT_EMAIL=admin@skillfolio.edu`
  - `ADMIN_DEFAULT_PASSWORD=AdminSecurePass123!`

---

## 6. Local Setup and Execution

### Prerequisites
- **Java Development Kit**: JDK 21+
- **Apache Maven**: 3.9+ (or use direct path `C:\Tools\apache-maven-3.10.0\bin\mvn.cmd`)
- **Node.js**: v20+ & npm 10+
- **PostgreSQL**: 15+ (running locally on port 5432)

---

### Step 1: Clone and Configure Environment

```bash
git clone https://github.com/your-username/student-portfolio.git
cd student-portfolio
```

#### Backend Environment
Create `backend/.env` (or copy from `backend/.env.example`):
```env
SPRING_PROFILES_ACTIVE=local
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skillfolio_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=superSecretJwtSigningKeyWithAtLeast256BitsLengthForSkillfolioSecurity2026!
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_DEFAULT_EMAIL=admin@skillfolio.edu
ADMIN_DEFAULT_PASSWORD=AdminPass123!
```

Create the local PostgreSQL database:
```sql
CREATE DATABASE skillfolio_db;
```

#### Frontend Environment
Create `frontend/.env` (or copy from `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

### Step 2: Build & Run the Backend

Navigate to `backend`:
```bash
cd backend

# Run the 18-test integration suite (runs on embedded H2 database)
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" test

# Run the Spring Boot application locally
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run -Dspring-boot.run.profiles=local
```
The backend server will start at `http://localhost:8080`.

---

### Step 3: Build & Run the Frontend

In a separate terminal, navigate to `frontend`:
```bash
cd frontend

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 7. Build Verification & Test Suite

### Running Backend Tests
The backend contains 18 comprehensive Spring Boot integration tests verifying:
1. `AuthControllerTest`: Student registration, duplicate email handling, login validation.
2. `RoleAuthorizationTest`: Admin endpoint rejection for student tokens (`403 Forbidden`).
3. `OwnerIsolationTest`: Student A cannot update or delete Student B's project (`403 Forbidden`).
4. `PublicPortfolioPrivacyTest`: Unauthenticated showcase retrieval, unpublished showcase 404, absence of sensitive PII.
5. `CrudValidationTest`: Bean validation rejection of blank project titles, invalid URLs, and invalid category enums.

```bash
cd backend
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" test
```
**Result**: `Tests run: 18, Failures: 0, Errors: 0, Skipped: 0` -> **BUILD SUCCESS**

### Packaging Production JAR
```bash
cd backend
& "C:\Tools\apache-maven-3.10.0\bin\mvn.cmd" clean package -DskipTests
```
Generates executable JAR: `backend/target/skillfolio-backend-1.0.0.jar`.

### Building Production Frontend
```bash
cd frontend
npm run build
```
Generates production SPA assets in `frontend/dist/`.

---

## 8. Deployment Guide

### A. Database Deployment (PostgreSQL)
1. Provision a managed PostgreSQL instance on **Render**, **Railway**, **Neon**, or **Supabase**.
2. Note the connection URL:
   `postgres://username:password@hostname:5432/databasename`
   *(Skillfolio's `DatabaseConfig.java` natively parses both standard JDBC format and cloud `postgres://` URLs).*

### B. Backend Deployment (Render / Docker)
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository and select the `backend` directory.
3. Choose **Docker** environment (using `backend/Dockerfile`).
4. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DATABASE_URL=postgres://...` (or use internal database link)
   - `JWT_SECRET=your-64-character-production-hmac-secret`
   - `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
   - `ADMIN_BOOTSTRAP_ENABLED=true`
   - `ADMIN_DEFAULT_EMAIL=faculty.admin@yourcollege.edu`
   - `ADMIN_DEFAULT_PASSWORD=StrongAdminPassword!2026`
5. Deploy. Render will execute the multi-stage Docker build and expose port `8080`.

### C. Frontend Deployment (Vercel)
1. In Vercel Dashboard, import the Git repository.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
5. The included `frontend/vercel.json` ensures that all routes (`/dashboard`, `/p/:slug`, `/admin`) correctly rewrite to `index.html` for client-side routing.
6. Deploy.

---

## 9. REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student account | Public |
| `POST` | `/api/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Authenticated |

### Student Profile (`/api/profile`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/profile/me` | Fetch current student's full profile | Student / Admin |
| `PUT` | `/api/profile/me` | Update headline, bio, contact, coding links | Student |
| `PUT` | `/api/profile/me/slug` | Update custom public portfolio slug | Student |
| `PUT` | `/api/profile/me/publish` | Toggle public showcase visibility | Student |

### Skills (`/api/skills`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/skills` | List logged-in student's skills | Student |
| `POST` | `/api/skills` | Add new skill (Technical / Soft / Tool / Domain) | Student |
| `PUT` | `/api/skills/{id}` | Update skill proficiency | Owner |
| `DELETE` | `/api/skills/{id}` | Delete skill | Owner |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/projects` | List logged-in student's projects | Student |
| `POST` | `/api/projects` | Add project (academic, personal, hackathon) | Student |
| `PUT` | `/api/projects/{id}` | Update project details / toggle featured | Owner |
| `DELETE` | `/api/projects/{id}` | Delete project | Owner |

### Certifications & Achievements
- `/api/certifications`: Full CRUD for certificates with issuing organization, date, and verification URLs.
- `/api/achievements`: Full CRUD for hackathon awards, academic honors, and leadership accomplishments.

### Dashboards & Public Showcases
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard/student` | Aggregated metrics, completeness %, chart data | Student |
| `GET` | `/api/dashboard/admin` | Total students, skills distribution, recent signups | Admin |
| `GET` | `/api/admin/students` | Search and audit student profiles | Admin |
| `GET` | `/api/public/portfolio/{slug}` | Privacy-sanitized public showcase | Public |

---

## 10. Viva & Interview Defense Guide

### Q1: Why did you choose Spring Boot + React over a traditional monolithic MVC (Thymeleaf/JSP)?
> *"A decoupled architecture separates UI concerns from business and persistence layers. React enables responsive, dynamic user experiences with single-page routing and real-time state management, while Spring Boot provides an enterprise-grade REST API backend with transactional integrity, stateless JWT security, and horizontal scalability. Furthermore, this separation enables the same API to serve mobile apps or third-party recruiters without rearchitecting."*

### Q2: How does the authentication system prevent session hijacking and scale horizontally?
> *"Authentication is completely stateless. Instead of storing HTTP sessions in server memory (which would require sticky sessions or Redis in a clustered environment), we issue a cryptographically signed JSON Web Token (JWT) using HMAC-SHA256. Each subsequent request includes the token in the `Authorization: Bearer` header. The `JwtAuthenticationFilter` validates the signature and expiration independently on each node without consulting a central session store."*

### Q3: How do you enforce security and owner-isolation between students?
> *"Multi-tenant security is enforced at both the filter chain and service layer. Spring Security ensures only authenticated tokens pass through. Within service methods (e.g., `ProjectService.updateProject`), we fetch the authenticated user ID from the `SecurityContext` and verify that the target entity's `user.id` strictly matches the token's subject. If a malicious student attempts to modify another student's project ID, the system throws an `UnauthorizedException` resulting in HTTP 403 Forbidden."*

### Q4: How is student privacy protected on public portfolio URLs (`/p/:slug`)?
> *"We implement strict data sanitization using a dedicated `PublicPortfolioResponse` DTO. When an unauthenticated visitor requests `/api/public/portfolio/{slug}`, the service checks if `is_published` is true. Even when published, the DTO deliberately omits sensitive personally identifiable information (PII) including email, phone number, password hash, registration timestamp, and database primary keys."*

### Q5: Why use Flyway migrations instead of `spring.jpa.hibernate.ddl-auto=update`?
> *"Hibernate's `ddl-auto=update` is non-deterministic, dangerous in production, cannot safely perform table alters or column renames, and cannot track migration history. Flyway provides immutable, version-controlled SQL migration scripts (`V1__initial_schema.sql`) that execute sequentially on application startup and maintain a checksummed `flyway_schema_history` table."*

---

## 11. Verification Checklist

- [x] Java 21 & Spring Boot 3.3.4 Backend
- [x] Spring Security 6 stateless JWT authentication
- [x] PostgreSQL relational schema with Flyway migrations
- [x] Multi-tenant owner-isolation across all CRUD entities
- [x] Public portfolio showcase with privacy firewall
- [x] Admin oversight dashboard with live metrics
- [x] React 18 + Vite frontend with Tailwind CSS design system
- [x] 18 passing backend integration tests
- [x] Production JAR packaging verified
- [x] Dockerfile and deployment configurations ready
