// Owl Post: floating chat panel. Sends the conversation to server.py, which updates
// data.js; the page then re-renders with the returned data.

const chatHistory = JSON.parse(sessionStorage.getItem("owlPost") || "[]");

document.body.insertAdjacentHTML(
  "beforeend",
  `<button class="chat-fab" id="chat-open" title="Send an update">🦉 Owl Post</button>
  <section class="chat-panel" id="chat-panel" hidden>
    <header><span>🦉 Owl Post</span><button id="chat-close" aria-label="Close">&times;</button></header>
    <div class="chat-log" id="chat-log"></div>
    <form class="chat-form" id="chat-form">
      <textarea id="chat-input" rows="2" placeholder="e.g. Finished stats, started the AI homework"></textarea>
      <button type="submit">Send</button>
    </form>
  </section>`
);

const panel = document.getElementById("chat-panel");
const log = document.getElementById("chat-log");
const input = document.getElementById("chat-input");
const sendBtn = document.querySelector("#chat-form button");

function addBubble(role, text, changes = []) {
  const list = changes.length ? `<ul class="chat-changes">${changes.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : "";
  log.insertAdjacentHTML("beforeend", `<div class="bubble ${role}">${esc(text).replace(/\n/g, "<br>")}${list}</div>`);
  log.scrollTop = log.scrollHeight;
  return log.lastElementChild;
}

if (!chatHistory.length) {
  addBubble("assistant", "Tell me what you worked on today, or ask what's coming up. I'll update the map for you.");
}
chatHistory.forEach((m) => addBubble(m.role, m.content, m.changes));

function saveHistory() {
  sessionStorage.setItem("owlPost", JSON.stringify(chatHistory.slice(-30)));
}

async function send() {
  const text = input.value.trim();
  if (!text || sendBtn.disabled) return;
  input.value = "";
  chatHistory.push({ role: "user", content: text });
  addBubble("user", text);
  const pending = addBubble("assistant pending", "The owl is flying…");
  sendBtn.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory.map(({ role, content }) => ({ role, content })) }),
    });
    const out = await res.json();
    pending.remove();
    if (res.status === 401) return (location.href = "/login");
    if (!res.ok) throw new Error(out.error || "Request failed");
    chatHistory.push({ role: "assistant", content: out.reply, changes: out.changes });
    addBubble("assistant", out.reply, out.changes);
    if (out.changes.length) setTaskData(out.data);
  } catch (err) {
    pending.remove();
    chatHistory.pop(); // let the user resend the same message
    addBubble("assistant error", `The owl couldn't get through (${err.message}). Try again in a moment.`);
  } finally {
    saveHistory();
    sendBtn.disabled = false;
    input.focus();
  }
}

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  send();
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
document.getElementById("chat-open").addEventListener("click", () => {
  panel.hidden = false;
  document.getElementById("chat-open").hidden = true;
  log.scrollTop = log.scrollHeight;
  input.focus();
});
document.getElementById("chat-close").addEventListener("click", () => {
  panel.hidden = true;
  document.getElementById("chat-open").hidden = false;
});
