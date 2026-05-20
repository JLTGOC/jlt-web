# ESLint Boundary Zones

Use this reference to enforce project structure rules with import/no-restricted-paths.

## Cross-Feature Import Restrictions

Block feature-to-feature imports so each feature stays independent.

```js
"import/no-restricted-paths": [
  "error",
  {
    zones: [
      {
        target: "./src/features/auth",
        from: "./src/features",
        except: ["./auth"],
      },
      {
        target: "./src/features/comments",
        from: "./src/features",
        except: ["./comments"],
      },
      {
        target: "./src/features/discussions",
        from: "./src/features",
        except: ["./discussions"],
      },
      {
        target: "./src/features/teams",
        from: "./src/features",
        except: ["./teams"],
      },
      {
        target: "./src/features/users",
        from: "./src/features",
        except: ["./users"],
      },
    ],
  },
];
```

## Unidirectional Architecture Rules

Enforce Shared -> Features -> App flow.

```js
"import/no-restricted-paths": [
  "error",
  {
    zones: [
      // App can import from features, but features cannot import from app
      {
        target: "./src/features",
        from: "./src/app",
      },

      // Shared modules are consumed by features/app, not the other way around
      {
        target: [
          "./src/components",
          "./src/hooks",
          "./src/lib",
          "./src/types",
          "./src/utils",
        ],
        from: ["./src/features", "./src/app"],
      },
    ],
  },
];
```

## Practical Notes

1. Start with strict rules for new modules and phase legacy code in gradually.
2. Keep exceptions explicit and minimal.
3. Prefer moving shared logic to shared folders instead of expanding exceptions.
4. Re-run lint after every zone update to catch regressions quickly.
5. If using absolute import aliases, mirror the same restrictions for aliased paths.
