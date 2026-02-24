# Migrate Move Components (Library Consumer)

**Audience:** Developers using Move in their app.
**When:** After upgrading the Move dependency to a newer version.
**What it does:** Reads `MIGRATIONS.json`, compares old vs new version, scans the consumer's code for affected components, and outputs a tailored upgrade checklist.

You are helping a user upgrade their project to a newer version of the Move component library.

## Steps

1. **Determine the user's current version.** Check their `package.json` for the `move` dependency version. If it's a `file:` link (local dev), ask what version they're upgrading from.

2. **Read the migration files.** List all files in `node_modules/move/migrations/`. Each file is named `{version}.json` and contains a `changes` array.

3. **Determine the target version.** Read `node_modules/move/package.json` for the installed version. This is the target.

4. **Collect all changes between current and target.** Read each version file where the version is greater than the user's current version and up to/including the target. Combine all `changes` arrays.

5. **Scan the user's codebase.** For each affected component, search the user's code (imports, JSX usage) to determine if they actually use that component.

6. **Generate a migration report.** Output a checklist grouped by component:

```
## Migration: v{from} → v{to}

### {ComponentName}
- **Type:** {breaking | deprecation | prop-renamed | prop-removed | prop-added | fix | enhancement}
- **What changed:** {summary}
- **Action:** {migration instructions}
- **Affected files:** {list of user's files that import/use this component}

### {NextComponent}
...

### No action needed
- {ComponentName}: {summary} (no breaking change)
```

7. **For breaking changes**, offer to apply the migration automatically if the change is mechanical (e.g., prop rename). Ask before making changes.

## Change types

| Type | User action needed? |
|------|-------------------|
| `breaking` | Yes — code will break without changes |
| `prop-renamed` | Yes — find and replace old prop name |
| `prop-removed` | Yes — remove usage of deleted prop |
| `deprecation` | Not yet — but should plan to migrate |
| `prop-added` | No — new optional prop available |
| `enhancement` | No — improved behavior, backwards compatible |
| `fix` | No — bug fix, backwards compatible |

## Rules

- Only report components the user actually uses
- Group "no action needed" items separately so the user can focus on what matters
- Be specific about file paths and line numbers when showing affected files
- For mechanical changes (renames), offer a concrete find-and-replace
