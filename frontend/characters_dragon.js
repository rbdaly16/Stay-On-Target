// Empyrean (Fourth Wing / Iron Flame / Onyx Storm) Labubus, drawn with labubuSVG() and the
// shared pieces from characters.js. Riders wear black flight leathers; dragons get horns,
// wings, and golden eyes. Each task's `helpers.dragon.character` references a key here.

const LEATHERS = `<path d="M34 102 L50 118 L66 102" fill="none" stroke="#3a3a3a" stroke-width="2"/>
  <rect x="30" y="111" width="40" height="3" fill="#3a3a3a"/><rect x="47" y="110" width="6" height="5" rx="1" fill="#9a9a9a"/>`;
const DAGGER = (x) => `<rect x="${x}" y="108" width="3" height="14" rx="1" fill="#cfd8dc"/><rect x="${x - 1.5}" y="106" width="6" height="2.5" fill="#6d4c41"/>`;
const goldEye = (x) => `<ellipse cx="${x}" cy="66" rx="4.6" ry="5.4" fill="#f2c230"/><ellipse cx="${x}" cy="66" rx="1.3" ry="4.4" fill="#111"/><circle cx="${x + 1.6}" cy="63.6" r="1.1" fill="#fff"/>`;
const DRAGON_EYES = goldEye(42) + goldEye(58);
const horns = (color) => `<path d="M33 42 Q26 30 30 20 Q34 32 40 38 Z M67 42 Q74 30 70 20 Q66 32 60 38 Z" fill="${color}"/>`;
const wings = (color, edge) => `<path d="M30 104 Q8 90 4 70 Q16 78 22 74 Q20 88 32 98 Z" fill="${color}" stroke="${edge}" stroke-width="1"/>
  <path d="M70 104 Q92 90 96 70 Q84 78 78 74 Q80 88 68 98 Z" fill="${color}" stroke="${edge}" stroke-width="1"/>`;
const scales = (color) => [[42, 104], [50, 108], [58, 104], [46, 116], [54, 116]]
  .map(([x, y]) => `<path d="M${x - 4} ${y} Q${x} ${y + 5} ${x + 4} ${y}" fill="none" stroke="${color}" stroke-width="1.2"/>`).join("");

const DRAGON_CHARACTERS = {
  violet: {
    name: "Violet Sorrengail",
    fur: "#5a4030",
    robe: "#1d1d1d",
    back: `<path d="M74 70 Q82 86 78 104" fill="none" stroke="#5a4030" stroke-width="7" stroke-linecap="round"/>
       <path d="M78 98 Q80 104 77 110" fill="none" stroke="#dfe6ea" stroke-width="7" stroke-linecap="round"/>`,
    body: LEATHERS + DAGGER(36) + DAGGER(62) + `<path d="M84 76 L78 88 L83 88 L77 100" fill="none" stroke="#ffe066" stroke-width="2" stroke-linejoin="round"/>`,
    front: `<path d="M30 59 Q38 49 48 53 Q56 47 70 59 Q50 44 30 59 Z" fill="#4a3426"/><path d="M60 52 Q66 54 69 58" fill="none" stroke="#dfe6ea" stroke-width="2"/>`,
  },
  xaden: {
    name: "Xaden Riorson",
    fur: "#1f1b18",
    robe: "#151515",
    back: `${[[18, 96], [82, 92], [14, 112], [86, 112]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#2a1f3d" opacity=".75"/>`).join("")}`,
    body: LEATHERS + `<path d="M58 99 q4 4 0 8 q-4 4 0 8 M62 99 q4 4 0 8" fill="none" stroke="#6b6b6b" stroke-width="1.4"/>`,
    front: fringe("#1f1b18") + `<path d="M64 76 q3 3 0 6" fill="none" stroke="#3a3a3a" stroke-width="1.2"/>`,
  },
  tairn: {
    name: "Tairn",
    fur: "#1a1a1a",
    face: "#2e2e2e",
    earInner: "#3a3a3a",
    robe: "#1a1a1a",
    eyes: DRAGON_EYES,
    back: wings("#141414", "#444"),
    body: scales("#3d3d3d"),
    front: horns("#555"),
  },
  sgaeyl: {
    name: "Sgaeyl",
    fur: "#1f2f5a",
    face: "#2c3f73",
    earInner: "#3a4f8a",
    robe: "#1f2f5a",
    eyes: DRAGON_EYES,
    back: wings("#18264a", "#4a63a8"),
    body: scales("#3a4f8a") + `<path d="M74 118 l8 -4 l-2 6 l6 0 l-6 4" fill="#9fb3e0"/>`,
    front: horns("#9fb3e0"),
  },
  andarna: {
    name: "Andarna",
    fur: "#d9a91f",
    face: "#f0cf6a",
    earInner: "#b8860b",
    robe: "#d9a91f",
    eyes: DRAGON_EYES,
    back: `<path d="M26 104 Q12 94 10 78 Q18 84 24 82 Q20 94 30 100 Z M74 104 Q88 94 90 78 Q82 84 76 82 Q80 94 70 100 Z" fill="#e8c14a" stroke="#b8860b"/>`,
    body: scales("#b8860b"),
    front: `<path d="M40 40 q4 -10 10 -14 q-2 8 2 12 q4 -8 10 -8 q-4 6 -2 12" fill="#f5d77a" stroke="#b8860b" stroke-width=".8"/>`,
  },
  rhiannon: {
    name: "Rhiannon Matthias",
    fur: "#2b1d14",
    robe: "#1d1d1d",
    back: [[20, 60], [80, 60], [22, 78], [78, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#22170f"/>`).join(""),
    body: LEATHERS + DAGGER(64),
    front: `<path d="M30 58 q4 -8 8 -4 q4 -8 8 -3 q4 -8 8 -2 q4 -8 8 -2 q4 -6 8 4 Q50 44 30 58 Z" fill="#22170f"/>`,
  },
  ridoc: {
    name: "Ridoc Gamlyn",
    fur: "#7a5a3a",
    robe: "#1d1d1d",
    body: LEATHERS + [[80, 90], [86, 104], [16, 98]].map(([x, y]) => `<path d="M${x} ${y - 6} L${x} ${y + 6} M${x - 5} ${y - 3} L${x + 5} ${y + 3} M${x - 5} ${y + 3} L${x + 5} ${y - 3}" stroke="#b3e5fc" stroke-width="1.6" stroke-linecap="round"/>`).join(""),
    front: fringe("#6b4a2e") + `<path d="M56 60 L64 58" stroke="#4a3426" stroke-width="2" stroke-linecap="round"/>`,
  },
  dain: {
    name: "Dain Aetos",
    fur: "#6b4a2e",
    robe: "#1d1d1d",
    body: LEATHERS + `<rect x="60" y="104" width="16" height="20" rx="1.5" fill="#5d4037" stroke="#3e2723"/><rect x="62" y="106" width="12" height="2" fill="#d4a017"/>`,
    front: fringe("#5a3d24"),
  },
  imogen: {
    name: "Imogen Cardulo",
    fur: "#d46a9a",
    robe: "#1d1d1d",
    body: LEATHERS + DAGGER(36),
    front: `<path d="M50 34 Q70 38 70 58 Q60 46 50 48 Z" fill="#b84f80"/><path d="M30 60 Q32 48 42 46" fill="none" stroke="#8a6a5a" stroke-width="1" stroke-dasharray="1.5 1.5"/>`,
  },
  brennan: {
    name: "Brennan Sorrengail",
    fur: "#5a4030",
    robe: "#1d1d1d",
    body: LEATHERS + `<circle cx="76" cy="108" r="9" fill="#81c784" opacity=".35"/><circle cx="76" cy="108" r="5" fill="#a5d6a7" opacity=".6"/><path d="M76 103 V113 M71 108 H81" stroke="#e8f5e9" stroke-width="2"/>`,
    front: fringe("#4a3426"),
  },
  jesinia: {
    name: "Jesinia Neema",
    fur: "#3b2a20",
    robe: "#efe3c8",
    back: `<path d="M22 64 Q20 96 30 108 L36 100 Q30 84 32 64 Z M78 64 Q80 96 70 108 L64 100 Q70 84 68 64 Z" fill="#2e2018"/>`,
    body: `<path d="M41 100 L50 110 L59 100" fill="none" stroke="#c9b48a" stroke-width="1.5"/><path d="M62 104 L76 98 L77 118 L63 124 Z" fill="#8d6e63" stroke="#5d4037"/><path d="M72 92 L66 112" stroke="#5d4037" stroke-width="1.2"/>`,
    front: `<path d="M30 60 Q38 48 50 50 Q62 48 70 60 Q50 44 30 60 Z" fill="#2e2018"/>`,
  },
  mira: {
    name: "Mira Sorrengail",
    fur: "#5a4030",
    robe: "#1d1d1d",
    body: LEATHERS + `<path d="M30 100 L38 98 L38 108 L30 110 Z M70 100 L62 98 L62 108 L70 110 Z" fill="#78909c" stroke="#455a64"/>` + DAGGER(48),
    front: fringe("#4a3426") + `<path d="M60 62 L66 70" stroke="#a1887f" stroke-width="1.2"/>`,
  },
};
