// Terminal theme module: a working prompt pinned to the bottom of the page.
//
// Everything it does is navigation over what's already on the page — scroll to
// a section, jump to a role, open a sibling page — plus `ask`, which hands the
// question to the existing Ask box rather than talking to anything itself.
// Loaded only when the Terminal theme is active; mount() returns the function
// that takes all of it away again.

const CSS = `
.term-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 30;
  font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
  font-size: 0.8rem; line-height: 1.55;
  background: var(--bg);
  border-top: 1px solid var(--border-mid);
  color: var(--text-mid);
}
.term-inner { max-width: 760px; margin: 0 auto; padding: 8px 20px 10px; }
.term-out { max-height: 11.5em; overflow-y: auto; white-space: pre-wrap; margin-bottom: 4px; }
.term-out:empty { display: none; }
.term-out .cmd { color: var(--text-muted); }
.term-out .err { color: var(--orange); }
.term-out .hi { color: var(--blue); }
.term-out a { color: var(--teal); text-decoration: underline; cursor: pointer; }
.term-line { display: flex; align-items: center; gap: 0.6ch; }
.term-ps1 { color: var(--blue); white-space: nowrap; }
.term-in {
  flex: 1; min-width: 0; background: none; border: none; outline: none;
  font: inherit; color: var(--text); caret-color: var(--blue); padding: 2px 0;
}
.term-in::placeholder { color: var(--text-dim); }
.term-min {
  background: none; border: 1px solid var(--border-mid); color: var(--text-muted);
  font: inherit; font-size: 0.7rem; padding: 0 7px; cursor: pointer;
}
.term-min:hover { color: var(--blue); border-color: var(--border-accent); }
.term-bar.is-min .term-out, .term-bar.is-min .term-line .term-in,
.term-bar.is-min .term-ps1 { display: none; }
.term-bar.is-min { left: auto; right: 16px; bottom: 16px; border: 1px solid var(--border-mid); }
.term-bar.is-min .term-inner { padding: 4px 6px; }
.term-flash { outline: 1px dashed var(--blue); outline-offset: 6px; transition: outline-color 1.2s; }
.term-flash.fade { outline-color: transparent; }
body.term-pad { padding-bottom: 5.5rem; }
@media (max-width: 600px) {
  .term-bar { font-size: 0.74rem; }
  .term-out { max-height: 7.5em; }
  .term-ps1 .host { display: none; }
}
@media print { .term-bar { display: none !important; } body.term-pad { padding-bottom: 0; } }
`;

// Pages it's fine to open. /plantvision is deliberately not linked from the
// résumé yet, so it isn't reachable from here either.
const PAGES = {
  mcp: "/mcp",
  how: "/how-ask-works",
  pdf: "/anthony_rizk_resume_sep2026.pdf",
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

export function mount(ctx) {
  const cleanups = [];
  const on = (el, ev, fn, opts) => {
    el.addEventListener(ev, fn, opts);
    cleanups.push(() => el.removeEventListener(ev, fn, opts));
  };

  // --- read the page as a filesystem ----------------------------------------
  // Built from the DOM each mount, so it can never disagree with the résumé.
  const sections = {};
  document.querySelectorAll("section").forEach((sec) => {
    const h = sec.querySelector("h2");
    if (!h) return;
    const name = slug(h.firstChild ? h.firstChild.textContent : h.textContent);
    if (name) sections[name] = sec;
  });
  const roles = {};
  document.querySelectorAll(".exp-item").forEach((item) => {
    const c = item.querySelector(".company");
    if (!c) return;
    // "Rove Mobile (acquired by SolarWinds)" -> "rovemobile"; the first text
    // node is the company, the parenthetical is a child span.
    const label = (c.firstChild ? c.firstChild.textContent : c.textContent).trim();
    let key = slug(label.split(/[—(]/)[0]);
    while (roles[key]) key += "2"; // Facebook appears twice
    roles[key] = { el: item, label };
  });

  // --- DOM ------------------------------------------------------------------
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.className = "term-bar";
  bar.innerHTML = `
    <div class="term-inner">
      <div class="term-out" aria-live="polite"></div>
      <div class="term-line">
        <span class="term-ps1"><span class="host">anthony@anthonyrizk.me</span>:~$</span>
        <input class="term-in" type="text" spellcheck="false" autocomplete="off"
               autocapitalize="off" aria-label="Terminal — type help"
               placeholder="type help" />
        <button class="term-min" type="button" aria-label="Minimise terminal">_</button>
      </div>
    </div>`;
  document.body.appendChild(bar);
  document.body.classList.add("term-pad");

  const out = bar.querySelector(".term-out");
  const input = bar.querySelector(".term-in");
  const minBtn = bar.querySelector(".term-min");

  const print = (html, cls) => {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  };
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

  const scrollTo = (el) => {
    el.scrollIntoView({ behavior: ctx.reducedMotion ? "auto" : "smooth", block: "start" });
    el.classList.add("term-flash");
    const t1 = setTimeout(() => el.classList.add("fade"), 900);
    const t2 = setTimeout(() => el.classList.remove("term-flash", "fade"), 2200);
    cleanups.push(() => { clearTimeout(t1); clearTimeout(t2); el.classList.remove("term-flash", "fade"); });
  };

  // --- commands -------------------------------------------------------------
  const commands = {
    help() {
      print(
        [
          "<span class='hi'>ls</span>              what's here",
          "<span class='hi'>ls roles</span>        every role, newest first",
          "<span class='hi'>cd</span> &lt;section&gt;    jump to a section   (cd ~ for the top)",
          "<span class='hi'>cat</span> &lt;role&gt;      jump to a role      (cat greg)",
          "<span class='hi'>ask</span> &lt;question&gt;  ask the résumé",
          "<span class='hi'>open</span> mcp|how|pdf",
          "<span class='hi'>whoami</span>  <span class='hi'>clear</span>  <span class='hi'>exit</span>",
          "tab completes · ↑↓ history · ` focuses · esc leaves",
        ].join("\n"),
      );
    },
    ls(arg) {
      if (arg && /^(roles?|experience)\/?$/.test(arg)) {
        print(Object.values(roles).map((r) => esc(r.label)).join("\n"));
        return;
      }
      print(Object.keys(sections).map((s) => `${s}/`).join("  ") + "  roles/");
    },
    cd(arg) {
      if (!arg || arg === "~" || arg === "/" || arg === "..") {
        window.scrollTo({ top: 0, behavior: ctx.reducedMotion ? "auto" : "smooth" });
        return;
      }
      const target = sections[slug(arg)];
      if (target) scrollTo(target);
      else if (roles[slug(arg)]) commands.cat(arg);
      else print(`cd: no such section: ${esc(arg)}`, "err");
    },
    cat(arg) {
      if (!arg) return print("cat: which role? try <span class='hi'>ls roles</span>", "err");
      const key = slug(arg);
      const hit = roles[key] || Object.entries(roles).find(([k]) => k.startsWith(key))?.[1];
      if (hit) scrollTo(hit.el);
      else if (sections[key]) scrollTo(sections[key]);
      else print(`cat: ${esc(arg)}: no such role`, "err");
    },
    ask(arg) {
      const q = (arg || "").trim();
      if (!q) return print("ask: what would you like to know?  e.g. ask what did he build at Tableau", "err");
      const askInput = document.getElementById("ask-input");
      const form = document.getElementById("ask-form");
      if (!askInput || !form) return print("ask: the Ask box isn't on this page", "err");
      askInput.value = q.slice(0, 500);
      scrollTo(document.getElementById("ask"));
      form.requestSubmit();
      print("→ answering in the Ask box above");
    },
    open(arg) {
      const url = PAGES[slug(arg || "")];
      if (!url) return print(`open: try ${Object.keys(PAGES).join(", ")}`, "err");
      window.location.href = url;
    },
    whoami() {
      const eyebrow = document.querySelector(".nameplate .eyebrow");
      const sub = document.querySelector(".nameplate .subtitle");
      print(esc(`anthony — ${eyebrow ? eyebrow.textContent.replace(/\s+/g, " ").trim() : ""}\n${sub ? sub.textContent.replace(/\s+/g, " ").trim() : ""}`));
    },
    clear() { out.innerHTML = ""; },
    exit() { ctx.setTheme("classic"); },
    logout() { ctx.setTheme("classic"); },
    sudo() { print("anthony is not in the sudoers file. This incident will be reported.", "err"); },
    hire() { print("Good instinct. <a href='mailto:anthony.rizk@gmail.com'>mail anthony</a>"); },
    mail() { window.location.href = "mailto:anthony.rizk@gmail.com"; },
    vim() { print("You're in. There is no way out. (try <span class='hi'>exit</span>)"); },
    pwd() { print("/home/anthony"); },
    date() { print(esc(new Date().toString())); },
  };
  commands.email = commands.mail;
  commands.man = commands.help;
  commands["?"] = commands.help;
  commands.dir = commands.ls;

  const history = [];
  let hIndex = 0;

  const run = (raw) => {
    const line = raw.trim();
    print(`$ ${esc(line)}`, "cmd");
    if (!line) return;
    history.push(line);
    hIndex = history.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(rest.join(" "));
    else print(`${esc(cmd)}: command not found. try <span class='hi'>help</span>`, "err");
  };

  const complete = () => {
    const v = input.value;
    const parts = v.split(/\s+/);
    const pool =
      parts.length <= 1
        ? Object.keys(commands).filter((c) => c.length > 1)
        : parts[0] === "cd"
          ? [...Object.keys(sections), "~"]
          : parts[0] === "cat"
            ? Object.keys(roles)
            : parts[0] === "open"
              ? Object.keys(PAGES)
              : parts[0] === "ls"
                ? ["roles"]
                : [];
    const last = parts[parts.length - 1].toLowerCase();
    const matches = pool.filter((p) => p.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      input.value = parts.join(" ") + " ";
    } else if (matches.length > 1) {
      print(matches.join("  "));
    }
  };

  on(input, "keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
    } else if (e.key === "ArrowDown" && history.length) {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || "";
    } else if (e.key === "Escape") {
      input.blur();
    }
  });

  // ` focuses the prompt from anywhere — but never while someone is typing
  // somewhere else, like the Ask box.
  on(document, "keydown", (e) => {
    if (e.key !== "`" || e.metaKey || e.ctrlKey || e.altKey) return;
    const a = document.activeElement;
    if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable)) return;
    e.preventDefault();
    if (bar.classList.contains("is-min")) toggleMin();
    input.focus();
  });

  const toggleMin = () => {
    const min = bar.classList.toggle("is-min");
    minBtn.textContent = min ? ">_" : "_";
    minBtn.setAttribute("aria-label", min ? "Open terminal" : "Minimise terminal");
    document.body.classList.toggle("term-pad", !min);
    try { sessionStorage.setItem("term-min", min ? "1" : "0"); } catch (e) {}
    if (!min) input.focus();
  };
  on(minBtn, "click", toggleMin);
  on(out, "click", (e) => { if (e.target === out) input.focus(); });
  try { if (sessionStorage.getItem("term-min") === "1") toggleMin(); } catch (e) {}

  print("anthonyrizk.me — type <span class='hi'>help</span>, or <span class='hi'>exit</span> to leave");

  return function unmount() {
    cleanups.forEach((fn) => fn());
    bar.remove();
    style.remove();
    document.body.classList.remove("term-pad");
  };
}
