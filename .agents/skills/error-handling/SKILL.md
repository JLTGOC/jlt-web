---
name: error-handling
description: "Design resilient error handling in React/Vite apps: centralized API error policies, user-safe messaging, localized error boundaries, and production tracking (Sentry/source maps). Use whenever a task mentions API errors, retries, toasts/notifications, auth failures, error boundaries, monitoring, or runtime exceptions, even if only implied."
argument-hint: 'Provide scope and strictness, for example: "auth API standard" or "quotations viewer strict"'
---

# Error Handling

## Purpose

Apply a consistent strategy for API failures, in-app runtime exceptions, and production error monitoring so failures are visible, contained, and recoverable.

## Use This Skill When

- Implementing API error behavior in services or client interceptors.
- Standardizing user-facing error notifications.
- Adding React error boundaries to prevent full-app crashes.
- Reviewing retry, token refresh, or unauthorized-session handling.
- Instrumenting or auditing production error tracking (Sentry or equivalent).
- Ensuring source maps and release metadata are present for readable stack traces.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Patterns and implementation guidance: [error handling guidelines](./references/error-handling-guidelines.md)
2. Execution and validation checklist: [error handling checklist](./references/error-handling-checklist.md)
3. Existing baseline in this repository: src/lib/api/client.ts, src/app/provider.tsx, src/app/routes/auth/LoginPage.tsx

## Workflow

1. Identify error sources by layer: API/network, domain logic, UI rendering, and unexpected runtime failures.
2. Normalize API errors through a central interceptor policy and define a consistent error payload shape.
3. Map errors to user-facing messaging with actionable feedback where possible and avoid leaking internals.
4. Handle authentication-related failures consistently (for example 401 logout, session invalidation, or token-refresh flow if present).
5. For optimistic mutations, require explicit rollback/error-recovery behavior and verify user-visible state consistency after failures.
6. Contain render-time crashes using localized error boundaries instead of a single global boundary only.
7. Capture unhandled and high-severity errors in production tracking tools with release + environment metadata.
8. Ensure source maps are uploaded so production stacks map to source code.
9. Prefer central/global remediation (interceptors, shared handlers, reusable hooks) over one-off local catch-path patches when patterns recur.
10. Validate fallback UX, retry behavior, optimistic rollback paths, and recovery flows.
11. Report residual risk and observability gaps.

## Operating Modes

1. Quick pass: targeted fix for one error path and local validation.
2. Standard pass: interceptor policy plus boundary placement review in touched flow.
3. Strict pass: full pass including tracking instrumentation and failure scenario verification.

## Non-Negotiables

- API error handling must be centralized and predictable.
- Unauthorized states must fail closed and keep session state consistent.
- User-facing error messaging should be clear but must avoid leaking sensitive internals.
- Error boundaries should isolate failures to affected regions when feasible.
- Production errors must be observable with actionable context (release, environment, platform).
- Source maps must be available for tracked errors in production.
- Optimistic UI mutation failures must always have deterministic rollback/reconciliation behavior.
- Repeated failure-handling patterns must be fixed at a shared/global layer when feasible.
