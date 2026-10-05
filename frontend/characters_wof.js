// Wings of Fire theme: cute chibi dragons (not Labubus), drawn by dragonSVG(). Each tribe gets
// its signature features: SeaWing glow stripes and fins, RainWing ruff and color patches,
// NightWing silver scales, SandWing tail barb, IceWing spikes, SkyWing flame glow,
// SilkWing butterfly wings and antennae, HiveWing stripes, LeafWing leaf wings.
// Each task's `helpers.wof.character` references a key here.

const glowDots = (color) => [[34, 50], [38, 46], [62, 46], [66, 50], [44, 92], [56, 92], [50, 112]]
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${color}"/>`).join("");
const ruff = (colors) => colors.map((c, i) => {
  const a = -150 + i * (120 / (colors.length - 1));
  const r = (a * Math.PI) / 180;
  return `<ellipse cx="${50 + Math.cos(r) * 27}" cy="${60 + Math.sin(r) * 24}" rx="6" ry="9" fill="${c}" transform="rotate(${a + 90} ${50 + Math.cos(r) * 27} ${60 + Math.sin(r) * 24})"/>`;
}).join("");
const spikes = (color) => [[38, 34], [46, 30], [54, 30], [62, 34]].map(([x, y]) => `<path d="M${x - 3} ${y + 5} L${x} ${y - 6} L${x + 3} ${y + 5} Z" fill="${color}"/>`).join("");
const butterflyWings = (a, b) => `<path d="M38 86 Q8 60 12 38 Q30 40 42 76 Z M62 86 Q92 60 88 38 Q70 40 58 76 Z" fill="${a}" stroke="${b}" stroke-width="1.2"/>
  <path d="M38 92 Q14 104 20 118 Q34 112 42 96 Z M62 92 Q86 104 80 118 Q66 112 58 96 Z" fill="${b}" opacity=".85"/>
  <circle cx="22" cy="52" r="4" fill="#fff" opacity=".6"/><circle cx="78" cy="52" r="4" fill="#fff" opacity=".6"/>`;
const antennae = (color) => `<path d="M42 38 Q36 22 30 18 M58 38 Q64 22 70 18" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="30" cy="18" r="2.5" fill="${color}"/><circle cx="70" cy="18" r="2.5" fill="${color}"/>`;

const WOF_CHARACTERS = {
  clay: { name: "Clay (MudWing)", body: "#8a6440", belly: "#d1b087", wing: "#6f4f31", horn: "#efe1c4", eye: "#b07a30" },
  tsunami: {
    name: "Tsunami (SeaWing)", body: "#2f7fc1", belly: "#9ad8f2", wing: "#22649c", horn: "#d9eefa", eye: "#2fb8a7",
    front: glowDots("#c6fbff") + `<path d="M42 36 Q50 22 58 36 Q50 32 42 36 Z" fill="#7cc4ec"/>`,
  },
  glory: {
    name: "Glory (RainWing)", body: "#7b5bd6", belly: "#f6c9e6", wing: "#5aa6e0", horn: "#ffe7a3", eye: "#3a9a4a",
    back: ruff(["#ff7ab0", "#ffb347", "#ffe066", "#6fdc8c", "#5ac8fa", "#b388ff"]),
    front: `<circle cx="38" cy="98" r="4" fill="#ffb347" opacity=".8"/><circle cx="62" cy="106" r="4" fill="#5ac8fa" opacity=".8"/><circle cx="58" cy="90" r="3" fill="#ff7ab0" opacity=".8"/>`,
  },
  starflight: {
    name: "Starflight (NightWing)", body: "#1f2647", belly: "#3d4877", wing: "#151a33", horn: "#cfd6f2", eye: "#cfd6f2",
    back: [[18, 66], [24, 58], [14, 72], [82, 66], [76, 58], [86, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#e8ecff"/>`).join(""),
    eyes: `<path d="M34 59 Q40 54 46 59 M54 59 Q60 54 66 59" fill="none" stroke="#e8ecff" stroke-width="2.4" stroke-linecap="round"/>`,
    front: `<rect x="62" y="96" width="16" height="12" rx="2" fill="#f3e3b8" stroke="#b9975a"/><path d="M62 99 h16 M62 105 h16" stroke="#b9975a" stroke-width=".8"/>`,
  },
  sunny: {
    name: "Sunny (SandWing/NightWing)", body: "#e8c25a", belly: "#f8e7ad", wing: "#d6a83a", horn: "#fff6d2", eye: "#3fa34d", tailTip: "none",
    front: `<circle cx="70" cy="34" r="5" fill="#ffd54f" opacity=".7"/>`,
  },
  moonwatcher: {
    name: "Moonwatcher (NightWing)", body: "#1b2038", belly: "#36406a", wing: "#141831", horn: "#d6dcf5", eye: "#7fd0ea",
    front: `<path d="M31 64 q1 4 0 6 q-1 -2 0 -6 Z M69 64 q1 4 0 6 q-1 -2 0 -6 Z" fill="#e8ecff"/><path d="M73 30 a7 7 0 1 0 6 10 a5 5 0 1 1 -6 -10 Z" fill="#e8ecff"/>`,
  },
  winter: {
    name: "Winter (IceWing)", body: "#d4ecf8", belly: "#f6fbff", wing: "#a9d3ec", horn: "#ffffff", eye: "#3f86d6",
    front: spikes("#ffffff") + `<path d="M78 92 l0 8 m-4 -4 l8 0 m-6 -3 l4 6 m0 -6 l-4 6" stroke="#7fbfe6" stroke-width="1.2"/>`,
  },
  peril: {
    name: "Peril (SkyWing)", body: "#e0562a", belly: "#f8a65a", wing: "#bf3d1a", horn: "#ffd27a", eye: "#f5d142",
    back: `<ellipse cx="50" cy="84" rx="40" ry="46" fill="#ffb74d" opacity=".25"/><ellipse cx="50" cy="84" rx="33" ry="40" fill="#ff8a3d" opacity=".2"/>`,
    front: [[24, 96], [76, 92], [50, 30]].map(([x, y]) => `<path d="M${x} ${y} q-4 -6 0 -12 q4 6 0 12 Z" fill="#ffcc4d"/>`).join(""),
  },
  qibli: {
    name: "Qibli (SandWing)", body: "#e1c189", belly: "#f6e5c0", wing: "#cda563", horn: "#fff8e6", eye: "#4a3220", tailTip: "#2b2b2b",
  },
  turtle: {
    name: "Turtle (SeaWing)", body: "#5f8f7a", belly: "#b2d6c2", wing: "#4a7563", horn: "#dcefe4", eye: "#2d5a46",
    front: glowDots("#d8fff0") + `<path d="M76 98 l2 5 5 1 -5 2 -2 5 -2 -5 -5 -2 5 -1 Z" fill="#fff6a8"/>`,
  },
  cricket: {
    name: "Cricket (HiveWing)", body: "#e8ad2c", belly: "#f7de92", wing: "#d9eef7", horn: "#3a2a12", eye: "#3a2a12",
    back: `<path d="M38 84 Q14 74 12 58 Q28 64 40 78 Z M62 84 Q86 74 88 58 Q72 64 60 78 Z" fill="#e3f4fb" stroke="#9cc7d8" opacity=".9"/>`,
    front: `<path d="M38 96 h24 M36 104 h28 M38 112 h24" stroke="#3a2a12" stroke-width="2.2"/>
      <circle cx="40" cy="58" r="9" fill="none" stroke="#3a2a12" stroke-width="2"/><circle cx="60" cy="58" r="9" fill="none" stroke="#3a2a12" stroke-width="2"/><path d="M49 58 h2" stroke="#3a2a12" stroke-width="2"/>`,
  },
  blue: {
    name: "Blue (SilkWing)", body: "#4f7fd6", belly: "#c3d6fa", wing: "#8e7cf0", horn: "#e6ecff", eye: "#3b4fa8", noWings: true,
    back: butterflyWings("#9d8bf5", "#5f9cf0"),
    front: antennae("#3b4fa8"),
  },
  sundew: {
    name: "Sundew (LeafWing)", body: "#4a8f3a", belly: "#b5d896", wing: "#3b7a2c", horn: "#d8ecc4", eye: "#c45a2a", noWings: true,
    back: `<path d="M38 86 Q10 78 10 52 Q32 58 42 80 Z M62 86 Q90 78 90 52 Q68 58 58 80 Z" fill="#3b7a2c"/>
      <path d="M38 84 Q22 72 14 56 M62 84 Q78 72 86 56" stroke="#9ccf7a" stroke-width="1.2" fill="none"/>`,
    front: `<circle cx="72" cy="30" r="3" fill="#e74c3c"/><path d="M72 33 q-2 6 -6 8" stroke="#3b7a2c" stroke-width="1.5" fill="none"/>`,
  },
};

// A cute chibi dragon: big head and shiny eyes, little horns, stubby wings, round belly,
// curled tail (SandWings get a dark barb; `tailTip: "none"` leaves Sunny barbless).
function dragonSVG(c) {
  const wings = c.noWings ? "" : `<path d="M36 84 Q14 72 10 52 Q22 60 28 56 Q26 68 40 78 Z M64 84 Q86 72 90 52 Q78 60 72 56 Q74 68 60 78 Z" fill="${c.wing}" stroke="${c.body}" stroke-width="1"/>`;
  const tip = c.tailTip === "none" ? "" : `<path d="M88 86 l6 -8 l-1 9 Z" fill="${c.tailTip || c.body}"/>`;
  const eyes = c.eyes ?? [40, 60].map((x) => `<ellipse cx="${x}" cy="58" rx="7" ry="8" fill="#1d1d1d"/><ellipse cx="${x}" cy="59" rx="5" ry="6" fill="${c.eye}"/>
      <circle cx="${x}" cy="59" r="3" fill="#1d1d1d"/><circle cx="${x + 2.2}" cy="55.5" r="2.2" fill="#fff"/><circle cx="${x - 2}" cy="61" r="1" fill="#fff"/>`).join("");
  return `<svg viewBox="0 0 100 130" class="labubu wof-dragon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${c.back || ""}
    <path d="M66 108 Q92 112 90 92 Q89 84 84 86" fill="none" stroke="${c.body}" stroke-width="7" stroke-linecap="round"/>${tip}
    ${wings}
    <ellipse cx="50" cy="102" rx="21" ry="22" fill="${c.body}"/>
    <ellipse cx="50" cy="106" rx="12" ry="15" fill="${c.belly}"/>
    <path d="M41 100 h18 M40 107 h20 M42 114 h16" stroke="${c.body}" stroke-width=".9" opacity=".35"/>
    <ellipse cx="40" cy="123" rx="7" ry="4" fill="${c.body}"/><ellipse cx="60" cy="123" rx="7" ry="4" fill="${c.body}"/>
    <path d="M35 42 Q28 26 34 20 Q37 32 42 38 Z M65 42 Q72 26 66 20 Q63 32 58 38 Z" fill="${c.horn}"/>
    <ellipse cx="50" cy="60" rx="28" ry="25" fill="${c.body}"/>
    <ellipse cx="50" cy="73" rx="14" ry="9" fill="${c.belly}"/>
    <circle cx="46" cy="71" r="1.2" fill="#3a2a2a"/><circle cx="54" cy="71" r="1.2" fill="#3a2a2a"/>
    <path d="M45 76 Q50 80 55 76" fill="none" stroke="#3a2a2a" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="31" cy="68" r="4" fill="#ff8fab" opacity=".45"/><circle cx="69" cy="68" r="4" fill="#ff8fab" opacity=".45"/>
    ${eyes}
    ${c.front || ""}
  </svg>`;
}
