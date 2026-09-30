// /phone device: a modern iPhone. Lock screen, home screen of apps built from
// the résumé, iOS-style app pages, and Spotlight as the way to ask.
// Everything is scoped under .ip so it can't collide with another device.

const CSS = `
.ip { --glass: rgba(255,255,255,.14); --glass-strong: rgba(30,30,40,.72); --muted: rgba(255,255,255,.62);
      --app-bg: #f2f2f7; --card: #fff; --ink: #1c1c1e; --ink-muted: #6e6e73; --sep: rgba(60,60,67,.18); --tint: #0a84ff;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif; color: #fff; }
.ip-device {
  width: 390px; height: 820px; max-height: calc(100vh - 110px);
  border-radius: 56px; padding: 12px;
  background: linear-gradient(145deg, #3a3a44, #16161c);
  box-shadow: 0 0 0 2px #4a4a55, 0 40px 90px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.08);
}
.ip-screen {
  position: relative; width: 100%; height: 100%; border-radius: 44px; overflow: hidden;
  background:
    radial-gradient(ellipse 90% 60% at 20% 10%, #5b4bd6 0%, transparent 60%),
    radial-gradient(ellipse 80% 70% at 90% 90%, #0fa3a3 0%, transparent 60%),
    radial-gradient(ellipse 70% 60% at 70% 30%, #d6477a 0%, transparent 55%),
    #1b1b3a;
  user-select: none; -webkit-user-select: none;
}
@media (max-width: 600px) {
  .ip, .ip-device { width: 100%; height: 100%; }
  .ip-device { max-height: none; border-radius: 0; padding: 0; background: none; box-shadow: none; }
  .ip-screen { border-radius: 0; }
  .ip-island { display: none; }
}
.ip-status {
  position: absolute; top: 0; left: 0; right: 0; z-index: 50; height: 50px;
  padding: max(16px, env(safe-area-inset-top)) 30px 0;
  display: flex; justify-content: space-between; align-items: flex-start;
  font: 600 15px inherit; font-weight: 600; font-size: 15px; pointer-events: none;
}
.ip-status.dark { color: var(--ink); }
.ip-island { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 118px; height: 34px; border-radius: 20px; background: #000; }
.ip-sys { display: flex; gap: 6px; align-items: center; }
.ip-layer { position: absolute; inset: 0; }
.ip [hidden] { display: none !important; }

.ip-lock { display: flex; flex-direction: column; align-items: center; padding: 88px 18px 40px; cursor: pointer;
  background: rgba(0,0,0,.12); transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .45s; }
.ip-lock.gone { transform: translateY(-100%); opacity: 0; }
.ip-lock .date { font-weight: 600; font-size: 18px; color: rgba(255,255,255,.85); }
.ip-lock .time { font-weight: 700; font-size: 88px; line-height: 1; letter-spacing: -2px; margin-top: 2px; }
.ip-notif { margin-top: auto; width: 100%; background: var(--glass); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-radius: 22px; padding: 12px 14px; display: flex; gap: 11px; align-items: center;
  animation: ip-notif .6s 1.2s cubic-bezier(.2,.8,.2,1) both; }
.ip-notif .icon { width: 38px; height: 38px; border-radius: 9px; flex-shrink: 0; background: linear-gradient(135deg,#7aa2f7,#bb9af7); }
.ip-notif .who { font-weight: 600; font-size: 14px; display: flex; justify-content: space-between; }
.ip-notif .who span { font-weight: 400; color: var(--muted); font-size: 13px; }
.ip-notif .msg { font-size: 14px; color: rgba(255,255,255,.9); }
@keyframes ip-notif { from { opacity: 0; transform: translateY(20px) scale(.96); } }
.ip-hint { margin-top: 26px; font-size: 13px; color: var(--muted); animation: ip-bob 2.4s ease-in-out infinite; }
@keyframes ip-bob { 50% { transform: translateY(-4px); } }
.ip-locklink { margin-top: 12px; font-size: 12px; color: var(--muted); }

.ip-home { display: flex; flex-direction: column; padding: max(64px, calc(env(safe-area-inset-top) + 44px)) 22px 14px; transition: transform .35s, filter .35s; }
.ip-home.behind { transform: scale(.94); filter: blur(6px) brightness(.8); }
.ip-search { align-self: center; margin-bottom: 20px; display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 16px;
  background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); font-size: 13px; color: rgba(255,255,255,.85); cursor: pointer; border: none; font-family: inherit; }
.ip-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 10px; align-content: start; }
.ip-app { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; border: none; background: none; color: inherit; font: inherit; text-decoration: none; }
.ip-app .tile { width: 60px; height: 60px; border-radius: 15px; display: grid; place-items: center; font-weight: 700; font-size: 26px; color: #fff;
  box-shadow: 0 6px 14px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.3); transition: transform .15s; }
.ip-app:active .tile { transform: scale(.9); }
.ip-app .label { font-weight: 500; font-size: 11.5px; max-width: 74px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 3px rgba(0,0,0,.4); }
.ip-dock { margin-top: auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 14px 12px; border-radius: 32px;
  background: var(--glass); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.ip-dock .label { display: none; }

.ip-page { background: var(--app-bg); color: var(--ink); overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: max(60px, calc(env(safe-area-inset-top) + 40px)) 0 60px;
  transition: transform .38s cubic-bezier(.2,.8,.2,1), opacity .3s, border-radius .38s; }
.ip-page.opening { transform: scale(.15); opacity: 0; border-radius: 40px; }
.ip-nav { display: flex; align-items: center; padding: 0 12px; height: 34px; }
.ip-nav button { border: none; background: none; color: var(--tint); font: 400 17px inherit; font-size: 17px; font-family: inherit; cursor: pointer; }
.ip-page h1 { font-weight: 700; font-size: 32px; letter-spacing: -.5px; padding: 4px 18px 2px; }
.ip-page .sub { padding: 0 18px; color: var(--ink-muted); font-size: 15px; }
.ip-page .meta { padding: 2px 18px 0; color: var(--ink-muted); font-size: 13px; }
.ip-group { margin: 22px 16px 0; background: var(--card); border-radius: 12px; overflow: hidden; }
.ip-group-title { margin: 22px 32px -14px; font-size: 12.5px; text-transform: uppercase; letter-spacing: .4px; color: var(--ink-muted); }
.ip-row { display: block; padding: 12px 16px; font-size: 15.5px; line-height: 1.4; border-bottom: .5px solid var(--sep); color: var(--ink); text-decoration: none; }
.ip-row:last-child { border-bottom: none; }
a.ip-row, button.ip-row { display: flex; justify-content: space-between; width: 100%; background: none; border-left: 0; border-right: 0; border-top: 0; font-family: inherit; text-align: left; cursor: pointer; }
a.ip-row::after, button.ip-row::after { content: "›"; color: #c7c7cc; font-size: 20px; line-height: 1; }
.ip-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 16px; }
.ip-chip { background: #e9e9ef; border-radius: 8px; padding: 5px 10px; font-size: 13.5px; color: #3a3a3c; }
.ip-homebar { position: absolute; left: 50%; bottom: max(8px, env(safe-area-inset-bottom)); transform: translateX(-50%);
  width: 134px; height: 5px; border-radius: 3px; background: rgba(255,255,255,.8); z-index: 60; border: none; cursor: pointer; }
.ip-homebar.dark { background: rgba(0,0,0,.75); }
.ip-homebar::before { content: ""; position: absolute; inset: -14px -20px; }

.ip-spot { padding: max(64px, calc(env(safe-area-inset-top) + 44px)) 18px 20px; background: rgba(10,10,20,.35); display: flex; flex-direction: column; gap: 14px; }
.ip-field { display: flex; align-items: center; gap: 8px; background: var(--glass-strong); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 14px; padding: 10px 12px; }
.ip-field input { flex: 1; min-width: 0; background: none; border: none; outline: none; color: #fff; font-size: 17px; font-family: inherit; }
.ip-field input::placeholder { color: rgba(255,255,255,.5); }
.ip-field button { border: none; background: none; color: #9ec5ff; font-size: 15px; font-family: inherit; cursor: pointer; }
.ip-spot-head { font-weight: 600; font-size: 13px; color: var(--muted); margin: 6px 4px -4px; }
.ip-spot-list { background: var(--glass-strong); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 14px; overflow: hidden; }
.ip-spot-list button { display: block; width: 100%; text-align: left; border: none; background: none; color: #fff; font-size: 15px; font-family: inherit;
  padding: 12px 14px; cursor: pointer; border-bottom: .5px solid rgba(255,255,255,.12); }
.ip-spot-list button:last-child { border-bottom: none; }
.ip-spot-note { font-size: 12px; color: var(--muted); padding: 0 4px; }
`;

// No logos: letters on gradients.
const PALETTE = {
  classdojo: ["#6d5dfc", "#4a3fd6"], greg: ["#3ec46d", "#1f8f4a"], facebook: ["#3b7cff", "#1e4fd1"],
  google: ["#f4b400", "#e1573a"], cape: ["#2b2d42", "#5c6078"], tableau: ["#e8762c", "#c2410c"],
  vmware: ["#607d8b", "#37474f"], zeebumobile: ["#ff6fa5", "#d6336c"], rovemobile: ["#14b8a6", "#0f766e"],
  bitheads: ["#8b5cf6", "#6d28d9"], truecontext: ["#0ea5e9", "#0369a1"],
};
function tint(slug, name) {
  let p = PALETTE[slug];
  if (!p) { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360; p = [`hsl(${h},70%,55%)`, `hsl(${(h + 30) % 360},70%,40%)`]; }
  return `linear-gradient(135deg,${p[0]},${p[1]})`;
}

const SIGNAL = `<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>`;
const BATTERY = `<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor"/><rect x="23" y="4" width="1.5" height="4" rx=".75" fill="currentColor" opacity=".4"/></svg>`;
const MAG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;

export function mount(host, ctx) {
  const { data, esc } = ctx;
  const cleanups = [];
  const on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); cleanups.push(() => el.removeEventListener(ev, fn, o)); };

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  // ── Apps from the data ──────────────────────────────────────────────
  const head = (title, sub, meta) =>
    `<div class="ip-nav"><button type="button" data-home>‹ Home</button></div><h1>${esc(title)}</h1>` +
    (sub ? `<div class="sub">${esc(sub)}</div>` : "") + (meta ? `<div class="meta">${esc(meta)}</div>` : "");
  const chips = (xs) => `<div class="ip-chips">${xs.map((x) => `<span class="ip-chip">${esc(x)}</span>`).join("")}</div>`;

  const apps = [];
  for (const r of data.roles) {
    apps.push({
      label: r.label, glyph: r.name.charAt(0), bg: tint(ctx.slug(r.name), r.name),
      render: () => head(r.name, r.title, [r.period, r.acq].filter(Boolean).join(" · ")) +
        (r.bullets.length ? `<div class="ip-group">${r.bullets.map((b) => `<div class="ip-row">${esc(b)}</div>`).join("")}</div>` : "") +
        (r.tech.length ? `<div class="ip-group-title">Built with</div><div class="ip-group">${chips(r.tech)}</div>` : ""),
    });
  }
  if (data.skills.length) apps.push({ label: "Skills", glyph: "✦", bg: "linear-gradient(135deg,#475569,#1e293b)",
    render: () => head("Skills") + `<div class="ip-group">${chips(data.skills)}</div>` });
  if (data.books.length) apps.push({ label: "Books", glyph: "B", bg: "linear-gradient(135deg,#f97316,#b45309)",
    render: () => head("Books") + data.books.map((b) => `<div class="ip-group"><div class="ip-row"><b>${esc(b.title)}</b><br>${esc([b.publisher, b.year].join(" · "))}</div><div class="ip-row">${esc(b.note)}</div></div>`).join("") });
  if (data.education.length) apps.push({ label: "Education", glyph: "E", bg: "linear-gradient(135deg,#eab308,#a16207)",
    render: () => head("Education") + data.education.map((e) => `<div class="ip-group"><div class="ip-row"><b>${esc(e.school)}</b> · ${esc(e.year)}</div><div class="ip-row">${esc(e.degree)}</div></div>`).join("") });
  apps.push({ label: "Settings", glyph: "⚙", bg: "linear-gradient(135deg,#8e8e93,#48484a)",
    render: () => head("Settings") +
      `<div class="ip-group-title">Phone</div><div class="ip-group">` +
      Object.entries(ctx.devices).map(([k, d]) => `<button type="button" class="ip-row" data-device="${k}">${esc(d.label)}${k === ctx.current() ? " ✓" : ""}</button>`).join("") +
      `</div><div class="ip-group-title">Résumé theme</div><div class="ip-group">` +
      [["Classic", "classic"], ["Terminal", "terminal"], ["Blueprint", "blueprint"]].map(([l, t]) => `<a class="ip-row" href="/?theme=${t}">${l}</a>`).join("") +
      `</div><div class="ip-group-title">This site</div><div class="ip-group">` +
      `<a class="ip-row" href="/">Back to the classic résumé</a><a class="ip-row" href="/how-ask-works">How the Ask box works</a><a class="ip-row" href="/mcp">Connect an agent (MCP)</a></div>` });

  const dock = [];
  if (data.links.linkedin) dock.push({ label: "LinkedIn", glyph: "in", bg: "linear-gradient(135deg,#2d7fd8,#1452a3)", href: data.links.linkedin });
  if (data.links.mail) dock.push({ label: "Mail", glyph: "✉", bg: "linear-gradient(135deg,#4fb6ff,#1a7bea)", href: data.links.mail });
  if (data.links.pdf) dock.push({ label: "PDF", glyph: "▤", bg: "linear-gradient(135deg,#ff5f57,#c7302a)", href: data.links.pdf });
  dock.push({ label: "Ask", glyph: "✦", bg: "linear-gradient(135deg,#73daca,#2a9d8f)", spot: true });

  // ── DOM ────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.className = "ip";
  root.innerHTML = `
    <div class="ip-device"><div class="ip-screen">
      <div class="ip-island" aria-hidden="true"></div>
      <div class="ip-status" aria-hidden="true"><span data-clock="short"></span><span class="ip-sys">${SIGNAL}${BATTERY}</span></div>
      <section class="ip-layer ip-lock" aria-label="Lock screen — tap to open">
        <div class="date" data-clock="date"></div><div class="time" data-clock="short"></div>
        <div class="ip-notif"><div class="icon"></div><div style="flex:1"><div class="who">Anthony <span>now</span></div><div class="msg">Ask me anything about my work.</div></div></div>
        <div class="ip-hint">Swipe up or tap to open</div>
        <a class="ip-locklink" href="/">View the classic résumé</a>
      </section>
      <section class="ip-layer ip-home" hidden aria-label="Home screen">
        <button class="ip-search" type="button">${MAG} Search</button>
        <div class="ip-grid"></div><div class="ip-dock"></div>
      </section>
      <section class="ip-layer ip-page" hidden aria-live="polite"></section>
      <section class="ip-layer ip-spot" hidden aria-label="Search">
        <form class="ip-field"><input type="text" maxlength="500" autocomplete="off" placeholder="Ask about Anthony…" /><button type="button" data-cancel>Cancel</button></form>
        <div class="ip-spot-head">Suggestions</div><div class="ip-spot-list"></div>
        <div class="ip-spot-note">Answers open in the résumé's Ask box.</div>
      </section>
      <button class="ip-homebar" type="button" aria-label="Go home" hidden></button>
    </div></div>`;
  host.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const screen = $(".ip-screen"), lock = $(".ip-lock"), home = $(".ip-home"), page = $(".ip-page"),
    spot = $(".ip-spot"), status = $(".ip-status"), homebar = $(".ip-homebar"), input = $(".ip-field input");

  const tile = (a, onOpen) => {
    const el = document.createElement(a.href ? "a" : "button");
    el.className = "ip-app";
    if (a.href) { el.href = a.href; if (/^https?:/.test(a.href)) { el.target = "_blank"; el.rel = "noopener"; } } else el.type = "button";
    el.setAttribute("aria-label", a.label);
    el.innerHTML = `<span class="tile" style="background:${a.bg}">${esc(a.glyph)}</span><span class="label">${esc(a.label)}</span>`;
    if (onOpen) on(el, "click", () => onOpen(el));
    return el;
  };
  apps.forEach((a) => $(".ip-grid").appendChild(tile(a, (el) => openApp(a, el))));
  dock.forEach((a) => $(".ip-dock").appendChild(tile(a, a.spot ? openSpot : null)));
  data.suggestions.forEach((q) => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = q;
    on(b, "click", () => ctx.ask(q)); $(".ip-spot-list").appendChild(b);
  });
  if (!data.suggestions.length) { $(".ip-spot-list").hidden = true; $(".ip-spot-head").hidden = true; }

  // ── Clock ──────────────────────────────────────────────────────────
  const tick = () => {
    const now = new Date();
    const short = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M$/i, "");
    const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    root.querySelectorAll('[data-clock="short"]').forEach((el) => (el.textContent = short));
    root.querySelectorAll('[data-clock="date"]').forEach((el) => (el.textContent = date));
  };
  tick();
  const clock = setInterval(tick, 15000);
  cleanups.push(() => clearInterval(clock));

  // ── Navigation ─────────────────────────────────────────────────────
  let layer = "lock";
  const show = (next) => {
    layer = next;
    home.hidden = !(next === "home" || next === "spot");
    home.classList.toggle("behind", next === "spot");
    spot.hidden = next !== "spot";
    page.hidden = next !== "app";
    status.classList.toggle("dark", next === "app");
    homebar.classList.toggle("dark", next === "app");
    homebar.hidden = next === "lock";
  };
  const unlock = () => {
    if (layer !== "lock") return;
    show("home");
    if (ctx.reducedMotion) { lock.hidden = true; return; }
    lock.classList.add("gone");
    const t = setTimeout(() => (lock.hidden = true), 460);
    cleanups.push(() => clearTimeout(t));
  };
  const openApp = (a, fromEl) => {
    page.innerHTML = a.render();
    page.scrollTop = 0;
    if (fromEl && !ctx.reducedMotion) {
      const s = screen.getBoundingClientRect(), r = fromEl.querySelector(".tile").getBoundingClientRect();
      page.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
      page.classList.add("opening");
      show("app");
      requestAnimationFrame(() => requestAnimationFrame(() => page.classList.remove("opening")));
    } else show("app");
  };
  const goHome = () => {
    if (layer === "app" && !ctx.reducedMotion) {
      page.classList.add("opening");
      const t = setTimeout(() => { page.classList.remove("opening"); show("home"); }, 300);
      cleanups.push(() => clearTimeout(t));
    } else if (layer !== "lock") show("home");
  };
  function openSpot() { show("spot"); input.value = ""; setTimeout(() => input.focus(), 50); }

  on(lock, "click", (e) => { if (!e.target.closest("a")) unlock(); });
  on(homebar, "click", goHome);
  on(page, "click", (e) => {
    if (e.target.closest("[data-home]")) goHome();
    const d = e.target.closest("[data-device]");
    if (d) ctx.setDevice(d.dataset.device);
  });
  on($(".ip-search"), "click", openSpot);
  on($("[data-cancel]"), "click", () => show("home"));
  on($(".ip-field"), "submit", (e) => { e.preventDefault(); ctx.ask(input.value); });
  on(spot, "click", (e) => { if (e.target === spot) show("home"); });
  on(document, "keydown", (e) => {
    if (e.key === "Escape") { if (layer === "spot") show("home"); else if (layer === "app") goHome(); }
    if ((e.key === "Enter" || e.key === " ") && layer === "lock") unlock();
  });

  // Swipe up to unlock or close an app; pull down on home for Spotlight.
  let y0 = null, x0 = null;
  on(screen, "touchstart", (e) => { y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; }, { passive: true });
  on(screen, "touchend", (e) => {
    if (y0 === null) return;
    const dy = e.changedTouches[0].clientY - y0, dx = e.changedTouches[0].clientX - x0;
    const fromBottom = y0 > screen.getBoundingClientRect().bottom - 60;
    if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) {
      if (dy < 0 && layer === "lock") unlock();
      else if (dy < 0 && layer === "app" && fromBottom) goHome();
      else if (dy > 0 && layer === "home") openSpot();
    }
    y0 = null;
  }, { passive: true });

  show("lock");

  return function unmount() {
    cleanups.forEach((fn) => fn());
    root.remove();
    style.remove();
  };
}
