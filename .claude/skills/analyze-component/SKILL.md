# Component Analysis Agent

Research how existing UI libraries implement a component, then propose a Move migration plan.

---

## How to Run

**Input:** A component name or description (e.g. "ColorPicker", "layout helpers like Stack and Grid").

**Two stages:**
1. **Research report** — Compare up to 5 libraries, output a feature matrix and recommendations. Always runs first.
2. **Migration plan** — Only after the user approves stage 1. Concrete plan ready for `/migrate-component`.

---

## Stage 1: Research Report

### Efficiency Rules

- **Max 5 libraries total** (3 baseline + up to 2 specialists)
- **No parallel research agents** — do all research inline with web search
- **One web search per library** — fetch the component's doc page, extract what's needed, move on
- **Skip obvious stuff** — don't research RTL, bundle size, dependencies unless specifically relevant
- **Keep it shallow** — props table + one minimal code snippet per lib is enough

### 1.1 Libraries to Check

**Baseline (pick the 3 most relevant):**

| Library | When to include |
|---------|----------------|
| Radix UI | Component has accessibility/interaction complexity |
| shadcn/ui | Component is common (Button, Dialog, etc.) |
| Mantine | Component needs rich props/variants |
| Chakra UI | Component is a layout or style primitive |
| MUI | Component needs enterprise-level features |

**Specialists (up to 2):** Only include if the component has a clearly better dedicated library (e.g. TanStack Table for data grids, react-day-picker for calendars, cmdk for command palettes). Skip specialists for generic components.

### 1.2 What to Capture Per Library

Just these 3 things:

1. **Props table** — name, type, default (skip obvious HTML pass-throughs)
2. **Composition** — monolithic or compound? What sub-components?
3. **Standout feature** — one thing this lib does better than others

### 1.3 Output Format

```markdown
## {ComponentName} — Library Analysis

### Quick Comparison

| | Lib A | Lib B | Lib C | Specialist |
|---|---|---|---|---|
| **Props** | gap, align, justify | gap, direction, wrap | spacing, cols | ... |
| **Compound** | No | No | Grid + Grid.Col | ... |
| **Standout** | grow mode | responsive props | container queries | ... |

### Props Detail

#### Lib A — {name}
| Prop | Type | Default |
|------|------|---------|
| gap | spacing token | 'md' |
| ... | ... | ... |

```tsx
<Stack gap="md" align="center">
  <Child />
</Stack>
```

(repeat for each lib — keep it brief)

### Recommendations for Move

1. **Components to build:** List with one-line descriptions
2. **Props consensus:** Which props appear across most libs
3. **Composition:** Compound vs monolithic recommendation
4. **Animation:** What needs motion (if anything)
5. **Key decisions:** Anything that needs user input
```

---

## Stage 2: Migration Plan

Only after user approves stage 1.

### Output Format

```markdown
## {ComponentName} — Migration Plan

### Classification
- **Category:** {category}
- **Pattern:** A/B/C/D

### Sub-components (if compound)
| Name | Slots | Description |
|------|-------|-------------|
| Root | root | ... |

### Props
| Prop | Type | Default | moveProps/defaults | Description |
|------|------|---------|-------------------|-------------|
| ... | ... | ... | ... | ... |

### CSS Tokens
- `--move-{component}-*` list

### Animation
- Hook + what animates (or "none")

### Files
| File | Description |
|------|-------------|
| `src/components/{cat}/{Name}/{Name}.tsx` | Component |
| `src/components/{cat}/{Name}/{Name}.module.css` | Styles |
| `src/components/{cat}/{Name}/index.ts` | Exports |
| `demo/src/demos/{Name}Demo.tsx` | Demo |

### Demo Examples
1. Usage — minimal
2–5. Feature examples (list titles)
```

---

## Important Notes

- Use the correct Move animation type names: `ElementAnimate`, `ContentAnimate`, `IndicatorAnimate`, `LayerAnimate`, `PopupAnimate`
- Reference Move conventions from the migrate-component skill
- If analyzing multiple related components (e.g. "layout helpers"), produce one report covering all of them, then one migration plan per component
- Don't over-research — the goal is informed decisions, not exhaustive documentation
