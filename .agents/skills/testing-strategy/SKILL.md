---
name: testing-strategy
description: "Design and enforce an integration-first testing strategy using Vitest, Testing Library, Playwright, and MSW. Use whenever a task mentions tests, regressions, reliability, QA coverage, integration tests, e2e checks, or user-flow validation, even if only implied."
argument-hint: 'Provide scope and strictness, for example: "quotations billing standard" or "auth login strict"'
---

# Testing Strategy

## Purpose

Apply a repeatable testing workflow that prioritizes confidence in real behavior through integration and end-to-end coverage, while still using unit tests where they provide strong value.

## Use This Skill When

- Adding a new feature and defining test coverage.
- Fixing a bug and adding regression tests.
- Refactoring existing code with behavior-preserving checks.
- Improving confidence in user flows across route, API, and UI boundaries.
- Deciding whether to use unit, integration, or e2e for a given risk.

## Standards Library

Use these references as the source of truth while executing this skill.

1. Testing principles and tooling guidance: [testing guidelines](./references/testing-guidelines.md)
2. Step-by-step execution and validation: [testing checklist](./references/testing-checklist.md)
3. Existing repository test baseline: `tests/quotations/`

## Workflow

1. Define the risk first: what user behavior could fail?
2. Select the lowest-cost test level that still proves the behavior; default to integration before unit-only coverage.
3. Add unit tests for isolated complex logic and shared utilities.
4. Add integration tests for feature flows and component-to-component/API interaction.
5. Add e2e tests for critical journeys that must work in production-like conditions.
6. Use API mocking through MSW when backend contracts are unavailable or when deterministic test control is required.
7. Prefer Testing Library queries that reflect user intent (role/text/label) over implementation details.
8. For mutations, test optimistic UI paths explicitly: immediate UI update, rollback on failure, and eventual cache/state reconciliation.
9. Prefer testing shared/global fixes when behavior spans multiple surfaces; avoid regression tests that only validate one local instance of a repeated pattern.
10. Run targeted tests first, then broader test suites.
11. Report what is covered, what remains untested, and why.

## Operating Modes

1. Quick pass: add focused regression tests for a localized change.
2. Standard pass: add or update integration coverage plus targeted unit tests.
3. Strict pass: include critical e2e coverage and full validation gates.

## Non-Negotiables

- Prefer behavior-focused assertions over implementation-detail assertions.
- Prioritize integration and e2e coverage for user-critical flows.
- Keep unit tests for reusable logic, shared functions, and hard-to-reason transformations.
- Avoid brittle tests that depend on internal state shape when UI behavior is the real contract.
- Keep tests deterministic and isolated from external network flakiness.
- Mutation-related tests must verify optimistic success, optimistic failure rollback, and post-error consistency.
- When a fix is intentionally global, regression coverage must include at least two representative consuming surfaces or one shared abstraction test that proves cross-surface effect.
