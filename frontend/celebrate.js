// Completion celebrations. app.js calls celebrateNewlyDone() whenever task data loads; tasks
// that are Done now but weren't the last time this browser looked trigger a themed scene.
// Star Wars: an X-wing torpedoes the Death Star. Harry Potter: Hedwig delivers a letter
// under floating candles and sparkles. Hindu: a kolam draws itself while diyas light and
// marigold and jasmine petals fall. Empyrean: lightning strikes as Tairn flies past
// breathing fire. All drawn in HTML/SVG; no images.

const XWING_SVG = `<svg viewBox="0 0 170 84" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="34" r="7" fill="#ff8a3d" opacity=".55"/><circle cx="16" cy="50" r="7" fill="#ff8a3d" opacity=".55"/>
  <circle cx="18" cy="34" r="3.5" fill="#ffd6a0"/><circle cx="18" cy="50" r="3.5" fill="#ffd6a0"/>
  <polygon points="40,38 72,38 60,8 46,8" fill="#c7ccd3" stroke="#8a939e"/>
  <polygon points="48,8 58,8 62,18 51,18" fill="#d33"/>
  <line x1="46" y1="8" x2="104" y2="8" stroke="#8a939e" stroke-width="2.5"/>
  <polygon points="40,46 72,46 60,76 46,76" fill="#b9bfc7" stroke="#8a939e"/>
  <polygon points="48,76 58,76 62,66 51,66" fill="#d33"/>
  <line x1="46" y1="76" x2="104" y2="76" stroke="#8a939e" stroke-width="2.5"/>
  <rect x="20" y="30" width="22" height="24" rx="4" fill="#9aa2ac"/>
  <polygon points="22,35 125,38 166,42 125,46 22,49" fill="#e3e6ea" stroke="#8a939e"/>
  <polygon points="118,38 132,39 132,45 118,46" fill="#d33"/>
  <ellipse cx="96" cy="42" rx="11" ry="3.2" fill="#2b3a4a"/>
</svg>`;

const DEATH_STAR_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="48" fill="#8d949c"/>
  <path d="M50 2 A48 48 0 0 1 50 98 A30 48 0 0 0 50 2 Z" fill="#000" opacity=".22"/>
  <path d="M3 52 Q50 58 97 52" fill="none" stroke="#5d646c" stroke-width="2.2"/>
  <circle cx="34" cy="32" r="12" fill="#767d85"/><circle cx="34" cy="32" r="7" fill="#656b72"/><circle cx="34" cy="32" r="2" fill="#4a4f55"/>
  <path d="M14 30 H26 M60 22 H82 M58 72 H80 M18 74 H40 M62 40 H90" stroke="#7a8189" stroke-width="1.5"/>
</svg>`;

const HEDWIG_SVG = `<svg viewBox="0 0 130 100" xmlns="http://www.w3.org/2000/svg">
  <g class="hw-wing hw-wing-back"><path d="M62 44 Q48 2 14 6 Q38 24 74 48 Z" fill="#e6e6df" stroke="#c9c9c0"/></g>
  <polygon points="36,52 12,46 16,62" fill="#ececE6" stroke="#cfcfc6"/>
  <ellipse cx="62" cy="54" rx="28" ry="21" fill="#f8f8f3" stroke="#d6d6ce"/>
  <circle cx="54" cy="50" r="1.4" fill="#9aa1a8"/><circle cx="62" cy="58" r="1.4" fill="#9aa1a8"/><circle cx="48" cy="60" r="1.2" fill="#9aa1a8"/>
  <circle cx="88" cy="40" r="16" fill="#fbfbf7" stroke="#d6d6ce"/>
  <circle cx="93" cy="37" r="4.6" fill="#f2c230"/><circle cx="94" cy="37" r="2.2" fill="#111"/><circle cx="94.8" cy="36.2" r=".7" fill="#fff"/>
  <polygon points="101,41 108,44 101,47" fill="#3a3a3a"/>
  <path d="M58 74 L56 80 M66 74 L67 80" stroke="#6b6b6b" stroke-width="2"/>
  <rect x="50" y="78" width="24" height="16" rx="1.5" fill="#f4e7c5" stroke="#b49a63"/>
  <path d="M50 78 L62 87 L74 78" fill="none" stroke="#b49a63"/>
  <circle cx="62" cy="87" r="3" fill="#a3201a"/>
  <g class="hw-wing hw-wing-front"><path d="M66 46 Q58 0 22 2 Q44 22 80 50 Z" fill="#fdfdf9" stroke="#cfcfc6"/></g>
</svg>`;

// A simple pulli kolam: rice-flour lines looping around a 5x5 grid of dots.
const KOLAM_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  ${[40, 70, 100, 130, 160].flatMap((x) => [40, 70, 100, 130, 160].map((y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#fff8e1"/>`)).join("")}
  <path class="kolam-line" pathLength="1" d="M100 18 C146 18 182 54 182 100 C182 146 146 182 100 182 C54 182 18 146 18 100 C18 54 54 18 100 18 Z" stroke="#fff8e1"/>
  <path class="kolam-line" pathLength="1" d="M100 52 L148 100 L100 148 L52 100 Z" stroke="#ffd54f"/>
  ${[0, 90, 180, 270].map((a) => `<path class="kolam-line" pathLength="1" transform="rotate(${a} 100 100)" d="M100 100 C76 76 76 40 100 40 C124 40 124 76 100 100" stroke="#fff8e1"/>`).join("")}
  ${[45, 135, 225, 315].map((a) => `<path class="kolam-line" pathLength="1" transform="rotate(${a} 100 100)" d="M100 100 C88 80 92 62 100 58 C108 62 112 80 100 100" stroke="#ef5350"/>`).join("")}
</svg>`;

const DIYA_SVG = `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 30 Q30 52 56 30 Q30 38 4 30 Z" fill="#b5531d" stroke="#7a3410"/><path d="M8 30 Q30 36 52 30" fill="none" stroke="#f2c230" stroke-width="1.5"/>
  <path class="diya-flame" d="M30 30 Q22 18 30 4 Q38 18 30 30 Z" fill="#ffb300"/><path d="M30 29 Q26 21 30 13 Q34 21 30 29 Z" fill="#fff3c4"/>
</svg>`;

// Tairn, a black morningstartail: bat wings, spiked tail club, golden eye.
const TAIRN_SVG = `<svg viewBox="0 0 230 130" xmlns="http://www.w3.org/2000/svg">
  <g class="tairn-wing tairn-wing-back"><path d="M100 64 L70 8 L84 30 L98 2 L108 34 L128 10 L126 60 Z" fill="#232323" stroke="#3c3c3c"/></g>
  <path d="M70 72 Q40 86 22 78 Q10 72 4 80" fill="none" stroke="#141414" stroke-width="7" stroke-linecap="round"/>
  <circle cx="6" cy="80" r="7" fill="#141414"/>${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M6 80 l${Math.cos((a * Math.PI) / 180) * 11} ${Math.sin((a * Math.PI) / 180) * 11}" stroke="#141414" stroke-width="3"/>`).join("")}
  <ellipse cx="110" cy="74" rx="46" ry="15" fill="#141414"/>
  <path d="M150 68 Q170 52 186 52 L210 56 L192 62 Q176 64 160 80 Z" fill="#141414"/>
  <path d="M190 50 L184 40 L196 50 Z" fill="#3c3c3c"/><circle cx="197" cy="55" r="2.2" fill="#f2c230"/>
  <path d="M96 86 L92 102 M126 86 L130 102" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
  <g class="tairn-wing tairn-wing-front"><path d="M106 66 L80 4 L96 28 L112 0 L120 32 L142 8 L136 64 Z" fill="#0d0d0d" stroke="#3c3c3c"/></g>
</svg>`;

const CELEBRATION_MS = { reduced: 2600, default: 5200 };

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function starWarsScene() {
  const debris = Array.from({ length: 16 }, () => {
    const angle = rand(0, Math.PI * 2);
    const dist = rand(12, 34);
    return `<span class="sw-debris" style="--dx:${Math.cos(angle) * dist}vmin;--dy:${Math.sin(angle) * dist}vmin;--s:${rand(4, 10)}px"></span>`;
  }).join("");
  return `<div class="sw-deathstar">${DEATH_STAR_SVG}</div>
    <div class="sw-flash"></div><div class="sw-ring"></div>${debris}
    <div class="sw-torpedo"></div>
    <div class="sw-xwing">${XWING_SVG}</div>`;
}

function hogwartsScene() {
  const sparkles = Array.from({ length: 34 }, () =>
    `<span class="hp-sparkle" style="left:${rand(2, 96)}vw;top:${rand(4, 92)}vh;font-size:${rand(10, 26)}px;animation-delay:${rand(0, 3).toFixed(2)}s">✦</span>`
  ).join("");
  const candles = Array.from({ length: 7 }, (_, i) =>
    `<div class="hp-candle" style="left:${8 + i * 13 + rand(-3, 3)}vw;top:${rand(6, 22)}vh;animation-delay:${rand(0, 1.5).toFixed(2)}s"><i></i></div>`
  ).join("");
  return `<div class="hp-glow"></div>${candles}${sparkles}
    <div class="hp-hedwig"><div class="hp-bob">${HEDWIG_SVG}</div></div>`;
}

function templeScene() {
  const petals = Array.from({ length: 46 }, (_, i) => {
    const marigold = i % 3 !== 0;
    return `<span class="petal ${marigold ? "marigold" : "jasmine"}" style="left:${rand(0, 100)}vw;--sway:${rand(-8, 8)}vw;animation-delay:${rand(0, 2.6).toFixed(2)}s;animation-duration:${rand(3, 4.6).toFixed(2)}s"></span>`;
  }).join("");
  const diyas = Array.from({ length: 9 }, (_, i) => `<div class="diya" style="animation-delay:${(0.3 + i * 0.22).toFixed(2)}s">${DIYA_SVG}</div>`).join("");
  return `<div class="temple-glow"></div><div class="kolam">${KOLAM_SVG}</div><div class="diyas">${diyas}</div>${petals}`;
}

function dragonScene() {
  const bolts = [[18, 0.35], [72, 1.5], [44, 2.55]].map(([x, delay]) => `<svg class="bolt" style="left:${x}vw;animation-delay:${delay}s" viewBox="0 0 60 300" preserveAspectRatio="none">
      <polyline points="34,0 22,90 38,96 16,190 32,196 8,300" fill="none" stroke="#fff6c8" stroke-width="5" stroke-linejoin="round"/>
      <polyline points="34,0 22,90 38,96 16,190 32,196 8,300" fill="none" stroke="#9fd3ff" stroke-width="12" stroke-linejoin="round" opacity=".35"/></svg>`).join("");
  return `<div class="storm-flash"></div>${bolts}<div class="tairn"><div class="tairn-fire"></div>${TAIRN_SVG}</div>`;
}

const SCENES = { sw: starWarsScene, hp: hogwartsScene, hindu: templeScene, dragon: dragonScene };

// Hedwig leaves a falling trail of sparkles as she flies.
function sparkleTrail(layer) {
  const owl = layer.querySelector(".hp-hedwig");
  const timer = setInterval(() => {
    if (!owl.isConnected) return clearInterval(timer);
    const r = owl.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "hp-trail";
    s.textContent = "✦";
    s.style.left = `${r.left + r.width * 0.25 + rand(-10, 10)}px`;
    s.style.top = `${r.top + r.height * 0.55 + rand(-10, 10)}px`;
    layer.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }, 80);
}

// Launch the torpedo from wherever the X-wing's nose is at fire time; it lands as the
// Death Star explodes (CSS: torpedo 0.6s, explosion starts at 1.9s).
function fireTorpedo(layer) {
  setTimeout(() => {
    const ship = layer.querySelector(".sw-xwing");
    const torpedo = layer.querySelector(".sw-torpedo");
    if (!ship || !torpedo) return;
    const r = ship.getBoundingClientRect();
    torpedo.style.setProperty("--tx0", `${r.right - 24}px`);
    torpedo.style.setProperty("--ty0", `${r.top + r.height * 0.3}px`);
    torpedo.classList.add("fire");
  }, 1300);
}

function celebrate(titles) {
  document.querySelector(".celebration")?.remove();
  const reduced = reducedMotion();
  const layer = document.createElement("div");
  layer.className = `celebration celebration-${currentTheme}${reduced ? " reduced" : ""}`;
  const label = titles.length === 1 ? titles[0] : `${titles.length} tasks complete`;
  const scene = reduced ? "" : (SCENES[currentTheme] || hogwartsScene)();
  layer.innerHTML = `<div class="celebration-scene" aria-hidden="true">${scene}</div>
    <div class="celebration-banner" role="status"><div class="cb-title">${esc(T("celebrateTitle"))}</div><div class="cb-task">${esc(label)}</div></div>`;
  document.body.appendChild(layer);
  if (!reduced && currentTheme === "hp") sparkleTrail(layer);
  if (!reduced && currentTheme === "sw") fireTorpedo(layer);
  setTimeout(() => layer.remove(), reduced ? CELEBRATION_MS.reduced : CELEBRATION_MS.default);
}

// Compares against the Done tasks this browser saw last time (per signed-in user). The very
// first visit just records them, so existing completed tasks don't all celebrate at once.
function celebrateNewlyDone(list) {
  const done = list.filter((t) => t.status === "Done");
  const key = `seenDone:${currentUserId}`;
  const stored = localStorage.getItem(key);
  localStorage.setItem(key, JSON.stringify(done.map((t) => t.id)));
  if (stored === null) return;
  const seen = new Set(JSON.parse(stored));
  const fresh = done.filter((t) => !seen.has(t.id));
  if (fresh.length) celebrate(fresh.map((t) => t.title));
}

// Preview without completing anything: add ?celebrate to the URL.
if (new URLSearchParams(location.search).has("celebrate")) {
  setTimeout(() => celebrate(["Preview celebration"]), 600);
}
