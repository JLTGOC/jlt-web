# Copilot Workspace Instructions

Follow these project rules for all changes in this workspace.

## Structure

- Keep most code under `src/features` by feature domain.
- Keep shared/common code in:
  - `src/components`
  - `src/hooks`
  - `src/lib`
  - `src/stores`
  - `src/types`
  - `src/utils`

## Feature Shape

- Organize most domain logic inside `src/features/<feature-name>`.
- Typical feature folders (only when needed):
  - `api`
  - `assets`
  - `components`
  - `hooks`
  - `stores`
  - `types`
  - `utils`

## Modularity

- Prefer composable units over monolithic files.
- Extract reusable logic into feature `utils` or `hooks`.
- Extract reusable UI into feature `components`.
- Keep page-level files focused on flow/state orchestration.

## Imports

- Prefer direct imports over barrel files.
- Avoid cross-feature imports.
- Compose features at `src/app` level when combining concerns.
- Maintain unidirectional flow: shared -> features -> app.
- Prefer absolute imports (for example `@/components/...`) when configured.

## Project Standards

- Respect ESLint and Prettier conventions in the repo.
- Prefer TypeScript-first changes; avoid weakening types.
- Keep file and folder names consistent (kebab-case preferred).
- Avoid introducing new barrel files or wide re-export patterns.

## API Placement

- Keep feature-specific API logic under `src/features/<feature>/api`.
- Use a shared/global API module only when contracts are truly cross-feature.

## Mutation Strategy (Optimistic UI First)

- Default to optimistic UI updates for user-triggered mutations whenever server semantics permit it.
- Always define rollback behavior for failed optimistic mutations.
- Keep cache/store synchronization explicit after optimistic writes (React Query invalidation/update, Zustand reconciliation, or equivalent).
- If optimistic updates are intentionally not used, document the reason (for example destructive/high-risk operations, strict server sequencing, or compliance constraints).

## Global Remediation Bias

- When a defect/pattern appears reusable across screens or features, prefer fixing it in shared abstractions before local call-site patching.
- For repeated logic, move behavior into feature/shared utilities, hooks, or centralized API policies instead of duplicating fixes.
- Treat local-only fixes as an exception and briefly justify why broader remediation is not practical.

## Quotations Feature

- Keep preview/PDF derivations consistent by sharing utility logic.
- Filter out empty charge rows and empty billing sections for document outputs.
- Keep billing validation aligned with output rendering rules.

## Error Handling

- Centralize API error policies through a shared client/interceptor.
- Use localized React error boundaries to contain runtime failures.
- Ensure user-facing error messages are actionable and do not leak internals.
- Track production errors and ensure source maps are available for debugging.

## Security

- Client-side checks improve UX, but server-side authorization remains mandatory.
- Document token storage tradeoffs (in-memory vs localStorage vs HttpOnly cookies).
- Sanitize untrusted content before rendering.
- Enforce both route-level and action-level authorization checks.

## Performance

### Code Splitting

- Prefer route-level lazy loading for non-critical screens/components.
- Avoid over-splitting into many tiny chunks.
- Balance startup speed and request count.

### State and Rendering

- Keep state close to usage.
- Avoid one large state object for unrelated concerns.
- Use lazy state initializers for expensive computation:

```ts
const [state, setState] = React.useState(() => expensiveInit());
```

- Prefer `children` composition to isolate unaffected subtrees.
- Use selector-based access for frequently updated shared state.

### Assets and Data

- Lazy-load non-critical images.
- Prefer modern image formats where feasible.
- Use React Query prefetching (`queryClient.prefetchQuery`) for high-confidence navigations.
- Monitor Lighthouse/Core Web Vitals when touching rendering/loading paths.

## State Management (Stack-Specific)

### Component State (React)

- Use `useState` for simple local state.
- Use `useReducer` for complex local transitions.

### Application State (Zustand)

- Use Zustand for shared client-side app state.
- Split stores by domain and use selectors to reduce rerenders.
- Do not mirror server cache state in Zustand.

### Server Cache (React Query)

- Use React Query for all remote data fetching/caching.
- Keep query keys stable and feature/domain-based.
- Co-locate feature query logic in feature `api/` folders.
- Handle invalidation/update paths explicitly after mutations.

### Form State (React Hook Form + Zod)

- Use RHF for form handling and Zod as the validation source of truth.
- Use `zodResolver` where schema validation applies.
- Keep schemas in feature `schemas/` and reuse in form + preview + submission paths.
- Prefer shared form wrappers from `src/components/form`.

### URL State (React Router)

- Use route params/query params for shareable navigational state.
- Keep temporary UI-only state out of URL unless deep-linking is needed.

## Testing

- Default to integration tests for feature behavior; unit tests for pure logic.
- Use Testing Library for user-facing assertions.
- Use Playwright for critical e2e journeys and smoke coverage.
- Use MSW for deterministic API behavior in tests and local development.

## Safety

- Preserve behavior/UI unless explicitly asked to change.
- Make smallest change set possible.
- Verify touched files for TypeScript/lint problems.
- Smallest change set should still prefer centralized/global correction where recurrence risk is non-trivial.
