// Page themes. The theme id is stored in localStorage and mirrored on <html data-theme>,
// which styles.css keys its overrides on. Elements with data-t="key" get that key's text.

const THEMES = {
  hp: {
    name: "Harry Potter",
    brand: "⚡ The Hogwarts Task Map",
    tagline: "Mischief managed, one task at a time",
    pageTitle: "The Hogwarts Task Map",
    done: "Mischief managed",
    back: "Back to the map",
    helperHeading: "Assigned helper",
    chatName: "🦉 Owl Post",
    chatIntro: "Tell me what you worked on today, or ask what's coming up. I'll update the map for you.",
    chatPending: "The owl is flying…",
    chatError: "The owl couldn't get through",
    celebrateTitle: "Mischief managed!",
  },
  sw: {
    name: "Star Wars",
    brand: "✦ Stay on Target",
    tagline: "Your galactic task map",
    pageTitle: "Stay on Target · Galactic Task Map",
    done: "Missions complete",
    back: "Back to the star map",
    helperHeading: "Assigned ally",
    chatName: "📡 Holocomm",
    chatIntro: "Report in, pilot. Tell me what you worked on, or ask what's coming up, and I'll update the star map.",
    chatPending: "Transmitting…",
    chatError: "The transmission didn't get through",
    celebrateTitle: "Mission complete!",
  },
  hindu: {
    name: "Hindu (South Indian)",
    brand: "🪔 Karya Siddhi Task Map",
    tagline: "Every task begun with Ganesha's blessing",
    pageTitle: "Karya Siddhi Task Map",
    done: "Karya siddhi (accomplished)",
    back: "Back to the map",
    helperHeading: "Guiding deity",
    chatName: "☁️ Meghaduta",
    chatIntro: "Namaskaram! Tell me what you worked on today, or ask what's coming up, and I'll update the map. (Meghaduta, the cloud messenger, is named for Kalidasa's poem.)",
    chatPending: "The cloud messenger is on its way…",
    chatError: "The message couldn't get through",
    celebrateTitle: "Karya Siddhi!",
  },
  dragon: {
    name: "Empyrean (Dragons)",
    brand: "🐉 Basgiath Task Map",
    tagline: "Riders Quadrant · Graduate or die",
    pageTitle: "Basgiath Task Map",
    done: "Tasks conquered",
    back: "Back to the war map",
    helperHeading: "Bonded ally",
    chatName: "🐉 Dragon Bond",
    chatIntro: "Report, cadet. Tell me what you worked on or what's ahead, and I'll update the war map.",
    chatPending: "Your dragon is listening…",
    chatError: "The bond went quiet",
    celebrateTitle: "Task conquered!",
  },
  wof: {
    name: "Wings of Fire",
    brand: "🐲 Jade Mountain Task Map",
    tagline: "Dragonets of destiny, one task at a time",
    pageTitle: "Jade Mountain Task Map",
    done: "Prophecies fulfilled",
    back: "Back to Pyrrhia",
    helperHeading: "Dragon friend",
    chatName: "💎 Dreamvisitor",
    chatIntro: "Hello, dragonet! Tell me what you worked on today, or ask what's coming up, and I'll update the map.",
    chatPending: "The Dreamvisitor is reaching out…",
    chatError: "The dream didn't connect",
    celebrateTitle: "Prophecy fulfilled!",
  },
};

let currentTheme = THEMES[localStorage.getItem("theme")] ? localStorage.getItem("theme") : "hp";

function T(key) {
  return THEMES[currentTheme][key];
}

function applyTheme(id) {
  currentTheme = THEMES[id] ? id : "hp";
  localStorage.setItem("theme", currentTheme);
  document.documentElement.dataset.theme = currentTheme;
  document.title = T("pageTitle");
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = T(el.dataset.t)));
  const select = document.getElementById("theme-select");
  if (select) select.value = currentTheme;
  document.dispatchEvent(new Event("themechange"));
}

document.getElementById("theme-select")?.addEventListener("change", (e) => applyTheme(e.target.value));
applyTheme(currentTheme);
