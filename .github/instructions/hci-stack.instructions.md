---
description: "Use when editing backend Express TypeScript code or frontend React TypeScript code in this HCI project. Enforces repository conventions for structure, API access, and type safety."
name: "HCI Stack Conventions"
applyTo:
  - "app/backend/src/**/*.ts"
  - "app/frontend/src/**/*.{ts,tsx}"
---
# HCI Stack Conventions

- Preserve strict TypeScript patterns. Prefer explicit types and avoid introducing any unless there is no practical alternative.
- Keep backend layering clear:
  - Define endpoints in routes files.
  - Keep request handling and business logic in controller files.
  - Keep data schema concerns in models.
- Keep backend app startup split:
  - app.ts creates and configures the Express app.
  - server.ts handles environment loading, database connection, and listen.
- For frontend API calls, use shared functions in app/frontend/src/lib/api.ts instead of introducing ad-hoc fetch calls in pages or components.
- Keep route-level page wiring in app/frontend/src/App.tsx and continue using ProtectedRoute for auth-protected pages.
- Follow existing code style in this repo: double quotes and semicolons in TypeScript/TSX files.
- When adding or changing data shapes, update related type definitions in app/frontend/src/types and backend request/response typings in the same change.
- Prefer additive, low-risk edits. Do not refactor unrelated files during feature or bug-fix tasks unless explicitly requested.
