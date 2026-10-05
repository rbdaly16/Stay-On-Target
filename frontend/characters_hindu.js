// Hindu theme (South Indian temple style). Deities are shown reverently as Tanjore-style
// medallions: a gold arched frame (like a temple prabhavali) around each deity's sacred
// symbols, rather than as cartoon figures. Each task's `helpers.hindu.character` in the
// data references a key here. `bg` is the panel color; `symbol` is SVG drawn in a
// 100x130 box (the open panel spans roughly x 22-78, y 18-116).

const HINDU_CHARACTERS = {
  ganesha: {
    name: "Ganesha (Vinayaka · Pillaiyar)",
    bg: "#8b1e1e",
    symbol: `<path d="M50 40 Q63 58 61 74 Q50 83 39 74 Q37 58 50 40 Z" fill="#f6e6b8" stroke="#b98a2e" stroke-width="1.2"/>
      <path d="M50 42 L50 78 M44 52 Q46 66 45 77 M56 52 Q54 66 55 77" fill="none" stroke="#c9a14a" stroke-width="1"/>
      <path d="M67 46 Q76 60 69 80" fill="none" stroke="#fff8e6" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="46" cy="101" rx="9" ry="5" fill="#9a8f86"/><circle cx="54" cy="98" r="3.4" fill="#9a8f86"/><circle cx="55.5" cy="95.5" r="1.6" fill="#c9b8ad"/>
      <circle cx="56" cy="98" r=".8" fill="#222"/><path d="M37 101 Q30 100 30 94" fill="none" stroke="#9a8f86" stroke-width="1.2"/>`,
  },
  saraswati: {
    name: "Saraswati",
    bg: "#1e5a32",
    symbol: `<line x1="40" y1="88" x2="68" y2="34" stroke="#7a4a1c" stroke-width="5" stroke-linecap="round"/>
      <circle cx="37" cy="92" r="14" fill="#b5651d" stroke="#f0c75e" stroke-width="1.5"/><circle cx="37" cy="92" r="6" fill="#7a4a1c"/>
      <circle cx="69" cy="32" r="7" fill="#b5651d" stroke="#f0c75e" stroke-width="1.2"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${45 + i * 3.6}" y1="${78 - i * 7}" x2="${49 + i * 3.6}" y2="${80 - i * 7}" stroke="#f0c75e" stroke-width="1"/>`).join("")}
      <line x1="43" y1="90" x2="70" y2="38" stroke="#fff3c4" stroke-width=".6"/>
      <ellipse cx="62" cy="106" rx="10" ry="5" fill="#fffaf0" stroke="#e8dcc0" stroke-width=".8"/>
      <path d="M68 104 Q74 98 70 92 Q68 89 71 87" fill="none" stroke="#fffaf0" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M71 87 L75 88 L71 89 Z" fill="#f57c00"/><path d="M54 104 Q58 101 64 104" fill="none" stroke="#e8dcc0" stroke-width=".8"/>`,
  },
  lakshmi: {
    name: "Lakshmi",
    bg: "#8b1e1e",
    symbol: `${[-60, -30, 0, 30, 60].map((a) => `<ellipse cx="50" cy="56" rx="7" ry="17" fill="#f48fb1" stroke="#c2185b" stroke-width=".8" transform="rotate(${a} 50 70)"/>`).join("")}
      <circle cx="50" cy="66" r="5" fill="#ffd54f"/>
      <path d="M30 74 Q50 84 70 74" fill="none" stroke="#2e7d32" stroke-width="2"/>
      ${[[38, 90], [50, 96], [62, 90], [44, 104], [56, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f2c230" stroke="#a67c00" stroke-width="1"/>`).join("")}`,
  },
  murugan: {
    name: "Murugan (Kartikeya · Subramanya)",
    bg: "#1e5a32",
    symbol: `<line x1="46" y1="112" x2="46" y2="46" stroke="#d4a017" stroke-width="3.5"/>
      <path d="M46 20 Q57 34 46 50 Q35 34 46 20 Z" fill="#f2c230" stroke="#a67c00" stroke-width="1.2"/><circle cx="46" cy="38" r="3" fill="#c62828"/>
      <path d="M62 112 Q60 80 66 52" fill="none" stroke="#5d8a3a" stroke-width="1.5"/>
      <ellipse cx="66" cy="50" rx="8" ry="11" fill="#2e7d32"/><ellipse cx="66" cy="51" rx="5" ry="7" fill="#00897b"/>
      <ellipse cx="66" cy="52" rx="3" ry="4" fill="#1565c0"/><circle cx="66" cy="52" r="1.6" fill="#0d1b4a"/>`,
  },
  nataraja: {
    name: "Shiva as Nataraja",
    bg: "#3b1f0f",
    symbol: `<circle cx="50" cy="68" r="27" fill="none" stroke="#e8a33d" stroke-width="3"/>
      ${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const x = 50 + Math.cos(a) * 30; const y = 68 + Math.sin(a) * 30; return `<path d="M${x - 2.5} ${y} Q${x} ${y - 6} ${x + 2.5} ${y} Z" fill="#ff7043" transform="rotate(${(a * 180) / Math.PI + 90} ${x} ${y})"/>`; }).join("")}
      <path d="M42 56 L58 56 L52 68 L58 80 L42 80 L48 68 Z" fill="#c9a14a" stroke="#7a5a1c" stroke-width="1.2"/>
      <path d="M48 68 L52 68" stroke="#7a5a1c" stroke-width="1.5"/><path d="M52 68 Q60 66 62 60" fill="none" stroke="#e8dcc0" stroke-width="1"/><circle cx="62" cy="59" r="1.8" fill="#e8dcc0"/>`,
  },
  venkateswara: {
    name: "Vishnu as Venkateswara (Balaji)",
    bg: "#14365e",
    symbol: `<path d="M42 30 L42 52 Q50 60 58 52 L58 30" fill="none" stroke="#fffaf0" stroke-width="4"/><line x1="50" y1="32" x2="50" y2="54" stroke="#e53935" stroke-width="2.5"/>
      <path d="M26 88 Q24 72 34 70 Q44 70 42 84 Q40 96 30 96 Z" fill="#fffaf0" stroke="#c9b8a0" stroke-width="1"/><path d="M34 72 Q28 76 32 82 Q37 86 38 80 Q38 76 35 77" fill="none" stroke="#c9b8a0" stroke-width="1.2"/><path d="M30 94 L27 100" stroke="#fffaf0" stroke-width="3" stroke-linecap="round"/>
      <circle cx="66" cy="82" r="13" fill="none" stroke="#f2c230" stroke-width="3"/>
      ${Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<line x1="66" y1="82" x2="${66 + Math.cos(a) * 13}" y2="${82 + Math.sin(a) * 13}" stroke="#f2c230" stroke-width="1.5"/>`; }).join("")}<circle cx="66" cy="82" r="3" fill="#f2c230"/>`,
  },
  durga: {
    name: "Durga",
    bg: "#8b1e1e",
    symbol: `<line x1="50" y1="112" x2="50" y2="40" stroke="#d4a017" stroke-width="3.5"/>
      <path d="M50 22 L54 40 L46 40 Z M36 30 Q34 44 46 46 M64 30 Q66 44 54 46" fill="#f2c230" stroke="#d4a017" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 56 Q66 60 62 76 Q58 66 50 66 Z" fill="#c62828"/>
      ${[-40, 0, 40].map((a) => `<ellipse cx="50" cy="96" rx="4.5" ry="10" fill="#f48fb1" transform="rotate(${a} 50 104)"/>`).join("")}`,
  },
  kali: {
    name: "Kali",
    bg: "#1b2440",
    symbol: `<path d="M38 104 L40 92 L44 96 L64 30 Q70 50 60 70 Q54 86 46 98 Z" fill="#cfd8dc" stroke="#90a4ae" stroke-width="1"/>
      <rect x="34" y="96" width="14" height="5" rx="1" fill="#d4a017" transform="rotate(-20 41 98)"/>
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="30" cy="54" rx="6" ry="11" fill="#e53935" transform="rotate(${a} 30 64)"/>`).join("")}
      <circle cx="30" cy="64" r="3" fill="#ffd54f"/><line x1="30" y1="64" x2="26" y2="52" stroke="#ffd54f" stroke-width="1"/>`,
  },
  meenakshi: {
    name: "Meenakshi (Parvati of Madurai)",
    bg: "#8b1e1e",
    symbol: `<ellipse cx="50" cy="64" rx="13" ry="18" fill="#43a047"/><circle cx="56" cy="44" r="10" fill="#4caf50"/>
      <path d="M64 42 Q72 44 66 50 Q64 47 62 47 Z" fill="#e53935"/><circle cx="58" cy="42" r="2" fill="#111"/><circle cx="58.6" cy="41.4" r=".6" fill="#fff"/>
      <path d="M40 74 Q30 96 36 108 Q42 92 48 80" fill="#2e7d32"/><path d="M38 72 Q46 70 52 76" fill="none" stroke="#a5d6a7" stroke-width="1.5"/>
      <path d="M58 100 Q62 88 68 100 Q63 96 58 100 Z" fill="#f48fb1"/><line x1="63" y1="100" x2="63" y2="112" stroke="#2e7d32" stroke-width="1.5"/>`,
  },
  hanuman: {
    name: "Hanuman (Anjaneya)",
    bg: "#b34700",
    symbol: `<circle cx="50" cy="48" r="17" fill="#f2c230" stroke="#a67c00" stroke-width="1.5"/>
      ${[0, 1, 2].map((i) => `<path d="M${36 + i * 0} ${42 + i * 6} Q50 ${46 + i * 6} 64 ${42 + i * 6}" fill="none" stroke="#a67c00" stroke-width="1"/>`).join("")}
      <circle cx="50" cy="29" r="4" fill="#f2c230" stroke="#a67c00"/>
      <rect x="47" y="64" width="6" height="40" rx="2" fill="#d4a017" stroke="#a67c00"/><rect x="44" y="102" width="12" height="6" rx="2" fill="#d4a017" stroke="#a67c00"/>`,
  },
  annapoorna: {
    name: "Annapoorna",
    bg: "#1e5a32",
    symbol: `<path d="M28 76 Q28 106 50 106 Q72 106 72 76 Z" fill="#d4a017" stroke="#a67c00" stroke-width="1.5"/><rect x="26" y="72" width="48" height="6" rx="3" fill="#f2c230" stroke="#a67c00"/>
      <path d="M32 72 Q50 56 68 72 Z" fill="#fffaf0"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${36 + i * 3.5}" cy="${68 - Math.sin((i / 8) * Math.PI) * 7}" r="1" fill="#e8dcc0"/>`).join("")}
      <path d="M62 30 L54 62" stroke="#f2c230" stroke-width="3" stroke-linecap="round"/><ellipse cx="52" cy="66" rx="6" ry="4" fill="#f2c230" stroke="#a67c00"/>`,
  },
  dhanvantari: {
    name: "Dhanvantari",
    bg: "#14365e",
    symbol: `<path d="M34 64 Q30 104 50 106 Q70 104 66 64 Z" fill="#d4a017" stroke="#a67c00" stroke-width="1.5"/>
      <rect x="40" y="56" width="20" height="9" rx="2" fill="#f2c230" stroke="#a67c00"/>
      <path d="M40 80 Q50 86 60 80" fill="none" stroke="#a67c00" stroke-width="1"/>
      ${[[50, 44, 3.5], [42, 36, 2.5], [58, 34, 2.5], [50, 26, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#b3e5fc" stroke="#e1f5fe" stroke-width=".8"/>`).join("")}`,
  },
  kubera: {
    name: "Kubera",
    bg: "#1e5a32",
    symbol: `<path d="M30 70 Q28 106 50 106 Q72 106 70 70 Z" fill="#a1683a" stroke="#6d4320" stroke-width="1.5"/>
      <path d="M36 70 Q50 62 64 70" fill="none" stroke="#6d4320" stroke-width="2"/>
      ${[[40, 66], [50, 60], [60, 66], [45, 54], [55, 54], [50, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f2c230" stroke="#a67c00" stroke-width="1"/>`).join("")}
      <path d="M38 88 l4 -6 l4 6 l-4 6 Z" fill="#e53935"/><path d="M54 88 l4 -6 l4 6 l-4 6 Z" fill="#43a047"/><circle cx="50" cy="96" r="3" fill="#90caf9"/>`,
  },
};

// Tanjore-style arched frame with gem studs around the deity's symbols.
function medallionSVG(c) {
  const studs = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const x = t < 0.5 ? 14 + t * 2 * 36 : 50 + (t - 0.5) * 2 * 36;
    const y = t < 0.5 ? 50 - Math.sin(t * Math.PI) * 42 : 50 - Math.sin(t * Math.PI) * 42;
    return `<circle cx="${x}" cy="${Math.min(y, 50)}" r="2.3" fill="${i % 2 ? "#c62828" : "#2e7d32"}" stroke="#fff3c4" stroke-width=".6"/>`;
  }).join("");
  return `<svg viewBox="0 0 100 130" class="helper-art medallion" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 124 L10 50 Q10 14 50 4 Q90 14 90 50 L90 124 Z" fill="#d4a017" stroke="#8a6a10" stroke-width="1.5"/>
    <path d="M10 124 L10 50 Q10 14 50 4 Q90 14 90 50 L90 124 Z" fill="none" stroke="#fff3c4" stroke-width=".8" transform="translate(50 64) scale(.94) translate(-50 -64)"/>
    <path d="M20 118 L20 52 Q20 24 50 15 Q80 24 80 52 L80 118 Z" fill="${c.bg}"/>
    ${studs}
    ${c.symbol}
    <rect x="6" y="118" width="88" height="10" rx="2" fill="#b8860b" stroke="#8a6a10"/>
    ${[18, 34, 50, 66, 82].map((x) => `<circle cx="${x}" cy="123" r="1.8" fill="#fff3c4"/>`).join("")}
  </svg>`;
}
