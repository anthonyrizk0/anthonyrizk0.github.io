// PlantVision theme: the résumé, seen through PlantVision.
//
// The page is the camera feed. Everything identifiable in view gets a faint
// detection box (the "YOLO" stage); whatever's under the reticle becomes the
// tracked candidate, and its identity is built up pass by pass — confidence
// accumulating as incremental evidence across frames, the actual insight from
// building PlantVision at Greg. Move too fast and confidence decays ("hold
// steady"); frame it badly and angle guidance says which way to go. A crop
// inset shows the region going to the classifier, a scheduler panel shows
// candidates competing for inference passes, and a test-harness panel exposes
// the knobs — pass rate, lock threshold, candidates per pass, bias correction.
//
// Pointer: the reticle follows the cursor. Touch: it stays in the centre of
// the screen and scrolling moves the page under it, which is how you point a
// camera.
//
// It reads the page and draws over it; it never changes the words. Everything
// it adds is removed on unmount and hidden in print.

const CSS = `
.pv-layer { position: fixed; inset: 0; z-index: 40; pointer-events: none; font-family: "JetBrains Mono", ui-monospace, Menlo, monospace; color: #e8fff0; }
.pv-layer * { box-sizing: border-box; }
.pv-feed { position: fixed; inset: 0; z-index: 39; pointer-events: none;
  background:
    radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%),
    radial-gradient(ellipse 70% 60% at 50% 45%, rgba(91,227,138,.05), transparent 70%); }
.pv-grain { position: fixed; inset: 0; z-index: 39; pointer-events: none; opacity: .07; background: var(--pv-grain); }

/* Detection boxes */
.pv-box { position: absolute; left: 0; top: 0; will-change: transform, width, height; border: 1px dashed rgba(180,255,200,.28); border-radius: 3px; transition: opacity .2s, border-color .2s; }
.pv-box .tag { position: absolute; left: -1px; top: -16px; font-size: 9px; padding: 1px 4px; background: rgba(0,0,0,.55); color: rgba(200,255,215,.7); white-space: nowrap; border-radius: 2px; }
.pv-box.target { border: none; }
.pv-box.target .tag { display: none; }
.pv-box .c { position: absolute; width: 16px; height: 16px; border: 2.5px solid var(--pv-c, #ffcc4d); display: none; }
.pv-box.target .c { display: block; }
.pv-box .c.tl { left: -3px; top: -3px; border-right: none; border-bottom: none; }
.pv-box .c.tr { right: -3px; top: -3px; border-left: none; border-bottom: none; }
.pv-box .c.bl { left: -3px; bottom: -3px; border-right: none; border-top: none; }
.pv-box .c.br { right: -3px; bottom: -3px; border-left: none; border-top: none; }
.pv-box.target::after { content: ""; position: absolute; inset: 0; border: 1px solid var(--pv-c, #ffcc4d); opacity: .35; border-radius: 3px; }
.pv-box.locked { --pv-c: #5be38a; }
.pv-box.locked::before { content: ""; position: absolute; inset: -6px; border: 2px solid #5be38a; border-radius: 6px; animation: pv-ping .7s ease-out both; }
@keyframes pv-ping { from { opacity: .9; transform: scale(.96); } to { opacity: 0; transform: scale(1.04); } }

/* Label pill on the target */
.pv-label { position: absolute; left: 0; top: 0; will-change: transform; padding: 6px 10px 7px; border-radius: 8px;
  background: rgba(8,14,10,.82); border: 1px solid var(--pv-c, #ffcc4d); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  min-width: 190px; transition: border-color .2s; }
.pv-label .n { font: 600 13px Inter, system-ui, sans-serif; color: #fff; display: flex; justify-content: space-between; gap: 10px; }
.pv-label .n b { color: var(--pv-c, #ffcc4d); font-family: "JetBrains Mono", monospace; font-weight: 600; }
.pv-label .l { font: italic 11.5px Georgia, "Times New Roman", serif; color: #b9f5cd; margin-top: 1px; }
.pv-probs { margin-top: 6px; display: grid; gap: 2px; }
.pv-probs div { display: grid; grid-template-columns: 1fr 56px 34px; gap: 6px; align-items: center; font-size: 9.5px; color: rgba(220,255,230,.75); }
.pv-probs i { display: block; height: 4px; border-radius: 2px; background: rgba(255,255,255,.12); overflow: hidden; }
.pv-probs i::after { content: ""; display: block; height: 100%; width: var(--w); background: var(--pv-c, #ffcc4d); }
.pv-probs div:not(:first-child) i::after { background: rgba(200,255,215,.45); }

/* Reticle */
.pv-reticle { position: absolute; left: 0; top: 0; width: 64px; height: 64px; margin: -32px 0 0 -32px; will-change: transform; }
.pv-reticle::before, .pv-reticle::after { content: ""; position: absolute; background: rgba(230,255,238,.85); }
.pv-reticle::before { left: 31px; top: 14px; width: 2px; height: 36px; }
.pv-reticle::after { top: 31px; left: 14px; height: 2px; width: 36px; }
.pv-reticle .ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(230,255,238,.6); transition: transform .25s, border-color .25s; }
.pv-reticle.busy .ring { border-color: #ffcc4d; animation: pv-spin 1.6s linear infinite; border-style: dashed; }
.pv-reticle.locked .ring { border-color: #5be38a; transform: scale(.7); }
@keyframes pv-spin { to { transform: rotate(360deg); } }

/* HUD */
.pv-hud { position: absolute; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 10.5px; letter-spacing: .5px; text-shadow: 0 1px 2px #000; }
/* --pv-safe is measured every frame: the bottom of the theme picker when it's
   on screen (it can wrap to two rows on a phone), otherwise the top edge. The
   picker is the way out, so nothing in the overlay may sit on it. */
.pv-top { top: var(--pv-safe, 10px); }
.pv-sched, .pv-harness { top: calc(var(--pv-safe, 10px) + 30px); }
.pv-bot { bottom: 12px; justify-content: center; }
.pv-hud .grp { display: flex; gap: 12px; align-items: center; background: rgba(0,0,0,.42); padding: 4px 9px; border-radius: 6px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.pv-rec { width: 7px; height: 7px; border-radius: 50%; background: #ff4d4d; display: inline-block; margin-right: 5px; animation: pv-blink 1.2s steps(1) infinite; }
@keyframes pv-blink { 50% { opacity: .2; } }
.pv-guide { font: 600 13px Inter, system-ui, sans-serif; letter-spacing: 0; background: rgba(0,0,0,.6); padding: 7px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); }
.pv-guide.warn { color: #ffcc4d; border-color: rgba(255,204,77,.4); }
.pv-guide.ok { color: #5be38a; border-color: rgba(91,227,138,.4); }
.pv-layer.carded .pv-bot { opacity: 0; }
.pv-corners::before, .pv-corners::after { content: ""; position: fixed; width: 34px; height: 34px; border: 2px solid rgba(230,255,238,.45); }
.pv-corners::before { left: 8px; top: 34px; border-right: none; border-bottom: none; }
.pv-corners::after { right: 8px; bottom: 50px; border-left: none; border-top: none; }

/* Scheduler panel */
.pv-sched { position: absolute; right: 12px; width: 220px; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 7px 9px; font-size: 9.5px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.pv-sched h4, .pv-crop h4, .pv-harness h4 { margin: 0 0 5px; font-size: 9px; font-weight: 600; letter-spacing: 1.5px; color: rgba(200,255,215,.6); }
.pv-sched .row { display: grid; grid-template-columns: 1fr 50px 30px; gap: 6px; align-items: center; padding: 1.5px 0; color: rgba(225,255,235,.82); }
.pv-sched .row.ran { color: #fff; }
.pv-sched .row.ran .nm::before { content: "▶ "; color: #ffcc4d; }
.pv-sched .nm { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pv-sched i { display: block; height: 3px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; }
.pv-sched i::after { content: ""; display: block; height: 100%; width: var(--w); background: #7fd6ff; }
.pv-sched .ft { margin-top: 5px; color: rgba(200,255,215,.55); display: flex; justify-content: space-between; }

/* Crop inset */
.pv-crop { position: absolute; left: 12px; bottom: 54px; width: 170px; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.1); border-radius: 8px; padding: 7px 8px 8px; font-size: 9px; }
.pv-crop .win { position: relative; width: 152px; height: 152px; overflow: hidden; border-radius: 4px; background: #0d0e1a; border: 1px solid rgba(255,255,255,.12); }
.pv-crop .win > .clone { position: absolute; left: 0; top: 0; transform-origin: 0 0; pointer-events: none; filter: grayscale(.85) contrast(1.25) brightness(1.05); }
.pv-crop .win::after { content: ""; position: absolute; left: 0; right: 0; height: 22%; top: -22%; background: linear-gradient(transparent, rgba(91,227,138,.35), transparent); animation: pv-scan 1.1s linear infinite; }
.pv-crop .cap { margin-top: 5px; color: rgba(200,255,215,.6); display: flex; justify-content: space-between; }
@keyframes pv-scan { to { top: 100%; } }

/* Species card */
.pv-card { position: absolute; right: 12px; bottom: 54px; width: 300px; pointer-events: auto; background: rgba(8,14,10,.9); border: 1px solid #5be38a; border-radius: 12px; padding: 12px 14px; box-shadow: 0 12px 40px rgba(0,0,0,.6);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transform: translateY(16px); opacity: 0; transition: transform .3s cubic-bezier(.2,.8,.2,1), opacity .25s; }
.pv-card.on { transform: none; opacity: 1; }
.pv-card .kick { font-size: 9px; letter-spacing: 1.5px; color: #5be38a; }
.pv-card .nm { font: 700 19px Inter, system-ui, sans-serif; color: #fff; margin-top: 3px; }
.pv-card .lat { font: italic 13px Georgia, "Times New Roman", serif; color: #b9f5cd; }
.pv-card .meta { font: 12px Inter, system-ui, sans-serif; color: rgba(225,255,235,.75); margin-top: 6px; line-height: 1.45; }
.pv-card .acts { display: flex; gap: 8px; margin-top: 10px; }
.pv-card button { pointer-events: auto; cursor: pointer; font: 600 12px Inter, system-ui, sans-serif; border-radius: 8px; padding: 7px 11px; border: 1px solid rgba(91,227,138,.6); background: rgba(91,227,138,.15); color: #c9ffd9; }
.pv-card button.ghost { border-color: rgba(255,255,255,.18); background: none; color: rgba(225,255,235,.7); }

/* Motion sensors */
.pv-mbtn { pointer-events: auto; cursor: pointer; font: 600 10px "JetBrains Mono", monospace; letter-spacing: 1px; color: #0a140e; background: #5be38a; border: none; border-radius: 6px; padding: 5px 9px; white-space: nowrap; }
.pv-mbtn.off { background: rgba(0,0,0,.45); color: rgba(225,255,235,.6); border: 1px solid rgba(255,255,255,.15); }
.pv-level { position: absolute; left: 0; top: 0; width: 150px; height: 2px; margin: -1px 0 0 -75px; will-change: transform; }
.pv-level::before, .pv-level::after { content: ""; position: absolute; top: 0; width: 40px; height: 2px; background: rgba(230,255,238,.75); border-radius: 1px; transition: background .2s; }
.pv-level::before { left: 0; } .pv-level::after { right: 0; }
.pv-level.level::before, .pv-level.level::after { background: #5be38a; box-shadow: 0 0 6px rgba(91,227,138,.8); }

/* Test harness */
.pv-hbtn { pointer-events: auto; cursor: pointer; font: 600 10px "JetBrains Mono", monospace; letter-spacing: 1px; color: #c9ffd9; background: rgba(0,0,0,.45); border: 1px solid rgba(91,227,138,.45); border-radius: 6px; padding: 4px 8px; }
.pv-harness { position: absolute; right: 12px; width: 240px; pointer-events: auto; background: rgba(6,10,8,.92); border: 1px solid rgba(91,227,138,.45); border-radius: 10px; padding: 10px 12px; font-size: 10.5px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.pv-harness label { display: block; margin-top: 8px; color: rgba(225,255,235,.85); }
.pv-harness label span { float: right; color: #5be38a; }
.pv-harness input[type=range] { width: 100%; accent-color: #5be38a; margin-top: 3px; }
.pv-harness .note { margin-top: 8px; font-size: 9.5px; color: rgba(200,255,215,.55); line-height: 1.4; }

/* Boot */
.pv-boot { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; background: rgba(4,7,5,.9); pointer-events: none; transition: opacity .4s; font-family: "JetBrains Mono", monospace; color: #c9ffd9; }
.pv-boot.done { opacity: 0; }
.pv-boot .b { width: min(340px, 80vw); font-size: 11px; }
.pv-boot .bar { margin-top: 8px; height: 4px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; }
.pv-boot .bar i { display: block; height: 100%; width: 0; background: #5be38a; transition: width .2s; }
.pv-boot .t { margin-top: 6px; color: rgba(200,255,215,.6); }

@media (max-width: 760px) {
  .pv-sched, .pv-crop { display: none; }
  .pv-hud { font-size: 9.5px; gap: 6px; left: 8px; right: 8px; }
  .pv-hud .grp { gap: 8px; padding: 4px 7px; white-space: nowrap; }
  .pv-top .grp.stats { display: none; }
  .pv-hbtn { font-size: 9px; padding: 4px 7px; white-space: nowrap; }
  .pv-card { left: 12px; right: 12px; width: auto; bottom: 58px; }
  .pv-top .grp.cam { display: none; }
  .pv-harness { left: 12px; right: 12px; width: auto; }
}
@media print { .pv-layer, .pv-feed, .pv-grain, .pv-boot { display: none !important; } }
@media (prefers-reduced-motion: reduce) {
  .pv-rec, .pv-crop .win::after, .pv-reticle.busy .ring, .pv-box.locked::before { animation: none !important; }
}
`;

// Common name → Latin binomial, the way PlantVision labelled a hydrangea.
// Keyed by slug of the company name; anything missing gets a generated one.
const LATIN = {
  classdojo: "Pedagogia dojensis",
  greg: "Viridis botanicus",
  facebook: "Messengeria lightspeedii",
  google: "Androidus servicium",
  cape: "Aerovehicula remota",
  tableau: "Tableau vizabilis",
  vmware: "Virtualis airwatchii",
  zeebumobile: "Zeebu infantilis",
  rovemobile: "Rove administratrix",
  bitheads: "Moai capitalis",
  truecontext: "Formularia mobilis",
};
const OTHER = {
  nameplate: ["Anthony Rizk", "Homo sapiens engineerus"],
  skills: ["Skills", "Competentia varia"],
  publications: ["Publications", "Liber blackberrius"],
  education: ["Education", "Mathematica waterlooensis"],
  ask: ["Ask box", "Oraculum corporis"],
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function mount(ctx) {
  const cleanups = [];
  const on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); cleanups.push(() => el.removeEventListener(ev, fn, o)); };
  const reduced = ctx.reducedMotion;
  const touch = window.matchMedia("(pointer: coarse)").matches;

  // ── Candidates: what the "detector" can find on the page ──────────
  const cands = [];
  const add = (el, name, latin, extra = {}) => cands.push({ el, name, latin, evidence: 0, conf: 0, prio: 0, ran: 0, seen: 0, box: null, smooth: null, ...extra });
  const nameplate = document.querySelector(".nameplate");
  if (nameplate) add(nameplate, ...OTHER.nameplate, { kind: "nameplate" });
  const seen = {};
  document.querySelectorAll(".exp-item").forEach((item) => {
    const c = item.querySelector(".company");
    const raw = text(c && c.firstChild ? { textContent: c.firstChild.textContent } : c);
    const name = raw.split(/\s[—(]/)[0];
    const key = slug(name);
    const period = text(item.querySelector(".period"));
    // Both Facebook stints are just "Facebook" here — the dates on the card
    // tell them apart, and "Facebook ’19" read as noise in a label.
    const label = name;
    seen[key] = true;
    add(item, label, LATIN[key] || name + " incognita", { kind: "role", key, period, title: text(item.querySelector(".role")) });
  });
  document.querySelectorAll("section").forEach((sec) => {
    const h = text(sec.querySelector("h2")).toLowerCase();
    const k = h.startsWith("skills") ? "skills" : h.startsWith("publications") ? "publications" : h.startsWith("education") ? "education" : sec.id === "ask" ? "ask" : null;
    if (k) add(sec, ...OTHER[k], { kind: k });
  });
  const roles = cands.filter((c) => c.kind === "role");

  // ── Overlay DOM ───────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
  const feed = document.createElement("div"); feed.className = "pv-feed";
  const grain = document.createElement("div"); grain.className = "pv-grain";
  grain.style.setProperty("--pv-grain", `url("${new URL("./grain.png", import.meta.url).href + new URL(import.meta.url).search}")`);
  const layer = document.createElement("div");
  layer.className = "pv-layer pv-corners";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `
    <div class="pv-boxes"></div>
    <div class="pv-label" hidden><div class="n"><span class="nm"></span><b class="pc"></b></div><div class="l"></div><div class="pv-probs"></div></div>
    <div class="pv-level" hidden></div>
    <div class="pv-reticle"><div class="ring"></div></div>
    <div class="pv-hud pv-top">
      <div class="grp"><span><span class="pv-rec"></span>PLANTVISION</span><span>LIVE</span></div>
      <div class="grp cam"><span>ISO 400</span><span>1/120</span><span>ƒ/1.8</span><span>YOLOv5 → crop → MobileNet</span></div>
      <div class="grp stats"><span class="pv-rate">— passes/s</span><span class="pv-count">0 in view</span></div>
      <button type="button" class="pv-mbtn" hidden>TILT TO AIM</button>
      <button type="button" class="pv-hbtn">TEST HARNESS</button>
    </div>
    <div class="pv-sched"><h4>INFERENCE SCHEDULER</h4><div class="rows"></div><div class="ft"><span>priority</span><span>conf</span></div></div>
    <div class="pv-crop"><h4>CROP → CLASSIFIER</h4><div class="win"></div><div class="cap"><span>224 × 224</span><span class="cname">—</span></div></div>
    <div class="pv-hud pv-bot"><div class="pv-guide">Point at a role to identify it</div></div>
    <div class="pv-harness" hidden>
      <h4>TEST HARNESS</h4>
      <label>Pass frequency <span data-v="rate"></span><input type="range" min="2" max="30" step="1" data-k="rate"></label>
      <label>Lock threshold <span data-v="thresh"></span><input type="range" min="0.5" max="0.98" step="0.01" data-k="thresh"></label>
      <label>Candidates per pass <span data-v="per"></span><input type="range" min="1" max="6" step="1" data-k="per"></label>
      <label><input type="checkbox" data-k="bias"> Bias correction <span data-v="bias"></span></label>
      <div class="note">The real one was a separate internal app sharing the pipeline, so anyone on the team could run controlled experiments across devices. Every empirical decision came out of it.</div>
    </div>`;
  const card = document.createElement("div");
  card.className = "pv-card";
  card.setAttribute("aria-live", "polite");
  layer.appendChild(card);
  document.body.append(feed, grain, layer);

  const $ = (s) => layer.querySelector(s);
  const boxes = $(".pv-boxes"), label = $(".pv-label"), reticle = $(".pv-reticle"), guide = $(".pv-guide"),
    rows = $(".pv-sched .rows"), cropWin = $(".pv-crop .win"), cropName = $(".pv-crop .cname"),
    harness = $(".pv-harness"), rateEl = $(".pv-rate"), countEl = $(".pv-count");

  cands.forEach((c) => {
    const b = document.createElement("div");
    b.className = "pv-box";
    b.innerHTML = `<span class="tag"></span><span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>`;
    boxes.appendChild(b);
    c.box = b;
    c.tag = b.querySelector(".tag");
  });

  // ── Parameters — the test harness edits these live ────────────────
  const P = { rate: 12, thresh: 0.9, per: 3, bias: true };
  const syncHarness = () => {
    harness.querySelectorAll("[data-k]").forEach((i) => { if (i.type === "checkbox") i.checked = P[i.dataset.k]; else i.value = P[i.dataset.k]; });
    harness.querySelector('[data-v="rate"]').textContent = P.rate + "/s";
    harness.querySelector('[data-v="thresh"]').textContent = P.thresh.toFixed(2);
    harness.querySelector('[data-v="per"]').textContent = P.per;
    harness.querySelector('[data-v="bias"]').textContent = P.bias ? "on" : "off";
  };
  syncHarness();
  harness.querySelectorAll("[data-k]").forEach((i) => on(i, "input", () => {
    const k = i.dataset.k;
    P[k] = i.type === "checkbox" ? i.checked : +i.value;
    syncHarness();
  }));
  on($(".pv-hbtn"), "click", () => {
    harness.hidden = !harness.hidden;
    $(".pv-sched").style.visibility = harness.hidden ? "" : "hidden";
  });

  // ── Reticle position ──────────────────────────────────────────────
  // Pointer: follows the cursor. Touch (or before the mouse moves): the
  // centre of the screen, so scrolling moves the page under it.
  let px = innerWidth / 2, py = innerHeight * 0.45, usingPointer = false;
  let rx = px, ry = py, lastRx = rx, lastRy = ry, speed = 0, scrollSpeed = 0, lastScroll = scrollY;
  if (!touch) {
    on(window, "pointermove", (e) => { if (e.pointerType === "mouse") { usingPointer = true; px = e.clientX; py = e.clientY; } });
    on(document, "pointerleave", () => { usingPointer = false; });
  }

  // ── Motion sensors (phones) ───────────────────────────────────────
  // Tilt aims the reticle — you point the phone at a role, like the real app.
  // The gyroscope's rotation rate feeds the "hold steady" penalty, so a
  // genuinely steady hand identifies faster. A level line rides on the
  // reticle, and a hard shake rescans. iOS only grants sensor access from a
  // tap, hence the button; desktops never see it.
  const M = { on: false, base: null, dx: 0, dy: 0, roll: 0, rot: 0, lastShake: 0 };
  const mbtn = $(".pv-mbtn"), levelEl = $(".pv-level");
  let guideHold = 0, guideHoldText = "";
  const flash = (t) => { guideHold = performance.now() + 1800; guideHoldText = t; };
  const canTilt = touch && typeof window.DeviceOrientationEvent !== "undefined";
  if (canTilt) mbtn.hidden = false;
  const orientAngle = () => (screen.orientation && typeof screen.orientation.angle === "number" ? screen.orientation.angle : window.orientation || 0);
  const onOrient = (e) => {
    if (e.beta == null || e.gamma == null) return;
    // Map device axes onto screen axes for the current orientation.
    const a = ((orientAngle() % 360) + 360) % 360;
    let x, y;
    if (a === 90) { x = e.beta; y = -e.gamma; }
    else if (a === 270) { x = -e.beta; y = e.gamma; }
    else { x = e.gamma; y = e.beta; }
    if (!M.base) M.base = { x, y };
    M.dx = clamp((x - M.base.x) * 16, -innerWidth / 2 + 30, innerWidth / 2 - 30);
    M.dy = clamp((y - M.base.y) * 16, -innerHeight * 0.4 + 30, innerHeight * 0.5 - 70);
    M.roll = x; // absolute side-to-side tilt: 0 is level
  };
  const onMotion = (e) => {
    const rr = e.rotationRate;
    if (rr) M.rot = M.rot * 0.8 + 0.2 * Math.hypot(rr.alpha || 0, rr.beta || 0, rr.gamma || 0);
    const acc = e.acceleration;
    if (acc && acc.x != null) {
      const g = Math.hypot(acc.x, acc.y || 0, acc.z || 0);
      const now = performance.now();
      if (g > 17 && now - M.lastShake > 1500) { M.lastShake = now; rescan(); }
    }
  };
  function rescan() {
    cands.forEach((c) => { c.evidence = 0; c.conf = 0; });
    card.classList.remove("on");
    locked = null;
    flash("↻ Rescanning…");
  }
  function startMotion() {
    M.on = true; M.base = null;
    on(window, "deviceorientation", onOrient);
    on(window, "devicemotion", onMotion);
    levelEl.hidden = false;
    mbtn.textContent = "RECENTRE";
    mbtn.classList.add("off");
    flash("Tilt to aim · shake to rescan");
  }
  on(mbtn, "click", () => {
    if (M.on) { M.base = null; flash("Recentred"); return; }
    const D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === "function") {
      D.requestPermission()
        .then((r) => {
          if (r !== "granted") { mbtn.textContent = "MOTION BLOCKED"; mbtn.classList.add("off"); return; }
          // Motion is a separate permission on iOS; ask for it in the same tap.
          const DM = window.DeviceMotionEvent;
          (DM && typeof DM.requestPermission === "function" ? DM.requestPermission().catch(() => "denied") : Promise.resolve("granted")).then(startMotion);
        })
        .catch(() => { mbtn.textContent = "MOTION BLOCKED"; mbtn.classList.add("off"); });
    } else startMotion();
  });

  // ── The model ─────────────────────────────────────────────────────
  // Evidence accumulates on whatever the classifier runs on; confidence is
  // 1 − e^(−k·evidence). Motion costs evidence. Without bias correction the
  // classifier over-predicts the "common species" — here, the newest role —
  // the way community-sourced training data over-predicted common plants.
  // Tuned so a steady target locks in about 3.5s at 12 passes/s (0.9 needs
  // ~42 passes of evidence). At 0.42 it locked in under half a second — too
  // fast to see the thing worth seeing, which is the wrong class leading for
  // the first second before the right one overtakes it.
  const K = 0.055;
  let target = null, locked = null, lastTarget = null, lastPass = 0, passes = 0, passWindow = performance.now();

  function probsFor(c) {
    // Top three classes for the target. The true class gets the confidence;
    // a plausible wrong one (a neighbour, or the same company's other stint)
    // takes most of the rest — and early on it can win.
    const others = roles.filter((r) => r !== c);
    // The plausible wrong answer is a neighbouring role with a different name
    // — never the same company's other stint, which would print "Facebook"
    // twice in the top three.
    const distinct = others.filter((r) => r.name !== c.name);
    const at = Math.max(0, roles.indexOf(c));
    const confuse = distinct.find((r) => roles.indexOf(r) > at) || distinct[0] || null;
    const third = distinct.find((r) => r !== confuse && r.name !== (confuse && confuse.name)) || null;
    const rest = 1 - c.conf;
    const wobble = reduced ? 0 : (Math.random() - 0.5) * 0.06;
    let pWrong = clamp(rest * 0.68 + wobble, 0, 1);
    if (!P.bias && c !== roles[0] && roles[0]) pWrong = clamp(pWrong + 0.12 * rest, 0, 1); // over-predicts the common class
    const list = [[c.name, c.conf], [confuse ? (!P.bias && c !== roles[0] && roles[0] ? roles[0].name : confuse.name) : "background", pWrong], [third ? third.name : "background", clamp(rest - pWrong, 0, 1)]];
    return list.sort((a, b) => b[1] - a[1]);
  }

  function pass(now, visible) {
    // The scheduler: rank visible candidates and run the classifier on the top
    // few. Priority favours the reticle's target, candidates not yet sure, and
    // ones not run recently — the shape that emerged from watching the real one.
    visible.forEach((c) => {
      const recency = clamp((now - c.ran) / 1500, 0, 1);
      c.prio = (c === target ? 0.6 : 0) + 0.25 * (1 - c.conf) + 0.15 * recency;
    });
    const chosen = [...visible].sort((a, b) => b.prio - a.prio).slice(0, P.per);
    const motion = clamp((speed + scrollSpeed * 0.6 + (M.on ? M.rot / 5 : 0)) / 22, 0, 1);
    chosen.forEach((c) => {
      c.ran = now;
      const gain = c === target ? 1 : 0.18;
      c.evidence = Math.max(0, c.evidence + gain * (1 - motion) - motion * 0.9);
      c.conf = 1 - Math.exp(-K * c.evidence);
    });
    passes++;
    return chosen;
  }

  // ── Crop inset: a scaled clone of the target, swapped on change ────
  function setCrop(c) {
    cropWin.innerHTML = "";
    cropName.textContent = c ? c.name : "—";
    if (!c) return;
    const r = c.el.getBoundingClientRect();
    const clone = c.el.cloneNode(true);
    clone.className += " clone";
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    // Never copy the Ask section's Turnstile widget or form controls.
    clone.querySelectorAll(".cf-turnstile, iframe, script, form").forEach((n) => n.remove());
    clone.style.width = r.width + "px";
    const s = Math.min(152 / r.width, 152 / Math.max(1, r.height));
    clone.style.transform = `translate(${(152 - r.width * s) / 2}px, ${(152 - r.height * s) / 2}px) scale(${s})`;
    cropWin.appendChild(clone);
  }

  // ── Species card ──────────────────────────────────────────────────
  function showCard(c) {
    const pct = Math.round(c.conf * 100);
    card.innerHTML = `<div class="kick">✓ IDENTIFIED · ${pct}% CONFIDENCE</div>
      <div class="nm"></div><div class="lat"></div><div class="meta"></div>
      <div class="acts">${c.kind === "role" ? '<button type="button" data-ask>Ask about this ✦</button>' : ""}<button type="button" class="ghost" data-x>Keep scanning</button></div>`;
    card.querySelector(".nm").textContent = c.name;
    card.querySelector(".lat").textContent = c.latin;
    card.querySelector(".meta").textContent = c.kind === "role" ? `${c.title}\n${c.period}`.replace("\n", " · ") : "Identified on the page.";
    card.classList.add("on");
  }
  on(card, "click", (e) => {
    if (e.target.closest("[data-x]")) { card.classList.remove("on"); if (locked) { locked.evidence = 0; locked.conf = 0; } locked = null; }
    if (e.target.closest("[data-ask]") && locked) {
      const input = document.getElementById("ask-input"), form = document.getElementById("ask-form");
      if (input && form) {
        input.value = `What did he do at ${locked.name.replace(/ ’\d\d$/, "")}?`;
        document.getElementById("ask").scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
        form.requestSubmit();
        card.classList.remove("on");
      }
    }
  });

  // ── Frame loop ────────────────────────────────────────────────────
  let raf = 0, lastFrame = performance.now();
  const W = () => innerWidth, H = () => innerHeight;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(64, now - lastFrame); lastFrame = now;

    // Reticle: eased toward the pointer, or parked in the centre on touch.
    const tx = usingPointer ? px : W() / 2 + (M.on ? M.dx : 0);
    const ty = usingPointer ? py : H() * 0.45 + (M.on ? M.dy : 0);
    const ease = reduced ? 1 : 1 - Math.pow(0.001, dt / 1000);
    rx += (tx - rx) * ease; ry += (ty - ry) * ease;
    speed = speed * 0.8 + Math.hypot(rx - lastRx, ry - lastRy) * 0.2; lastRx = rx; lastRy = ry;
    scrollSpeed = scrollSpeed * 0.8 + Math.abs(scrollY - lastScroll) * 0.2; lastScroll = scrollY;
    reticle.style.transform = `translate(${rx}px, ${ry}px)`;
    if (M.on) {
      levelEl.style.transform = `translate(${rx}px, ${ry}px) rotate(${-M.roll}deg)`;
      levelEl.classList.toggle("level", Math.abs(M.roll) < 2);
    }
    const pick = document.querySelector(".theme-picker");
    const pb = pick ? pick.getBoundingClientRect().bottom : 0;
    const safe = Math.max(10, pb + 8);
    layer.style.setProperty("--pv-safe", safe + "px");
    layer.classList.toggle("carded", card.classList.contains("on"));

    // Detection: everything with a box on screen.
    const visible = [];
    let best = null, bestArea = Infinity;
    cands.forEach((c) => {
      const r = c.el.getBoundingClientRect();
      const inView = r.bottom > 0 && r.top < H() && r.right > 0 && r.left < W() && r.height > 8;
      c.rect = r;
      if (!inView) { c.box.style.opacity = "0"; c.evidence = Math.max(0, c.evidence - dt / 900); c.conf = 1 - Math.exp(-K * c.evidence); return; }
      visible.push(c);
      // The tracker lags the truth slightly, the way a real one does.
      const t = { x: r.left, y: r.top, w: r.width, h: r.height };
      c.smooth = c.smooth && !reduced ? { x: c.smooth.x + (t.x - c.smooth.x) * 0.45, y: c.smooth.y + (t.y - c.smooth.y) * 0.45, w: c.smooth.w + (t.w - c.smooth.w) * 0.45, h: c.smooth.h + (t.h - c.smooth.h) * 0.45 } : t;
      const s = c.smooth;
      c.box.style.opacity = "1";
      c.box.style.transform = `translate(${s.x}px, ${s.y}px)`;
      c.box.style.width = s.w + "px";
      c.box.style.height = s.h + "px";
      // Target: the smallest candidate under the reticle.
      if (rx >= r.left && rx <= r.right && ry >= r.top && ry <= r.bottom) {
        const a = r.width * r.height;
        if (a < bestArea) { best = c; bestArea = a; }
      }
    });
    target = best;
    if (target !== lastTarget) {
      setCrop(target);
      if (locked && target !== locked) { card.classList.remove("on"); locked = null; }
      lastTarget = target;
    }

    // Inference passes on the scheduler's clock.
    let ran = [];
    if (now - lastPass >= 1000 / P.rate) { ran = pass(now, visible); lastPass = now; }
    if (now - passWindow > 1000) { rateEl.textContent = `${passes} passes/s`; passes = 0; passWindow = now; }
    countEl.textContent = `${visible.length} in view`;

    // Boxes and their tags.
    visible.forEach((c) => {
      c.box.classList.toggle("target", c === target);
      c.box.classList.toggle("locked", c === locked);
      if (c !== target) c.tag.textContent = `obj ${c.conf.toFixed(2)}`;
    });

    // The target's label, colour sliding amber → green with confidence.
    const motion = clamp((speed + scrollSpeed * 0.6 + (M.on ? M.rot / 5 : 0)) / 22, 0, 1);
    if (target) {
      const hue = 45 + target.conf * 95;
      const col = `hsl(${hue}, 90%, 62%)`;
      target.box.style.setProperty("--pv-c", target === locked ? "#5be38a" : col);
      label.style.setProperty("--pv-c", target === locked ? "#5be38a" : col);
      label.hidden = false;
      const probs = probsFor(target);
      const top = probs[0];
      label.querySelector(".nm").textContent = top[0];
      label.querySelector(".pc").textContent = (top[1] * 100).toFixed(0) + "%";
      label.querySelector(".l").textContent = top[0] === target.name ? target.latin : "(uncertain)";
      label.querySelector(".pv-probs").innerHTML = probs.map(([n, p]) => `<div><span>${n.replace(/[<>&]/g, "")}</span><i style="--w:${(p * 100).toFixed(0)}%"></i><span>${p.toFixed(2)}</span></div>`).join("");
      const s = target.smooth || { x: target.rect.left, y: target.rect.top, w: target.rect.width };
      const lx = clamp(s.x, 8, W() - 220), ly = clamp(s.y - 92, safe + 30, H() - 140);
      label.style.transform = `translate(${lx}px, ${ly}px)`;

      // Lock once confident and steady.
      if (!locked && target.conf >= P.thresh && motion < 0.35) { locked = target; showCard(target); }
      reticle.classList.toggle("locked", target === locked);
      reticle.classList.toggle("busy", target !== locked);

      // Guidance: the angle-guidance idea — make the person a better input.
      const r = target.rect;
      if (target === locked) setGuide("✓ Identified — " + target.name, "ok");
      else if (motion > 0.45) setGuide(touch ? "Hold steady — scrolling too fast" : "Hold steady…", "warn");
      else if (r.top < -40 && r.height < H() * 1.2) setGuide("↑ Scroll up to frame it", "warn");
      else if (r.bottom > H() + 40 && r.height < H() * 1.2) setGuide("↓ Scroll down to frame it", "warn");
      else setGuide(`Identifying… ${Math.round(target.conf * 100)}%`, "");
    } else {
      label.hidden = true;
      reticle.classList.remove("busy", "locked");
      setGuide(touch ? "Scroll a role under the crosshair" : "Point at a role to identify it", "");
    }

    // Scheduler panel: what's competing for passes, and what just ran.
    if (ran.length || now % 4 < dt) {
      rows.innerHTML = [...visible].sort((a, b) => b.prio - a.prio).slice(0, 6).map((c) =>
        `<div class="row ${ran.includes(c) ? "ran" : ""}"><span class="nm">${c.name.replace(/[<>&]/g, "")}</span><i style="--w:${(c.prio * 100).toFixed(0)}%"></i><span>${c.conf.toFixed(2)}</span></div>`).join("");
    }
  }
  let lastGuide = "";
  function setGuide(t, cls) {
    if (performance.now() < guideHold) { t = guideHoldText; cls = ""; }
    const key = t + cls;
    if (key === lastGuide) return;
    lastGuide = key; guide.textContent = t; guide.className = "pv-guide" + (cls ? " " + cls : "");
  }

  // ── Boot: load the "model", then go live ──────────────────────────
  let boot = null;
  const start = () => { raf = requestAnimationFrame(frame); };
  if (ctx.reason === "pick" && !reduced) {
    boot = document.createElement("div");
    boot.className = "pv-boot";
    boot.innerHTML = `<div class="b"><div class="s">Loading resume-classifier-v2.mlmodel</div><div class="bar"><i></i></div><div class="t">0.0 / 4.2 MB · ${roles.length} classes</div></div>`;
    document.body.appendChild(boot);
    const bar = boot.querySelector("i"), t = boot.querySelector(".t"), s = boot.querySelector(".s");
    let p = 0;
    const step = setInterval(() => {
      p = Math.min(1, p + 0.08 + Math.random() * 0.1);
      bar.style.width = p * 100 + "%";
      t.textContent = `${(p * 4.2).toFixed(1)} / 4.2 MB · ${roles.length} classes`;
      if (p >= 1) {
        clearInterval(step);
        s.textContent = "Camera ready · Neural Engine";
        setTimeout(() => { boot.classList.add("done"); start(); }, 260);
        setTimeout(() => { boot && boot.remove(); }, 700);
      }
    }, 90);
    cleanups.push(() => clearInterval(step));
  } else start();

  const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); };
  on(document, "visibilitychange", onVis);

  return function unmount() {
    cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
    layer.remove(); feed.remove(); grain.remove(); style.remove();
    if (boot) boot.remove();
  };
}
