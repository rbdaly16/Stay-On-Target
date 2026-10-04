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
    loginTitle: "Password, please",
    loginSub: "The Fat Lady won't let just anyone in.",
    loginButton: "Enter",
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
    loginTitle: "Clearance code, please",
    loginSub: "Only authorized pilots beyond this point.",
    loginButton: "Engage",
    celebrateTitle: "Mission complete!",
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
