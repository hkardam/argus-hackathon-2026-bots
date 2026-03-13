---
trigger: always_on
---

**Stack:** Spring Boot 3.5.11 (Java 21) | PostgreSQL | React 18+ (TypeScript)
**Constraint:** 8-Hour Sprint Mode

---

### 1. RECURSIVE MODULAR STRUCTURE
Every feature is a `module/`. In a hackathon, keep depth to a minimum unless a feature (e.g., `payment/`) requires its own sub-logic.
* **Rule:** No logic exists outside a module.
* **Rule:** Cross-module communication happens **only** through Services.
* **Hackathon Tip:** If it takes more than 5 minutes to decide on a sub-module, keep it flat in the main module.

### 2. LAYERED DIRECTORY DEFINITIONS (JAVA/TS)
* **controller/**: `@RestController` classes. Use `ResponseEntity<T>` exclusively.
* **services/**: `@Service` classes. Business logic + 3rd party integrations.
* **repo/**: `JpaRepository` interfaces. No logic, just data access.
* **model/**: `@Entity` classes for PostgreSQL. Keep these lean.
* **dto/**: Java 21 `record` types (immutable, boilerplate-free) for the backend. TypeScript `interface` or `type` for the frontend.
* **util/**: Pure static methods or `@Component` helpers (e.g., `DateFormatter`).

### 3. THE "FIREWALL" (DATA FLOW)
* **Service Isolation:** Services **MUST NOT** leak `@Entity` objects to the Controller.
* **Mapping:** Use Java 21 Records in the Service to transform Models into DTOs instantly.
* **Direction:** `React UI` -> `Controller` -> `Service` -> `Repo` -> `PostgreSQL`.
* **Constraint:** Controllers never talk to Repos. Repos never talk to Services.

### 4. HACKATHON ADAPTATIONS
* **Java 21 Records:** Use `record` for all DTOs to save time on getters/setters/constructors.
* **Frontend-Backend Sync:** Every Backend `dto/` must have a matching TypeScript `interface` in the React `src/types/` folder to ensure type safety.
* **Database:** Use **Lombok** (`@Data`, `@Builder`) on `@Entity` models to accelerate development.
* **Error Handling:** Use a single `@RestControllerAdvice` for global error handling to avoid try-catch blocks in every controller.

### 5. AGENT OPERATIONAL RULES
* **Tree First:** Before coding, the agent must output the folder tree for the requested feature.
* **DTO/Type First:** Generate the Java `record` and the React `interface` before writing logic.
* **Verification:** Every response must end with a "Leak Check" confirming no `@Entity` or DB reference is exposed to the API.
* **NO TESTING:** Do **NOT** generate test cases (Unit, Integration, or E2E) unless explicitly instructed. Focus entirely on functional feature delivery.

---

### 📂 EXAMPLE HACKATHON STRUCTURE
```text
src/main/java/com/hackathon/app/
└── modules/
    └── auth/
        ├── controller/  (AuthController.java)
        ├── services/    (AuthService.java)
        ├── repo/        (AccountRepository.java)
        ├── model/       (AccountEntity.java)
        ├── dto/         (LoginRequest.java, AuthResponse.java - RECORDS)
        └── util/        (JwtProvider.java)