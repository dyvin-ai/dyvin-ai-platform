# Dyvin Insights

DYVIN AI — Frontend Design & Implementation Master Specification (v2)

Status: Authoritative build spec Quality bar: Peec AI × Profound AI, visually superior to both, with an original Dyvin identity Target: 100/100 execution on light mode, 100/100 on dark mode — not a "dark mode toggle that looks worse"

0. What Changed in v2

This version upgrades the original spec in four ways the first pass under-specified:

Dark mode is treated as a first-class design system, not an inverted palette. Full token tables for both modes, with contrast targets.

Icons are curated per-feature, not looked up generically. A locked icon map is provided so no two unrelated features share an icon and nothing feels like a random pack.

Imagery and illustration are specified. Where photography, abstract data-art, and empty-state illustration should appear, and the style rules for each.

"Slides" are specified as real components — onboarding carousels, report export slides, and agent-run summary cards — not just a figure of speech.

Everything from the original brief is preserved and tightened. Nothing here contradicts it; it replaces ambiguity with decisions.

1. Product Positioning

Dyvin is a serious AI-search intelligence platform. On first screen, a user must understand, in under five seconds:

How visible their brand is in AI search

Which AI models mention them

Which prompts drive visibility

Which competitors are winning

Which sources influence the answers

Where visibility is improving or declining

What action to take next

Product principle: Clarity → Intelligence → Evidence → Action. Every visual element earns its place by helping the user understand data or take action. If a component doesn't serve one of those two jobs, cut it.

2. Design Benchmark

From Peec AI: analytical hierarchy, restrained SaaS visual language, sophisticated data density, polished filtering, competitor comparison, readable charts, subtle borders, refined typography, calm whitespace.

From Profound AI: enterprise intelligence workflows, deep analytics, research-oriented information architecture, evidence/source exploration, drill-down interactions, prompt-level analysis, competitive intelligence, actionable insight framing.

Dyvin's own edge (v2 addition): neither product has a strong illustrated/editorial layer or a genuinely excellent dark mode. Dyvin wins on both — it should feel like a well-funded analytics company designed its product with an in-house design team, not assembled it from a component kit.

Do not pixel-copy either product. Do not reuse proprietary branding, logos, or private implementation details. Recreate the underlying quality principles.

3. Design Personality

Is: premium, calm, intelligent, analytical, editorial, trustworthy, precise, modern, enterprise-ready.

Is not: cyberpunk, hacker/terminal, crypto, neon, gaming, developer-tool-heavy, childish, template-generated, gradient-overloaded.

Hard bans: decorative neon cyan, glowing borders, excessive glassmorphism, excessive gradients, floating blobs, gratuitous animation, rainbow charts, meaningless donut charts, generic emoji, mismatched icon packs, fake terminal/matrix aesthetics, unnecessary 3D.

4. Core Visual Principle

The interface must read as a product, not a dashboard template.

Anti-pattern: KPI card → KPI card → KPI card → KPI card → generic chart → generic table.

Correct pattern — a coherent analytical story:

AI Visibility
68.4%  +8.7 pts
Across 420 tracked prompts and 6 AI models.

↓
Large visibility trend
↓
Model breakdown
↓
Competitive position
↓
Prompt performance
↓
Source / citation intelligence
↓
What changed
↓
Recommended actions


Layout guides the user through the analysis like a report a sharp analyst would write, not a grid a template generated.

5. Technology Stack

React + TypeScript

Vite (unless a strong, stated technical reason requires otherwise)

Tailwind CSS

shadcn/ui

Lucide React (icons — see §9 for the locked icon map)

Recharts (charts)

TanStack Table (complex tables)

Zod (runtime validation at service boundaries)

date-fns (date handling)

next-themes or an equivalent lightweight theme provider for dark/light switching with prefers-color-scheme detection + manual override + persistence

Prefer lightweight dependencies. Never add a dependency purely for decoration (no confetti libraries, no particle backgrounds, no 3D scene libraries unless a feature genuinely requires one).

6. Frontend Architecture

src/
  app/
  components/
    ui/
    layout/
    navigation/
    analytics/
    charts/
    tables/
    filters/
    insights/
    prompts/
    sources/
    competitors/
    illustrations/     <- NEW: empty-state & editorial art
    slides/             <- NEW: onboarding + export + agent-summary slide components
  features/
    overview/
    visibility/
    prompts/
    competitors/
    sources/
    insights/
    agents/
  data/
  hooks/
  lib/
    theme/               <- NEW: token definitions, theme context, contrast helpers
  services/
  types/
  styles/


Keep components modular. No monolithic page components. No duplicated styling — every visual pattern (card, stat block, trend badge, status pill) is a shared primitive used everywhere it appears.

7. Application Shell

Desktop:

┌──────────┬──────────────────────────────────────────┐
│ Sidebar  │  Top Header                               │
│ 232–248px├──────────────────────────────────────────┤
│          │  Main analytical workspace                │
│          │  (max-width constrained, comfortable      │
│          │   horizontal padding, no edge-to-edge      │
│          │   stretch)                                │
└──────────┴──────────────────────────────────────────┘


Header height: 56–64px. Sidebar width: 232–248px, collapsible to an icon rail (~64px) on demand — collapse state persists per user.

Do not stretch every component to full browser width. Do not leave excessive unused margins either — content max-width should feel intentional (typically 1280–1440px reading/working area, centered or left-anchored depending on density).

8. Navigation

Primary: Overview · AI Visibility · Prompts · Competitors · Sources · Insights · Agents Secondary: Reports · Settings

One consistent icon system — Lucide only. See the locked map in §9. Never mix icon packs, emoji, or unrelated SVGs into navigation.

9. Icon System — Locked Map (v2, curated)

The original spec's icon suggestions ("Eye / Activity" for Visibility, generic overlaps) invite inconsistency across a build done in phases. This map is final — do not substitute mid-build.

Area Icon Why this one, not the obvious alternative Overview LayoutDashboard Neutral, standard entry point marker AI Visibility Radar Distinct from "Insights" (Sparkles) and from generic Eye; visibility-as-detection reads more analytical than "watching" Prompts MessageSquareText More specific than plain MessageSquare — signals content/text analysis, not chat Competitors Swords or Users (choose one, lock it) — default Users for enterprise tone; avoid Swords if the brand wants to stay calm rather than combative Prevent an accidental "gamified" feel Sources Link2 for the nav item; Globe reserved only for "web/domain" metadata inline in tables Avoids clash with Prompts' FileText-adjacent usage elsewhere Insights Sparkles Reserved exclusively for Insights — do not reuse Sparkles for "AI" flourishes elsewhere or it loses meaning Agents Bot Standard, legible at small sizes Reports FileBarChart2 More specific than BarChart3 — signals "chart inside a document," distinguishing from in-app charts Settings Settings2 Slightly more refined mark than the default gear; use consistently, not interchangeably with Settings Trend up TrendingUp Status badges only Trend down TrendingDown Status badges only No change Minus Never a colored icon — neutral gray only Export Download Not ArrowDownToLine — keep it recognizable Filter SlidersHorizontal Not Filter (too generic, overused) Search Search Standard is correct here — don't get clever Notifications Bell Standard Workspace switch ChevronsUpDown Standard shadcn combobox affordance Citation / evidence Quote Reserved for citation excerpts specifically, never reused elsewhere Model badge (generic fallback only, real logos preferred where licensing allows) Cpu Used only if a model's real mark can't be shown Drill-down / expand ArrowUpRight For "open detail view" affordances on cards Empty state Inbox (data-related) / SearchX (no-results) Distinguish "nothing tracked yet" from "no results for this filter" Success/positive state CircleCheck Never Check alone — the circle gives it enough visual weight to read at a glance Warning TriangleAlert Standard Danger/error CircleAlert Distinct silhouette from warning triangle so the two are never confused at small sizes

Rule: one icon = one meaning, everywhere in the app. If a future feature needs a new concept, add it to this table before using it — don't grab whatever looks close.

10. Sidebar

Clean neutral background, subtle right border (not a hard black line)

Restrained active state: subtle neutral surface fill + strong text weight — never a solid black/brand-color pill

Inactive: muted gray text, transparent background

Hover: subtle neutral background shift, no color jump

Workspace selector near top (with ChevronsUpDown)

Account/workspace controls near bottom

Collapse control persists across sessions; collapsed rail shows icons only, with tooltips

11. Header

Header provides context, not decoration. Controls, as needed per page: workspace, date range, model filter, tags, export, search, notifications, account, and a theme toggle (see §13).

Use shadcn primitives: Button, Popover, DropdownMenu, Select, Calendar, Command. Keep controls compact, same height, aligned to a single baseline.

12. Global Design Tokens (Light Mode)

--background:            #FAFAF9   (warm neutral, not pure white)
--surface:                #FFFFFF
--surface-subtle:         #F5F4F2
--foreground:              #18181B   (near-black charcoal, not #000)
--muted-foreground:       #6B7280
--border:                   #E5E3DF
--border-strong:           #D4D1CB
--accent:                   #2F5D50   (deep, editorial green — Dyvin's signature; not SaaS-generic blue)
--accent-foreground:      #FFFFFF
--success:                  #1F8A5F
--success-bg:              #E8F5EE
--warning:                  #B7791F
--warning-bg:               #FBF2E3
--danger:                   #C0392B
--danger-bg:                #FCEBE9
--info:                       #2563A8
--info-bg:                  #E9F1FA


13. Global Design Tokens (Dark Mode) — this is the part most specs skimp on

Dark mode is not #FFFFFF inverted to #000000. It uses elevated neutral surfaces, not true black, and desaturates accent colors slightly so they don't vibrate against dark backgrounds.

--background:            #0E0F0F   (near-black, warm-neutral undertone — not pure #000)
--surface:                 #17181A   (card surface, one step up from background)
--surface-subtle:         #1D1F21   (secondary surface, e.g. table stripe, nested card)
--foreground:               #F2F1EE   (warm off-white, not pure #FFF — reduces glare/eye strain)
--muted-foreground:       #9B9C9E
--border:                   #2A2C2E
--border-strong:           #3A3C3E
--accent:                   #4FA98A   (lightened, slightly desaturated from light-mode accent for dark-surface contrast)
--accent-foreground:      #0E0F0F
--success:                  #4FBE8D
--success-bg:               #123324   (dark-tinted success surface, not a bright fill)
--warning:                   #E0A94D
--warning-bg:                #332711
--danger:                     #E2685C
--danger-bg:                  #34120F
--info:                         #5FA3E0
--info-bg:                    #10222F


Contrast requirements (non-negotiable):

Body text on background: ≥ 7:1 (AAA)

Muted text on background: ≥ 4.5:1 (AA)

Chart line colors on both surfaces: verified individually — a line that reads fine in light mode often disappears or blooms in dark mode; test each series color against --surface in both themes before shipping a chart.

Never rely on pure saturation swaps between modes — every accent/status color has an explicit dark-mode value above, not a CSS filter: invert() hack.

Theme switching:

Respect prefers-color-scheme on first load

Explicit toggle in header (Sun/Moon icon swap, or a single SunMoon icon with state)

Persist user choice (localStorage or account setting)

No flash-of-wrong-theme on load — resolve theme before first paint

Every screenshot/QA pass in §56 must be done in both modes, not light-only with a dark mode assumed to "just work"

14. Typography

Font: Geist or Inter. Mono (numerical/technical values only): visibility percentages, ranks, position numbers, technical identifiers.

Page title:        28–36px, semibold
Section title:      18–22px, semibold
Card title:          13–15px, medium
Primary metric:     32–48px, semibold, tabular-nums
Body:                  14–15px, regular
Metadata:             11–13px, regular, muted-foreground


Not every heading is huge. Reserve the largest sizes for the one primary number per screen (see §17).

15. Spacing

Base unit: 4px. Scale: 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48. Cards have consistent internal rhythm — same padding, same gap-between-elements, on every card of the same type. No ad-hoc spacing values outside the scale.

16. Border Radius

Small controls: 6–8px

Cards: 8–12px

Large surfaces: 12–16px

Pills: 9999px, only for genuinely pill-shaped semantic elements (status badges, filter chips) — not applied to buttons or cards by default

17. Shadows

Prefer borders over shadows for resting states, in both modes.

Dark mode shadow note: shadows barely register on dark backgrounds — use a subtle lighter border or a very faint glow (border-strong token, not a drop-shadow) to indicate elevation instead of relying on shadow alone.

Shadows reserved for: popovers, dialogs, floating controls, elevated menus. Keep them small and soft — never a heavy drop shadow.

18. Imagery & Illustration (NEW)

The original spec had zero guidance here, which is why AI-generated dashboards tend to feel sterile. Dyvin uses imagery in three specific, restrained places:

18.1 Empty states — line-art data illustration

Simple, single-color (accent-tinted) line illustrations, not stock photography, not cartoon mascots. Style: geometric, editorial, similar in spirit to how Linear or Vercel illustrate empty states — abstract representations of charts, radar sweeps, or documents, never literal "sad face" or generic clipart. Store as SVG components in components/illustrations/.

18.2 Onboarding / marketing surfaces — abstract data art

Where a hero or landing surface needs visual weight (first-run screen, workspace creation), use abstract generative-looking compositions built from the product's own data shapes: overlapping line-chart curves, radar rings, subtle dot grids — rendered in the theme's accent and neutral tokens. Never generic AI-abstract-blob art, never photography of "people looking at laptops."

18.3 Source favicons / model logos

Real favicons for cited domains (from the source data) and real AI model marks where licensing allows, falling back to the Cpu icon token (§9) when unavailable. This is the one place literal imagery belongs — it's evidentiary, not decorative.

Never: stock photography of offices, generic "AI brain" graphics, glowing neural-network wireframes, or robot imagery. These read as the exact "AI-generated admin dashboard" cliché this spec exists to avoid.

19. Slides (NEW — real components, three distinct uses)

"Slide" is implemented as an actual reusable component pattern in components/slides/, used in three places:

19.1 Onboarding carousel

First-run experience: 3–5 slides introducing Overview, Prompts, Sources, and Agents. Horizontal, swipeable on touch, arrow/dot navigation on desktop. Each slide: one illustration (§18.1 style), one headline, one sentence of supporting copy. Skippable at any point.

19.2 Report export slides

The Reports feature (§29) generates an exportable, presentation-style sequence: Visibility Summary → Model Performance → Competitor Movement → Prompt Winners/Losers → Source Changes → Recommended Actions. Each is a self-contained "slide" — a fixed-aspect-ratio card (16:9) suitable for screenshotting or PDF export, reusing the same chart/table components as the live app so numbers never diverge between the dashboard and the exported report.

19.3 Agent-run summary card

When an agent (§28) completes a task, its result renders as a compact slide-style summary (not a chat bubble): what was analyzed, progress, and structured results — matching the "Competitor Analyst" example already in §28.

All three reuse one underlying <Slide> primitive (fixed aspect ratio option, consistent padding, theme-aware) rather than three separate implementations.

20. Overview Page — the Flagship Screen

Must answer: How visible are we? Is it improving? Which models drive it? How do we compare to competitors? Which prompts matter? What changed? What should we do next?

20.1 Hero

AI visibility
68.4%   +8.7 pts
Your brand appears in 68.4% of tracked AI answers.

420 tracked prompts · 6 AI models · 14 competitors


Every metric has context. No unexplained numbers, ever.

20.2 Primary visibility chart

Large, title "AI Visibility Over Time." Range controls: 7d / 30d / 90d / 12mo. View toggle: Visibility / Position / Sentiment. Multiple series, restrained curves, clear axes, hover tooltip, legend, comparison mode. No glow, no decorative gradient fills.

Hover tooltip example:

May 18
Dyvin              68.4%
Competitor A       71.2%
Competitor B       54.8%
Average position    2.3


20.3 Model performance

ChatGPT       72.4%   +9.2   #2.1
Claude        64.8%   +6.4   #3.0
Gemini        69.1%  +11.1   #2.4
Perplexity    67.8%   +7.8   #1.9


Columns: Visibility, Change, Average position, Mentions, Sentiment.

20.4 Competitive position

Columns: Brand, Visibility, Share of Voice, Avg. Position, Mentions, Trend. Highlight Dyvin's row subtly (accent-tinted left border or subtle surface tint) — never a solid bright fill across the whole row.

20.5 Prompt performance

Columns: Prompt, Category, Visibility, Position, Mentioned, Sentiment, Change.

20.6 Source/citation intelligence, Insights, Recommended actions

As specified in §24–§27 below, surfaced in condensed form on Overview with links to full pages.

Composition order: page context → primary metric → trend → model breakdown → competitive position → prompt performance → source intelligence → insights → recommended actions. Not every section is a card — use section breaks and typographic hierarchy so it reads as one continuous analysis, not a stack of boxes.

21. Chart Interaction Detail

Tooltips compact and polished, theme-aware (dark-mode tooltip is a distinct elevated surface, not the light-mode tooltip with inverted text). Selected point stays visible after hover ends until deselected. Comparison mode overlays a second brand/competitor series with a visually distinct (not just differently-colored) line style — e.g., solid vs. dashed — so the chart is legible for color-blind users too.

22. Prompt Detail

Clicking a prompt opens: prompt text, AI models, visibility, position, competitors, sentiment, sources, citations, answer examples, historical performance, recommendations. This view is where Dyvin becomes evidence-driven rather than a summary dashboard — spend real design effort here, not just on Overview.

23. Sources & Source Detail

Sources list: Domain (with real favicon per §18.3), Citation count, Share of citations, Authority, Trend. Source detail: citation frequency, brands mentioned, prompts where it appears, AI models using it, citation trend, relevant answer excerpts (quoted with the Quote icon per §9).

24. Insights

Not a KPI dashboard. Categories: Winning, Losing, Opportunity, Competitive, Source, Prompt. Each insight states what happened, why, and what to do.

WINNING
Dyvin gained 8.7 points of AI visibility this week.
Why: 12 high-volume commercial prompts improved.

OPPORTUNITY
23 high-volume prompts currently have visibility below 20%.
Potential impact: +11–16 visibility points
[Explore prompts →]


25. Agents

Structured task workflows, not a chatbot playground.

Competitor Analyst
Analyzing: Competitor A
Progress: Analyzing 84 prompts
Results: 3 emerging weaknesses · 7 citation opportunities · 12 prompt opportunities


Rendered using the <Slide> summary pattern from §19.3.

26. Reports

Executive-ready. Visibility summary, model performance, competitor movement, prompt winners/losers, source changes, recommended actions — assembled as the export-slide sequence from §19.2. Support export, date range, team sharing.

27. Filters

Date, AI Model, Country, Language, Brand, Competitor, Prompt category, Tag, Source. Combinable, with active filters shown as dismissible chips (SlidersHorizontal icon for the filter trigger). Compact controls, consistent height with header controls.

28. Tables

Clean headers, subtle row separators, compact but readable rows, strong numerical alignment (tabular-nums, right-aligned), status badges only where they add information, hover state, sorting, pagination, optional column visibility. Never feel like a spreadsheet — feel like a designed data surface.

29. Status Badges

Positive:      +8.7%     (success token)
Negative:      -4.2%     (danger token)
Neutral:       No change (Minus icon, muted-foreground, no color)
Opportunity:   Potential (info or warning token, per context)


No rainbow badges. Every color maps to one of the four semantic tokens, in both themes.

30. Loading, Empty, and Error States

Loading: skeletons matching actual component geometry, per page. No generic spinners as the default.

Empty: explain what's missing, why it matters, what to do next, using §18.1 illustrations.

No tracked prompts yet.
Add your first prompt to begin measuring AI visibility.
[Add prompts]


Error: human, specific, actionable.

We couldn't load visibility data.
[Retry]


Never surface raw error codes to the user.

31. Responsive Design

Targets: Desktop 1440px, Tablet 1024px, Mobile 390px. Recompose, don't shrink.

Mobile: sidebar → drawer, header stays compact, filters scroll horizontally, wide tables scroll horizontally or transform into stacked cards, charts keep readable dimensions, bottom actions stay accessible, onboarding carousel (§19.1) becomes swipe-native.

32. Accessibility

Keyboard navigation, visible focus rings (theme-aware — must be visible on dark surfaces too, not just a default browser blue outline that disappears on dark backgrounds), semantic buttons, aria labels, sufficient contrast (§13 targets), adequate touch targets (≥44px), reduced-motion support (prefers-reduced-motion respected — disable chart/transition animation), screen-reader-friendly labels, no color-only meaning (status always paired with an icon or text, per §9/§29).

33. Motion

Allowed: subtle page transitions, tooltip transitions, drawer transitions, filter transitions, sorting transitions, chart hover, onboarding slide transitions. Avoid: floating decorative objects, perpetual animation, glowing pulses, excessive spring/bounce easing. Premium SaaS motion is quiet — durations in the 120–220ms range, ease-out, no bounce.

34. Data Visualization Rules

Every chart answers a specific question. Line charts for trends, bars for comparison, stacked bars for composition, tables for precise values, scatter only when relationships genuinely matter. No donut charts for decoration. No chart exists without a one-line answer to "why is this chart here."

35. Analytics Density

Information-rich, not crowded: one large primary analytical surface per screen, supporting metrics beneath it, compact secondary tables, drill-down for depth. Avoid ten equally-weighted cards — there must always be a clear #1 element on every screen.

36. Data Storytelling Pattern (apply to every screen)

Primary question → Primary answer → Supporting evidence → Next action


Example:

Q: Are we becoming more visible?
A: Yes — 68.4%, up 8.7 points.
Evidence: Model breakdown + competitor movement.
Action: Investigate 23 declining prompts.


37. Routes

/overview
/visibility
/prompts
/prompts/:id
/competitors
/sources
/sources/:id
/insights
/agents
/reports
/settings


Auth can be layered in independently. Use URL query params for shareable filter state, e.g. /visibility?model=chatgpt&period=30d.

38. Mock Data

Realistic, fictional only — never real customer data, never live calls to Peec/Profound APIs.

Brands: Dyvin, Atlas AI, SignalFlow, Vector Labs, Northstar AI Models: ChatGPT, Claude, Gemini, Perplexity

39. Data Model (TypeScript types)

Brand, Competitor, Prompt, PromptPerformance, ModelPerformance, VisibilityPoint, CitationSource, Insight, AgentTask, Report — kept API-ready for future backend integration.

40. Service Boundary

services/
  analyticsService.ts
  promptsService.ts
  competitorsService.ts
  sourcesService.ts
  insightsService.ts


Mock implementations now; swappable for real API calls later. No large datasets hard-coded directly into presentation components.

41. State Management

Local React state where sufficient. No global state store unless a real cross-cutting need appears. URL query params for shareable filters (§37).

42. Performance

Avoid unnecessary re-renders, duplicated chart libraries, excessive dependencies, oversized icon imports (import Lucide icons individually, not the whole set). Lazy-load heavy routes. Monitor bundle size as part of the quality gate.

43. Visual QA Protocol

Build success ≠ visual success. These are separate checks, and each must be run in both light and dark mode:

Viewports: 1440×900, 1024×768, 390×844

Checklist per viewport, per theme: sidebar · header · typography · spacing · charts (line legibility, tooltip contrast) · tables · filters · buttons · focus states · responsive behavior · overflow · alignment · whitespace · hierarchy · icon consistency (§9) · illustration/empty states (§18) · contrast ratios (§13)

If actual rendered visual inspection cannot be performed, state explicitly: "Visual fidelity has not been independently verified." Never claim zero discrepancies, and never claim dark mode is correct, without having actually rendered and inspected it — dark mode is where most unverified claims break.

44. Quality Gate (per page, before marking complete)

Check Question Product Does it answer a real user question? Design Does it feel premium in both themes? Hierarchy Is the primary information obvious at a glance? Data Are metrics understandable without explanation? Interaction Can users drill down? Accessibility Can keyboard/screen-reader users operate it? Responsive Does it work at 390px? Icons Does every icon match the locked map in §9? Imagery Do empty/onboarding states follow §18, not stock art? Performance Is it reasonably fast? Consistency Does it match the rest of the Dyvin system?

45. Build Order

Phase 1 — Foundation: Vite, React, TypeScript, Tailwind, shadcn/ui, Lucide, Recharts, routing, both theme token sets, theme switching mechanics. Phase 2 — Shell: sidebar, header, responsive nav, workspace selector, theme toggle. Phase 3 — Overview (flagship — build to full quality bar, both themes, before continuing). Phase 4 — Visibility → Phase 5 — Prompts → Phase 6 — Competitors → Phase 7 — Sources → Phase 8 — Insights → Phase 9 — Agents → Phase 10 — Reports (incl. export slides) → Phase 11 — Settings → Phase 12 — Onboarding carousel.

Do not generate the entire application in one pass. Build the design system first — including both themes — then one exceptional flagship screen, verified in both modes, before propagating its patterns outward.

46. Design Anti-Patterns (final list — never introduce)

Neon cyan · cyberpunk gradients · glowing cards · excessive blur/glass · giant undifferentiated KPI grids · meaningless donut charts · rainbow charts · oversized headings everywhere · random emoji · inconsistent icon sets · fake AI terminal screens · matrix/neural-network backgrounds · unnecessary 3D · excessive rounded rectangles · stock photography of offices/laptops/robots · dark mode as a simple color inversion.

47. Final Visual Target

On opening Dyvin, in either theme, the reaction should be:

"This looks like a serious AI-search intelligence company built this."

Not:

"This looks like an AI-generated admin dashboard."

Whitespace deliberate. Charts analytical. Tables precise. Interactions obvious. The interface calm even when the underlying data is complex — in light mode and in dark mode, equally.

48. Coding Agent Master Instruction

You are the senior frontend engineer and product UI implementation agent for this build.

Before coding: inspect the repository, confirm the current stack, install only required dependencies, establish design tokens for both themes, establish component primitives, establish routing, establish mock service boundaries, establish the locked icon map (§9).

Then build in phases (§45). Do not blindly generate hundreds of components. Do not repeatedly redesign the whole application. Do not replace working architecture without reason. Do not introduce visual effects because they're trendy. Do not claim visual fidelity, in either theme, without rendering and inspecting the actual application at all three viewports.

First implementation task: project foundation, design tokens (light + dark), typography, theme switching, application shell, sidebar, header, Overview page skeleton, primary AI Visibility analytical surface. Then run the app, render at 1440×900 / 1024×768 / 390×844, in both themes, inspect the result, fix visual issues. Only then proceed to other pages.

49. Definition of Done

The frontend succeeds only when:

It feels like a premium SaaS product, in both light and dark mode

It does not resemble a generic AI dashboard or cybersecurity software

Information architecture is coherent

Analytics have clear meaning; every chart answers a stated question

Tables are polished; navigation is intuitive

Responsive layouts are intentional, not shrunk

Accessibility targets (§32) are met

The icon system (§9) is applied without exception

Imagery and empty states (§18) follow the editorial-illustration direction, never stock/generic AI art

Onboarding, report-export, and agent-summary slides (§19) share one underlying component

Mock data is realistic; backend integration can be added later without rework

Components are reusable; build succeeds; visual QA (§43) has actually been performed in both themes

Final quality bar: Peec-level visual polish + Profound-level analytical depth + a genuinely excellent, independently-designed dark mode + an original Dyvin identity that could credibly be sold as an enterprise product today.

Do not stop at "it works."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/abaa4d79-fa0a-40bb-8fd7-0741bf29e7a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
