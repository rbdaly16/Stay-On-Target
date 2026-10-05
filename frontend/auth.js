// Clerk sign-in. initAuth() loads Clerk (script tags from Clerk's own CDN, per its
// no-bundler setup), then either shows the sign-in box or mounts the account button.
// apiFetch() attaches the signed-in user's short-lived session token to API calls.

let currentUserId = null;

function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Couldn't load ${src}`));
    document.head.appendChild(s);
  });
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Match Clerk's sign-in box and menus to the current theme. Newer Clerk versions renamed
// some color variables (colorText -> colorForeground, etc.), so both names are passed.
function clerkAppearance() {
  const ink = cssVar("--ink");
  const soft = cssVar("--ink-soft");
  const input = cssVar("--input-bg");
  return {
    variables: {
      colorPrimary: cssVar("--red-dark"),
      colorBackground: cssVar("--parchment-light"),
      colorText: ink,
      colorForeground: ink,
      colorTextSecondary: soft,
      colorMutedForeground: soft,
      colorInputBackground: input,
      colorInput: input,
      colorInputText: ink,
      colorInputForeground: ink,
      colorNeutral: ink,
      fontFamily: cssVar("--font-body"),
    },
  };
}

function showSignIn() {
  document.body.classList.add("signed-out");
  const old = document.getElementById("sign-in");
  if (old) window.Clerk.unmountSignIn(old);
  const app = document.getElementById("app");
  app.innerHTML = `<div class="signin-wrap"><div id="sign-in"></div></div>`;
  window.Clerk.mountSignIn(document.getElementById("sign-in"), { appearance: clerkAppearance() });
}

async function initAuth() {
  try {
    const cfg = await (await fetch("/api/config")).json();
    await loadScript(`https://${cfg.frontendApi}/npm/@clerk/ui@1/dist/ui.browser.js`);
    await loadScript(`https://${cfg.frontendApi}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
      "data-clerk-publishable-key": cfg.publishableKey,
    });
    await window.Clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor }, appearance: clerkAppearance() });
  } catch (err) {
    document.getElementById("app").innerHTML = `<p class="empty">Couldn't reach the sign-in service (${esc(err.message)}). Try refreshing.</p>`;
    return false;
  }

  // Reload whenever someone signs in or out, so the page always matches the account.
  const wasSignedIn = window.Clerk.isSignedIn;
  window.Clerk.addListener(({ user }) => {
    if (!!user !== wasSignedIn) location.reload();
  });

  if (!wasSignedIn) {
    showSignIn();
    return false;
  }
  currentUserId = window.Clerk.user.id;
  window.Clerk.mountUserButton(document.getElementById("user-button"), { appearance: clerkAppearance() });
  return true;
}

async function apiFetch(url, options = {}) {
  const token = await window.Clerk.session?.getToken();
  const res = await fetch(url, { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } });
  if (res.status === 401) showSignIn();
  return res;
}

// Restyle Clerk's components when the theme changes.
document.addEventListener("themechange", () => {
  if (!window.Clerk?.loaded) return;
  if (!window.Clerk.isSignedIn) return showSignIn();
  const btn = document.getElementById("user-button");
  window.Clerk.unmountUserButton(btn);
  window.Clerk.mountUserButton(btn, { appearance: clerkAppearance() });
});
