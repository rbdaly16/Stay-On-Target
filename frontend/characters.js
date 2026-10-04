// Harry Potter Labubus drawn as inline SVG. Each task's `helper.character` in data.js
// references a key here. Every character shares the Labubu base (bunny ears, round
// furry head, toothy grin); `back`, `body`, `front`, and `eyes` layer on their look.

const FACE = "#f7e1cc";
const eye = (x) => `<ellipse cx="${x}" cy="66" rx="4.3" ry="5.3" fill="#24150f"/><circle cx="${x + 1.5}" cy="64" r="1.5" fill="#fff"/>`;
const EYES = eye(42) + eye(58);

const ROUND_GLASSES = `<g fill="none" stroke="#1d1d1d" stroke-width="1.8"><circle cx="42" cy="66" r="7"/><circle cx="58" cy="66" r="7"/></g>`;
const SQUARE_GLASSES = `<g fill="none" stroke="#1d1d1d" stroke-width="1.6"><rect x="35" y="60" width="14" height="11" rx="2.5"/><rect x="51" y="60" width="14" height="11" rx="2.5"/></g>`;
const FRECKLES = [[35, 71], [38, 74], [33, 75], [65, 71], [62, 74], [67, 75]]
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#a0522d"/>`).join("");
const SHIRT_TIE = (tie, stripe) => `<path d="M41 100 L50 113 L59 100 Z" fill="#fff"/>
  <path d="M48.5 101 L51.5 101 L53.5 119 L50 123 L46.5 119 Z" fill="${tie}"/>
  <path d="M47.6 107 L52.4 106 L52.8 109 L47.3 110 Z" fill="${stripe}"/>`;
const GRYFFINDOR_SCARF = `<path d="M29 95 Q50 105 71 95 L71 101 Q50 111 29 101 Z" fill="#740001"/>
  <rect x="38" y="99" width="4" height="7" fill="#d3a625" transform="rotate(12 40 102)"/>
  <rect x="58" y="99" width="4" height="7" fill="#d3a625" transform="rotate(-12 60 102)"/>
  <rect x="55" y="102" width="8" height="20" rx="1" fill="#740001"/>
  <rect x="55" y="110" width="8" height="3" fill="#d3a625"/>`;
const LETTER = (ch, color) => `<text x="50" y="122" text-anchor="middle" font-size="13" font-family="Georgia, serif" font-weight="bold" fill="${color}">${ch}</text>`;
const fringe = (color) => `<path d="M30 59 L33 50 L38 56 L42 48 L46 55 L50 47 L54 55 L58 48 L62 56 L67 50 L70 59 Q50 44 30 59 Z" fill="${color}"/>`;

const CHARACTERS = {
  harry: {
    name: "Harry Potter",
    fur: "#2b2421",
    robe: "#1c1c1c",
    body: GRYFFINDOR_SCARF,
    front: fringe("#2b2421") + `<path d="M51 52 L48 55.5 L52 56.5 L49 60" fill="none" stroke="#c0392b" stroke-width="1.3"/>` + ROUND_GLASSES,
  },
  hermione: {
    name: "Hermione Granger",
    fur: "#6e4728",
    robe: "#1c1c1c",
    back: [[22, 62, 14], [78, 62, 14], [25, 83, 12], [75, 83, 12], [29, 44, 12], [71, 44, 12]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#5c3a1f"/>`).join(""),
    body: SHIRT_TIE("#740001", "#d3a625") +
      `<rect x="57" y="104" width="20" height="15" rx="1.5" fill="#7b1e1e"/><rect x="59" y="106" width="16" height="2" fill="#d3a625"/><rect x="57" y="117" width="20" height="2" fill="#efe3c2"/>`,
    front: `<path d="M30 60 Q36 50 44 55 Q50 48 56 55 Q64 50 70 60 Q50 45 30 60 Z" fill="#5c3a1f"/>`,
  },
  ron: {
    name: "Ron Weasley",
    fur: "#d2691e",
    robe: "#7a1f2b",
    body: LETTER("R", "#d3a625"),
    front: fringe("#b85417") + FRECKLES,
  },
  fred: {
    name: "Fred Weasley",
    fur: "#d2691e",
    robe: "#2e5e3a",
    body: LETTER("F", "#d3a625") +
      `<g transform="rotate(-25 79 108)"><rect x="76" y="100" width="6" height="16" rx="1" fill="#c0392b"/><path d="M76 100 L79 93 L82 100 Z" fill="#d3a625"/></g>
       <path d="M88 88 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5 z" fill="#d3a625"/>`,
    front: fringe("#b85417") + FRECKLES,
  },
  arthur: {
    name: "Arthur Weasley",
    fur: "#c4622d",
    robe: "#6b4f2a",
    body: `<rect x="62" y="104" width="12" height="9" rx="2" fill="#d9c27a"/><rect x="64" y="98" width="2" height="6" fill="#999"/><rect x="70" y="98" width="2" height="6" fill="#999"/>
       <path d="M68 113 q0 8 -8 12" stroke="#333" stroke-width="1.5" fill="none"/>`,
    front: `<ellipse cx="50" cy="39" rx="12" ry="6" fill="${FACE}"/>` + SQUARE_GLASSES + FRECKLES,
  },
  dumbledore: {
    name: "Albus Dumbledore",
    fur: "#e6e6e6",
    robe: "#4b2a6b",
    front: `<path d="M33 79 Q50 96 67 79 Q68 112 50 129 Q32 112 33 79 Z" fill="#f7f7f7" stroke="#cfcfcf" stroke-width=".6"/>
       <g fill="none" stroke="#8a6d1f" stroke-width="1.6"><path d="M35.5 66 a6.5 6.5 0 0 0 13 0 Z"/><path d="M51.5 66 a6.5 6.5 0 0 0 13 0 Z"/></g>
       <path d="M35 41 L50 2 L65 41 Z" fill="#4b2a6b"/><ellipse cx="50" cy="41" rx="20" ry="4" fill="#3a1f55"/>
       <path d="M47 22 l1.2 2.4 2.6.4 -1.9 1.8.5 2.6 -2.4-1.3 -2.4 1.3.5-2.6 -1.9-1.8 2.6-.4z" fill="#d3a625"/>`,
  },
  mcgonagall: {
    name: "Minerva McGonagall",
    fur: "#7d7d7d",
    robe: "#1a472a",
    front: SQUARE_GLASSES +
      `<path d="M37 39 Q45 22 53 2 Q56 16 63 39 Z" fill="#1a472a"/><rect x="38" y="33" width="24" height="4" fill="#740001"/><ellipse cx="50" cy="39" rx="26" ry="5" fill="#123620"/>`,
  },
  snape: {
    name: "Severus Snape",
    fur: "#141414",
    robe: "#0c0c0c",
    back: `<path d="M19 60 Q19 38 50 33 Q81 38 81 60 L81 104 L67 104 L67 72 L33 72 L33 104 L19 104 Z" fill="#0f0f0f"/>`,
    body: `<path d="M63 100 h7 v4 l4 8 a7 7 0 0 1 -15 0 l4 -8 z" fill="#3fa34d" stroke="#ddd" stroke-width=".8"/>`,
    front: `<path d="M50 35 L50 52" stroke="#3a3a3a" stroke-width="1.2"/><path d="M37 58 L46 60 M54 60 L63 58" stroke="#141414" stroke-width="2" stroke-linecap="round"/>`,
  },
  luna: {
    name: "Luna Lovegood",
    fur: "#efe0a0",
    robe: "#1f3b6b",
    back: `<path d="M19 60 Q19 38 50 33 Q81 38 81 60 L83 108 L67 108 L67 72 L33 72 L33 108 L17 108 Z" fill="#e3cd7d"/>`,
    front: `<rect x="34" y="59" width="15" height="13" rx="5" fill="#f39ac4" opacity=".75" stroke="#b5527c" stroke-width="1.2"/>
       <rect x="51" y="59" width="15" height="13" rx="5" fill="#7ec8e3" opacity=".75" stroke="#3b84a3" stroke-width="1.2"/>
       <circle cx="20" cy="80" r="3.5" fill="#c2185b"/><path d="M20 76.5 q-2 -4 0 -6 q2 2 0 6" fill="#3c8d3c"/>
       <circle cx="80" cy="80" r="3.5" fill="#c2185b"/><path d="M80 76.5 q-2 -4 0 -6 q2 2 0 6" fill="#3c8d3c"/>`,
  },
  neville: {
    name: "Neville Longbottom",
    fur: "#7a5230",
    robe: "#1c1c1c",
    body: GRYFFINDOR_SCARF.replace(`<rect x="55" y="102" width="8" height="20" rx="1" fill="#740001"/>
  <rect x="55" y="110" width="8" height="3" fill="#d3a625"/>`, "") +
      `<path d="M60 108 h16 l-2 14 h-12 z" fill="#a0522d"/><path d="M68 108 q-8 -10 -4 -16 q4 6 4 16 q2 -12 8 -14 q0 10 -8 14 z" fill="#3c8d3c"/>`,
  },
  moody: {
    name: "Mad-Eye Moody",
    fur: "#8c8c8c",
    robe: "#3b3b3b",
    eyes: eye(42) +
      `<path d="M51 63 L29 54 M65 63 L79 57" stroke="#5a4630" stroke-width="2.2"/>
       <circle cx="58" cy="66" r="7.5" fill="#fff" stroke="#555" stroke-width="1.6"/><circle cx="58" cy="66" r="4.2" fill="#2e86de"/><circle cx="58" cy="66" r="1.9" fill="#111"/>`,
    front: `<path d="M33 60 L37 72" stroke="#a0522d" stroke-width="1.2"/><path d="M28 56 L31 46 L36 52 L40 43 L45 51 L50 42 L55 51 L60 43 L64 52 L69 46 L72 56 Q50 40 28 56 Z" fill="#6f6f6f"/>`,
  },
  griphook: {
    name: "Griphook",
    fur: "#9aa77c",
    robe: "#2b2b2b",
    body: `<path d="M41 100 L50 112 L59 100 Z" fill="#fff"/><path d="M45 102 L50 105 L55 102 L55 108 L50 105 L45 108 Z" fill="#111"/>
       <circle cx="70" cy="113" r="7.5" fill="#d3a625" stroke="#a67c00" stroke-width="1.2"/>
       <text x="70" y="117" text-anchor="middle" font-size="9" font-family="Georgia, serif" font-weight="bold" fill="#8a6500">G</text>`,
    front: `<path d="M36 58 L46 61 M54 61 L64 58" stroke="#4d5a36" stroke-width="2" stroke-linecap="round"/>`,
  },
};

function labubuSVG(c) {
  const fur = c.fur;
  return `<svg viewBox="0 0 100 130" class="labubu" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${c.back || ""}
    <ellipse cx="50" cy="114" rx="23" ry="15" fill="${c.robe}"/>
    ${c.body || ""}
    <ellipse cx="35" cy="26" rx="8.5" ry="21" fill="${fur}" transform="rotate(-14 35 26)"/>
    <ellipse cx="35" cy="28" rx="4" ry="13" fill="#f2b8c0" transform="rotate(-14 35 28)"/>
    <ellipse cx="65" cy="26" rx="8.5" ry="21" fill="${fur}" transform="rotate(14 65 26)"/>
    <ellipse cx="65" cy="28" rx="4" ry="13" fill="#f2b8c0" transform="rotate(14 65 28)"/>
    <circle cx="50" cy="64" r="30" fill="${fur}"/>
    <ellipse cx="50" cy="70" rx="21" ry="17" fill="${FACE}"/>
    <circle cx="35" cy="76" r="3.2" fill="#f4a7a7" opacity=".7"/>
    <circle cx="65" cy="76" r="3.2" fill="#f4a7a7" opacity=".7"/>
    ${c.eyes ?? EYES}
    <path d="M38 75 Q50 87 62 75 Z" fill="#5a1414"/>
    <path d="M38.5 75.3 L40.8 78.6 L43 75.8 L45.3 79.6 L47.6 76 L50 80 L52.4 76 L54.7 79.6 L57 75.8 L59.2 78.6 L61.5 75.3 Z" fill="#fff"/>
    ${c.front || ""}
  </svg>`;
}
