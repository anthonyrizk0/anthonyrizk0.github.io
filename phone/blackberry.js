// /phone device: a BlackBerry Bold-style handset.
//
// Landscape screen, the row of hard keys (call · menu · trackpad · back ·
// end), and a full QWERTY you can type on. Navigation is the BlackBerry way:
// arrows or the trackpad move a highlight, click opens, back backs out, and a
// letter on the home screen jumps to the next app starting with it. BBM is the
// Ask box — your message goes Delivered, then Read — and, for now, the answer
// opens in the résumé's Ask box.
//
// Homage, not a copy: no logos or wordmarks, just the shapes. Scoped under .bb.

const CSS = `
.bb { font-family: Inter, "Helvetica Neue", Arial, sans-serif; color: #eee; user-select: none; -webkit-user-select: none; }
.bb-device {
  position: relative; width: 372px; padding: 26px 16px 22px;
  border-radius: 34px 34px 48px 48px;
  background: linear-gradient(180deg, #232327 0%, #0c0c0e 55%, #151518 100%);
  box-shadow: 0 0 0 3px #858b95, 0 0 0 5px #2a2c31, 0 40px 90px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.08);
  display: flex; flex-direction: column; gap: 12px;
}
.bb-speaker { position: absolute; top: 11px; left: 50%; transform: translateX(-50%); width: 64px; height: 5px; border-radius: 3px;
  background: repeating-linear-gradient(90deg, #000 0 3px, #26262b 3px 5px); }
.bb-led { position: absolute; top: 9px; right: 30px; width: 7px; height: 7px; border-radius: 50%; background: #3a0a0a; }
.bb-led.on { background: #ff2a2a; box-shadow: 0 0 8px 2px rgba(255,40,40,.7); animation: bb-led 2.4s steps(1) infinite; }
@keyframes bb-led { 0%, 8% { opacity: 1; } 9%, 100% { opacity: .08; } }

.bb-screen { position: relative; aspect-ratio: 4 / 3; border-radius: 4px; overflow: hidden; border: 5px solid #000;
  background: radial-gradient(ellipse 90% 80% at 30% 20%, #1f3a5c, transparent 70%), radial-gradient(ellipse 70% 60% at 85% 85%, #3a1f4d, transparent 70%), #0a0f18; }
.bb-bar { position: absolute; top: 0; left: 0; right: 0; height: 20px; padding: 0 8px; display: flex; align-items: center; justify-content: space-between;
  font-size: 11px; font-weight: 600; background: linear-gradient(#2b2f38, #16181d); border-bottom: 1px solid #000; z-index: 5; }
.bb-bar .sig { display: flex; gap: 5px; align-items: center; font-size: 9.5px; }
.bb-bar .bars { display: inline-flex; gap: 1px; align-items: flex-end; height: 9px; }
.bb-bar .bars i { display: block; width: 2px; background: #eee; }
.bb-view { position: absolute; top: 20px; left: 0; right: 0; bottom: 0; overflow: hidden; }
.bb [hidden] { display: none !important; }

/* Home: icon grid, highlighted icon's name in a banner at the bottom. */
.bb-grid { position: absolute; inset: 0 0 22px; overflow-y: auto; scrollbar-width: none; padding: 8px 6px;
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; align-content: start; }
.bb-grid::-webkit-scrollbar { display: none; }
.bb-icon { position: relative; height: 50px; border-radius: 6px; display: grid; place-items: center; cursor: pointer; border: 1.5px solid transparent; background: none; }
.bb-icon.focus { border-color: #6fb2ff; background: rgba(62,140,255,.28); box-shadow: 0 0 10px rgba(62,140,255,.5); }
.bb-icon .g { width: 34px; height: 34px; border-radius: 7px; display: grid; place-items: center; font-weight: 700; font-size: 17px; color: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.45), inset 0 -8px 12px rgba(0,0,0,.25), 0 2px 4px rgba(0,0,0,.5); position: relative; overflow: hidden; }
.bb-icon .g::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 50%; background: linear-gradient(rgba(255,255,255,.35), rgba(255,255,255,.05)); }
.bb-splat { position: absolute; top: 2px; right: 6px; width: 15px; height: 15px; border-radius: 50%; background: #e02424; color: #fff; font-size: 10px; font-weight: 700;
  display: grid; place-items: center; box-shadow: 0 0 0 1.5px #0a0f18; }
.bb-label { position: absolute; left: 0; right: 0; bottom: 0; height: 22px; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; background: linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.75)); border-top: 1px solid rgba(255,255,255,.08); }

/* Lists: every app page is a list you move through with a highlight. */
.bb-page { position: absolute; inset: 0; display: flex; flex-direction: column; background: #0d0d0f; }
.bb-title { padding: 5px 9px; font-size: 12.5px; font-weight: 700; background: linear-gradient(#3b4250, #20242c); border-bottom: 1px solid #000; }
.bb-list { flex: 1; overflow-y: auto; scrollbar-width: none; }
.bb-list::-webkit-scrollbar { display: none; }
.bb-row { display: block; width: 100%; text-align: left; padding: 6px 9px; font-size: 12px; line-height: 1.35; color: #e8e8e8;
  border: none; border-bottom: 1px solid #222; background: none; font-family: inherit; cursor: pointer; text-decoration: none; }
.bb-row.head { background: #16181d; color: #9fb6d6; font-weight: 600; cursor: default; }
.bb-row.big { font-size: 14px; font-weight: 700; color: #fff; }
.bb-row.focus { background: linear-gradient(#2f7fe8, #1c5fc4); color: #fff; }
.bb-row.link::after { content: " ›"; color: #8fb8ee; }
.bb-row.focus.link::after { color: #fff; }

/* BBM */
.bb-chat { position: absolute; inset: 0; display: flex; flex-direction: column; background: #f1f1f1; color: #111; }
.bb-chat .who { display: flex; gap: 7px; align-items: center; padding: 5px 8px; background: linear-gradient(#3b4250, #20242c); color: #fff; }
.bb-chat .who .av { width: 26px; height: 26px; border-radius: 4px; background: linear-gradient(135deg, #7aa2f7, #bb9af7); flex-shrink: 0; }
.bb-chat .who b { font-size: 12px; display: block; }
.bb-chat .who span { font-size: 9.5px; color: #c6cfe0; }
.bb-msgs { flex: 1; overflow-y: auto; padding: 6px 8px; display: flex; flex-direction: column; gap: 5px; scrollbar-width: none; }
.bb-msgs::-webkit-scrollbar { display: none; }
.bb-msg { font-size: 11.5px; line-height: 1.35; max-width: 92%; }
.bb-msg .from { font-weight: 700; font-size: 10.5px; }
.bb-msg.them .from { color: #1d5fb8; }
.bb-msg.me { align-self: flex-end; text-align: right; }
.bb-msg.me .from { color: #3b8a2a; }
.bb-msg .rcpt { display: inline-block; margin-left: 5px; font-size: 9.5px; font-weight: 700; color: #1d5fb8; }
.bb-msg .opt { display: block; color: #1d5fb8; cursor: pointer; }
.bb-msg a { color: #1d5fb8; font-weight: 700; }
.bb-typing { font-size: 10.5px; color: #777; font-style: italic; }
.bb-compose { display: flex; align-items: center; gap: 4px; margin: 0 6px 6px; padding: 4px 6px; background: #fff; border: 1px solid #9aa4b3; border-radius: 3px; font-size: 12px; min-height: 24px; color: #111; }
.bb-compose .ph { color: #999; }
.bb-caret { display: inline-block; width: 1px; height: 13px; background: #111; animation: bb-caret 1s steps(1) infinite; }
@keyframes bb-caret { 50% { opacity: 0; } }

/* Hard keys and keyboard. */
.bb-keys { display: grid; grid-template-columns: 1fr 1fr 1.25fr 1fr 1fr; gap: 6px; align-items: center; padding: 0 2px; }
.bb-hk { height: 34px; border-radius: 12px; border: none; cursor: pointer; display: grid; place-items: center; color: #cfd3da;
  background: linear-gradient(#2a2c31, #111215); box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 2px 3px rgba(0,0,0,.6); }
.bb-hk:active, .bb-key:active { transform: translateY(1px); filter: brightness(1.3); }
.bb-hk.call { color: #3fd46a; } .bb-hk.end { color: #ff4a4a; }
.bb-pad { height: 38px; border-radius: 10px; border: 1.5px solid #7d828b; cursor: pointer; position: relative;
  background: radial-gradient(circle at 50% 40%, #3a3d44, #121316); box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 2px 4px rgba(0,0,0,.6); touch-action: none; }
.bb-pad::after { content: ""; position: absolute; inset: 9px 16px; border-radius: 6px; border: 1px solid rgba(255,255,255,.12); }
.bb-kb { display: flex; flex-direction: column; gap: 0; padding: 4px 2px 0; }
.bb-kb .row { display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; padding: 4px 0 5px; border-bottom: 3px solid; border-image: linear-gradient(90deg, #555a63, #c3c8d0, #555a63) 1; }
.bb-kb .row:last-child { border-bottom: none; }
.bb-key { position: relative; height: 30px; border: none; cursor: pointer; font-family: inherit; font-weight: 700; font-size: 12.5px; color: #f2f2f2;
  border-radius: 4px 4px 9px 9px; background: linear-gradient(#34363c, #16171a 70%); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 2px 2px rgba(0,0,0,.7); }
.bb-key .alt { position: absolute; top: 1px; left: 3px; font-size: 7.5px; font-weight: 600; color: #e6a93a; }
.bb-key.wide { grid-column: span 6; }
.bb-key.fn { font-size: 10px; color: #b9bec7; }

@media (max-width: 600px) {
  .bb, .bb-device { width: 100%; height: 100%; }
  .bb-device { border-radius: 0; padding: max(20px, env(safe-area-inset-top)) 10px max(12px, env(safe-area-inset-bottom)); box-shadow: none; gap: 10px; }
  /* A tall phone has spare height: give it to the screen, not the keys. */
  .bb-screen { aspect-ratio: auto; flex: 1; min-height: 0; }
  .bb-kb { flex: none; }
  .bb-key { height: 40px; font-size: 14px; }
  .bb-hk, .bb-pad { height: 40px; }
}
`;

const PALETTE = {
  classdojo: ["#7d6dff", "#3d31b8"], greg: ["#4bd67a", "#187a3c"], facebook: ["#4d8bff", "#1a44b8"],
  google: ["#ffc426", "#d8491f"], cape: ["#56607a", "#1e2130"], tableau: ["#ff8a3d", "#b3380a"],
  vmware: ["#7d99a8", "#2e3d45"], zeebumobile: ["#ff7fb1", "#c42461"], rovemobile: ["#22c9b6", "#0b6660"],
  bitheads: ["#9a70ff", "#5a1fc2"], truecontext: ["#2bb5f5", "#035a8f"],
};
function tint(slug, name) {
  let p = PALETTE[slug];
  if (!p) { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360; p = [`hsl(${h},70%,58%)`, `hsl(${(h + 30) % 360},70%,35%)`]; }
  return `linear-gradient(160deg,${p[0]},${p[1]})`;
}

const I = {
  call: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>`,
  menu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/></svg>`,
  back: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>`,
};

const ROWS = [
  [["Q", "#"], ["W", "1"], ["E", "2"], ["R", "3"], ["T", "("], ["Y", ")"], ["U", "_"], ["I", "-"], ["O", "+"], ["P", "@"]],
  [["A", "*"], ["S", "4"], ["D", "5"], ["F", "6"], ["G", "/"], ["H", ":"], ["J", ";"], ["K", "'"], ["L", '"'], ["⌫", "", "del"]],
  [["alt", "", "fn"], ["Z", "7"], ["X", "8"], ["C", "9"], ["V", "?"], ["B", "!"], ["N", ","], ["M", "."], ["$", ""], ["↵", "", "enter"]],
  [["aA", "", "shift"], ["0", ""], ["space", "", "space"], ["?", ""], [".", ""]],
];

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

  // ── Apps ───────────────────────────────────────────────────────────
  // Each app is a list of rows: {text, cls, href, go, pick}.
  const apps = [];
  apps.push({ id: "bbm", label: "BBM", glyph: "✉", bg: "linear-gradient(160deg,#4d4d57,#15151a)", splat: true });
  for (const r of data.roles) {
    apps.push({
      label: r.label, glyph: r.name.charAt(0), bg: tint(ctx.slug(r.name), r.name),
      rows: () => [
        { text: r.name, cls: "big" },
        { text: r.title },
        { text: [r.period, r.acq].filter(Boolean).join(" · ") },
        ...(r.bullets.length ? [{ text: "What I did", cls: "head" }, ...r.bullets.map((b) => ({ text: "• " + b }))] : []),
        ...(r.tech.length ? [{ text: "Built with", cls: "head" }, { text: r.tech.join(", ") }] : []),
        { text: "Ask about " + r.name, go: () => openBBM("What did he do at " + r.name + "?") },
      ],
    });
  }
  if (data.skills.length) apps.push({ label: "Skills", glyph: "✦", bg: "linear-gradient(160deg,#6a7890,#23293a)",
    rows: () => [{ text: "Skills", cls: "big" }, ...data.skills.map((s) => ({ text: s }))] });
  if (data.books.length) apps.push({ label: "Books", glyph: "B", bg: "linear-gradient(160deg,#ff9a4a,#9a3b06)",
    rows: () => data.books.flatMap((b) => [{ text: b.title, cls: "big" }, { text: [b.publisher, b.year].join(" · ") }, { text: b.note }]) });
  if (data.education.length) apps.push({ label: "Education", glyph: "E", bg: "linear-gradient(160deg,#f2c230,#8a5c07)",
    rows: () => data.education.flatMap((e) => [{ text: e.school, cls: "big" }, { text: e.year }, { text: e.degree }]) });
  if (data.links.mail) apps.push({ label: "Messages", glyph: "@", bg: "linear-gradient(160deg,#4fb6ff,#0c5bb8)", href: data.links.mail });
  if (data.links.linkedin) apps.push({ label: "LinkedIn", glyph: "in", bg: "linear-gradient(160deg,#3a8cf0,#0c3f8a)", href: data.links.linkedin });
  if (data.links.pdf) apps.push({ label: "Documents", glyph: "▤", bg: "linear-gradient(160deg,#ff6a60,#9a1d17)", href: data.links.pdf });
  apps.push({ label: "Options", glyph: "⚙", bg: "linear-gradient(160deg,#9aa0aa,#3a3e46)",
    rows: () => [
      { text: "Phone", cls: "head" },
      ...Object.entries(ctx.devices).map(([k, d]) => ({ text: d.label + (k === ctx.current() ? "  ✓" : ""), pick: k })),
      { text: "Résumé theme", cls: "head" },
      ...[["Classic", "classic"], ["Terminal", "terminal"], ["Blueprint", "blueprint"]].map(([l, t]) => ({ text: l, href: "/?theme=" + t })),
      { text: "This site", cls: "head" },
      { text: "Back to the classic résumé", href: "/" },
      { text: "How the Ask box works", href: "/how-ask-works" },
      { text: "Connect an agent (MCP)", href: "/mcp" },
    ] });

  // ── DOM ────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.className = "bb";
  const kb = ROWS.map((row) => `<div class="row">${row.map(([k, alt, kind]) =>
    `<button type="button" class="bb-key${kind === "space" ? " wide" : ""}${kind && kind !== "space" ? " fn" : ""}" data-k="${kind || k}" aria-label="${k === "⌫" ? "Delete" : k === "↵" ? "Enter" : k}">${alt ? `<span class="alt">${esc(alt)}</span>` : ""}${kind === "space" ? "" : esc(k)}</button>`
  ).join("")}</div>`).join("");
  root.innerHTML = `
    <div class="bb-device">
      <div class="bb-speaker" aria-hidden="true"></div><div class="bb-led on" aria-hidden="true"></div>
      <div class="bb-screen">
        <div class="bb-bar" aria-hidden="true"><span data-clock></span><span class="sig">3G <span class="bars"><i style="height:3px"></i><i style="height:5px"></i><i style="height:7px"></i><i style="height:9px"></i></span> ▮</span></div>
        <div class="bb-view">
          <div class="bb-home"><div class="bb-grid" role="listbox" aria-label="Applications"></div><div class="bb-label" aria-live="polite"></div></div>
          <div class="bb-page" hidden><div class="bb-title"></div><div class="bb-list" role="list"></div></div>
          <div class="bb-chat" hidden>
            <div class="who"><div class="av"></div><div><b>Anthony Rizk</b><span>Ask me anything about my work · PIN 2A0FF1CE</span></div></div>
            <div class="bb-msgs" aria-live="polite"></div>
            <div class="bb-compose"><span class="txt"></span><span class="bb-caret"></span></div>
          </div>
        </div>
      </div>
      <div class="bb-keys">
        <button type="button" class="bb-hk call" data-hk="call" aria-label="Call — open BBM">${I.call}</button>
        <button type="button" class="bb-hk" data-hk="menu" aria-label="Menu — home screen">${I.menu}</button>
        <div class="bb-pad" data-hk="select" role="button" tabindex="-1" aria-label="Trackpad — select"></div>
        <button type="button" class="bb-hk" data-hk="back" aria-label="Back">${I.back}</button>
        <button type="button" class="bb-hk end" data-hk="end" aria-label="End — home screen">${I.call.replace("<svg", '<svg style="transform:rotate(135deg)"')}</button>
      </div>
      <div class="bb-kb">${kb}</div>
    </div>`;
  host.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const grid = $(".bb-grid"), label = $(".bb-label"), homeEl = $(".bb-home"), page = $(".bb-page"),
    list = $(".bb-list"), titleEl = $(".bb-title"), chat = $(".bb-chat"), msgs = $(".bb-msgs"),
    composeTxt = $(".bb-compose .txt"), led = $(".bb-led");
  if (ctx.reducedMotion) led.style.animation = "none";

  // ── Clock ──────────────────────────────────────────────────────────
  const tick = () => { $("[data-clock]").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
  tick();
  const clock = setInterval(tick, 15000);
  cleanups.push(() => clearInterval(clock));

  // ── Home ───────────────────────────────────────────────────────────
  const icons = apps.map((a, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "bb-icon"; b.setAttribute("role", "option"); b.setAttribute("aria-label", a.label);
    b.innerHTML = `<span class="g" style="background:${a.bg}">${esc(a.glyph)}</span>${a.splat ? '<span class="bb-splat" aria-label="new">1</span>' : ""}`;
    on(b, "click", () => { focusIcon(i); open(i); });
    grid.appendChild(b);
    return b;
  });
  const COLS = 5;
  let hi = 0;
  const focusIcon = (i) => {
    hi = (i + apps.length) % apps.length;
    icons.forEach((el, j) => { el.classList.toggle("focus", j === hi); el.setAttribute("aria-selected", j === hi ? "true" : "false"); });
    label.textContent = apps[hi].label;
    icons[hi].scrollIntoView({ block: "nearest" });
  };

  // ── Pages ──────────────────────────────────────────────────────────
  let view = "home", rows = [], rowEls = [], ri = 0;
  const show = (v) => {
    view = v;
    homeEl.hidden = v !== "home"; page.hidden = v !== "page"; chat.hidden = v !== "chat";
  };
  const focusRow = (i) => {
    const pickable = rowEls.map((_, j) => j).filter((j) => !rows[j].cls || rows[j].cls !== "head");
    if (!pickable.length) return;
    // Move to the nearest non-heading row in the direction of travel.
    let j = Math.max(0, Math.min(rows.length - 1, i));
    const dir = i >= ri ? 1 : -1;
    while (rows[j] && rows[j].cls === "head") j += dir;
    if (!rows[j]) j = ri;
    ri = j;
    rowEls.forEach((el, k) => el.classList.toggle("focus", k === ri));
    rowEls[ri].scrollIntoView({ block: "nearest" });
  };
  const open = (i) => {
    const a = apps[i];
    if (a.href) { window.open(a.href, /^https?:/.test(a.href) ? "_blank" : "_self"); return; }
    if (a.id === "bbm") { openBBM(); return; }
    titleEl.textContent = a.label;
    rows = a.rows();
    list.innerHTML = "";
    rowEls = rows.map((r, k) => {
      const el = document.createElement(r.href ? "a" : "div");
      el.className = "bb-row" + (r.cls ? " " + r.cls : "") + (r.href || r.go || r.pick ? " link" : "");
      if (r.href) el.href = r.href;
      el.textContent = r.text;
      on(el, "click", (e) => { if (!r.href) e.preventDefault(); focusRow(k); activate(); });
      list.appendChild(el);
      return el;
    });
    ri = 0; list.scrollTop = 0; show("page"); focusRow(0);
  };
  const activate = () => {
    const r = rows[ri]; if (!r) return;
    if (r.go) r.go();
    else if (r.pick) ctx.setDevice(r.pick);
    else if (r.href) location.href = r.href;
  };

  // ── BBM ────────────────────────────────────────────────────────────
  let compose = "", chatStarted = false, busy = false;
  const renderCompose = () => {
    composeTxt.innerHTML = compose ? esc(compose) : '<span class="ph">Enter message</span>';
  };
  const say = (who, html, cls) => {
    const d = document.createElement("div");
    d.className = "bb-msg " + cls;
    d.innerHTML = `<div class="from">${esc(who)}:</div><div>${html}</div>`;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    return d;
  };
  function openBBM(prefill) {
    show("chat");
    // Reading the message clears the LED and the splat, as it would.
    led.classList.remove("on");
    const splat = root.querySelector(".bb-splat"); if (splat) splat.remove();
    if (!chatStarted) {
      chatStarted = true;
      const opts = data.suggestions.map((q, n) => `<span class="opt" data-q="${esc(q)}">${n + 1}. ${esc(q)}</span>`).join("");
      say("Anthony", "Hey — ask me anything about my work." + (opts ? "<br>Or press a number:" + opts : ""), "them");
    }
    compose = prefill || ""; renderCompose();
  }
  on(msgs, "click", (e) => { const o = e.target.closest("[data-q]"); if (o) send(o.dataset.q); });

  function send(text) {
    const q = (text || compose).trim();
    if (!q || busy) return;
    busy = true; compose = ""; renderCompose();
    const mine = say("Me", `${esc(q)}<span class="rcpt">…</span>`, "me");
    const rcpt = mine.querySelector(".rcpt");
    later(() => (rcpt.textContent = "D"), 450);
    later(() => (rcpt.textContent = "R"), 1500);
    later(() => {
      const t = document.createElement("div");
      t.className = "bb-typing"; t.textContent = "Anthony is typing…";
      msgs.appendChild(t); msgs.scrollTop = msgs.scrollHeight;
      later(() => {
        t.remove();
        const reply = say("Anthony", `Good one — that answer's better on the big screen. <a href="#" data-open>Read it ›</a>`, "them");
        reply.querySelector("[data-open]").addEventListener("click", (e) => { e.preventDefault(); ctx.ask(q); });
        pendingQuestion = q;
        busy = false;
      }, 1400);
    }, 1900);
  }
  let pendingQuestion = null;

  // ── Input: hard keys, trackpad, keyboard ───────────────────────────
  const move = (dx, dy) => {
    if (view === "home") focusIcon(hi + dx + dy * COLS);
    else if (view === "page") focusRow(ri + dy + dx);
    else if (view === "chat") msgs.scrollTop += dy * 40;
  };
  const select = () => {
    if (view === "home") open(hi);
    else if (view === "page") activate();
    else if (view === "chat") { if (compose) send(); else if (pendingQuestion) ctx.ask(pendingQuestion); }
  };
  const back = () => { if (view !== "home") show("home"); };
  const typeKey = (k) => {
    if (view === "chat") {
      if (k === "del") compose = compose.slice(0, -1);
      else if (k === "enter") return send();
      else if (k === "space") compose += " ";
      else if (/^[1-9]$/.test(k) && !compose && data.suggestions[+k - 1]) return send(data.suggestions[+k - 1]);
      else if (k.length === 1 && compose.length < 500) compose += compose.length === 0 ? k.toUpperCase() : k.toLowerCase();
      renderCompose();
      return;
    }
    if (k === "enter" || k === "space") return select();
    if (k === "del") return back();
    // The BlackBerry trick: a letter on the home screen jumps to the next
    // app that starts with it.
    if (view === "home" && /^[a-z0-9]$/i.test(k)) {
      for (let s = 1; s <= apps.length; s++) {
        const j = (hi + s) % apps.length;
        if (apps[j].label.toLowerCase().startsWith(k.toLowerCase())) { focusIcon(j); return; }
      }
    }
  };

  root.querySelectorAll("[data-hk]").forEach((el) => on(el, "click", () => {
    const k = el.dataset.hk;
    if (k === "call") openBBM();
    else if (k === "menu" || k === "end") show("home");
    else if (k === "back") back();
    else if (k === "select") select();
  }));
  root.querySelectorAll("[data-k]").forEach((el) => on(el, "click", () => {
    const k = el.dataset.k;
    if (k === "fn" || k === "shift") return;
    typeKey(k === "⌫" ? "del" : k === "↵" ? "enter" : k);
  }));

  // Trackpad on touch: a swipe across it moves the highlight, a tap selects.
  const pad = $(".bb-pad");
  let p0 = null;
  on(pad, "pointerdown", (e) => { p0 = { x: e.clientX, y: e.clientY, moved: false }; pad.setPointerCapture(e.pointerId); });
  on(pad, "pointermove", (e) => {
    if (!p0) return;
    const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
    if (Math.abs(dx) > 14 || Math.abs(dy) > 14) {
      if (Math.abs(dx) > Math.abs(dy)) move(Math.sign(dx), 0); else move(0, Math.sign(dy));
      p0 = { x: e.clientX, y: e.clientY, moved: true };
    }
  });
  on(pad, "pointerup", () => { p0 = null; });

  on(document, "keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    let handled = true;
    if (k === "ArrowLeft") move(-1, 0);
    else if (k === "ArrowRight") move(1, 0);
    else if (k === "ArrowUp") move(0, -1);
    else if (k === "ArrowDown") move(0, 1);
    else if (k === "Escape") back();
    else if (k === "Enter") typeKey("enter");
    else if (k === "Backspace") typeKey("del");
    else if (k === " ") typeKey("space");
    else if (k.length === 1) typeKey(k);
    else handled = false;
    if (handled) e.preventDefault();
  });

  focusIcon(0);
  show("home");
  renderCompose();

  return function unmount() {
    cleanups.forEach((fn) => fn());
    root.remove();
    style.remove();
  };
}
