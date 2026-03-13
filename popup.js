const STORAGE_KEY = "antiUltraEnabled";

const toggleButton = document.getElementById("toggle-button");
const statusPill = document.getElementById("status-pill");

function render(enabled) {
  document.body.dataset.enabled = String(enabled);
  statusPill.textContent = enabled ? "Hidden" : "Visible";
  toggleButton.textContent = enabled ? "Show" : "Hide";
  toggleButton.setAttribute(
    "aria-label",
    enabled ? "Show the hidden Gemini Ultra elements" : "Hide the Gemini Ultra elements"
  );
}

function updateState(enabled) {
  chrome.storage.sync.set({ [STORAGE_KEY]: enabled }, () => {
    render(enabled);
  });
}

toggleButton.addEventListener("click", () => {
  chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
    updateState(!result[STORAGE_KEY]);
  });
});

chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
  render(Boolean(result[STORAGE_KEY]));
});
