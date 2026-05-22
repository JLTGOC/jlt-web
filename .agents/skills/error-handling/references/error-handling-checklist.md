# Error Handling Checklist

Use this checklist to implement and verify robust error handling.

## 1. Scope and Failure Modes

- List expected failures for the touched flow (network, auth, validation, runtime).
- Classify each failure as recoverable, partially recoverable, or fatal.
- Define expected UX for each category.

## 2. API Error Policy

- API client interceptors handle common status classes consistently.
- Unauthorized responses trigger consistent session behavior.
- Token-refresh behavior is explicit if your auth model supports it.
- Error payload normalization exists before feature-level handling.

## 3. User Messaging

- User notifications are clear, concise, and actionable.
- Messages do not leak sensitive backend details.
- Duplicate/noisy toasts are minimized.

## 4. In-App Containment

- Error boundaries are placed at appropriate app/route/feature levels.
- Fallback UI keeps unaffected regions functional.
- Recovery actions are available where practical.

## 5. Tracking and Telemetry

- Production errors are captured by a tracking system.
- Captured events include environment/release metadata.
- Source maps are uploaded for readable stack traces.
- High-priority issues are alertable and triaged.
 - Source map availability is verified in production-like builds.

## 6. Validation

Run baseline project gates for touched scope:

1. pnpm lint
2. pnpm test
3. pnpm build

For error flows, also perform scenario checks:

1. 401 unauthorized behavior
2. network failure behavior
3. boundary fallback rendering
4. notification display correctness
5. optimistic mutation rollback behavior (when any mutation path is touched)

## 7. Strict Enforcement Gates (Required)

A task is considered incomplete if any applicable item below is missing:

- Mutation flows include explicit optimistic behavior decision (`used` or `not used with reason`).
- If optimistic behavior is used, rollback/reconciliation path is implemented and verified.
- If the same error pattern appears in multiple surfaces, remediation is centralized (or a documented exception explains why not).
- Validation report includes command evidence and scenario evidence.

## 8. Reporting

Include in final report:

1. Error paths covered
2. User-facing behavior changes
3. Tracking instrumentation status
4. Residual risks and assumptions
5. Optimistic decision (`used` or `not used + reason`) and rollback evidence
6. Global-remediation decision (`centralized` or `local + reason`)
