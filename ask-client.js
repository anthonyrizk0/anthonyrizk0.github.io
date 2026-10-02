// The Ask client — shared by the résumé (/) and the phones (/phone).
//
// It owns everything between "a question" and "an answer": loading Turnstile,
// trading a solved challenge for a session token, asking, re-challenging once
// when a session has gone stale, and streaming the answer back. It owns no UI.
// Each page decides how to show "thinking", where the checkbox appears when
// Cloudflare wants a click, and what to say when something fails — the client
// just reports which thing failed.
//
// One client per page: Turnstile calls back through fixed global function
// names (window.askTurnstile*), so two clients on one page would fight.

const BASE = "https://ask.anthonyrizk.me";
export const SITEKEY = "0x4AAAAAAEnfXIBT6gmKFYih";
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

// How long to wait for Turnstile to load *and* render its widget before
// concluding something is blocking it. The old client checked once, at call
// time — so a question asked the moment the page loaded (the /?ask= hand-off)
// failed as "blocked" whenever the script was merely still loading.
const READY_TIMEOUT_MS = 15000;
// Reading and clicking the checkbox, when Cloudflare asks for one.
const CHALLENGE_TIMEOUT_MS = 60000;

/** Failures the caller can tell apart. `kind` is what the UI should switch on. */
export class AskError extends Error {
  constructor(kind, detail) {
    super(kind + (detail ? ": " + detail : ""));
    this.kind = kind; // "blocked" | "verify-timeout" | "verify-failed" | "no_output" | "unreachable"
  }
}

// ── Markdown ───────────────────────────────────────────────────────────
// Minimal, and HTML is escaped FIRST, so nothing the model emits — or that a
// visitor talks it into emitting — can inject markup. Unclosed markers render
// literally and correct themselves as the closing marker streams in.
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function inlineMd(s) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
}
export function renderMarkdown(src) {
  return escapeHtml(src)
    .split(/\n{2,}/)
    .filter((b) => b.trim())
    .map((block) => {
      const lines = block.split("\n").filter((l) => l.trim());
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        return "<ul>" + lines.map((l) => "<li>" + inlineMd(l.replace(/^\s*[-*]\s+/, "")) + "</li>").join("") + "</ul>";
      }
      return "<p>" + inlineMd(lines.join(" ")) + "</p>";
    })
    .join("");
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.host  where the Turnstile widget lives. If it has no
 *   .cf-turnstile inside, one is created. It should be somewhere the visitor
 *   can see when onChallenge(true) fires.
 * @param {(visible: boolean) => void} [opts.onChallenge]  Cloudflare wants (or
 *   no longer wants) the visitor to click the checkbox.
 */
export function createAskClient({ host, onChallenge = () => {} }) {
  let widget = host.querySelector(".cf-turnstile");
  if (!widget) {
    widget = document.createElement("div");
    widget.className = "cf-turnstile";
    host.appendChild(widget);
  }
  if (!widget.id) widget.id = "ask-turnstile";
  const sel = "#" + widget.id;
  Object.entries({
    sitekey: SITEKEY,
    action: "ask",
    execution: "execute",
    callback: "askTurnstileToken",
    "error-callback": "askTurnstileError",
    "before-interactive-callback": "askTurnstileShow",
    "after-interactive-callback": "askTurnstileHide",
  }).forEach(([k, v]) => widget.setAttribute("data-" + k, v));

  // Implicit rendering, deliberately: Turnstile scans for .cf-turnstile when
  // its script loads. (Explicit render() hit ordering bugs in Safari earlier.)
  // So the widget markup must exist before the script is added.
  if (!document.querySelector(`script[src^="${SCRIPT}"]`)) {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    document.head.appendChild(s);
  }

  let pending = null; // resolver for the in-flight execute()
  window.askTurnstileShow = () => onChallenge(true);
  window.askTurnstileHide = () => onChallenge(false);
  window.askTurnstileToken = (tok) => {
    onChallenge(false);
    if (pending) { pending.resolve(tok); pending = null; }
  };
  window.askTurnstileError = () => {
    onChallenge(false);
    if (pending) { pending.reject(new AskError("verify-failed")); pending = null; }
  };

  // ── Ready: the script has loaded AND rendered our widget ─────────────
  let readyP = null;
  function ready() {
    if (readyP) return readyP;
    readyP = new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const rendered = widget.querySelector("iframe, input[name='cf-turnstile-response']");
        if (window.turnstile && rendered) return resolve();
        if (Date.now() - t0 > READY_TIMEOUT_MS) return reject(new AskError("blocked"));
        setTimeout(check, 100);
      })();
    });
    // A failed wait shouldn't poison later attempts — the blocker may be gone.
    readyP.catch(() => { readyP = null; });
    return readyP;
  }

  function solve() {
    return new Promise((resolve, reject) => {
      // Each attempt owns its timer; settling it must not leave a timeout
      // behind that could reject a later challenge.
      let timer;
      const attempt = {
        resolve: (tok) => { done(); resolve(tok); },
        reject: (err) => { done(); reject(err); },
      };
      function done() { clearTimeout(timer); if (pending === attempt) pending = null; }
      pending = attempt;
      try {
        window.turnstile.reset(sel); // clear any spent token first
        timer = setTimeout(() => attempt.reject(new AskError("verify-timeout")), CHALLENGE_TIMEOUT_MS);
        window.turnstile.execute(sel);
      } catch (e) {
        attempt.reject(new AskError("verify-failed", e && e.message));
      }
    });
  }

  // One challenge per visit, not per question: the token buys a session.
  let session = null;
  let sessionExpiry = 0;
  async function ensureSession() {
    if (session && Date.now() < sessionExpiry) return session;
    await ready();
    const tok = await solve();
    let res;
    try {
      res = await fetch(BASE + "/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turnstileToken: tok }),
      });
    } catch (e) {
      throw new AskError("unreachable", e && e.message);
    }
    if (!res.ok) throw new AskError(res.status === 403 ? "verify-failed" : "unreachable", "session " + res.status);
    const data = await res.json();
    session = data.session;
    // Renew a minute early rather than failing a question on the edge.
    sessionExpiry = Date.now() + Math.max(0, data.expiresIn - 60000);
    return session;
  }
  function dropSession() { session = null; sessionExpiry = 0; }

  /**
   * Ask a question. Resolves with the full answer text; calls onText with the
   * text so far as it streams. Rejects with an AskError.
   */
  async function ask(question, { onText = () => {}, signal } = {}) {
    // Verification is its own failure domain. Folding it into the request
    // errors reported every stalled challenge as a backend outage.
    let sess;
    try {
      sess = await ensureSession();
    } catch (e) {
      dropSession();
      try { window.turnstile && window.turnstile.reset(sel); } catch (_) {}
      throw e instanceof AskError ? e : new AskError("verify-failed", e && e.message);
    }

    const post = (s) => fetch(BASE + "/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, session: s }),
      signal,
    });

    try {
      let res = await post(sess);
      // A 403 means the session is dead, not that the visitor is unwelcome:
      // the server's signing secret is regenerated on restart, so a session can
      // stop being valid before its expiry. Re-challenge once.
      if (res.status === 403) {
        dropSession();
        res = await post(await ensureSession());
      }
      if (!res.ok || !res.body) throw new AskError("unreachable", "HTTP " + res.status);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", out = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n\n")) !== -1) {
          const raw = buf.slice(0, i);
          buf = buf.slice(i + 2);
          const data = raw.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trimStart()).join("\n");
          if (!data) continue;
          const msg = JSON.parse(data);
          // The model reasoned past its budget without answering — not an outage.
          if (msg.error === "no_output") throw new AskError("no_output");
          if (msg.error) throw new AskError("unreachable", msg.error);
          if (msg.text) { out += msg.text; onText(out); }
        }
      }
      if (!out) throw new AskError("unreachable", "empty response");
      return out;
    } catch (e) {
      if (e && e.name === "AbortError") throw e;
      if (!(e instanceof AskError) || e.kind === "unreachable") dropSession();
      throw e instanceof AskError ? e : new AskError("unreachable", e && e.message);
    }
  }

  return { ask, ready };
}

/** What to tell a visitor for each failure. Pages can override. */
export const MESSAGES = {
  blocked: "The verification step didn't load — a content blocker may be stopping it. The résumé covers the same ground.",
  "verify-timeout": "The verification check didn't complete — that's usually a browser privacy setting or a content blocker. Try again, or reload the page.",
  "verify-failed": "Couldn't complete the verification step. Try again, or reload the page.",
  no_output: "That one ran long without producing an answer. Try asking it more narrowly.",
  unreachable: "This is temporarily unreachable — my side, not yours. The résumé covers the same ground, and email still works.",
};
