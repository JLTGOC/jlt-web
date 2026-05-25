# Performance Checklist

Use this checklist to execute and verify optimizations consistently.

## 1. Scope and Baseline

- Define the affected route/component and user-visible symptom.
- Capture at least one baseline metric before changes (for example LCP, INP, TBT, route load time).
- Classify optimization type: route split, rerender reduction, data latency, or media loading.

## 2. Route Loading

- Non-critical route/screen is lazily loaded.
- Splitting strategy avoids excessive tiny chunks.
- Suspense/loading UX remains acceptable.

## 3. Component and State

- State is localized where possible.
- Large unrelated state blobs are not introduced.
- Expensive state initialization uses lazy initializer function.
- High-frequency shared state uses selectors.
- Context is not used as default for high-velocity state.
- `children` composition considered where it isolates stable subtrees.

## 4. Styling and Rendering Cost

- Runtime-heavy styling was avoided for performance-sensitive updates.
- Any memoization/composition changes are justified by rerender profile evidence.

## 5. Assets and Images

- Off-screen images are lazy-loaded.
- Modern formats considered (WebP/AVIF where feasible).
- Responsive image sizing (`srcset`, width hints) considered for large media.

## 6. Data Prefetching

- Prefetch added only for high-confidence navigation paths.
- Query key is stable and domain-based.
- Prefetch scope does not create unnecessary network pressure.

## 7. Mutation Responsiveness and Consistency

- For user-triggered mutations, optimistic UI is used by default when server semantics permit.
- Rollback path is defined for optimistic failure.
- Cache/store reconciliation prevents stale or flickering post-error UI.
- If optimistic UI is not used, an explicit reason is documented.

## 8. Validation and Reporting

- Run required project validation commands for touched scope.
- Confirm no behavior regressions in affected flows.
- Capture after-change metrics for the same baseline category (LCP/INP/TBT, route load, bundle size).
- Record what changed, measured impact, and remaining tradeoffs.
- Record whether remediation was centralized or local, with rationale.

## 9. Strict Enforcement Gates (Required)

A task is considered incomplete if any applicable item below is missing:

- Baseline metric and post-change evidence are provided for optimization tasks.
- Mutation flows include optimistic decision evidence and rollback/reconciliation verification.
- Repeated performance pattern is fixed in shared/global abstraction when practical (or exception documented).

## Suggested Report Format

1. Problem and baseline metric
2. Optimization applied
3. Validation evidence (commands, screenshots, metrics)
4. Mutation/global-remediation decisions and evidence
5. Outcome and residual risk
