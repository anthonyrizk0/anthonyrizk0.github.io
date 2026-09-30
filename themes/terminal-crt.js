// Terminal theme: the CRT layer.
//
// Four fixed layers over the page, pointer-events off: tube vignette,
// scanlines, a faint refresh band rolling down, and film-like grain. They only
// darken and lighten what's under them — the résumé stays real text, selectable
// and indexable. Readability is the budget: every value here is tuned faint on
// purpose, and should be turned down rather than up.
//
// Why CSS and not a shader. The first version was a WebGL fragment shader doing
// exactly these four things. It ran at 60fps when the page loaded in Terminal,
// but after picking Terminal from Classic it fell to 1–10fps and stayed there,
// in testing on a software GPU — independent of canvas resolution, context
// reuse, layer promotion or the text glow, so not something tuning would fix.
// Nothing in this effect needs per-pixel computation: a vignette is a radial
// gradient, scanlines a repeating one, the band a gradient that translates, the
// grain a noise tile that steps. Animated only through transform, all of it is
// compositor work, and it held 60fps on load, after a pick, and after repeated
// switching. WebGL is kept for effects that genuinely need a shader.

// Grain is a pre-rendered 128px noise tile (themes/grain.png, generated once)
// and it holds still. A moving grain — first as an SVG noise filter, then as
// this same image jumping ten times a second — kept 60fps on the frame counter
// but stalled and timed out screenshots in testing: a full-viewport translucent
// layer re-blended every jump. Still, it costs about the same as no grain at
// all. The rolling band already makes the screen feel alive; the flicker wasn't
// worth being the most expensive thing on a phone.
// Carries this module's ?v= so a new grain is never served from a stale cache.
const GRAIN = new URL("./grain.png", import.meta.url).href + new URL(import.meta.url).search;

const CSS = `
.term-crt {
  position: fixed; inset: 0; overflow: hidden;
  pointer-events: none; z-index: 31;   /* over the page *and* the prompt (30):
                                          the prompt is on the screen, so it sits
                                          behind the glass like everything else */
}
.term-crt > div { position: absolute; }

/* The lit phosphor: a faint green glow in the middle of the screen. On a page
   this dark, an effect that only darkens has nothing to darken — the light is
   what makes the edges visibly fall away. */
.term-crt .lit {
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 45%, rgba(125,232,135,.075), transparent 70%);
}
/* The edges fall away like a curved screen. */
.term-crt .vig {
  inset: 0;
  /* Taller than it is wide, so the darkening falls mostly at the sides — the
     prompt lives at the bottom edge and must stay bright. */
  background: radial-gradient(ellipse 72% 95% at 50% 50%, transparent 50%, rgba(0,0,0,.7) 100%);
}
/* The glass: rounded corners with a dark bezel outside them, and a soft
   shadow just inside the edge. This is the part that reads as "a monitor"
   at a glance. */
/* !important because the theme squares off every element on the page with
   body * { border-radius: 0 !important; box-shadow: none !important } — which
   silently erased this whole layer until it was checked in computed style.
   (.term-crt .glass outranks body * on specificity once both are important.) */
.term-crt .glass {
  inset: 12px; border-radius: 34px / 28px !important;
  box-shadow:
    0 0 0 1px rgba(200,220,205,.10),      /* lip of the bezel catching light */
    0 0 0 60px #1a1d1b,                   /* the bezel: grey plastic, not black —
                                             it has to read as a different
                                             material from the dark glass */
    inset 0 0 46px 4px rgba(0,0,0,.6),    /* glass darkening into the curve */
    inset 0 0 0 1px rgba(0,0,0,.8) !important;
}
/* A scanline every 3 CSS pixels — dark enough to cut through the text. */
.term-crt .scan {
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1px, transparent 1px 3px);
}
/* The refresh band: a soft bright bar drifting down every ~13s. */
.term-crt .band {
  left: 0; right: 0; top: -30vh; height: 30vh;
  background: linear-gradient(transparent, rgba(125,232,135,.11) 50%, transparent);
  animation: crt-band 13s linear infinite;
  will-change: transform;
}
/* Grain: one still noise tile. */
.term-crt .grain {
  inset: 0; opacity: .11;
  background: url("${GRAIN}");
}
@keyframes crt-band { from { transform: translateY(0); } to { transform: translateY(160vh); } }
/* Reduced motion keeps everything still — tube, glass, lines, grain — and
   drops the one thing that moves. */
@media (prefers-reduced-motion: reduce) {
  .term-crt .band { display: none; }
}
@media print { .term-crt { display: none !important; } }
@media (max-width: 600px) {
  .term-crt .glass { inset: 6px; border-radius: 22px / 18px !important; }
}

/* Power-on: the screen snaps open from a bright horizontal line. Only when the
   theme was just picked — arriving on an already-terminal page shouldn't
   perform at you every time. */
.term-boot .container { animation: term-boot 560ms cubic-bezier(.2,.8,.2,1) both; transform-origin: 50% 40vh; }
.term-boot::after {
  content: ""; position: fixed; inset: 0; z-index: 32; pointer-events: none;
  background: radial-gradient(ellipse 80% 2% at 50% 40%, #d9ffe0, transparent 70%);
  animation: term-boot-flash 560ms ease-out both;
}
@keyframes term-boot {
  0%   { transform: scale(1, 0.004); filter: brightness(6); }
  38%  { transform: scale(1, 0.004); filter: brightness(6); }
  62%  { transform: scale(1, 1.02);  filter: brightness(1.8); }
  100% { transform: scale(1, 1);     filter: none; }
}
@keyframes term-boot-flash {
  0% { opacity: 1; } 40% { opacity: 1; } 100% { opacity: 0; }
}
`;

export function mountCRT(ctx) {
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const layer = document.createElement("div");
  layer.className = "term-crt";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `<div class="lit"></div><div class="vig"></div><div class="scan"></div><div class="band"></div><div class="grain"></div><div class="glass"></div>`;
  document.body.appendChild(layer);

  let bootTimer = 0;
  if (ctx.reason === "pick" && !ctx.reducedMotion) {
    document.body.classList.add("term-boot");
    bootTimer = setTimeout(() => document.body.classList.remove("term-boot"), 650);
  }

  return function unmountCRT() {
    clearTimeout(bootTimer);
    document.body.classList.remove("term-boot");
    layer.remove();
    style.remove();
  };
}
