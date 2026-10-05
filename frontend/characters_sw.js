// Star Wars characters as cute chibi figures, drawn with chibiSVG() and the shared pieces
// from characters.js.
// Each task's `helpers.sw.character` in the data references a key here.

const SABER = (color, x = 82) => `<rect x="${x}" y="103" width="4.5" height="11" rx="1" fill="#9a9a9a"/><rect x="${x}" y="105" width="4.5" height="2" fill="#333"/>
  <rect x="${x - 0.5}" y="65" width="5.5" height="38" rx="2.75" fill="${color}" opacity=".45"/><rect x="${x + 0.4}" y="66" width="3.7" height="37" rx="1.85" fill="${color}"/>
  <rect x="${x + 1.5}" y="67" width="1.5" height="35" rx=".75" fill="#fff" opacity=".85"/>`;

const SW_CHARACTERS = {
  luke: {
    name: "Luke Skywalker",
    fur: "#e3c16f",
    robe: "#e8dcc2",
    body: `<path d="M41 100 L50 110 L59 100" fill="none" stroke="#c9b48a" stroke-width="1.5"/><rect x="30" y="112" width="40" height="3" fill="#7a5a3a"/>` + SABER("#39d353"),
    front: fringe("#c9a24a"),
  },
  leia: {
    name: "Princess Leia",
    fur: "#4a2f1f",
    robe: "#f4f4f2",
    back: `<circle cx="16" cy="66" r="11" fill="#3b2416"/><circle cx="84" cy="66" r="11" fill="#3b2416"/>
       <path d="M16 59 a7 7 0 1 1 -6 9 M84 59 a7 7 0 1 0 6 9" fill="none" stroke="#5a3a24" stroke-width="1.5"/>`,
    body: `<rect x="31" y="111" width="38" height="3" fill="#c8c8c0"/>`,
    front: `<path d="M30 58 Q40 48 50 52 Q60 48 70 58 Q50 44 30 58 Z" fill="#3b2416"/>`,
  },
  han: {
    name: "Han Solo",
    fur: "#6b4a2e",
    robe: "#f2efe6",
    body: `<path d="M30 104 Q34 100 42 99 L46 127 L31 122 Z" fill="#1f1f1f"/><path d="M70 104 Q66 100 58 99 L54 127 L69 122 Z" fill="#1f1f1f"/>`,
    front: fringe("#5a3d24") + `<path d="M56 60 L64 58" stroke="#3a2614" stroke-width="2" stroke-linecap="round"/>`,
  },
  chewbacca: {
    name: "Chewbacca",
    fur: "#7a5230",
    face: "#a8784a",
    robe: "#6b4626",
    body: `<path d="M30 104 L70 126" stroke="#3d2a16" stroke-width="5"/>
       ${[38, 46, 54, 62].map((x, i) => `<rect x="${x - 2}" y="${106 + i * 4.4}" width="4" height="4" fill="#b8b8b8" transform="rotate(29 ${x} ${108 + i * 4.4})"/>`).join("")}`,
    front: `<path d="M31 56 l4 -6 l3 6 l4 -7 l3 7 l5 -8 l5 8 l3 -7 l4 7 l3 -6 l4 6" fill="none" stroke="#5e3d22" stroke-width="1.6" stroke-linejoin="round"/>`,
  },
  yoda: {
    name: "Yoda",
    fur: "#8fb36a",
    face: "#b9d39a",
    ears: `<path d="M24 64 L0 54 Q8 66 26 74 Z M76 64 L100 54 Q92 66 74 74 Z" fill="#8fb36a"/><path d="M22 66 L8 59 Q14 66 24 71 Z M78 66 L92 59 Q86 66 76 71 Z" fill="#c9a6a0" opacity=".7"/>`,
    robe: "#c2a878",
    body: `<path d="M27 104 Q50 96 73 104 L70 126 Q50 130 30 126 Z" fill="#8a6f48" opacity=".55"/><rect x="73" y="98" width="3" height="28" rx="1.5" fill="#6b4f2a"/>`,
    front: `<path d="M40 40 q4 -6 9 -2 M52 38 q5 -5 9 1" fill="none" stroke="#e8e8e8" stroke-width="1.4" stroke-linecap="round"/>`,
  },
  obiwan: {
    name: "Obi-Wan Kenobi",
    fur: "#b5763c",
    robe: "#c9b28c",
    body: `<path d="M27 104 Q34 98 42 99 L44 128 L28 124 Z M73 104 Q66 98 58 99 L56 128 L72 124 Z" fill="#6b4a2c"/>`,
    front: fringe("#9c6232") + `<path d="M35 80 Q50 95 65 80 Q63 99 50 103 Q37 99 35 80 Z" fill="#9c6232"/>`,
  },
  r2d2: {
    name: "R2-D2",
    fur: "#e8eef5",
    face: "#f5f8fc",
    robe: "#dfe7f0",
    body: `<rect x="40" y="104" width="8" height="14" rx="1" fill="#2f6fd0"/><rect x="52" y="104" width="8" height="5" rx="1" fill="#2f6fd0"/><rect x="52" y="112" width="8" height="6" rx="1" fill="#9db4cf"/>`,
    front: `<path d="M27 52 Q50 26 73 52 L69 54 Q50 34 31 54 Z" fill="#2f6fd0"/><rect x="44" y="40" width="12" height="5" rx="1" fill="#2f6fd0"/><circle cx="62" cy="45" r="2" fill="#e53935"/>`,
  },
  c3po: {
    name: "C-3PO",
    fur: "#d4a72c",
    face: "#e8c75a",
    robe: "#c99a22",
    eyes: `<circle cx="42" cy="66" r="5" fill="#ffe066" stroke="#8a6a10" stroke-width="1.5"/><circle cx="58" cy="66" r="5" fill="#ffe066" stroke="#8a6a10" stroke-width="1.5"/>`,
    body: `<path d="M38 104 L62 104 M40 110 L60 110 M44 116 L56 116" stroke="#8a6a10" stroke-width="1.5"/><circle cx="50" cy="121" r="2.5" fill="#8a6a10"/>`,
  },
  lando: {
    name: "Lando Calrissian",
    fur: "#3b2a20",
    robe: "#f0e8d8",
    back: `<path d="M24 100 Q50 92 76 100 L84 128 L16 128 Z" fill="#2b4a7a"/><path d="M26 102 L20 127 L28 127 Z M74 102 L80 127 L72 127 Z" fill="#e0b84a"/>`,
    front: `<path d="M41 74 Q50 69 59 74 Q50 72.5 41 74 Z" fill="#2a1d14" stroke="#2a1d14" stroke-width="1.5" stroke-linejoin="round"/>`,
  },
  vader: {
    name: "Darth Vader",
    fur: "#151515",
    face: "#2c2c2c",
    robe: "#0d0d0d",
    eyes: `<ellipse cx="42" cy="65" rx="5.5" ry="4.5" fill="#050505" stroke="#555" stroke-width=".8"/><ellipse cx="58" cy="65" rx="5.5" ry="4.5" fill="#050505" stroke="#555" stroke-width=".8"/>`,
    body: `<rect x="42" y="104" width="16" height="10" rx="1.5" fill="#2a2a2a" stroke="#666" stroke-width=".6"/>
       <rect x="45" y="107" width="3" height="3" fill="#e53935"/><rect x="50" y="107" width="3" height="3" fill="#39d353"/><rect x="55" y="107" width="1.5" height="3" fill="#9a9a9a"/>` + SABER("#ff2a2a"),
  },
};
