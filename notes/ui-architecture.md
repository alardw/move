# Move UI Architecture — Fundamental Discussion

> A synthesis of a long working session (2026-07-18 → 19) between Alard (UX designer + FE
> developer, 37 yrs) and Claude (Opus 4.8). It records *why* Move is shaped the way it is —
> the reasoning, the reversals, and the division of labor — so the thinking survives past any
> single session. This is design rationale; it deliberately lives in `notes/`, not the
> user-facing docs (house rule: docs describe *what*, never *why*).

---

## 0. The arc, in one line

We started concluding the **design pattern** was probably the wrong thing to build, and ended
concluding it is the *right* thing — but only once its *purpose* was reframed. Same artifact,
transformed understanding: not a **cage that prescribes composition** (wrong) but a
**clamp-engine that guarantees works-and-adjusts** (right). You cannot tell which one you have
by reading the file — only by knowing what it is *for*.

---

## 1. The problem

AI is excellent at building UI until the demo has to become a product. The gap is structural,
and it has two faces:

- **"Off"** — generated screens don't look nice; they feel unbalanced.
- **Drift** — solution X on page A, a different solution Y for the same function on page B.
  The AI is "good at lookups, bad at consistent invention: each prompt re-decides instead of
  reusing." This is externally documented — see the repo's own `what-ai-gets-wrong` page and
  its CHI-2026 citation: *"consistency holds within a screen but breaks across screens."*

Drift is the deeper problem, and it is a **theorem, not a risk**: AI generation is **stateless
across invocations**, so re-deciding (and diverging) is the *default*. You can only reuse a
decision that was recorded as a referenceable object. Every alternative (pass-context, critic,
shared component) reduces to *make it explicit*.

## 2. The thesis

> **The product is not a screen generator. It is a commitment keeper.**
> The job is cross-*experience* consistency — "the same function looks and behaves the same
> everywhere it appears" — not the quality of a single screen. Value scales with the *size* of
> the experience, not the complexity of the screen. Move is the **AI-era design system**: the
> persistence layer that lets generation N+1 bind to generation N's choice.

## 3. "Off" is three problems, not one

| Problem | Layer | Fixed by |
|---|---|---|
| flat shell, weak type, tight spacing | **Defaults** | tokens / components — *no patterns* |
| wrong solution for the function | **Structure** | patterns (checkable) |
| contrast, balance, "feel" | **Taste** | not a spec — a constrained engine + a human eye |

Patterns only address the middle. Chasing "more patterns" never fixes defaults or taste.

## 4. The layered model

A screen = **Structure × Register × Content × Theme × Behavior**. These were wrongly fused in
the old `useCase` driver.

- **Structure** = patterns (which solution).
- **Register** = the *taste levers* (density, emphasis text↔visual, surface-weight flat↔framed,
  scale-contrast) — an app-level seed, like a theme seed but for space/information.
- **Content** = the adapter / data shape — always consumer-supplied, the one irreducible input.
- **Theme** = colour / type / radius (`defineThemes`).
- **Behavior** = state / feedback (pending/error/empty/ready).

## 5. What a design pattern IS — the reversal

The key move. A design pattern is **not a prescription** (that would produce the *Bootstrap
effect* — every app looking the same). It is the **compositional analog of the theme builder**:

- **`defineTheme` works because the constraint is enforced in code, not left to judgment.** It
  *clamps* to WCAG AA and derives the ramp perceptually, so a broken/inconsistent theme is
  **inexpressible**. That guarantees a **floor** (valid + internally consistent) and leaves a
  **wide opportunity space** (hue, chroma, font) — variety without sameness. It does not
  eliminate taste; it **relocates** it: from "hand-pick every colour and probably fail" to
  "choose a seed in a space where you can't produce something broken."
- **A design pattern is this, for composition.** Its **axes = the levers** (the choices —
  filter?, arrangement?, density?). Its **bindings + heuristics = the clamps** (the rules that
  make any lever setting resolve to something that *works*).
  - Example (Alard's): "Do you need filtering?" is the *lever*. "If so, put it above the data,
    fixed so it's always available" is the *clamp* — a filter that scrolls away is *broken*;
    above-the-data-and-fixed *works*. That is the compositional equivalent of the AA clamp.

**The honest target is `works + internally-consistent + cheap-to-change`, NOT `beautiful`.**
Beauty is subjective — there is no universal truth — so aiming a *system* at it is a category
error. "Not-so-nice but works and changes in one lever" beats "someone's idea of nice, baked
in." The engine guarantees the **floor**; the human's lever choice sets the **direction**;
neither can produce something broken.

### Consequence for the failure class

Most AI "off" errors are **floor violations** (broken composition), not ceiling misses (merely
not-optimal). The accent rule that stops at the quote and orphans the attribution is the
compositional equivalent of failing AA — the accent should frame the semantic *unit*. An engine
that **encodes** such rules makes those failures *inexpressible*, the same way an off-AA colour
is. So the work is **hardening heuristics into encoded clamps**, not authoring taste. The
heuristics come in strengths: `checkable: true` (a real clamp, guaranteed floor) vs
convention/guidance (soft). The floor is only as strong as how many are the first kind.

## 6. The commitment machinery

- **A pattern (definition):** named **role** + **port** + an *open* decision space
  (axes · bindings · heuristics). **A composite (commitment):** that pattern with decisions
  *closed*, adapter-bound, named. **App ledger:** `role → committed instance`; consistency =
  every occurrence of a role binds to the same instance.
- **Roles are addressed by a signature, not open text:** `role = verb × object-shape × scope`.
  - **verb** — small closed set, tiered: *primary* (find/consume/act/create/navigate/authenticate),
    *ambient* (orient/status/notify), *mechanic* (disclose/select).
  - **scope** — closed (app/page/region/item). **object-shape** — the only open dim, adapter-defined.
- **Borrow the dictionary, build the grammar.** Vocabulary is largely standardised: **ARIA
  landmarks** (scope), **schema.org types + `Action`** (object + verb), **WAI-ARIA APG** (the
  interaction-pattern catalogue). The commitment/consistency layer is ours; it doesn't exist yet.
- **Delegation is the consistency machinery** — a shared child commitment (the tile) enforces
  sameness across every parent context. **Register is the *allowed variation within* a
  commitment** (home grid vs up-next list = same role); a different role-binding for the same
  signature = drift.

## 7. Lifecycle: seeded + emergent

Seed the head of the market top-down; grow the tail bottom-up by **extraction**. **Cloning a
real product = patterns IN** (extraction); **greenfield = patterns OUT** (instantiation).
Commitments must **self-report as a byproduct of building**; the ledger is *derived by
indexing*, never hand-authored. Structure accretes with recurrence (loose tag first →
axis-keyed after extraction).

## 8. No ground truth — surface, don't resolve

Role-granularity ("is B the same function as A?") has **no objectively-correct answer** — expert
humans can't cleanly call it either. So the human is a **decider** (makes it true by committing),
not an **oracle** (knows the answer); the ledger **legislates** consistency, it doesn't discover
it. Therefore: consistency-of-the-choice beats correctness-of-the-choice; record the **rationale**
(precedent), not just the verdict; don't force binary (graded: identical → same+register-variance
→ shared-parent/divergent-slot → distinct); **default lean = bias-to-merge** (a split must
justify itself). The matcher **surfaces near-misses** for a human; it never silently guesses.

## 9. The capability boundary (the human ↔ AI division)

This is the load-bearing conclusion — arrived at from both directions (Alard's read of the AI's
capability = the architecture derived independently).

- **The AI is good at:** breadth (millions of interfaces, W3C, libraries), tireless retrieval,
  running oracles/forcing-functions, **propagating a pattern across scale (consistency)**, being
  wrong out loud and reframing fast.
- **The AI is NOT good at:** taste, **originating** appearance, **evaluating whether a reference
  is good** (it followed Mantine's semantically-wrong info-icon-on-a-quote and couldn't tell),
  reliable fine-proportion perception.
- **Three modes, by reliability:** *originate from scratch* (worst) → *match a single reference*
  (poor — one example radically underdetermines the design; gaps get filled from a bad prior) →
  **extend an established, internally-consistent, *good* corpus in its vein** (the AI's real
  strength — continuation/retrieval = consistency).
- **Screenshots help, bounded.** They convert appearance from *invented-from-prior* into
  *observed structure the AI can match* — but only the **composition** layer (spans, containment,
  hierarchy, placement), never the **refinement** layer (proportion, balance, quality). Necessary,
  not sufficient: even with the Mantine shot in hand, the AI's fix was still off, because
  translation reintroduces un-vetted micro-choices and it can't judge the reference. Useful
  upgrade: **put the AI's own rendered output in the loop** and diff it against the reference at
  the composition level — that self-check reaches floor violations (the border error), not taste.
- **Where taste must enter:** the **primitive** layer (raw CSS, *outside* any enforced engine —
  this is where Quote broke and where a human exemplar earns its keep), and lever-choice /
  final judgment. At the **composite** layer (compose primitives via levers, no custom CSS) the
  AI is *inside* the engine and can't break the floor — that layer gets the parametric treatment,
  not a prescribed sample.

## 10. The oracle principle (everywhere)

Checkable → **oracle**; un-checkable (taste) → **surface for a human**. Rooted in the sharpest
insight: **the AI's invented value feels *identical* to the retrieved one at write-time — there
is no internal "I'm guessing" signal — so the AI cannot self-detect it.** Therefore
precision/consistency can't come from carefulness or "look at the spec"; only an *external*
forcing-function (force retrieval before write) + oracle (fail the invented value) separates
guess from truth. This is why enforcement is structural, not a crutch — and it extends straight
into the visual: floor violations are checkable/encodable; refinement is the residue only a human
can judge.

## 11. Product stance — grammar, not blocks

Move should be the **decision framework (the grammar)**, not a bag of ready-to-use composites.
The AI is already good at the *artifact*; it's bad at the *decision* (drift) — so shipping ready
artifacts solves the non-problem, on shadcn's turf where Move has no moat. The decision layer is
the *empty, unclaimed* layer and Move's moat. Definitions are **distilled from precedent**
(real products + APG + libraries as inspiration, never literal), **AI-assisted + human-curated**.
Ship only a small capped set of reference composites as *proof the frameworks resolve* — never
the headline (the tangible thing tempts over-investment → Move degrades into another component
library). Grammar is less tangible → harder go-to-market; that's the price of owning the layer
that actually solves the problem.

## 12. The operating setup (the division, made operational)

- **Taste enters at a bounded set of seed points, and they are the human's:** the register/levers,
  the primitive exemplars (raw CSS), vetting which references deserve matching, the final "does it
  sing." Finite, high-leverage.
- **The AI runs inside the clamps:** propagate patterns, run oracles + forcing-functions, hold the
  commitment ledger, do the tireless breadth.
- **The pipeline routes on one question:** am I *extending* an exemplar (AI proceeds) or
  *originating* appearance (route to the human)? That single detection is the whole division.
- **Rendered output goes back in the loop** for composition-level self-check.
- The **ceiling** stays human; the AI **raises the floor and carries the consistency**.

## 13. What to build next (the translation-into-something-that-works)

1. **Harden heuristics into encoded clamps** so the floor is guaranteed, not hoped (start:
   turn the `checkable:false` structural rules — F33/F34/H4 class — into oracles).
2. **Register-as-composition-engine** — the levers + a derivation that yields internally
   consistent spacing/type/hierarchy/proportion (the theme-builder-for-layout).
3. **The app-level ledger** — add a `role`/`signature` projection to `CompositeSpec`; realize the
   `app` scope (`CompositeScope` lacks `shell`).
4. **Tasteful primitive exemplars**, human-seeded, at the raw-CSS layer.
5. **`component-analyze` gathers screenshots**, not just prop tables — render and *look* first, so
   composition is retrieved, not guessed; flag refinement as a human-review axis.
6. **Extend/originate routing + rendered-output-in-loop** across the pipeline.

## 14. Confidence stratification

- **Carved in stone:** stateless-gen → drift → explicit-commitments-necessary; product = commitment
  keeper; "off" = defaults + structure + taste; content = irreducible input; Structure/Register/
  Content are genuinely distinct; the capability boundary (AI propagates, human originates/vets).
- **Weaker (right direction, single-example specifics):** `role = verb × object × scope` (fit to
  YouTube; unproven on B2B/dashboards/creative); delegation-as-consistency (assumes nesting);
  output→spec decomposition (hinges on regenerate-not-edit).
- **Needs more thought:** the verb taxonomy & tiers; the register→derivation engine (does the
  composition clamp-set actually cover the failures?); the emergence/self-report syntax; can a
  *novel* UX be decomposed by AI at all.

## 15. Live artifacts from the session (evidence)

- **Recipe cleanup** — recipes are dead, superseded by design-pattern + composite; dead
  `RecipeSpec` removed.
- **Quote component** — built end-to-end through the pipeline; passed every mechanical oracle
  (types, tokens, a11y/axe) and was still visually *off* — failing **exactly where the theory
  predicted**: the raw-CSS primitive layer with no clamp, where the AI had to originate taste.
  The only thing that caught it was a human eye. That is §9–§10, demonstrated live.
- **WCAG "add it" → "it already exists"** — the forcing-function (reading `check:all`) caught the
  AI about to rebuild an existing system (`criteria.ts`, `check:wcag-evidence`, the axe a11y-sweep).
  A component ties in by having docs samples the sweep axe-checks; component-specific a11y is just
  "native semantics + `aria-hidden` on decoration."

## 16. Meta — continuity lives in the artifacts

The AI does not retain this context between sessions. So the collaboration's continuity **cannot
live in the model** — it must live in the artifacts (this note, the memory files, the specs, the
encoded clamps). Encode the understanding, because the model won't remember it. That is the same
lesson as everything above, applied to the collaboration itself.
