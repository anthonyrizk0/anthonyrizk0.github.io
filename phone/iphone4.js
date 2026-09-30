// /phone device: an iPhone 4 running an iOS 6-style skeuomorphic UI.
//
// The home button is the navigation: press to close an app, hold for Siri —
// and Siri is the Ask box. Slide to unlock, glossy icons on a glass shelf,
// pinstriped grouped tables under a glossy nav bar, Books as a wooden shelf,
// Skills as a yellow Notes pad, Messages with glossy bubbles. Answers, as on
// the other devices for now, open in the résumé's Ask box.
//
// Homage, not a copy: no logos or Apple artwork, just the shapes and textures.
// Everything is scoped under .i4. Unlike the modern iPhone, this keeps the
// whole device on screen on a phone — without the home button it isn't this.

const FONT = "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap";

const LINEN = `repeating-linear-gradient(45deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px),
  repeating-linear-gradient(-45deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px),
  radial-gradient(ellipse at 50% 30%, #4a4d52, #2c2e31)`;
const PINSTRIPE = `repeating-linear-gradient(90deg, #c5ccd4 0 5px, #cbd2d9 5px 7px)`;

const CSS = `
.i4 { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #fff; user-select: none; -webkit-user-select: none; }
.i4-device { position: relative; width: 340px; height: 680px; border-radius: 52px; padding: 0 16px;
  background: #0c0c0d;
  box-shadow: 0 0 0 4px #b9bcc2, 0 0 0 6px #6d7178, 0 0 0 7px #d9dce1, 0 40px 90px rgba(0,0,0,.6), inset 0 0 0 2px #222;
  display: flex; flex-direction: column; align-items: center; transform-origin: top center; }
.i4-top { height: 88px; width: 100%; position: relative; }
.i4-ear { position: absolute; top: 44px; left: 50%; transform: translateX(-50%); width: 60px; height: 7px; border-radius: 4px;
  background: #1c1c1e; box-shadow: inset 0 1px 2px #000, 0 1px 0 rgba(255,255,255,.08); }
.i4-cam { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); width: 9px; height: 9px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #3a4a6a, #05060a 60%); }
.i4-screen { position: relative; width: 308px; height: 462px; overflow: hidden; background: #000; border: 2px solid #000; }
.i4-bottom { flex: 1; display: grid; place-items: center; width: 100%; }
.i4-home { width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer; position: relative;
  background: radial-gradient(circle at 50% 30%, #2a2a2d, #0d0d0e 70%);
  box-shadow: inset 0 2px 3px rgba(0,0,0,.9), inset 0 -1px 1px rgba(255,255,255,.12), 0 0 0 1px #2c2c2f; touch-action: none; }
.i4-home::after { content: ""; position: absolute; inset: 20px; border-radius: 5px; border: 1.5px solid rgba(255,255,255,.35); }
.i4-home:active { filter: brightness(1.4); }

.i4-status { position: absolute; top: 0; left: 0; right: 0; height: 20px; z-index: 40; background: #000; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: space-between; padding: 0 6px; text-shadow: 0 -1px 0 rgba(0,0,0,.6); }
.i4-status.trans { background: rgba(0,0,0,.35); }
.i4-status .carrier { display: flex; gap: 4px; align-items: center; font-weight: 400; }
.i4-status .dots { display: inline-flex; gap: 1px; align-items: flex-end; }
.i4-status .dots i { display: block; width: 3px; background: #fff; border-radius: 1px; }
.i4-status .batt { display: inline-block; width: 22px; height: 10px; border: 1px solid #fff; border-radius: 2px; position: relative; }
.i4-status .batt::before { content: ""; position: absolute; inset: 1px 3px 1px 1px; background: linear-gradient(#b8f0a0, #4cd964); }
.i4-status .batt::after { content: ""; position: absolute; right: -3px; top: 2px; width: 2px; height: 4px; background: #fff; }
.i4-layer { position: absolute; inset: 20px 0 0 0; }
.i4 [hidden] { display: none !important; }

/* Lock */
.i4-lock { inset: 20px 0 0 0; background:
  radial-gradient(ellipse 80% 60% at 30% 30%, #3d6fb0, transparent 70%), radial-gradient(ellipse 70% 60% at 80% 80%, #2c8a7a, transparent 70%), #10233f; }
.i4-lock .bar { position: absolute; left: 0; right: 0; background: linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.75)); border: solid rgba(255,255,255,.12); border-width: 1px 0; text-align: center; }
.i4-lock .top { top: 0; padding: 6px 0 8px; }
.i4-lock .time { font-size: 58px; font-weight: 200; line-height: 1.05; letter-spacing: -1px; }
.i4-lock .date { font-size: 13px; font-weight: 700; }
.i4-lock .bottom { bottom: 0; height: 84px; display: grid; place-items: center; }
.i4-note { position: absolute; left: 12px; right: 12px; top: 118px; border-radius: 9px; padding: 8px 10px 9px 44px;
  background: linear-gradient(rgba(55,55,60,.92), rgba(25,25,28,.92)); box-shadow: 0 1px 0 rgba(255,255,255,.2) inset, 0 3px 10px rgba(0,0,0,.5);
  animation: i4-note .5s 1s ease-out both; }
.i4-note .ic { position: absolute; left: 9px; top: 9px; width: 28px; height: 28px; border-radius: 6px; }
.i4-note b { font-size: 13px; } .i4-note div { font-size: 12.5px; color: #ddd; }
@keyframes i4-note { from { opacity: 0; transform: scale(.9); } }
.i4-slider { position: relative; width: 272px; height: 50px; border-radius: 12px; background: linear-gradient(#1a1a1c, #3a3a3e);
  box-shadow: inset 0 2px 5px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.2); cursor: pointer; touch-action: none; }
.i4-slider .txt { position: absolute; inset: 0; display: grid; place-items: center; padding-left: 50px; font-size: 21px; font-weight: 300;
  background: linear-gradient(90deg, #666 0%, #666 40%, #fff 50%, #666 60%, #666 100%); background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent; animation: i4-shine 2.6s linear infinite; }
@keyframes i4-shine { from { background-position: 100% 0; } to { background-position: -100% 0; } }
.i4-knob { position: absolute; top: 3px; left: 3px; width: 64px; height: 44px; border-radius: 9px; display: grid; place-items: center;
  background: linear-gradient(#fdfdfd, #c9c9cc); box-shadow: 0 1px 2px rgba(0,0,0,.6); color: #8a8a8f; font-size: 26px; font-weight: 700; }
.i4-knob.snap { transition: transform .25s ease-out; }

/* Home */
.i4-springboard { inset: 20px 0 0 0; background:
  radial-gradient(ellipse 80% 60% at 30% 20%, #3d6fb0, transparent 70%), radial-gradient(ellipse 70% 60% at 80% 70%, #2c8a7a, transparent 70%), #10233f; }
.i4-grid { position: absolute; top: 12px; left: 8px; right: 8px; display: grid; grid-template-columns: repeat(4, 1fr); row-gap: 14px; }
.i4-grid.in .i4-app { animation: i4-fly .45s cubic-bezier(.2,.8,.2,1) both; }
@keyframes i4-fly { from { opacity: 0; transform: scale(1.8); } }
.i4-app { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; border: none; background: none; color: #fff; font: inherit; text-decoration: none; }
.i4-app .g { position: relative; width: 57px; height: 57px; border-radius: 12px; display: grid; place-items: center; font-size: 26px; font-weight: 700;
  box-shadow: 0 2px 3px rgba(0,0,0,.55); overflow: hidden; text-shadow: 0 -1px 0 rgba(0,0,0,.35); }
.i4-app .g::after { content: ""; position: absolute; left: -10%; right: -10%; top: -48%; height: 95%; border-radius: 50%;
  background: linear-gradient(rgba(255,255,255,.55), rgba(255,255,255,.12)); }
.i4-app .l { font-size: 11px; font-weight: 700; text-shadow: 0 1px 2px #000; max-width: 72px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.i4-app:active .g { filter: brightness(.6); }
.i4-app .gw { position: relative; display: block; }
.i4-badge { position: absolute; top: -7px; right: -8px; min-width: 22px; height: 22px; border-radius: 11px; padding: 0 5px; z-index: 2;
  font-size: 13px; font-weight: 700; display: grid; place-items: center; color: #fff;
  background: radial-gradient(circle at 50% 30%, #ff6b6b, #d40000 70%); border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,.6); }
.i4-dock { position: absolute; left: 0; right: 0; bottom: 0; height: 92px; }
.i4-shelf { position: absolute; left: 0; right: 0; bottom: 0; height: 40px;
  background: linear-gradient(rgba(255,255,255,.35), rgba(255,255,255,.12) 45%, rgba(40,50,70,.55));
  border-top: 1px solid rgba(255,255,255,.7); transform: perspective(200px) rotateX(35deg); transform-origin: bottom; }
.i4-dock .row { position: absolute; left: 8px; right: 8px; bottom: 14px; display: grid; grid-template-columns: repeat(4, 1fr); }
.i4-dock .l { display: none; }

/* App chrome: glossy nav bar, pinstriped grouped tables */
.i4-appview { z-index: 10; inset: 20px 0 0 0; background: ${PINSTRIPE}; color: #000; display: flex; flex-direction: column;
  transition: transform .35s cubic-bezier(.2,.8,.2,1), opacity .3s; }
.i4-appview.zoom { transform: scale(.1); opacity: 0; }
.i4-nav { height: 44px; flex-shrink: 0; display: grid; place-items: center; font-size: 20px; font-weight: 700; color: #fff;
  text-shadow: 0 -1px 0 rgba(0,0,0,.5); background: linear-gradient(#b0bccd, #889bb3 50%, #7b8fa8 51%, #6d84a2);
  border-bottom: 1px solid #2d3642; box-shadow: inset 0 1px 0 rgba(255,255,255,.45); padding: 0 10px; white-space: nowrap; overflow: hidden; }
.i4-body { flex: 1; overflow-y: auto; scrollbar-width: none; padding-bottom: 14px; }
.i4-body::-webkit-scrollbar { display: none; }
.i4-sec { margin: 14px 9px 0; font-size: 15px; font-weight: 700; color: #4c566c; text-shadow: 0 1px 0 #fff; padding-left: 9px; }
.i4-group { margin: 7px 9px 0; background: #fff; border: 1px solid #a9abad; border-radius: 9px; overflow: hidden; }
.i4-row { display: block; padding: 10px 11px; font-size: 14px; line-height: 1.35; border-bottom: 1px solid #ccc; color: #000; text-decoration: none; background: #fff; }
.i4-row:last-child { border-bottom: none; }
.i4-row.big { font-size: 17px; font-weight: 700; }
.i4-row .v { color: #385487; }
a.i4-row, button.i4-row { display: flex; justify-content: space-between; width: 100%; border-left: 0; border-right: 0; border-top: 0; font-family: inherit; text-align: left; cursor: pointer; }
a.i4-row::after, button.i4-row::after { content: "›"; color: #8e8e93; font-size: 20px; line-height: 1; font-weight: 700; }
.i4-row.check { color: #385487; }
.i4-row.check::after { content: "✓"; color: #385487; font-size: 15px; }

/* Notes: yellow pad */
.i4-notes { flex: 1; overflow-y: auto; scrollbar-width: none; padding: 8px 12px 20px 38px; font-family: "Marker Felt", "Noteworthy", Kalam, cursive; font-size: 17px; line-height: 27px; color: #3a2a12;
  background: linear-gradient(90deg, transparent 29px, rgba(200,60,60,.45) 29px 30px, transparent 30px 32px, rgba(200,60,60,.45) 32px 33px, transparent 33px),
              repeating-linear-gradient(transparent 0 26px, #9fc6e6 26px 27px), #fdf7b4; }
.i4-notes::-webkit-scrollbar { display: none; }
.i4-navnotes { background: linear-gradient(#d49c62, #a8672f); border-bottom-color: #5c3514; }

/* Books: wooden shelves */
.i4-shelves { flex: 1; overflow-y: auto; padding: 22px 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px 14px; align-content: start;
  background: repeating-linear-gradient(transparent 0 118px, #5a3416 118px 132px, #3d220d 132px 134px),
              repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 2px, transparent 2px 9px), linear-gradient(90deg, #a0662e, #c58a4e, #a0662e); }
.i4-book { height: 104px; border-radius: 2px 4px 4px 2px; padding: 8px 6px; cursor: pointer; border: none; text-align: left; color: #111;
  background: linear-gradient(90deg, rgba(0,0,0,.25) 0 3px, transparent 3px), linear-gradient(#f5c518, #e0a800);
  box-shadow: 2px 3px 6px rgba(0,0,0,.6); font: 700 9.5px/1.2 "Helvetica Neue", Arial, sans-serif; }
.i4-book small { display: block; margin-top: 6px; font-weight: 400; }

/* Messages */
.i4-msgs { flex: 1; overflow-y: auto; scrollbar-width: none; padding: 10px 8px; display: flex; flex-direction: column; gap: 7px; background: #dbe2ed; }
.i4-msgs::-webkit-scrollbar { display: none; }
.i4-b { max-width: 78%; padding: 7px 11px; border-radius: 16px; font-size: 14px; line-height: 1.3; box-shadow: 0 1px 1px rgba(0,0,0,.3); }
.i4-b.them { align-self: flex-start; background: linear-gradient(#f3f3f3, #d9d9d9); color: #000; }
.i4-b.me { align-self: flex-end; color: #fff; background: linear-gradient(#6bb3ff, #1f7ceb); }
.i4-b a { color: #1f5fc0; font-weight: 700; }
.i4-b .opt { display: block; color: #1f5fc0; cursor: pointer; margin-top: 4px; }
.i4-typing { align-self: flex-start; font-size: 12px; color: #6d7a8c; }
.i4-compose { display: flex; gap: 6px; padding: 6px; background: linear-gradient(#e4e8ee, #b8c0cc); border-top: 1px solid #8d97a6; }
.i4-compose input { flex: 1; min-width: 0; border-radius: 14px; border: 1px solid #8d97a6; padding: 5px 10px; font: 14px inherit; font-family: inherit; box-shadow: inset 0 1px 2px rgba(0,0,0,.25); }
.i4-compose button { border: 1px solid #1f5fc0; border-radius: 13px; padding: 0 12px; color: #fff; font-weight: 700; font-family: inherit; cursor: pointer;
  background: linear-gradient(#7cb8ff, #2b7de9 50%, #1f6fdc 51%, #2b7de9); text-shadow: 0 -1px 0 rgba(0,0,0,.4); }

/* Siri */
.i4-siri { inset: 20px 0 0 0; background: ${LINEN}; display: flex; flex-direction: column; color: #fff; z-index: 30;
  transition: opacity .25s; }
.i4-siri.fade { opacity: 0; }
.i4-siri .say { padding: 26px 20px 10px; font-size: 19px; text-align: center; text-shadow: 0 1px 2px #000; }
.i4-siri .sugg { padding: 0 16px; flex: 1; overflow-y: auto; }
.i4-siri .sugg button { display: block; width: 100%; margin-top: 8px; text-align: left; padding: 9px 12px; border-radius: 9px; cursor: pointer;
  font-size: 13.5px; color: #eee; font-family: inherit; background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.08); }
.i4-siri form { display: flex; gap: 6px; padding: 8px 12px; }
.i4-siri input { flex: 1; min-width: 0; border-radius: 14px; border: none; padding: 6px 12px; font-size: 14px; font-family: inherit; }
.i4-siri .dock { height: 86px; display: grid; place-items: center; background: linear-gradient(rgba(0,0,0,.1), rgba(0,0,0,.45)); border-top: 1px solid rgba(255,255,255,.08); }
.i4-mic { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #c9c9cf; display: grid; place-items: center; cursor: pointer;
  background: radial-gradient(circle at 50% 35%, #8e8e96, #3f3f46 70%); box-shadow: 0 0 0 3px rgba(0,0,0,.4), 0 3px 8px rgba(0,0,0,.6); }
.i4-mic.listening { background: radial-gradient(circle at 50% 35%, #d9b3ff, #7a2fd6 70%); box-shadow: 0 0 18px 6px rgba(170,90,255,.7), 0 0 0 3px rgba(0,0,0,.4); }
.i4-mic svg { filter: drop-shadow(0 -1px 0 rgba(0,0,0,.5)); }

@media (max-width: 600px) {
  .i4 { width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden; }
}
`;

const PALETTE = {
  classdojo: ["#8a7dff", "#4a3fd6"], greg: ["#5fdc86", "#1f8f4a"], facebook: ["#6a9bff", "#1e4fd1"],
  google: ["#ffcf40", "#e1573a"], cape: ["#6b7390", "#262a3a"], tableau: ["#ff9a55", "#c2410c"],
  vmware: ["#8fa6b3", "#37474f"], zeebumobile: ["#ff8cbb", "#d6336c"], rovemobile: ["#3fd6c4", "#0f766e"],
  bitheads: ["#a784ff", "#6d28d9"], truecontext: ["#4cc3ff", "#0369a1"],
};
function tint(slug, name) {
  let p = PALETTE[slug];
  if (!p) { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360; p = [`hsl(${h},75%,62%)`, `hsl(${(h + 30) % 360},70%,40%)`]; }
  return `linear-gradient(${p[0]},${p[1]})`;
}
const MIC = `<svg width="26" height="34" viewBox="0 0 24 32" fill="#fff"><rect x="7" y="1" width="10" height="19" rx="5"/><path d="M3 15a9 9 0 0 0 18 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M12 24v5M7 30h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`;

export function mount(host, ctx) {
  const { data, esc } = ctx;
  const cleanups = [];
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
  cleanups.push(() => timers.forEach(clearTimeout));
  const on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); cleanups.push(() => el.removeEventListener(ev, fn, o)); };

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
  let font = document.querySelector('link[data-i4-font]');
  if (!font) { font = document.createElement("link"); font.rel = "stylesheet"; font.href = FONT; font.setAttribute("data-i4-font", ""); document.head.appendChild(font); }

  // ── Apps ───────────────────────────────────────────────────────────
  const table = (title, groups) => ({ kind: "table", title, groups });
  const apps = [];
  for (const r of data.roles) {
    apps.push({
      label: r.label, glyph: r.name.charAt(0), bg: tint(ctx.slug(r.name), r.name),
      open: () => table(r.name, [
        { rows: [{ text: r.name, cls: "big" }, { text: r.title }, { text: [r.period, r.acq].filter(Boolean).join(" · "), cls: "v" }] },
        ...(r.bullets.length ? [{ title: "What I did", rows: r.bullets.map((b) => ({ text: b })) }] : []),
        ...(r.tech.length ? [{ title: "Built with", rows: [{ text: r.tech.join(", ") }] }] : []),
        { rows: [{ text: "Ask about " + r.name, go: () => openMessages("What did he do at " + r.name + "?") }] },
      ]),
    });
  }
  if (data.skills.length) apps.push({ label: "Notes", glyph: "✎", bg: "linear-gradient(#fff3a0,#e8c43a)", open: () => ({ kind: "notes" }) });
  if (data.books.length) apps.push({ label: "Books", glyph: "B", bg: "linear-gradient(#c98a4b,#7a4513)", open: () => ({ kind: "books" }) });
  if (data.education.length) apps.push({ label: "Education", glyph: "E", bg: "linear-gradient(#ffd44d,#b88306)",
    open: () => table("Education", data.education.map((e) => ({ rows: [{ text: e.school, cls: "big" }, { text: e.year, cls: "v" }, { text: e.degree }] }))) });
  apps.push({ label: "Settings", glyph: "⚙", bg: "linear-gradient(#b8bcc4,#5d626b)",
    open: () => table("Settings", [
      { title: "Phone", rows: Object.entries(ctx.devices).map(([k, d]) => ({ text: d.label, cls: k === ctx.current() ? "check" : "", pick: k })) },
      { title: "Résumé theme", rows: [["Classic", "classic"], ["Terminal", "terminal"], ["Blueprint", "blueprint"]].map(([l, t]) => ({ text: l, href: "/?theme=" + t })) },
      { title: "This site", rows: [{ text: "Back to the classic résumé", href: "/" }, { text: "How the Ask box works", href: "/how-ask-works" }, { text: "Connect an agent (MCP)", href: "/mcp" }] },
    ]) });

  const dock = [{ label: "Messages", glyph: "✉", bg: "linear-gradient(#8ef08a,#1fae2a)", badge: true, open: () => ({ kind: "messages" }) }];
  if (data.links.mail) dock.push({ label: "Mail", glyph: "@", bg: "linear-gradient(#7fc4ff,#1668d8)", href: data.links.mail });
  if (data.links.linkedin) dock.push({ label: "LinkedIn", glyph: "in", bg: "linear-gradient(#5aa0ff,#0c4fa8)", href: data.links.linkedin });
  if (data.links.pdf) dock.push({ label: "PDF", glyph: "▤", bg: "linear-gradient(#ff8a80,#c7302a)", href: data.links.pdf });

  // ── DOM ────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.className = "i4";
  root.innerHTML = `
    <div class="i4-device">
      <div class="i4-top"><div class="i4-cam"></div><div class="i4-ear"></div></div>
      <div class="i4-screen">
        <div class="i4-status"><span class="carrier"><span class="dots"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:10px"></i><i style="height:12px"></i></span> Anthony</span><span data-clock></span><span class="batt"></span></div>
        <section class="i4-layer i4-lock" aria-label="Lock screen">
          <div class="bar top"><div class="time" data-clock></div><div class="date" data-date></div></div>
          <div class="i4-note"><div class="ic" style="background:linear-gradient(#8ef08a,#1fae2a)"></div><b>Anthony</b><div>Ask me anything — or hold the Home button for Siri.</div></div>
          <div class="bar bottom"><div class="i4-slider" role="button" tabindex="0" aria-label="Slide to unlock"><div class="txt">slide to unlock</div><div class="i4-knob">→</div></div></div>
        </section>
        <section class="i4-layer i4-springboard" hidden aria-label="Home screen"><div class="i4-grid"></div>
          <div class="i4-dock"><div class="i4-shelf"></div><div class="row"></div></div></section>
        <section class="i4-layer i4-appview" hidden aria-live="polite"></section>
        <section class="i4-layer i4-siri" hidden aria-label="Siri">
          <div class="say">What can I help you with?</div>
          <div class="sugg"></div>
          <form><input type="text" maxlength="500" autocomplete="off" placeholder="Ask about Anthony…" aria-label="Ask Siri" /></form>
          <div class="dock"><button type="button" class="i4-mic listening" aria-label="Ask">${MIC}</button></div>
        </section>
      </div>
      <div class="i4-bottom"><button type="button" class="i4-home" aria-label="Home button — press for home, hold for Siri"></button></div>
    </div>`;
  host.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const device = $(".i4-device"), status = $(".i4-status"), lock = $(".i4-lock"), board = $(".i4-springboard"),
    grid = $(".i4-grid"), view = $(".i4-appview"), siri = $(".i4-siri"), slider = $(".i4-slider"), knob = $(".i4-knob"),
    homeBtn = $(".i4-home");

  // On a phone, keep the whole device visible — scale it to fit.
  const fit = () => {
    if (window.innerWidth > 600) { device.style.transform = ""; return; }
    const s = Math.min(window.innerWidth / 380, window.innerHeight / 720);
    device.style.transform = `scale(${s})`;
    device.style.transformOrigin = "center";
  };
  fit(); on(window, "resize", fit);

  // ── Clock ──────────────────────────────────────────────────────────
  const tick = () => {
    const now = new Date();
    root.querySelectorAll("[data-clock]").forEach((el) => (el.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M$/i, "")));
    root.querySelectorAll("[data-date]").forEach((el) => (el.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })));
  };
  tick();
  const clock = setInterval(tick, 15000);
  cleanups.push(() => clearInterval(clock));

  // ── Springboard ────────────────────────────────────────────────────
  const tile = (a) => {
    const el = document.createElement(a.href ? "a" : "button");
    el.className = "i4-app";
    if (a.href) { el.href = a.href; if (/^https?:/.test(a.href)) { el.target = "_blank"; el.rel = "noopener"; } } else el.type = "button";
    el.setAttribute("aria-label", a.label);
    el.innerHTML = `<span class="gw"><span class="g" style="background:${a.bg}">${esc(a.glyph)}</span>${a.badge ? '<span class="i4-badge">1</span>' : ""}</span><span class="l">${esc(a.label)}</span>`;
    if (a.open) on(el, "click", () => openApp(a, el));
    return el;
  };
  apps.forEach((a, i) => { const t = tile(a); t.style.animationDelay = (i % 4) * 25 + Math.floor(i / 4) * 35 + "ms"; grid.appendChild(t); });
  dock.forEach((a) => $(".i4-dock .row").appendChild(tile(a)));

  // ── Layers ─────────────────────────────────────────────────────────
  let layer = "lock";
  const show = (next) => {
    layer = next;
    lock.hidden = next !== "lock";
    board.hidden = !(next === "home" || next === "app" || next === "siri");
    view.hidden = next !== "app";
    siri.hidden = next !== "siri";
    status.classList.toggle("trans", next === "lock");
  };
  const unlock = () => {
    show("home");
    if (!ctx.reducedMotion) { grid.classList.remove("in"); void grid.offsetWidth; grid.classList.add("in"); }
  };

  // Slide to unlock: drag the knob. A tap, Enter or Space slides it for you.
  let drag = null;
  const maxX = () => slider.clientWidth - knob.offsetWidth - 6;
  const setKnob = (x) => { knob.style.transform = `translateX(${x}px)`; slider.querySelector(".txt").style.opacity = String(Math.max(0, 1 - x / 90)); };
  const autoSlide = () => {
    knob.classList.add("snap"); setKnob(maxX());
    later(() => { knob.classList.remove("snap"); setKnob(0); unlock(); }, ctx.reducedMotion ? 0 : 260);
  };
  on(slider, "pointerdown", (e) => { drag = { x0: e.clientX, x: 0, moved: false }; slider.setPointerCapture(e.pointerId); knob.classList.remove("snap"); });
  on(slider, "pointermove", (e) => {
    if (!drag) return;
    drag.x = Math.max(0, Math.min(maxX(), e.clientX - drag.x0));
    if (drag.x > 4) drag.moved = true;
    setKnob(drag.x);
  });
  on(slider, "pointerup", () => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.moved) return autoSlide();
    if (d.x > maxX() * 0.8) { setKnob(0); unlock(); }
    else { knob.classList.add("snap"); setKnob(0); }
  });
  on(slider, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); autoSlide(); } });

  // ── Apps ───────────────────────────────────────────────────────────
  const renderTable = (t) => {
    let html = `<div class="i4-nav">${esc(t.title)}</div><div class="i4-body">`;
    t.groups.forEach((g, gi) => {
      if (g.title) html += `<div class="i4-sec">${esc(g.title)}</div>`;
      html += `<div class="i4-group">` + g.rows.map((r, ri) => {
        const act = r.href || r.go || r.pick;
        const tag = r.href ? "a" : act ? "button" : "div";
        return `<${tag} class="i4-row ${r.cls || ""}" ${r.href ? `href="${esc(r.href)}"` : ""} ${act && !r.href ? `type="button" data-r="${gi}:${ri}"` : ""}>${esc(r.text)}</${tag}>`;
      }).join("") + `</div>`;
    });
    return html + `</div>`;
  };
  let current = null;
  function openApp(a, fromEl) {
    const spec = a.open();
    current = spec;
    if (spec.kind === "table") view.innerHTML = renderTable(spec);
    else if (spec.kind === "notes") view.innerHTML = `<div class="i4-nav i4-navnotes">Skills</div><div class="i4-notes">${data.skills.map(esc).join("<br>")}</div>`;
    else if (spec.kind === "books") {
      view.innerHTML = `<div class="i4-nav" style="background:linear-gradient(#8a5a2e,#5c3514);border-bottom-color:#2a1606">Books</div><div class="i4-shelves">` +
        data.books.map((b, i) => `<button type="button" class="i4-book" data-book="${i}">${esc(b.title)}<small>${esc(b.publisher)}</small></button>`).join("") + `</div>`;
    } else if (spec.kind === "messages") return openMessages();
    if (fromEl && !ctx.reducedMotion) {
      const s = view.parentElement.getBoundingClientRect(), r = fromEl.querySelector(".g").getBoundingClientRect();
      const k = s.width / view.parentElement.offsetWidth || 1;
      view.style.transformOrigin = `${(r.left + r.width / 2 - s.left) / k}px ${(r.top + r.height / 2 - s.top) / k - 20}px`;
      view.classList.add("zoom"); show("app");
      requestAnimationFrame(() => requestAnimationFrame(() => view.classList.remove("zoom")));
    } else show("app");
  }
  on(view, "click", (e) => {
    const r = e.target.closest("[data-r]");
    if (r && current && current.groups) {
      const [gi, ri] = r.dataset.r.split(":").map(Number);
      const row = current.groups[gi].rows[ri];
      if (row.go) row.go(); else if (row.pick) ctx.setDevice(row.pick);
    }
    const b = e.target.closest("[data-book]");
    if (b) {
      const book = data.books[+b.dataset.book];
      current = table(book.title, [{ rows: [{ text: book.title, cls: "big" }, { text: [book.publisher, book.year].join(" · "), cls: "v" }, { text: book.note }] }]);
      view.innerHTML = renderTable(current);
    }
  });

  // ── Messages ───────────────────────────────────────────────────────
  let chatStarted = false, busy = false;
  const bubble = (who, html) => {
    const d = document.createElement("div");
    d.className = "i4-b " + who; d.innerHTML = html;
    const list = view.querySelector(".i4-msgs"); list.appendChild(d); list.scrollTop = list.scrollHeight;
    return d;
  };
  let chatLog = [];
  function openMessages(prefill) {
    current = { kind: "messages" };
    const badge = root.querySelector(".i4-badge"); if (badge) badge.remove();
    view.innerHTML = `<div class="i4-nav">Anthony</div><div class="i4-msgs"></div>
      <form class="i4-compose"><input type="text" maxlength="500" autocomplete="off" placeholder="Text Message" aria-label="Message" /><button type="submit">Send</button></form>`;
    show("app");
    if (!chatStarted) {
      chatStarted = true;
      const opts = data.suggestions.map((q) => `<span class="opt" data-q="${esc(q)}">${esc(q)}</span>`).join("");
      chatLog.push(["them", "Hey — ask me anything about my work." + (opts ? "<br>Or tap one:" + opts : "")]);
    }
    chatLog.forEach(([w, h]) => bubble(w, h));
    const input = view.querySelector("input");
    input.value = prefill || "";
    view.querySelector("form").addEventListener("submit", (e) => { e.preventDefault(); sendMsg(input.value); input.value = ""; });
  }
  on(view, "click", (e) => { const o = e.target.closest("[data-q]"); if (o) sendMsg(o.dataset.q); });
  function sendMsg(text) {
    const q = (text || "").trim(); if (!q || busy) return;
    busy = true;
    const mine = ["me", esc(q)]; chatLog.push(mine); bubble(...mine);
    later(() => {
      const list = view.querySelector(".i4-msgs"); if (!list) { busy = false; return; }
      const t = document.createElement("div"); t.className = "i4-typing"; t.textContent = "Anthony is typing…"; list.appendChild(t);
      later(() => {
        t.remove();
        const reply = ["them", `Good one — that answer's better on the big screen. <a href="#" data-ask="${esc(q)}">Read it ›</a>`];
        chatLog.push(reply); bubble(...reply); busy = false;
      }, 1400);
    }, 900);
  }
  on(root, "click", (e) => { const a = e.target.closest("[data-ask]"); if (a) { e.preventDefault(); ctx.ask(a.dataset.ask); } });

  // ── Siri ───────────────────────────────────────────────────────────
  data.suggestions.forEach((q) => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = "“" + q + "”";
    on(b, "click", () => siriAsk(q)); $(".i4-siri .sugg").appendChild(b);
  });
  let before = "home";
  const openSiri = () => {
    if (layer === "siri") return;
    before = layer === "lock" ? "lock" : layer;
    show("siri");
    siri.querySelector(".say").textContent = "What can I help you with?";
    const input = siri.querySelector("input"); input.value = "";
    later(() => input.focus(), 60);
  };
  const closeSiri = () => { if (layer === "siri") show(before === "app" ? "app" : before); };
  const siriAsk = (q) => {
    q = (q || "").trim(); if (!q) return;
    siri.querySelector(".say").textContent = "Let me check on that…";
    later(() => ctx.ask(q), ctx.reducedMotion ? 0 : 900);
  };
  on(siri.querySelector("form"), "submit", (e) => { e.preventDefault(); siriAsk(siri.querySelector("input").value); });
  on(siri.querySelector(".i4-mic"), "click", () => siriAsk(siri.querySelector("input").value));

  // ── The home button: press for home, hold for Siri ─────────────────
  let holdTimer = null, held = false;
  const press = () => {
    if (layer === "siri") return closeSiri();
    if (layer === "app") {
      if (ctx.reducedMotion) return show("home");
      view.classList.add("zoom");
      later(() => { view.classList.remove("zoom"); show("home"); }, 280);
    } else if (layer === "lock") {
      // Pressing home on the lock screen just wakes it; the slider is the lock.
      slider.animate?.([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
    }
  };
  on(homeBtn, "pointerdown", () => {
    held = false;
    holdTimer = setTimeout(() => { held = true; openSiri(); }, 550);
  });
  const release = () => { clearTimeout(holdTimer); if (!held) press(); held = true; };
  on(homeBtn, "pointerup", release);
  on(homeBtn, "pointerleave", () => clearTimeout(holdTimer));
  on(homeBtn, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); press(); } });
  cleanups.push(() => clearTimeout(holdTimer));
  on(document, "keydown", (e) => {
    const typing = e.target.tagName === "INPUT";
    if (e.key === "Escape") press();
    else if (!typing && (e.key === "Enter" || e.key === " ") && layer === "lock" && e.target !== homeBtn) { e.preventDefault(); autoSlide(); }
  });

  show("lock");

  return function unmount() {
    cleanups.forEach((fn) => fn());
    root.remove();
    style.remove();
  };
}
