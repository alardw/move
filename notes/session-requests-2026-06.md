# Verzoeken — sessie juni 2026

Volledige lijst van verzoeken. ✅ = afgerond, ⏳ = openstaand/follow-up (staat in TODO.md).

## Repo & commits
1. ✅ Logische commits maken voor al het open werk.
2. ✅ README laten beschrijven wat de repo is + verwijzen naar de (live) docs.
3. ✅ Checken of `missing-components.md` nog actueel is.
4. ✅ Staleness-check over de hele repo na alle wijzigingen.
5. ✅ Losse root-markdown (behalve README) consolideren → `notes/`.
6. ✅ De generation-issues-log: nog nodig? → verwijderd (1 open item naar TODO).
7. ✅ Benchmark-package + ongebruikte deps verwijderen.

## "What AI gets wrong"-pagina
8. ✅ Pagina toevoegen als rationale voor Move (onder Getting Started Overview, niet in AI-sectie).
9. ✅ Onderscheid component-library vs design system, elk met eigen AI-uitdagingen.
10. ✅ Met echte, gevestigde referenties (WebAIM, CHI 2026 ACM, Frontend Masters).
11. ✅ Strengths-first framing ("What AI gets right"), positieve toon.
12. ✅ Flow als Move-componenten; punten consistent maken (niet alles "issues").

## Hosting & assets
13. ✅ Docs hosten op GitHub Pages (auto-deploy).
14. ✅ Gottak-font fix (laadde niet) + uitleg waar fonts horen.

## Skills (spec-driven)
15. ✅ `.agents`/`.claude` geen kapotte symlinks committen; Claude vs Codex discovery begrijpen.
16. ✅ Skills hernoemen naar `component-*` / `app-*` voor groepering.
17. ✅ `npx move skills` CLI fixen + documenteren.
18. ✅ Begrijpen/borgen dat de repo fundamenteel spec-driven is (generatie-skills zijn essentieel).

## Theming → "Make it your own" (IA-herstructurering)
19. ✅ i18n-documentatie: bestond niet — waar past het? → eigen top-level item.
20. ✅ Theming herkaderen als "Make it your own" (configureerbare zaken).
21. ✅ Surfaces & Stacking → Core Concepts (conceptueel, niet configureerbaar).
22. ✅ Nieuwe routes die de structuur volgen; alle links/breadcrumbs bijwerken.
23. ✅ Icons-pagina (icon libraries) + Typography-pagina (fonts) toevoegen.
24. ✅ Theming-model verwijzen naar de subpagina's.
25. ✅ `--move-font-sans` → `--move-font` (primitive hernoemen).
26. ✅ Component Contract-pagina: breedte-overflow fixen (en alle pagina's checken).

## Iconen via resolver
27. ✅ Componenten die inline-SVG renderen → via de resolver; + skill-guardrail zodat 't niet terugkomt.

## i18n / labels
28. ✅ i18n-pagina die ALLE labels lijst (top-level).
29. ✅ Video/audio player: hebben knoppen toegankelijke namen? WCAG voor icon-buttons. → ja, maar inconsistent.
30. ✅ ALLE knoppen/labels nalopen en de setup consistent maken.
31. ✅ Guardrail kloppend maken zodat de inconsistentie in de toekomst niet kan ontstaan (validate E1 + generate rule 21).
32. ✅ ALLE componenten fixen → één `labels`-object overal (via 17-agent workflow; typecheck + 1758 tests groen).
33. ✅ i18n-tabel uitbreiden naar alle componenten.

## Recipes
34. ✅ Oude auth-recepten opduiken (login, 2-factor, wachtwoord vergeten, reset).
35. ✅ Recepten organiseren: groeperen (Authentication…), niet op de componentpagina (cross-link).
36. ✅ Lange component/recipe-lijsten uit de nav; per-item routes blijven bookmarkbaar.
37. ✅ Geen ⌘K-shortcuts; discovery zit in de overview zelf.
38. ✅ Visuele 'card' per recipe — live preview nu; `image?`-slot voor latere screenshots.
39. ✅ Recepten kritisch beoordeeld (bruikbaar als startpunt; demo-grade; SignIn-inconsistentie genoteerd).
40. ⏳ "Hadden we er niet meer?" — ja: **data**, **navigation**, **page**-groepen nog bedraden (TODO).

## Components-overview
41. ✅ Eerst search/filter op components bouwen, dán de lange lijst weghalen (zelfde aanpak).
42. ✅ Live preview voor componenten (lazy gemount) i.p.v. alleen icoon.
43. ✅ "Browse"-kop + fluff-lede weg; lede = enkel "Every Move primitive, in one place."
44. ✅ Synoniemen-zoekfunctie (modal→Dialog, spinner→Loader, otp→PinInput…).
45. ✅ Bij "All": categorisering + sortering.
46. ✅ Voorbeelden verticaal centreren in de live preview.

## Openstaand (in notes/TODO.md)
- ⏳ Overige recipe-groepen bedraden (data / navigation / page).
- ⏳ Recipes single-source (nu docs-kopieën van skills/references) of genereren.
- ⏳ Preview-thumbnails automatiseren → `image?`-slots vullen (cards + recipes).
- ⏳ `defineTheme()` (theming-surface minimaliseren).
- ⏳ Tooltip compound Content-tests timeouten in jsdom (UNRESOLVED).
- ⏳ Optioneel: SignIn-recipe consistent maken (`fullWidth` + disabled-state).
