---
name: performance-optimization
description: "Optimize React/Vite performance: route-level code splitting, state/render tuning, image delivery, Web Vitals, and TanStack Query prefetching. Use whenever a task mentions slow pages, rerenders, bundle size, Lighthouse/Core Web Vitals, loading latency, or perceived sluggish UI, even if it is only a hint."
argument-hint: 'Provide scope and strictness, for example: "quotations viewer quick" or "dashboard strict"'
---

# Performance Optimization

## Purpose

Apply a repeatable workflow for performance tuning in this repository, with emphasis on route-level loading, render stability, and data-fetch efficiency.

## Use This Skill When

- A route or page feels slow to load.
- Components rerender too frequently.
- State shape or context usage appears to trigger broad updates.
- Bundle size, image loading, or Web Vitals need improvement.
- You want proactive prefetching on high-confidence navigation flows.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Practical guidance and examples: [performance guidelines](./references/performance-guidelines.md)
2. Execution and verification checklist: [performance checklist](./references/performance-checklist.md)
3. Existing route-level lazy loading reference: `src/app/router.tsx`

## Workflow

1. Identify the bottleneck category first: route load, rerenders, network/data latency, or media delivery.
2. Capture a baseline metric when applicable (LCP/INP/TBT, route load time, bundle size).
3. Apply the smallest high-impact change first (route split, state relocation, selector use, targeted prefetch).
4. Avoid broad rewrites; keep architecture boundaries intact.
5. For mutation-heavy interactions, prefer optimistic UI to reduce perceived latency and tune reconciliation to avoid jittery rerenders.
6. Re-check affected flows for behavioral regressions (including optimistic rollback and stale-cache correction paths).
7. Validate with lint/tests and collect measurable evidence (Lighthouse/PageSpeed/Core Web Vitals when applicable).

## Operating Modes

1. Quick pass: one focused optimization and local validation for low-risk updates.
2. Standard pass: route/state/data checks plus targeted validation.
3. Strict pass: end-to-end pass with metrics before/after and explicit tradeoff notes.

## Non-Negotiables

- Prefer route-level code splitting for non-critical screens.
- Avoid over-splitting into many tiny chunks.
- Keep state close to usage and avoid giant state objects.
- Prefer selector-based access for frequently updated shared state.
- Use `children` composition when it isolates unaffected subtrees.
- Prefer low-runtime-cost styling strategies for performance-sensitive paths.
- Use image lazy loading and modern formats where practical.
- For eligible user-triggered mutations, optimistic UI is the default to improve responsiveness.
- If the same performance issue appears across multiple areas, prioritize shared/global remediation over repeated local micro-fixes.
