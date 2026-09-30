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

## Themes

One axis, stored in `localStorage.theme` and set as `data-theme` on `<html>`
before first paint by the inline script at the top of `<head>`:

- unset → Classic, following the OS colour scheme
- `light` / `dark` → Classic pinned (what the sun/moon toggle writes)
- `terminal`, … → novelty themes that own their palette; the toggle hides

`?theme=` in the URL wins for that view but is **never persisted** — only a
pill click persists, so a shared joke link doesn't haunt the recipient. A
stored novelty theme is written back into the URL with `replaceState`.

Adding a theme touches four places, and missing one fails silently: the
`THEMES`/`NOVELTY` arrays in the head script, `NOVELTY` in the picker script, a
pill in `.theme-picker`, and `theme_<name>` in the event allowlist in
`../ask-api/src/server.ts`. Theme CSS goes inside `@media screen` so print
always comes out Classic, and it must not add or remove content — same DOM,
same words, every theme. Classic's OS-dark rule is scoped to
`:root:not([data-theme])` so it can't leak under a novelty theme.

## Funnel events

The Ask box posts a fixed vocabulary of event names to `/event` — no free text,
no identifiers, nothing about the visitor. Adding a new event means adding it
to the allowlist in `../ask-api/src/server.ts` too, or it's silently dropped.

**The beacon body is `text/plain`, and that isn't sloppiness.** The call is
cross-origin and `sendBeacon` can't preflight, so a non-safelisted type like
`application/json` is dropped silently by Chrome. It was, for a week — three
humans asked questions in one afternoon and the funnel logged nothing. Don't
"correct" it back. The server parses the body as JSON whatever the header says.
