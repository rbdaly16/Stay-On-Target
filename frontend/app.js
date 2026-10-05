const DAY_MS = 86400000;
const DAY_W = 30;

const GROUP_ORDER = {
  category: ["Work", "School", "Job Search", "Personal", "Uncategorized"],
  status: ["In progress", "Not started", "Blocked", "Done"],
  priority: ["High", "Medium", "Low"],
};

const state = {
  groupBy: localStorage.getItem("groupBy") || "category",
  hideDone: localStorage.getItem("hideDone") === "true",
};

let tasks = [];
let lastUpdated = null;
const today = startOfDay(new Date());

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a, b) {
  return Math.round((b - a) / DAY_MS);
}

function fmtDate(s) {
  return parseDate(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function slug(s) {
  return s.toLowerCase().replace(/\s+/g, "-");
}

// Undated tasks sort after everything with a deadline.
function deadlineValue(t) {
  return t.deadline ? +parseDate(t.deadline) : Infinity;
}

function isOverdue(t) {
  return t.status !== "Done" && !!t.deadline && parseDate(t.deadline) < today;
}

function dueText(t) {
  if (t.status === "Done") return "Done";
  if (!t.deadline) return "No deadline yet";
  const n = daysBetween(today, parseDate(t.deadline));
  if (n < 0) return `Overdue by ${-n} day${n === -1 ? "" : "s"}`;
  if (n === 0) return "Due today";
  return `Due in ${n} day${n === 1 ? "" : "s"}`;
}

// Done tasks show a green check and a struck-through title.
function titleHtml(t) {
  return t.status === "Done"
    ? `<span class="done-check" aria-label="Done">✔</span><s>${esc(t.title)}</s>`
    : esc(t.title);
}

function badge(kind, value) {
  return `<span class="badge ${kind}-${slug(value)}">${esc(value)}</span>`;
}

// Each task has a helper per theme in `helpers` (hp, sw, hindu, dragon, wof). Older tasks
// kept the Harry Potter one in `helper`. Hindu deities render as Tanjore medallions, Wings
// of Fire as chibi dragons, the rest as Labubus.
const ROSTERS = { hp: CHARACTERS, sw: SW_CHARACTERS, hindu: HINDU_CHARACTERS, dragon: DRAGON_CHARACTERS, wof: WOF_CHARACTERS };
const RENDERERS = { hindu: medallionSVG, wof: dragonSVG };

function helperSVG(ch) {
  return (RENDERERS[currentTheme] || labubuSVG)(ch);
}

function taskHelper(t) {
  const h = t.helpers?.[currentTheme] ?? (currentTheme === "hp" ? t.helper : null);
  const ch = h && ROSTERS[currentTheme][h.character];
  return ch ? { ch, reason: h.reason } : null;
}

function helperHtml(t, size) {
  const h = taskHelper(t);
  if (!h) return "";
  return `<span class="helper helper-${size}" data-tip-name="${esc(h.ch.name)}" data-tip="${esc(h.reason)}">${helperSVG(h.ch)}</span>`;
}

function renderSummary(list) {
  const active = list.filter((t) => t.status !== "Done");
  const week = active.filter((t) => {
    if (!t.deadline) return false;
    const n = daysBetween(today, parseDate(t.deadline));
    return n >= 0 && n <= 7;
  });
  const stats = [
    ["Active", active.length, ""],
    ["Due in 7 days", week.length, ""],
    ["Overdue", active.filter(isOverdue).length, "alert"],
    [T("done"), list.length - active.length, "good"],
  ];
  return `<section class="summary">${stats
    .map(([label, n, cls]) => `<div class="stat ${cls}"><div class="stat-n">${n}</div><div class="stat-l">${label}</div></div>`)
    .join("")}</section>`;
}

function renderControls() {
  const opts = ["category", "status", "priority"]
    .map((g) => `<button data-group="${g}" class="${state.groupBy === g ? "active" : ""}">${g[0].toUpperCase() + g.slice(1)}</button>`)
    .join("");
  return `<section class="controls">
    <div class="group-by"><span>Group by</span>${opts}</div>
    <label class="toggle"><input type="checkbox" id="hide-done" ${state.hideDone ? "checked" : ""}> Hide done</label>
  </section>`;
}

function renderGantt() {
  const visible = tasks.filter((t) => !(state.hideDone && t.status === "Done"));
  if (!visible.length) return `<p class="empty">No tasks to show.</p>`;

  // Timeline spans all tasks, padded, and always includes the week before and month after today.
  // Quick-captured tasks without a deadline get a row but no bar, so they don't shape the timeline.
  const dated = visible.filter((t) => t.deadline);
  const starts = dated.map((t) => parseDate(t.start || t.deadline));
  const ends = dated.map((t) => parseDate(t.deadline));
  const rangeStart = new Date(Math.min(...starts, today - 7 * DAY_MS) - 2 * DAY_MS);
  const rangeEnd = new Date(Math.max(...ends, +today + 30 * DAY_MS) + 3 * DAY_MS);
  const nDays = daysBetween(rangeStart, rangeEnd) + 1;
  const trackW = nDays * DAY_W;

  const days = Array.from({ length: nDays }, (_, i) => new Date(+rangeStart + i * DAY_MS));
  const months = [];
  days.forEach((d) => {
    const label = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    if (!months.length || months[months.length - 1].label !== label) months.push({ label, count: 0 });
    months[months.length - 1].count++;
  });

  const weekendBg = days
    .map((d, i) => (d.getDay() === 0 || d.getDay() === 6 ? `<div class="weekend" style="left:${i * DAY_W}px;width:${DAY_W}px"></div>` : ""))
    .join("");
  const todayLine = `<div class="today-line" style="left:${daysBetween(rangeStart, today) * DAY_W + DAY_W / 2}px"></div>`;

  const header = `<div class="g-row g-head">
    <div class="g-label">Task</div>
    <div class="g-track" style="width:${trackW}px">
      <div class="months">${months.map((m) => `<div style="width:${m.count * DAY_W}px">${m.label}</div>`).join("")}</div>
      <div class="days">${days
        .map((d) => `<div class="${+d === +today ? "is-today" : ""}" style="width:${DAY_W}px">${d.getDate()}</div>`)
        .join("")}</div>
    </div>
  </div>`;

  const key = state.groupBy;
  const groups = GROUP_ORDER[key]
    .map((name) => ({ name, items: visible.filter((t) => t[key] === name) }))
    .filter((g) => g.items.length);

  const body = groups
    .map((g) => {
      const rows = g.items
        .sort((a, b) => deadlineValue(a) - deadlineValue(b))
        .map((t) => {
          const href = `#/task/${encodeURIComponent(t.id)}`;
          let bar;
          if (t.deadline) {
            const s = parseDate(t.start || t.deadline);
            const left = daysBetween(rangeStart, s) * DAY_W;
            const width = (daysBetween(s, parseDate(t.deadline)) + 1) * DAY_W;
            bar = `<a href="${href}" class="bar status-${slug(t.status)} ${isOverdue(t) ? "overdue" : ""}"
                 style="left:${left}px;width:${width}px" title="${esc(t.title)} — ${esc(t.status)}, ${dueText(t)}">
                ${esc(t.title)}
              </a>`;
          } else {
            const left = daysBetween(rangeStart, today) * DAY_W + DAY_W;
            bar = `<a href="${href}" class="no-deadline" style="left:${left}px" title="Tell the chat when it's due to add a bar">No deadline yet</a>`;
          }
          return `<div class="g-row">
            <a class="g-label" href="#/task/${encodeURIComponent(t.id)}">
              ${helperHtml(t, "sm")}
              <span class="g-text">
                <span class="g-title">${titleHtml(t)}</span>
                <span class="g-meta">${badge("priority", t.priority)} ${t.deadline ? fmtDate(t.deadline) : "No deadline"}</span>
              </span>
            </a>
            <div class="g-track" style="width:${trackW}px">${weekendBg}${todayLine}${bar}</div>
          </div>`;
        })
        .join("");
      return `<div class="g-row g-group"><div class="g-label">${esc(g.name)} <span class="count">${g.items.length}</span></div><div class="g-track" style="width:${trackW}px"></div></div>${rows}`;
    })
    .join("");

  const legend = GROUP_ORDER.status.map((s) => `<span><i class="swatch status-${slug(s)}"></i>${s}</span>`).join("");

  return `<section class="gantt-wrap"><div class="gantt" id="gantt">${header}${body}</div></section>
    <div class="legend">${legend}<span><i class="swatch overdue-swatch"></i>Overdue</span><span><i class="swatch today-swatch"></i>Today</span></div>`;
}

const EXAMPLES = [
  ["Add a task", "Add a task: finish the accounting problem set. School, high priority, due Friday."],
  ["Jot something down", "Add a task: call the dentist"],
  ["Daily check-in", "I started the accounting problem set but didn't finish it."],
  ["Plan ahead", "What's coming up this week, and what should I focus on first?"],
];

// Shown to a signed-in user whose tracker is empty.
function renderWelcome() {
  const chat = esc(T("chatName"));
  return `<section class="welcome">
    <h1>Welcome! Your tracker is empty.</h1>
    <p>Everything here runs through the chat. Open <b>${chat}</b> (bottom right) and talk to it like an assistant.</p>
    <ol class="welcome-steps">
      <li><b>Add tasks.</b> Give each one a <b>title</b>, plus if you know them a <b>category</b>
        (${GROUP_ORDER.category.slice(0, -1).join(", ")}), <b>priority</b> (${GROUP_ORDER.priority.join(", ")}), and
        <b>deadline</b>. Just jotting something down? A title alone works: it lands in <b>Uncategorized</b> at Medium
        priority with no bar until you tell the chat when it's due.</li>
      <li><b>Check in.</b> Tell it what you worked on (or didn't). It updates statuses and adds dated notes to each task.</li>
      <li><b>Plan.</b> Ask what's coming up or how to prioritize, and it answers from your tasks.</li>
      <li><b>Explore.</b> Click any task for its details, notes, and helper. Switch the look with the Theme menu,
        and finish a task to see a celebration.</li>
    </ol>
    <h2>Try an example</h2>
    <div class="welcome-examples">${EXAMPLES.map(([label, text], i) =>
      `<button class="example" data-example="${i}"><span>${esc(label)}</span>“${esc(text)}”</button>`).join("")}</div>
    <p class="welcome-note">Clicking an example puts it in the chat box so you can edit it before sending.</p>
  </section>`;
}

function renderOverview() {
  if (!tasks.length) {
    document.getElementById("app").innerHTML = renderWelcome();
    document.querySelectorAll("[data-example]").forEach((b) =>
      b.addEventListener("click", () => openChat(EXAMPLES[b.dataset.example][1]))
    );
    return;
  }
  document.getElementById("app").innerHTML = renderSummary(tasks) + renderControls() + renderGantt();

  document.querySelectorAll("[data-group]").forEach((b) =>
    b.addEventListener("click", () => {
      state.groupBy = b.dataset.group;
      localStorage.setItem("groupBy", state.groupBy);
      renderOverview();
    })
  );
  document.getElementById("hide-done").addEventListener("change", (e) => {
    state.hideDone = e.target.checked;
    localStorage.setItem("hideDone", state.hideDone);
    renderOverview();
  });

  // Scroll so today sits near the left edge of the timeline.
  const line = document.querySelector(".today-line");
  const gantt = document.getElementById("gantt");
  if (line && gantt) gantt.scrollLeft = Math.max(0, line.offsetLeft - 5 * DAY_W);
}

function renderTask(id) {
  const t = tasks.find((x) => x.id === id);
  const app = document.getElementById("app");
  if (!t) {
    app.innerHTML = `<a class="back" href="#/">&larr; ${T("back")}</a><p class="empty">Task not found.</p>`;
    return;
  }

  const notes = [...(t.notes || [])].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  const notesHtml = notes.length
    ? `<ol class="notes">${notes.map((n) => `<li><time>${fmtDate(n.date)}</time><p>${esc(n.text)}</p></li>`).join("")}</ol>`
    : `<p class="empty">No notes yet.</p>`;

  const fields = [
    ["Category", badge("category", t.category)],
    ["Status", badge("status", t.status)],
    ["Priority", badge("priority", t.priority)],
    ["Start", t.start ? fmtDate(t.start) : "—"],
    ["Deadline", t.deadline ? fmtDate(t.deadline) : "Not set yet"],
    ["Timing", `<span class="${isOverdue(t) ? "text-alert" : ""}">${dueText(t)}</span>`],
  ];

  const h = taskHelper(t);
  const helperSection = h
    ? `<section><h2>${T("helperHeading")}</h2><div class="helper-card">${helperHtml(t, "lg")}
        <div><div class="helper-name">${esc(h.ch.name)}</div><p>${esc(h.reason)}</p></div></div></section>`
    : "";

  app.innerHTML = `<a class="back" href="#/">&larr; ${T("back")}</a>
    <article class="task">
      <h1>${titleHtml(t)}</h1>
      <dl class="fields">${fields.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      ${helperSection}
      ${t.description ? `<section><h2>Description</h2><p>${esc(t.description)}</p></section>` : ""}
      <section><h2>Notes</h2>${notesHtml}</section>
    </article>`;
}

// One shared tooltip for helper hover text, positioned in the viewport so the
// scrolling chart can't clip it.
const tip = document.createElement("div");
tip.className = "tooltip";
document.body.appendChild(tip);
document.addEventListener("mouseover", (e) => {
  const el = e.target.closest("[data-tip]");
  if (!el) return;
  tip.innerHTML = `<strong>${esc(el.dataset.tipName)}</strong>${esc(el.dataset.tip)}`;
  const r = el.getBoundingClientRect();
  tip.style.left = `${Math.min(r.right + 10, window.innerWidth - 290)}px`;
  tip.style.top = `${Math.max(8, r.top + r.height / 2 - 40)}px`;
  tip.classList.add("show");
});
document.addEventListener("mouseout", (e) => {
  if (e.target.closest("[data-tip]")) tip.classList.remove("show");
});

function route(keepScroll = false) {
  tip.classList.remove("show");
  const m = location.hash.match(/^#\/task\/(.+)$/);
  if (m) renderTask(decodeURIComponent(m[1]));
  else renderOverview();
  if (!keepScroll) window.scrollTo(0, 0);
  document.getElementById("last-updated").textContent = lastUpdated ? `Last updated ${fmtDate(lastUpdated)}` : "";
}

// Called on load and by chat.js after the server saves changes.
function setTaskData(data, keepScroll = true) {
  ({ tasks, lastUpdated } = data);
  route(keepScroll);
  celebrateNewlyDone(tasks);
}

async function loadTasks() {
  const res = await apiFetch("/api/data");
  if (res.status === 401) return;
  if (!res.ok) {
    document.getElementById("app").innerHTML = `<p class="empty">Couldn't load tasks (${res.status}). Try refreshing.</p>`;
    return;
  }
  setTaskData(await res.json(), false);
}

window.addEventListener("hashchange", () => route());
document.addEventListener("themechange", () => currentUserId && route(true));
initAuth().then((signedIn) => signedIn && loadTasks());
