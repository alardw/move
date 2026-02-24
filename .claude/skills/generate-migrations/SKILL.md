# Generate Migration Entries (Library Developer)

**Audience:** You, the Move library developer.
**When:** Before running `npm run pack` to release a new version.
**What it does:** Analyzes git diffs since the last release, detects component changes, and writes `migrations/unreleased.json`. The pack script will fail without this file.

You are an agent that analyzes component changes since the last release and writes structured migration entries to `migrations/unreleased.json`.

---

## How to Run

**Input:** No arguments needed. The agent determines everything from git history and source files.

**Output:** Creates or updates `migrations/unreleased.json` with all detected changes.

---

## Step 1: Determine the baseline

Find the last released version by listing `migrations/*.json` (excluding `unreleased.json`):
- The file with the highest version number is the baseline (e.g. `migrations/0.2.0.json`).
- If no version files exist, use the version in `package.json` as the baseline — this means everything since the last pack is unreleased.

Then find the corresponding git state:
- Run `git log --oneline` to understand the commit history.
- Run `git diff --name-only HEAD~N` (adjust N based on commits since last release) to get all changed files. If version tags exist, use `git diff --name-only v{version}..HEAD`.
- Filter to only files under `src/components/`, `src/styles/`, and `src/animation/`.

---

## Step 2: Identify affected components

For each changed file under `src/components/{category}/{ComponentName}/`:
- Group changes by component name.
- Track which files changed: `.tsx`, `.module.css`, `index.ts`, hooks (`use*.ts`).

Also check for cross-cutting changes:
- `src/styles/themes/` — theme token changes affect all themed components.
- `src/styles/tokens/` — design token changes can affect any component.
- `src/animation/` — animation system changes affect animated components.
- `src/engine/` — factory changes affect all components.

---

## Step 3: Analyze each component's changes

For each affected component, run `git diff` on its files and categorize the change:

### Props analysis (`.tsx` files)
- **Read the current interface** and compare with the git diff.
- Look for:
  - Added props → type: `prop-added`
  - Removed props → type: `prop-removed`
  - Renamed props → type: `prop-renamed`
  - Changed prop types → type: `breaking`
  - Changed default values → type: `enhancement` or `breaking` (if behavior changes)

### CSS analysis (`.module.css` files)
- Look for:
  - New CSS custom properties → type: `enhancement`
  - Removed CSS custom properties → type: `breaking`
  - Renamed CSS custom properties → type: `breaking`
  - Changed default values of custom properties → type: `enhancement`
  - Layout changes (display, position, overflow, flex) → type: `fix` or `breaking`
  - New selectors/slots → type: `enhancement`
  - Removed selectors/slots → type: `breaking`

### Export analysis (`index.ts`, `src/index.ts`)
- New exports → type: `prop-added` or `enhancement`
- Removed exports → type: `breaking`
- Renamed exports → type: `breaking`

### Hook analysis (`use*.ts`)
- Changed return type → type: `breaking`
- Changed options → applies same rules as props

---

## Step 4: Classify each change

Use these types:

| Type | Meaning | User action? |
|------|---------|-------------|
| `breaking` | Code will break without changes | Yes |
| `prop-renamed` | A prop was renamed | Yes — find/replace |
| `prop-removed` | A prop was deleted | Yes — remove usage |
| `prop-added` | A new optional prop is available | No |
| `deprecation` | Still works but will be removed | Plan for it |
| `enhancement` | Improved behavior, backwards compatible | No |
| `fix` | Bug fix, backwards compatible | No |

### Rules for classification
- If the change is internal-only (refactor, code style) and doesn't affect the public API or visual output → **skip it**, don't add an entry.
- If a CSS custom property default changes but the property itself still exists → `enhancement` (users who override it are unaffected).
- If overflow, layout, or positioning changes → `fix` if it corrects a bug, `breaking` if it changes intended behavior.
- If a component gains a new sub-component → `enhancement`.
- If a component loses a sub-component → `breaking`.

---

## Step 5: Write to migrations/unreleased.json

Create or update `migrations/unreleased.json`:

```json
{
  "changes": [
    {
      "component": "Dialog",
      "type": "fix",
      "summary": "Body overflow no longer clips focus outlines",
      "details": "Added 3px padding + negative margin to .body so focus rings are not clipped by overflow:auto.",
      "migration": "No action needed. If you override Dialog.Body margin via pt, account for the -3px vertical margin."
    }
  ]
}
```

The pack script will add `version` and `date` fields and rename this to `migrations/{version}.json`.

### Entry format rules
- `component`: PascalCase component name (e.g. `"Dialog"`, `"InputText"`, `"RadioGroup"`)
- For cross-cutting changes (themes, tokens, engine), use `component: "ThemeProvider"`, `component: "Engine"`, or `component: "Tokens"` as appropriate.
- `summary`: One sentence, present tense, describes what changed from the user's perspective.
- `details`: Technical explanation of what was changed internally. Optional for simple changes.
- `migration`: What the user needs to do. Use `"No action needed."` for non-breaking changes. Be specific for breaking changes — include old/new prop names, code examples.

### Merging rules
- If `migrations/unreleased.json` already exists, **merge** new findings into its `changes` array — don't replace.
- If a component already has an entry for the same change, update it rather than duplicating.
- Keep entries sorted: `breaking` first, then `prop-renamed`, `prop-removed`, `deprecation`, `prop-added`, `enhancement`, `fix`.

---

## Step 6: Output summary

After writing, output a summary table:

```
## Unreleased Migration Entries

| Component | Type | Summary |
|-----------|------|---------|
| Dialog | fix | Body overflow no longer clips focus outlines |
| Button | prop-renamed | `variant="ghost"` renamed to `variant="text"` |

Breaking changes: 1
Non-breaking changes: 1
```

---

## Important

- **Be conservative with `breaking`** — only use it when user code will actually fail or produce wrong output.
- **Don't create entries for internal refactors** that don't change the public API or visual output.
- **When in doubt about classification**, err on the side of documenting it — it's easier to remove an entry than to miss a breaking change.
- **Always read the actual diff** — don't guess based on file names alone.
