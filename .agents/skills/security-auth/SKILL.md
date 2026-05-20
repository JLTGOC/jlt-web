---
name: security-auth
description: "Harden client-side auth/authorization: JWT flows, token storage tradeoffs (memory/localStorage/HttpOnly cookies), XSS mitigation, and RBAC/PBAC checks. Use whenever a task mentions login, auth, permissions, token handling, role guards, OWASP, or security review, even if only implied."
argument-hint: 'Provide scope and strictness, for example: "auth flow standard" or "quotations permissions strict"'
---

# Security Auth

## Purpose

Apply a practical security workflow for client-side authentication and authorization while keeping server-side enforcement as the ultimate source of truth.

## Use This Skill When

- Implementing login/logout and token handling.
- Reviewing token persistence choices and XSS risk.
- Adding or refactoring route guards and action-level permission checks.
- Designing RBAC or PBAC behavior for features.
- Performing security-focused audits for auth and access control paths.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Security guidance and patterns: [security guidelines](./references/security-guidelines.md)
2. Execution and review checklist: [security checklist](./references/security-checklist.md)
3. Existing auth and permission baseline: src/stores/authStore.ts, src/lib/api/client.ts, src/components/guards/ProtectedRoute.tsx, src/components/guards/RoleGuard.tsx, src/lib/permissions.ts

## Workflow

1. Identify protected resources and define trust boundaries.
2. Verify authentication flow: login, token propagation, persistence, logout, and unauthorized handling.
3. Choose token storage intentionally with explicit XSS tradeoff notes.
4. Centralize authenticated user state and ensure consistent app-wide access semantics.
5. Enforce authorization at both route and action levels.
6. For auth-sensitive mutations, use optimistic UI only when permission outcomes are predictable and rollback/fail-closed behavior is explicit.
7. Add PBAC checks for ownership or policy-sensitive operations.
8. Validate that untrusted content is sanitized before rendering.
9. Prefer global fixes in auth middleware/guards/permission helpers over local permission patches repeated across screens.
10. Confirm server-side enforcement expectations and dependencies.
11. Report residual risk and required server-side safeguards.

## Operating Modes

1. Quick pass: focused auth or permission fix with targeted validation.
2. Standard pass: auth flow plus RBAC/PBAC checks and XSS review for touched paths.
3. Strict pass: full security review of auth, authorization, sanitization, and failure scenarios.

## Non-Negotiables

- Client-side auth improves UX but does not replace server-side authorization checks.
- Token persistence strategy must be documented with threat tradeoffs.
- Route-level protection must be paired with action-level permission checks.
- Untrusted user content must not be rendered without sanitization.
- Security-sensitive behavior must fail closed on missing or invalid auth context.
- Optimistic updates must never bypass or weaken authorization guarantees; failures must rollback and fail closed.
- Repeated auth/security fixes should be centralized (guards, permission services, API policy) rather than copy-pasted locally.
