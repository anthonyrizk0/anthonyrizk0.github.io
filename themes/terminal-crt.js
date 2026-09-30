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

const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/>` +
      `<feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  );

const CSS = `
.term-crt {
  position: fixed; inset: 0; overflow: hidden;
  pointer-events: none; z-index: 25;   /* over the page, under the prompt (30) */
}
.term-crt > div { position: absolute; }

/* The edges fall away like a curved screen. */
.term-crt .vig {
  inset: 0;
  background: radial-gradient(ellipse 78% 70% at 50% 50%, transparent 52%, rgba(0,0,0,.62) 100%);
}
/* A scanline every 3 CSS pixels. */
.term-crt .scan {
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.075) 0 1px, transparent 1px 3px);
}
/* The refresh band: a soft bright bar drifting down every ~13s. */
.term-crt .band {
  left: 0; right: 0; top: -30vh; height: 30vh;
  background: linear-gradient(transparent, rgba(125,232,135,.045) 50%, transparent);
  animation: crt-band 13s linear infinite;
  will-change: transform;
}
/* Grain: one noise tile, jumped between offsets rather than re-rendered. */
.term-crt .grain {
  inset: -160px; opacity: .06;
  background: url("${NOISE}");
  animation: crt-grain .5s steps(5) infinite;
  will-change: transform;
}
@keyframes crt-band { from { transform: translateY(0); } to { transform: translateY(160vh); } }
@keyframes crt-grain {
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(-37px, 23px); }
  40%  { transform: translate(51px, -11px); }
  60%  { transform: translate(-19px, -47px); }
  80%  { transform: translate(29px, 41px); }
  100% { transform: translate(0, 0); }
}
/* Reduced motion keeps the still parts — the tube and the lines — and drops
   everything that moves. */
@media (prefers-reduced-motion: reduce) {
  .term-crt .band, .term-crt .grain { display: none; }
}
@media print { .term-crt { display: none !important; } }

/* Power-on: the screen snaps open from a bright horizontal line. Only when the
   theme was just picked — arriving on an already-terminal page shouldn't
   perform at you every time. */
.term-boot .container { animation: term-boot 560ms cubic-bezier(.2,.8,.2,1) both; transform-origin: 50% 40vh; }
.term-boot::after {
  content: ""; position: fixed; inset: 0; z-index: 26; pointer-events: none;
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
  layer.innerHTML = `<div class="vig"></div><div class="scan"></div><div class="band"></div><div class="grain"></div>`;
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
