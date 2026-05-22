# Project Structure Canonical

Use this document as the source of truth for architecture placement and import boundaries.

## Base Layout

Most code should live under src using a feature-first structure:

```sh
src
|
+-- app               # application layer (routes, providers, router composition)
|   +-- routes
|   +-- app.tsx
|   +-- provider.tsx
|   +-- router.tsx
+-- assets            # global static assets (images, fonts, icons)
+-- components        # shared components used across features
+-- config            # global config and env mapping
+-- features          # feature modules (primary domain location)
+-- hooks             # shared hooks
+-- lib               # reusable/preconfigured libraries
+-- stores            # global state stores
+-- testing           # test utilities and mocks
+-- types             # shared TypeScript types
+-- utils             # shared utility functions
```

## Core Principles

1. Keep domain logic inside src/features whenever possible.
2. Keep shared infrastructure in shared folders only.
3. Compose features at src/app level.
4. Prefer direct imports over barrel files.
5. Keep refactors behavior-preserving unless change is explicitly requested.

## Feature Module Shape

A feature can include only what it needs:

```sh
src/features/<feature-name>
|
+-- api         # feature API requests/hooks (preferred default)
+-- assets      # feature-specific static assets
+-- components  # feature-scoped UI
+-- hooks       # feature-scoped hooks
+-- stores      # feature-scoped state
+-- types       # feature-scoped types
+-- utils       # feature-scoped utilities
```

Notes:

1. Not every folder is required for every feature.
2. Add subfolders only when there is real usage.
3. Keep file responsibilities explicit.

## API Placement Options

Default:

1. Place feature-specific API calls in src/features/<feature>/api.

Exception:

1. If many contracts are shared across features, a dedicated shared API module is acceptable (for example src/lib/api or src/api).

## Import and Dependency Rules

Avoid coupling features directly.

Recommended direction:

- Shared -> Features -> App

Allowed:

1. Features import from shared modules.
2. App imports from shared modules and features.

Disallowed:

1. Shared imports from features or app.
2. Feature-to-feature imports unless explicitly approved.

If reuse is needed across features, move the reusable code to a shared module.

## Direct Import Policy

Avoid barrel-file-heavy patterns for feature internals when possible.

Reason:

1. Direct imports are clearer and reduce accidental over-importing.
2. Large barrel patterns can reduce tree-shaking effectiveness and obscure dependencies.

## Absolute Imports

Prefer absolute imports (for example `@/components/...`) when configured. This keeps paths stable during moves and avoids deep relative traversal.

## Naming Conventions

Keep file and folder names consistent (kebab-case by default) to reduce cognitive load and simplify navigation.

## ESLint Enforcement

Use import/no-restricted-paths zones to enforce:

1. cross-feature import restrictions,
2. unidirectional architecture between shared, features, and app.

See [ESLint boundary zones](./eslint-boundary-zones.md) for concrete examples.

## Scalability Outcome

This structure improves:

1. maintainability,
2. team collaboration,
3. ownership clarity,
4. portability to frameworks like Next.js, Remix, and React Native.
