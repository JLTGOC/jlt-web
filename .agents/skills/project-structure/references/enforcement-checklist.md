# Structure Enforcement Checklist

Use this checklist for any implementation, refactor, or review touching architecture and folder boundaries.

## 1. Intake and Scope Mapping

1. List touched files.
2. Tag each as shared, feature, or app layer.
3. Identify whether any files are misplaced based on layer intent.
4. Confirm whether behavior changes are expected.

## 2. Folder Placement

1. Domain logic lives in src/features/<feature> unless truly shared.
2. Shared code is placed only in shared folders (components, hooks, lib, stores, types, utils).
3. App composition remains in src/app.
4. Page/container files focus on orchestration; reusable logic is extracted.

## 3. Feature Shape

1. Feature folder includes only required subfolders (api, assets, components, hooks, stores, types, utils).
2. No unnecessary empty feature subfolders are introduced.
3. Types and utils remain close to the feature unless broadly reused.

## 4. API Placement

1. Feature-specific API declarations live in src/features/<feature>/api by default.
2. Shared API modules are used only when contracts are truly cross-feature.
3. API placement choice is documented when exceptions are made.

## 5. Import Boundaries

1. Shared modules do not import from features or app.
2. Features do not import from sibling features unless explicitly approved.
3. App may import from shared and features.
4. Direct imports are preferred over barrel-file indirection.
5. Absolute imports are used consistently when configured.
6. Dependency direction remains Shared -> Features -> App.

## 6. ESLint Architecture Rules

1. import/no-restricted-paths zones reflect cross-feature restrictions.
2. import/no-restricted-paths zones reflect unidirectional flow restrictions.
3. Rules are scoped to avoid blocking valid existing imports unintentionally.

## 7. Safety and Verification

1. Patch size remains minimal and avoids unrelated format churn.
2. Existing behavior is preserved unless change is explicitly requested.
3. Validation commands are run according to scope.
4. File and folder naming remains consistent with project conventions.

## 8. Evidence Recording

1. Mark each section as pass or fail.
2. Record one concrete reason for each fail item.
3. Record exact command evidence for validation gates.
4. If skipping a required gate, record rationale and risk.

## 9. Optimistic Mutation Placement

1. Mutation orchestration is implemented in reusable hooks/API/store abstractions when shared behavior exists.
2. Rollback/reconciliation logic is colocated with mutation abstraction, not duplicated across pages.
3. If optimistic UI is not used for a touched mutation flow, exception rationale is documented.

## 10. Global Remediation Requirement

1. Repeated issue patterns are fixed at shared/global ownership level when feasible.
2. Local-only patches include explicit reason for not centralizing.
3. New shared abstraction placement still respects Shared -> Features -> App direction.

## 11. Strict Enforcement Gates (Required)

A task is considered incomplete if any applicable item below is missing:

1. Boundary and placement sections pass for touched files.
2. Mutation placement/rollback decision is documented for touched mutation flows.
3. Global-vs-local remediation decision is documented with rationale.
4. Required validation gates are executed or skipped with explicit risk notes.
