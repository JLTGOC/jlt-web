# Error Handling Guidelines

Use this guide to make error behavior consistent across transport, UI, and observability layers.

## Core Principle

Good error handling should do three things at once:

1. protect user experience,
2. preserve secure application state,
3. provide enough telemetry to debug production issues quickly.

## API Errors

Centralize API failure behavior in client interceptors.

Typical interceptor responsibilities:

- Normalize backend error payloads to a consistent app shape.
- Trigger user notifications for actionable failures.
- Handle authentication failures (for example 401 session invalidation).
- Optionally trigger token-refresh flow before failing requests.
 - Map error status classes to consistent app-level categories (validation, auth, system).

Guidance:

- Keep transport-level concerns in the API client, not scattered in features.
- Avoid duplicating identical error toasts in multiple call sites.
- Do not expose raw stack traces or sensitive server details to users.
 - Prefer a single notification policy (toast/banner) per error class to avoid noise.

Repository baseline:

- src/lib/api/client.ts already includes request and response interceptors.
- src/app/provider.tsx configures notification rendering via Mantine Notifications.
- src/app/routes/auth/LoginPage.tsx demonstrates user-facing error notification on mutation failure.

## In-App Errors

Use React error boundaries to contain render-time exceptions.

Recommended boundary strategy:

- Keep at least one high-level boundary for app safety.
- Add feature or route-level boundaries around risky or isolated surfaces.
- Prefer multiple localized boundaries over a single app-wide boundary only.

Boundary fallbacks should:

- explain that part of the UI failed,
- offer recovery actions (retry, refresh section, navigate away),
- keep unaffected areas usable.

## Error Tracking

Track production errors with a dedicated tool such as Sentry.

Minimum tracking expectations:

- capture uncaught exceptions and unhandled promise rejections,
- include release and environment metadata,
- include browser/platform context,
- include source maps in releases so stack traces map to source code.
 - validate that sourcemaps are uploaded for production builds.

Operational guidance:

- prioritize alerts for user-facing breakages and auth-flow failures,
- deduplicate noisy issues,
- annotate known non-actionable errors.

## Practical Error Taxonomy

Define and use clear categories:

- User errors: invalid input or recoverable action errors.
- Domain errors: business rule failures.
- System errors: network, timeout, service unavailable.
- Security errors: unauthorized/forbidden and session invalidation.
- Unknown errors: unexpected exceptions requiring telemetry triage.

Map each category to:

1. user message,
2. retry policy,
3. logging/tracking level,
4. fallback UI behavior.
