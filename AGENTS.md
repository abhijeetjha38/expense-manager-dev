

# AGENTS.md

## Tech Stack
- Backend: Python 3.12+ with FastAPI
- ORM: SQLAlchemy 2.0 with async support
- Database: SQLite (single-instance deployment only)
- File Storage: Local filesystem for receipt uploads
- Frontend: Next.js (React) as standalone SPA with client-side rendering
- Do NOT use Next.js SSR or API routes. Next.js serves as a static frontend with file-based routing only.
- Frontend calls FastAPI REST APIs directly. Do NOT add a proxy layer.
- API docs auto-generated via FastAPI's OpenAPI/Swagger

## Architecture
- Modular monolith — backend organized by domain modules with clear boundaries
- Modules: Auth, Expenses, Categories, Budgets, Analytics, Reports, Notifications
- Each module encapsulates its own services, models, and routes
- Modules communicate through well-defined internal interfaces. Do NOT access another module's database tables directly.
- REST API (JSON) connecting frontend to backend
- Standard resource-based endpoints per module
- Web-only application. Do NOT build mobile apps or offline support.
- Notifications are in-app only (bell icon / inbox pattern). Do NOT implement email or push notifications.
- Budget threshold notifications trigger at 50%, 80%, and 100%
- Scheduled weekly summary notifications

## Security
- JWT authentication stored in localStorage on the client
- Access token + refresh token pattern. Access tokens are short-lived.
- Password hashing: bcrypt
- RBAC with two roles: **User** (own data only) and **Admin** (manage default categories, view usage stats)
- All API endpoints must enforce ownership checks — users can only access their own records
- CORS: allow only the Next.js frontend origin
- Input validation: Pydantic models on all FastAPI endpoints
- HTTPS required in production
- Receipt upload constraints:
  - Allowed types: JPEG, PNG, PDF only
  - Max file size: 5MB
  - Strip special characters from filenames; generate unique server-side filenames
- Do NOT implement rate limiting for initial release
- Do NOT implement virus scanning for initial release

## Testing
- Backend: pytest for smoke tests on critical paths only (auth flows, expense CRUD, budget threshold logic)
  - Do NOT write unit tests for every service/model
  - No mandatory coverage thresholds
- Frontend components: React Testing Library + Vitest
  - Test UI components (forms, cards, data displays) and user interactions
- E2E: Playwright for critical flows (registration → login → add expense → view dashboard, budget alerts, report export, search/filter)
- Do NOT implement API contract testing. Use FastAPI's OpenAPI docs as informal reference only.

## Backend Module Boundaries

```
backend/
  modules/
    auth/        # Registration, login, session/token management
    expenses/    # CRUD for expense entries, receipt attachment
    categories/  # Default and custom expense categories
    budgets/     # Monthly/category budget setting, threshold tracking
    analytics/   # Spending charts, trends, category breakdowns
    reports/     # Report generation and export (PDF, CSV, Excel)
    notifications/ # In-app budget alerts, weekly summaries, reminders
```

Each module folder contains its own routes, services, models, and schemas.

## API Conventions
- Use Pydantic models for all request/response schemas
- Use SQLAlchemy 2.0 async patterns for database access
- Return standard JSON responses from all endpoints
- Use FastAPI dependency injection for auth and ownership verification

## Frontend Conventions
- Use Next.js file-based routing for page structure
- Call backend REST APIs directly from client-side code
- Do NOT use `getServerSideProps`, `getStaticProps`, or Next.js API routes