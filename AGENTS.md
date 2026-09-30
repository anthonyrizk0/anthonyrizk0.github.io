# anthonyrizk.me

Anthony's résumé site. Public repo, served by GitHub Pages at the apex domain
(see `CNAME`). The Ask box calls `ask.anthonyrizk.me`, which lives in the
sibling repo `../ask-api` — that one has its own `AGENTS.md`.

## How it's built

**Hand-written HTML with inline `<style>` in each page. No framework, no build
step, no dependencies.** Don't introduce any — a push to `main` is the deploy,
and that only works because the files are the artifact. Pages take a minute or
two to go live; verify with `curl` rather than assuming.

GitHub Pages serves extensionless URLs, so `mcp.html` answers at `/mcp` and
`plantvision.html` at `/plantvision`. A trailing slash 404s, so absolute asset
paths (`/pv/foo.jpg`) are the safer habit.

## Things that will bite you

- **`index.html` carries a full print stylesheet** as well as the screen one.
  It's how the page becomes a clean PDF, and it's easy to break without
  noticing, because nothing renders differently on screen. If you touch layout,
  check print too. `.links` is hidden on paper by design.
- **`anthony_rizk_resume_sep2026.pdf` is a Google Docs export**, not generated
  from this page. It drifts. When the résumé changes, the PDF needs
  re-exporting by hand, and it's the copy that ends up in ATS systems.
  `pdftotext -layout` is the way to diff it against the page.
- **Prose on a published page is Anthony's voice, not yours.** Offer structure,
  headings, figure captions and technical content; say plainly that connective
  prose is a placeholder for him to rewrite, and don't link a new page from the
  résumé until he's passed over it. `/plantvision` is currently live but
  deliberately unlinked.
- **The view-source comment at the top of `index.html`** is an easter egg
  advertising the MCP endpoint. It describes how the endpoint is bounded, so it
  goes stale when that changes — it has already drifted once.

## Link previews

The `og:`/`twitter:` tags in `index.html` drive how the link looks when shared.
The image is `og/card-v2.png`, rendered from `og/card.html` with a headless
browser at 1200×630 — edit the HTML and re-render; don't hand-edit the PNG.
LinkedIn often shows it as a **160×84 thumbnail**, so the card is deliberately
just two big elements; anything smaller turns to mush. Give a changed card a new
filename, because platforms cache images by URL. Platforms
cache previews for days, so after any change re-scrape with LinkedIn's Post
Inspector and Facebook's Sharing Debugger. If the tagline on the page changes,
the card and the description tag need changing too.

`sitemap.xml` lists the public pages. `/plantvision` is deliberately absent
until it's linked from the résumé.

## Themes

One axis, stored in `localStorage.theme` and set as `data-theme` on `<html>`
before first paint by the inline script at the top of `<head>`:

- unset → Classic, following the OS colour scheme
- `light` / `dark` → Classic pinned (what the sun/moon toggle writes)
- `terminal`, … → novelty themes that own their palette; the toggle hides

`?theme=` in the URL wins for that view but is **never persisted** — only a
pill click persists, so a shared joke link doesn't haunt the recipient. A
stored novelty theme is written back into the URL with `replaceState`.

**Bump `VERSION` in the theme registry at the top of `index.html` whenever anything in `themes/` changes.** Browsers cache those files for ten minutes and a hard refresh doesn't reliably refetch a dynamic import, so without a new URL visitors run old theme code against a new page.

Adding a theme touches four places, and missing one fails silently: an entry
in the registry (`NOVELTY` in the head script — optionally with a `module` and
`fonts`), a pill in `.theme-picker`, its CSS, and `theme_<name>` in the event
allowlist in `../ask-api/src/server.ts`. Everything else reads the registry. Theme CSS goes inside `@media screen` so print
always comes out Classic, and it must not add or remove content — same DOM,
same words, every theme. Classic's OS-dark rule is scoped to
`:root:not([data-theme])` so it can't leak under a novelty theme.

### Theme modules

A theme can optionally have a JS module in `themes/<name>.js`, registered in
`MODULES` in the picker script. It's `import()`ed only when that theme is
active — Classic visitors download none of it — and after the CSS has already
painted, so a failed module leaves a working themed page.

Contract: `export function mount(ctx)` returns an `unmount` that removes
*everything* it created — elements, injected `<style>`, listeners, timers,
animation frames, body classes. `ctx` has `reducedMotion` and `setTheme(name)`.
Modules decorate the résumé and never replace or alter its content; anything
they add is hidden in print. Rapid theme switching is handled by the loader
(a stale import is dropped), but a module that leaks on unmount will stack up.

WebGL can't read DOM pixels, so a shader can't run *over* the live text —
shader layers go behind or above it, and real-text effects use CSS/SVG filters.

**Reach for CSS before WebGL**, and animate only `transform` and `opacity`.
Terminal's CRT layer started as a WebGL shader and was replaced: it held 60fps
when the page loaded in Terminal but fell to 1–10fps after picking Terminal from
Classic, and nothing about the canvas fixed it. The same look in CSS holds 60fps
in every case. Keep WebGL for effects that genuinely need per-pixel work.

## /phone

`phone.html` is the résumé as a phone home screen, and it has **no content of
its own**: it fetches `/` and builds every app from the résumé's markup. The
contract is these class names — `.exp-item`, `.company` (+ `.acq`), `.period`,
`.role`, `.desc li`, `.tech`, `.skill-tag`, `.pub-item`, `.edu-item`,
`.links a`, `.ask-chip`. Renaming any of them breaks the phone silently, so
check `/phone` after changing résumé structure.

It sits in the theme row as "Phone ↗" because that's what it is to a visitor,
but structurally it's a separate page. Spotlight hands questions to the résumé
via `/?ask=…#ask` rather than running its own Ask client — one Ask client, not
two. It's `noindex` and out of the sitemap while it's a first cut.

## Funnel events

The Ask box posts a fixed vocabulary of event names to `/event` — no free text,
no identifiers, nothing about the visitor. Adding a new event means adding it
to the allowlist in `../ask-api/src/server.ts` too, or it's silently dropped.

**The beacon body is `text/plain`, and that isn't sloppiness.** The call is
cross-origin and `sendBeacon` can't preflight, so a non-safelisted type like
`application/json` is dropped silently by Chrome. It was, for a week — three
humans asked questions in one afternoon and the funnel logged nothing. Don't
"correct" it back. The server parses the body as JSON whatever the header says.
