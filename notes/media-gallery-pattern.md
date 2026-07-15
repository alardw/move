# Media gallery — pattern knowledge (competitor analysis → `MediaGallery` recipe)

Working doc. Goal: extract the media-gallery **parameter space** from real players so the
future `MediaGallery` recipe carries **decision axes + heuristics + Move bindings** (a
parameterized pattern, not a fixed template — see `dogfood-findings.md` › Recipes). Built
from screenshots + code snippets of each player; the recipe schema gets read off this once
populated (build-first).

> **Provenance note.** The named references below are **design research** — observations of
> publicly-visible UIs, cited only to map the parameter space. UI *patterns* aren't
> proprietary; the point is the design *characteristics*, not the products. The synthesized,
> shipped artifact (`packages/move/recipes/media-gallery.pattern.draft.ts`) is **brand-free**,
> naming samples by archetype (`VisualMasonry`, `RichMetadataGrid`, …) — the pattern is
> defined by what it *does*, not by who uses it.

## Decision axes (the parameter space each player exercises)
- **media**: image · ai-image · video · audio · 3d · product · mixed
- **layout**: uniform-grid · masonry · justified-rows · carousel/rows
- **labeling**: none (purely visual) · label · rich (creator / stats / price)
- **selection info**: what's shown *to help choose* an item (and what's emphasised)
- **item actions**: none · link-only · one · few · many · selection-mode
- **action *kinds* (observed vocabulary)**: **like** · **save/bookmark** · share · follow · play · add-to-list · add-to-cart · download · quick-view · select · message · remix (edit-prompt/vary) · **overflow (⋮)**. `like` + `save` + `overflow` are near-universal; the rest are use-case-driven (H20). Each has a conventional icon + placement + weight — captured in `ACTIONS` in `media-gallery.pattern.draft.ts`.
- **action placement**: corners · beneath · overlay-bar/gradient · hover-reveal
- **indicators on media**: type/play · duration · progress · rank/status · count · price
- **interaction/events**: click-link · hover-actions · hover-preview(play) · hover-expand · select

## Gallery organization — the PAGE level (above the item)

From the full-page screenshots: the gallery itself has decision axes *above* the item.
A `MediaGallery` is a **page that arranges item composites** — two levels: **gallery**
(this section) composes **item** (the axes above).

- **arrangement:** `uniform-grid` · `masonry` · `justified-rows` · `dense-grid` (near-gapless) · **`shelves`** (stacked themed horizontal rows/carousels)
- **sectioning:** `flat` · **`themed-shelves`** (curated: "Top 10", "Recent", "Bestsellers", each with *see-more*) · **`grouped`** (by data — date/place, category) · + per-section *item variants* (e.g. ranked Top-10 gets big numbers)
- **filtering:** `none` · **topic-chips** (horizontally-scrollable) · **faceted-sidebar** (brand/price/rating/condition) · **content-type-toggle** (images/videos/styles)
- **sort / feed:** `none` · **feed-tabs** (For You / Hot / Top / Recent / Likes)
- **chrome:** `nav-rail`/`sidebar` · `top-menu` · **profile-header + tabs** · **create/compose-bar** · **multi-pane app-shell** (library + panel + player) · global `search`
- **featured:** `none` · **hero/billboard** · **featured-larger / ranked** items
- **density:** `generous` ↔ `standard` ↔ `tight/gapless`; columns 3 → 5+ / responsive
- **paging:** `infinite` · `see-more-per-shelf` · `pagination`
- **interspersed:** `none` · **ads/sponsored** · **promos** (labelled, sometimes titled unlike organic items)

**Per-page mapping (organization only):**
| Page | arrangement | sectioning | filter/sort | chrome | notes |
|---|---|---|---|---|---|
| discovery-masonry | masonry | flat | topic-chips | nav-rail + search | ads interspersed · infinite |
| subscription-grid | uniform-grid | flat | — | nav-rail + search | generous · infinite |
| streaming-browse | **shelves** | themed-shelves | top-menu | top-menu | hero billboard · **ranked** Top-10 variant · see-more/shelf |
| profile-grid | dense-grid | flat | — | **profile-header + tabs** | tight/gapless |
| music-home | **shelves** | themed-shelves | topic-chips | **app-shell** (sidebar+panel+player) | see-more/shelf |
| generate-explore | masonry | flat | **feed-tabs** + **content-type-toggle** | nav-rail + **create-bar** | tight |
| photo-archive | justified-rows | **grouped** (date/place) | — | nav-sidebar + search | infinite |
| commerce-category | shelves (4-across) | themed-shelves | **faceted-sidebar** + category-nav | top-menu | see-more/section |
| maker-community | uniform-grid | flat | topic-chips + feed-tabs | nav-sidebar + search | promos interspersed · generous |

**Key takeaway:** arrangement + sectioning + chrome vary independently of the *item* axes.
The same item (a rich-labeled card) appears in a uniform grid, in shelves, or in a
faceted-search page. So `MediaGallery` = **GalleryOrg (page) ∘ MediaItem (composite)** —
which is exactly the composite-composes-composite / page-scope relationship (§A).

## Review synthesis — the cleaned model + decision sources (2026-07-02)

Reviewing the draft surfaced one recurring flaw: **several axes conflated orthogonal
things** (what the media *is* vs what you *do* with it vs how it's *controlled*).
Untangled, plus the decision-source model — which is the recipe's real authoring contract.

### Untanglings applied / to apply
- **`shelves`** was in *both* `arrangement` and `sectioning` → it's `sectioning:'themed-shelves'` × `arrangement:'carousel'`. Removed from arrangement.
- **`media`** conflated render-kind with use-case → `ai-image` = `image` + generative labeling + `remix`; `product` = `image` + `fit:contain` + transactional + `add-to-cart`. Real media = **image · video · audio · 3d**.
- **`sorting`** was one axis doing two jobs and missing the main one → **`ordering`** (the *dimension*: relevance · **time** · popularity · rating · price · alphabetical · curated) + **`sortControl`** (none · tabs · dropdown). `grouped`/`themed` already imply an ordering.
- **`interaction`** did *three* jobs → **`primaryAction`** (open · play · select · quick-view — the item's default activation, usually the whole tile) + **`hoverMedia`** (none · preview · expand · reveal-info — what hover does to the media) + **`hoverActions`** (which *secondary* kinds appear).
- **`chrome`** (nav-rail · top-menu · app-shell · profile-header · search) is the **hosting page**, not the gallery → moves to feature scope (`composition-spec.draft.ts`). The gallery keeps only its own controls (`filtering`, `sortControl`).

### ⭐ It's not "media gallery" — it's `ItemGallery` (the generalization)
The pattern is **a gallery of items, each with a visual *lead* + metadata + actions.**
*Media gallery*, *product gallery*, *people directory*, *file browser* are all the same
structural pattern — **instances**, differentiated purely by axis values:
- media gallery = `useCase:discover/consume` + `media:image/video` + `labeling:none/rich` → **media-forward** (the visual *is* the content)
- product gallery = `useCase:shop` + `media:image` + `fit:contain` + `labeling:transactional` → **metadata-forward** (the photo is a *component*; price/rating lead)
- people directory = `useCase:showcase` + lead:`avatar` + `labeling:rich` + `message`

**This validates "recipe = parameterized pattern":** one pattern spans the family via
`useCase × media × labeling`; writing separate `MediaGallery`/`ProductGallery` recipes
would be the mistake we're avoiding. So:
- **rename** `MediaGallery` → **`ItemGallery`** (`Gallery` / `CardCollection`); media/product/… are *instances*, not the pattern.
- **reframe the item** as **`lead` + `metadata` + `actions`**, where `lead` is usually media (`image/video/audio/3d`) but the axis is "the item's lead visual" — extensible to `avatar`/`icon`/`swatch`/`chart-thumbnail`. Media-forward ↔ metadata-forward = `useCase` + `labeling`.
- **Ceiling (scope boundary):** the *broader* thing is a **Collection** whose item *presentation* varies — table-row · list-row · **gallery-card**. `ItemGallery` = the "card with a visual lead" presentation. Scope the recipe here — going up to "any collection" dilutes the media-specific axes (fit, on-lead overlays, hover-preview) that make it worth having.

### `useCase` — the driver (new, top-level)
Purpose is the hidden variable behind every correlation. `useCase` ∈ **discover · consume · create · shop · archive · showcase · social**. It is (a) the coarse **matchable** key and (b) a **preset** that fills most axes with sensible defaults. **Each archetype ≈ a use case's default config.**

### Archetype vs sample (naming fix)
`useCase → **archetype** (named config preset) → [bindings] → **sample** (.tsx, the actual design)`. Archetypes are *configs*; samples are the concrete `.tsx` seeds the AI extends (to be generated). Rename `SAMPLES` → `ARCHETYPES`; reserve "sample" for the code.

### Actions by category (intent — predicts weight + clustering)
**collect** (save · add-to-list · download) · **react** (like · share · follow · message) · **consume** (play · quick-view) · **transact** (add-to-cart) · **create** (remix) · **manage** (select · overflow).

**⭐ The action *set* is derived from `useCase × media` (both, together):**
- **`useCase` sets the base intent-mix:** discover → collect + react · social → react · shop → transact · create → create · consume → consume + collect · archive → manage + collect · showcase → react + collect.
- **`media` adds/gates the media-specific ones:** video/audio → **play** (as `primaryAction`) · product → **add-to-cart** · 3d → download + remix · image → save + download.
So `primaryAction` + `hoverActions` are **`use-case-preset` refined by a `media` rule** — e.g. `play` only appears for playable media, `add-to-cart` only for products. (`select`/`overflow` are always available; `like`/`save` near-universal.)

### ⭐ Decision sources — how each axis is decided (four layers, in precedence)
The recipe tags each axis with `decidedBy`, so it's drivable by an AI with the consumer barely touching it, safely.
1. **`data-rule`** — computed from the app's **data**, not a taste choice: `media` (from content), `fit` (media semantics), `ordering`-default / `selection` / `stats` (from data shape). Misreading the data is *checkable*.
2. **`use-case-preset`** — the `useCase` sets a sensible default (overridable): `arrangement`, `sectioning`, `labeling`, `density`, `paging`, `featured`, `primaryAction`, `hoverMedia`, `sortControl`, `filtering`, and *which* `hoverActions`.
3. **`consumer`** — explicit + **minimal**: overrides where they have a specific opinion, plus domain-specific actions. Consumer input ≈ **use-case + data + a few overrides**.
4. **`ai-heuristic`** — the AI decides under heuristics + oracle: overlay **placement · contrast · weight**, and the concrete **`.tsx` sample**. This is the *drift zone* (Meta finding: `ghost`, `subtle`) → hard rails: force-from-sample + the oracle.

**Payoff:** the AI can't drift on what it doesn't decide — layers 1–2 pin most axes, layer 4 is checked. That's what makes the pattern safely AI-drivable.

## Roster (10 — chosen to span the axes)
1. Pinterest · 2. Instagram · 3. YouTube · 4. Netflix · 5. Spotify ·
6. Behance · 7. Midjourney · 8. Google Photos · 9. Amazon · 10. Sketchfab

## What I extract per player (from screenshot + snippet)
- **axis-choices** — where this player sits on each axis above
- **indicators + placement** — what sits on the media and where
- **interaction** — resting vs hover/active state; what's revealed when
- **heuristics revealed** — the design *rules* it demonstrates (→ running list)
- **Move binding** — how each choice maps to Move component + props (→ running list)
- **Move gaps** — what Move can't express (→ running list + `dogfood-findings.md`)

---

## Per-player extraction

### 3. YouTube — video item (rich grid) · resting + hover screenshots + `ytd-rich-item-renderer` snippet
- **media:** video · **layout:** uniform grid, **16:9** cards, **borderless** (no card surface — thumbnail + text on the page bg; not a `Card`).
- **labeling: RICH, beneath the media** — channel **avatar** · **title** (clamped to **2 lines**) · channel name · **verified check** (inline) · views · age. Creator is a first-class selection signal.
- **selection info:** custom marketing thumbnail (not a still) · title · channel identity + verified · views (popularity) · recency · duration (time cost).
- **item actions:** an **overflow `⋮`** ("Meer acties") in the metadata row (top-right of the text block) — the action long-tail behind one button. On hover over the thumbnail: **mute** + **CC** toggles.
- **indicators on media:** **duration badge, persistent, bottom-right** on the thumbnail (`13:17`). (Watched-progress = red bar bottom, when applicable — not shown.)
- **action/indicator placement — the key detail:** persistent **duration → bottom-right**; hover **controls (mute/CC) → top-right**; overflow **`⋮` → in the metadata block, not on the image.** Indicators and controls occupy **different corners**; rich text goes **below**, never over.
- **interaction:** resting = static thumbnail + duration. **Hover = the thumbnail becomes a muted autoplay *video preview*** with mute/CC controls top-right (hover *upgrades the medium*, distinct from hover-actions or hover-expand). Whole thumbnail is a link.

### 4. Netflix — boxart title-card (carousel) · resting + hover-expand screenshots + `title-card` snippet
- **media:** video · **layout:** **carousel / horizontal rows** (`slider-item`), 16:9 rounded boxart · **borderless**.
- **labeling: NONE visible — the title is *baked into the boxart art*** (only in `aria-label` + a hidden `fallback-text` for a11y). **Zero text beneath.** The polar opposite of YouTube (H1).
- **selection info:** the marketing boxart itself (title + brand baked in) + badges. Rich metadata is **hover-gated** (see interaction).
- **indicators on media (two flavors):** **`TOP 10` ranking badge, top-right corner** (small, bold); **"Nieuw seizoen" status *pill*, bottom, prominent** (solid red, wide) — a bolder indicator than a corner badge.
- **item actions:** *none* at rest. On **hover-expand**: an **action bar** — **Play** (solid white circle, leading/primary) · **Add (+)** · **Like (👍)** (outline circles) · **More (⌄)** pushed to the **far right**, separated from the positive actions.
- **interaction: hover-*expand* (the "bob")** — the card **grows into a larger overlay card** over its neighbors, revealing: autoplay preview (top) → action bar → metadata (age `12` · `2 seizoenen` · `HD` · genres `Fantasierijk • Avontuur • Epic World`). All the selection info appears **only on expand**.

### 1. Pinterest — pin (masonry) · resting + hover screenshots + `pinWrapper` snippet
- **media:** image · **layout: MASONRY** — **variable aspect ratio per pin** (`aspect-ratio: var(...)`, `padding-bottom: 124%`), native proportions preserved · rounded · **borderless**.
- **labeling: none at rest** — pure image, no title/text (title is `aria-label`/`alt` only). Visual-first like Netflix, but *no baked-in title either* — just the image.
- **selection info:** the image itself. That's it (inspiration content — the picture *is* the information).
- **indicators on media:** **none** (static images, no status).
- **item actions (hover-revealed, one per corner):** **top-left** board/destination select (`Profile ▾`) · **top-right Save** (prominent **solid red**, primary) · **bottom-right share** (solid white circle) · **`•••` overflow** below → menu (See more/less, Download, Report). Actions hug the **corners**, center stays clear; each has a **solid background** for contrast over any image (**no ghost**).
- **interaction: hover-*reveal-actions*** — the **third mode**: buttons fade in **over** the resting image at the corners, **without** growing the card (≠ Netflix expand) or previewing (≠ YouTube). Card stays put; whole thing is a link.

### 2. Instagram — profile-grid tile · resting + hover screenshots + tile snippet
- **media:** image / video / carousel · **layout: uniform grid, cropped** (`object-fit: cover`, all tiles same aspect ~4:5) — the *opposite* of Pinterest masonry.
- **labeling: absolutely none** — no title, caption, or author, ever. On a single profile's grid, identity is redundant (all the same author), so labeling collapses to **zero**. Even more minimal than Netflix (which at least bakes a title into the art).
- **selection info:** the image only.
- **indicators on media:** type icon (carousel/reel/video) top-corner when applicable (not in these shots); otherwise none.
- **item actions: NONE.** You cannot act on a grid tile; the only interaction is click → open the post.
- **interaction: hover-*reveal-info*** (the **fourth** flavor) — a **scrim** darkens the image and **read-only engagement stats** (❤️ 10 · 💬 0) fade in **centered**. Display, not targets — which is *why* they can sit in the center (unlike interactive/persistent elements, which go to the edges).

### 5. Spotify — album card (carousel) · resting + hover screenshots + `encore card` snippet
- **media:** audio (album/playlist **cover art**, square 1:1) · **layout:** carousel/rows.
- **item: a real `Card` surface** — the **first non-borderless** item. "Naked" at rest, **hover reveals the surface (bg + lift)**. The surface-vs-borderless axis, embodied.
- **labeling: moderate, beneath, inside the card** — **title** ("DECIDE", clamp **1 line**) + **subtitle** ("Album • Djo" = type • artist, muted). Less than YouTube's rich, more than zero.
- **selection info:** cover · title · type · artist.
- **indicators on media:** none.
- **item actions: a single primary *play*** — **green (brand) circular icon button, bottom-right on the cover**, hover-revealed, prominent. Whole card → open; play → play.
- **interaction: hover-*reveal-action* + surface lift** — the play affordance appears on the cover *and* the card surface fades in. One dominant action for playable media.

### 7. Midjourney — job card (grid) · resting + hover screenshots + `jobCard` snippet
- **media:** AI-generated image, square · **layout:** uniform grid (absolute/virtualized).
- **labeling: none at rest**; on hover the **author** appears (bottom-left).
- **selection info:** the image; author on hover.
- **indicators on media:** none.
- **item actions — a hover *bottom bar*, grouped by kind:** **left** = attribution (author pill + **follow (+)**); **right** = **domain-specific** icon actions: **edit-prompt** · **search-similar** · **like**. (Vary/upscale live in the detail.)
- **interaction: hover-*reveal-actions*, bottom-bar layout** — actions along the **bottom edge** (not four corners), over a **subtle gradient** with **icon drop-shadows** for contrast (a *lighter* contrast technique than a full scrim).

### 6. Dribbble — shot card (grid) · resting + hover screenshots + `shot2-item` snippet · **the combination case**
- **media:** image + **video (muted autoplay on hover)** — from the snippet `hover-media-type="video"` + `.mp4` `hover-media-src` (motion; **not visible in a screenshot** — captured from markup).
- **layout:** grid, 4:3 thumbnails · **borderless** thumbnail + details beneath.
- **labeling: rich, beneath, *always visible*** — avatar + author ("Paperpillar") + **PRO badge**, and **engagement stats** (♥ 389 likes · 👁 64.4k views).
- **indicators on media:** a **motion/video type indicator** (persistent, top-right — the "extras" icons).
- **item actions (hover *bottom bar*):** **title** left; **message/"get in touch" · save (bucket) · like** right — white circular buttons. (Message = a portfolio-specific action kind.)
- **interaction: a COMBINATION** — hover-*preview* (still → autoplay mp4) **and** hover-*reveal-actions* (bottom bar) **at once**, with **stats always beneath**. Confirms your "combinations too": the four hover modes are **not exclusive**.

### 8. Google Photos — tile (justified rows) · from description (item = thumb + checkbox)
- **item is minimal** (thumb + hover checkbox + favorite) — the novelty is all **system-level**:
- **layout: justified rows** — native aspect, row-height-aligned, fills width (the third layout, ≠ uniform-crop, ≠ masonry). **Grouped by date/album** (sections, not a flat field).
- **selection: a gallery-wide *mode*** — a hover **checkbox** (top-left) flips the whole grid into multi-select; a **bulk action bar** then operates on the *set* (share / delete / add-to-album). Single-item-actions vs bulk-selection is a **top-level fork** the recipe must decide.
- **indicators:** video → duration; type icon. **labeling:** none.

### 9. Amazon — product card (carousel/grid) · resting + hover screenshots + `octopus-pc-item` snippet · **the commerce case**
- **media:** product photo **on white, `fit: contain`** — the product shown **whole, not cropped** (cropping a product loses the product). First non-cover media-fit.
- **layout:** carousel/grid.
- **labeling: rich + *transactional*, beneath** — **price** (€110,02, the **largest** element / visual anchor) · **strike-through RRP** (€144,00 → discount framing) · **✓prime** badge · title (clamp 2) · **★ rating** (4,3/5) + **review count** (1.759). The numbers, not the image, drive the choice.
- **selection info:** price · discount · rating · reviews · Prime/shipping — **trust + value signals**, a fundamentally different basis from visual/creative players.
- **item actions:** **Quick-look** (hover → outlined pill bottom-center of image → opens a **quick-view modal**). Buy/cart lives in quick-look/detail.
- **interaction:** hover → **quick-look modal** (preview *without leaving the grid*, but a modal — ≠ inline expand). Click → product detail.

### 10. MakerWorld — 3D-print model card (grid) · resting + hover · **the convergence check**
- **media:** static model render (4:3) — *not* interactive-3D in the tile (so it does **not** add the manipulable-media axis Sketchfab would have).
- **labeling: rich beneath** — title · author + **verified** · domain stats (**⬇ 516** downloads · **👍 1.8k** boosts).
- **indicators:** "new version" green cube (top-left) + a **category pill** ("MINI GOLF SET", bottom-left) — both persistent on-media (C5/G9).
- **actions:** save + `⋮` overflow, **top-right corner, hover-revealed** (circular). [ignore the injected Pinterest bookmarklet in the screenshot]
- **⇒ CONVERGENCE SIGNAL:** a 10th player, in a *new domain* (3D-print community), added **no new axis** — it slots entirely into existing patterns (H1 rich-beneath · H6 identity+verified · H13 corner actions · H22 stats-beneath · C5/G9 indicators, incl. a category-pill). When a fresh, different-domain player contributes nothing new, the **parameter space is captured.** Time to synthesize.

---

## Running — heuristics (design laws, deduped)
- **H1 — rich metadata lives *beneath* the media, not on it.** Only compact *status* (duration) sits on the media; when there's a lot to say (title, creator, views, age) it goes below. [YouTube]
- **H2 — persistent status indicators sit in a corner, small, away from the center.** Duration → bottom-right. "Least covering the center." [YouTube]
- **H3 — indicators and hover-controls occupy *different* corners** so they never collide (duration bottom-right; mute/CC top-right). [YouTube]
- **H4 — the action long-tail hides behind one overflow (`⋮`)**, kept out of the resting state, placed in the metadata block (not on the image). [YouTube]
- **H5 — hover can *upgrade the medium*, not just reveal actions** (static thumbnail → muted video preview). A distinct interaction mode from hover-actions / hover-expand. [YouTube]
- **H6 — creator/identity is a first-class selection signal** when the source matters (avatar + name + verified). [YouTube]
- **H7 — the labeling axis is a spectrum, driven by media/purpose:** rich-always-beneath (YouTube, informational) ↔ zero-text / **title-baked-into-art + metadata hover-gated** (Netflix, immersive). Selection-info *density* trades against visual immersion. [YouTube ↔ Netflix]
- **H8 — indicators come in two weights:** subtle **corner badge** (duration, Top 10) vs prominent **status pill/ribbon** (New season, discount) overlaid at an edge. Pick by how much it should shout. [YouTube, Netflix]
- **H9 — action-bar grouping:** primary action **solid + leading**, secondary **outline**, and **overflow/expand pushed to the *opposite* end**, separated from the positive actions. [Netflix]
- **H10 — hover-*expand* is a distinct mode:** the item grows into a richer card that **overlays its neighbors**, revealing preview + actions + metadata at once (vs hover-*reveal-actions* [Pinterest] vs hover-*preview-in-place* [YouTube]). [Netflix]
- **H11 — layout ⟂ media/purpose:** uniform-crop (YouTube/Netflix 16:9, consistent rhythm) vs **native-aspect masonry** (Pinterest — preserve proportions, because for inspiration content cropping *loses the information*). [Pinterest]
- **H12 — three interaction modes now clear:** hover-*reveal-actions* (Pinterest, actions over a still card) · hover-*preview-in-place* (YouTube, medium upgrades) · hover-*expand* (Netflix, card grows + overlays). Driven by media (still vs video) and purpose (act-on-it vs consume-it). [all three]
- **H13 — corner actions: one per corner, each with a *solid* background for contrast, primary emphasised (brand colour).** Center stays clear. Reconfirms the "no ghost over photos" lesson and your "actions at the edges" heuristic. [Pinterest]
- **H14 — hover can reveal read-only *info* (engagement stats), not just actions** — a *fourth* flavor: hover-*reveal-info*. Over a **scrim**, and **centered** — because display-info isn't a target, so the "keep the center clear" rule doesn't apply to it (only to interactive/persistent elements). [Instagram]
- **H15 — labeling collapses to *zero* when the context makes it redundant** — a single author's grid needs no author/label; the images speak. The extreme bottom of the labeling axis (below even Netflix's baked-in title). [Instagram]
- **corollary — center vs edge is decided by *interactivity*:** interactive (actions) + persistent (indicators) → edges/corners; transient read-only info → may center over a scrim.
- **H16 — playable media gets a single *primary* "play" affordance on the cover** — brand-coloured, circular, corner (bottom-right), hover-revealed. The dominant action for consumable/playable media (audio, video). [Spotify]
- **H17 — surface vs borderless is an axis.** A "naked" `Card` that reveals its **surface + lift on hover** signals a discrete, tappable object (library/collection). Borderless (YouTube/Netflix/Pinterest/IG) suits an edge-to-edge visual wall. Pick by whether items are *objects to pick* or *a continuous field to browse*. [Spotify]
- **H18 — actions can cluster along one *edge* (a bottom bar), grouped by kind:** attribution/identity left, action-icons right. An alternative to the four-corner spread (Pinterest), common for creator content. [Midjourney]
- **H19 — contrast technique scales with need** (pick the lightest that stays legible): solid button background (Pinterest) → full scrim (Instagram) → **edge gradient** (Netflix, Midjourney) → **icon drop-shadow** (Midjourney, lightest). More technique only when the image would otherwise win. [all]
- **H20 — item *actions are use-case-driven*** — the *kinds* come from what the app lets you DO with the media (Midjourney: edit-prompt, search-similar, vary; Pinterest: save; Spotify: play; commerce: add-to-cart). The *placement/contrast* is universal (H13/H18/H19); the *set* is per-app. [all]
- **H21 — the hover modes COMBINE; they're not exclusive.** Dribbble does hover-*preview* (autoplay video) **and** hover-*reveal-actions* (bottom bar) at once, with stats always beneath. Real players stack them. [Dribbble, YouTube]
- **H22 — engagement stats are a *visibility* sub-axis:** always-beneath (Dribbble likes/views — popularity guides choice in discovery) vs hover-gated (Instagram) vs none. Driven by whether popularity is a selection signal. [Dribbble ↔ Instagram]
- **H23 — selection is a gallery-wide *mode*, not an item action.** A checkbox flips the whole grid into multi-select with a **bulk action bar** operating on the *set* (share/delete/add-to-album). Single-item-actions vs bulk-selection is a top-level fork. [Google Photos]
- **H24 — layout has (at least) three options, aspect-driven:** uniform-crop (consistent rhythm; crops) · masonry (native aspect, columns) · **justified-rows** (native aspect, row-height-aligned, fills width). Plus optional **grouping/sections** (by date/album). [Instagram · Pinterest · Google Photos]
- **H25 — commerce items are chosen on *transactional* signals**, so labeling foregrounds **price** (the visual anchor) + discount framing + rating/reviews + shipping/Prime. The numbers drive the choice, not the image. A distinct labeling profile. [Amazon]
- **H26 — media-*fit* is an axis:** **cover/crop** (fill the frame — editorial/photo: Pinterest, IG, YouTube) vs **contain/whole** on a neutral bg (products/assets: Amazon). Cropping is fine for a scene, fatal for a product. [Amazon]
- **H27 — preview-without-leaving comes in three forms:** in-place (YouTube video swap) · inline *expand* (Netflix bob) · **quick-view *modal*** (Amazon). Pick by how much the preview needs to show vs. disrupt the grid. [YouTube · Netflix · Amazon]

## Running — Move bindings (decision → component + props)
- **borderless item** → a `Stack` (Image + metadata), *not* `Card.Root`. [surface-vs-borderless axis]
- **thumbnail** → `Image` `fit="cover"` `aspectRatio="16 / 9"` `radius="md"`.
- **rich metadata beneath** → `Stack` row: `Avatar` · text block (`Heading`/`Text` title + `Text` muted meta) · overflow.
- **verified check** → `Icon` inline after the name.
- **overflow `⋮`** → `Dropdown`/menu with an icon-button trigger, hover-revealed.
- **duration badge on media** → `Badge` positioned bottom-right *over* the image — **but see gap G1** (Image has no persistent corner-badge slot).
- **carousel/row layout** → `Carousel` (Move has it, `scrollApi`) — no gap for the row layout itself.
- **status pill overlay** ("New season") → `Badge` (solid/prominent) at a bottom edge over the image — same slot need as G1, prominent mode.
- **action bar** → `Stack` row of icon `Button`s; primary solid + leading, overflow/expand separated to the far end. (Circular icon-button shape → check Move Button.)
- **age/HD/season chips** → `Badge` + `Text` with `•` delimiters.
- **masonry** → **no clean Move binding** (see G8). `Grid minChildWidth` gives uniform rows, not variable-height packing.
- **corner actions (per corner)** → this is the unifying need: `Image` should expose **4 corner slots**, each holding a persistent *indicator* OR a hover-revealed *action* (see G1→**G9**). Pinterest uses 3 corners for actions; YouTube/Netflix use corners for indicators. Same slot system.
- **surface item** (Spotify) → `Card` with a **naked → hover-surface (bg + lift)** variant. Check Move `Card` variants (→ G10). Borderless items = plain `Stack`.
- **play affordance on cover** (Spotify) → G9 corner slot holding a *primary circular* action (also G7 circular icon-button).

## Running — Move gaps (→ dogfood-findings)
- **G1 — `Image` has no *persistent* corner-indicator slot** (duration/count/status), positioned per-corner, distinct from the hover `action` overlay. YouTube needs duration bottom-right *always on*; my `ApodCard` had to dump the "Video" badge into the body because there was nowhere on the image. → new component finding.
- **G2 — multi-line clamp** (title → 2 lines). Reconfirms **C1** (`Text` has only single-line `truncate`).
- **G3 — borderless/surfaceless media item** must be a first-class option (not everything is a `Card`). → decision axis + Move should render it gracefully.
- **G4 — hover video-preview mode** (muted autoplay on hover, with mute/CC). Advanced; likely out of round-1 scope, noted.
- **G5 — hover-*expand* preview card** (Netflix "bob": item grows into a larger card overlaying neighbors, revealing preview + action bar + metadata). No Move component; composable from `HoverCard`/`Popover` + `Card` + `VideoPlayer`, but the grow-and-overlay layout is the hard part.
- **G6 — G1's indicator slot needs *two weights*:** subtle corner badge AND prominent edge pill/ribbon (folded into C5).
- **G7 — circular icon-button** (Play/Add/Like) — does Move `Button` do circular icon-only? Check.
- **G8 — masonry / native-aspect layout.** `Grid` does uniform rows (`minChildWidth`), not variable-height packing where each item keeps its own aspect ratio. Core to image galleries (Pinterest, Behance likely). → new layout finding.
- **G9 — the unifying one: `Image` needs a flexible *overlay* system**, superseding G1/C5 and the single `action`. Regions: **4 corners** · **center** · **edge bars** (bottom/top, e.g. title-left + actions-right — Midjourney/Dribbble). Each region holds a **persistent indicator** (duration, Top 10, count, price, motion-flag) · a **hover-revealed action** (save/share/play/message) · **read-only info** (Instagram stats) · a **title**. Contrast spectrum (H19): solid chip → scrim → edge-gradient → icon drop-shadow. Placement law (H14 corollary): interactive/persistent → edges; read-only info → center. **Combinable** with hover-*preview* (media swap → video, G4) and hover-*expand* (G5). One system covers every player.
- **G11 — selection *mode*** (Google Photos): a gallery-wide multi-select with per-item checkbox + a bulk action bar over the *set*. Not an item concern — a `MediaGallery`-level mode. No Move equivalent.
- **G12 — justified-rows + masonry layouts** (extends C6): native-aspect packing, row-aligned (justified) or column-packed (masonry). Plus **section grouping** (by date/album). `Grid` does neither.
- **G13 — no `Rating` component** (Amazon stars). Already in `missing-components.md` (survey); commerce galleries confirm the real need. `fit: cover/contain` (H26) — `Image.fit` already covers it, *no* gap there.
- **quick-look modal** (Amazon) → `Dialog` covers it; no gap.
