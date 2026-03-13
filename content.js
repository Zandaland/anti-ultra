const STORAGE_KEY = "antiUltraEnabled";
const STYLE_ID = "anti-ultra-style";
const FALLBACK_CLASS = "anti-ultra-fallback-hidden";

const CSS_SELECTORS = [
  ".buttons-container.adv-upsell",
  ".upgrade-container.g1-upsell-container.under-input",
  'a[data-test-id="desktop-upgrade-tier2-button"]',
  '[data-test-id="desktop-upgrade-tier2-button"]',
  'g1-dynamic-upsell-button[data-test-id="g1-dynamic-upsell-button"]',
  'g1-dynamic-upsell-button[data-test-id="g1-dynamic-advanced-upsell-button"]',
  '[data-test-id="g1-dynamic-upsell-button"]',
  '[data-test-id="g1-dynamic-advanced-upsell-button"]',
  'button[data-test-id="bard-g1-dynamic-upsell-menu-button"]'
];

const FALLBACK_TEXT_PATTERNS = [
  /upgrade to google ai ultra/i,
  /get the highest access to models & features/i
];

const FALLBACK_CONTAINER_SELECTORS = [
  ".buttons-container.adv-upsell",
  ".upgrade-container.g1-upsell-container.under-input",
  'a[data-test-id="desktop-upgrade-tier2-button"]',
  '[data-test-id="desktop-upgrade-tier2-button"]',
  'g1-dynamic-upsell-button[data-test-id="g1-dynamic-upsell-button"]',
  'g1-dynamic-upsell-button[data-test-id="g1-dynamic-advanced-upsell-button"]',
  '[data-test-id="g1-dynamic-upsell-button"]',
  '[data-test-id="g1-dynamic-advanced-upsell-button"]',
  'button[data-test-id="bard-g1-dynamic-upsell-menu-button"]'
];

let enabled = true;
let observer = null;

function getMatchingElements(root = document) {
  if (!root.querySelectorAll) {
    return [];
  }

  const elements = [];

  for (const selector of CSS_SELECTORS) {
    elements.push(...root.querySelectorAll(selector));
  }

  return elements;
}

function getStyleMarkup() {
  const selectorBlock = CSS_SELECTORS.join(",\n");

  return `
    ${selectorBlock} {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .${FALLBACK_CLASS} {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
}

function ensureStyle() {
  let style = document.getElementById(STYLE_ID);

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = getStyleMarkup();
    (document.head || document.documentElement).appendChild(style);
  }

  return style;
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

function isRelevantUpsellText(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return FALLBACK_TEXT_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isAllowedFallbackContainer(element) {
  return FALLBACK_CONTAINER_SELECTORS.some((selector) => element.matches(selector));
}

function findFallbackContainer(element) {
  let current = element;

  while (current && current !== document.body && current.nodeType === Node.ELEMENT_NODE) {
    if (isAllowedFallbackContainer(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function markFallbackUpsells(root = document) {
  if (!enabled || !root.querySelectorAll) {
    return;
  }

  const candidates = root.querySelectorAll("div, a, button, span, g1-dynamic-upsell-button");

  for (const element of candidates) {
    if (element.classList.contains(FALLBACK_CLASS)) {
      continue;
    }

    const text = element.textContent || "";
    if (!isRelevantUpsellText(text)) {
      continue;
    }

    const container = findFallbackContainer(element);
    if (!container) {
      continue;
    }

    container.classList.add(FALLBACK_CLASS);
  }
}

function clearFallbackUpsells() {
  document.querySelectorAll(`.${FALLBACK_CLASS}`).forEach((element) => {
    element.classList.remove(FALLBACK_CLASS);
  });
}

function unhideExplicitTargets() {
  for (const element of getMatchingElements()) {
    element.style.removeProperty("display");
    element.style.removeProperty("visibility");
    element.style.removeProperty("pointer-events");
  }
}

function syncObserverState() {
  if (!enabled) {
    observer?.disconnect();
    observer = null;
    return;
  }

  if (observer) {
    return;
  }

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          markFallbackUpsells(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

function applyState() {
  if (enabled) {
    ensureStyle();
    markFallbackUpsells();
  } else {
    removeStyle();
    clearFallbackUpsells();
    unhideExplicitTargets();
  }

  syncObserverState();
}

function loadState() {
  chrome.storage.sync.get({ [STORAGE_KEY]: true }, (result) => {
    enabled = Boolean(result[STORAGE_KEY]);
    applyState();
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync" || !changes[STORAGE_KEY]) {
    return;
  }

  enabled = Boolean(changes[STORAGE_KEY].newValue);
  applyState();
});

loadState();

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      if (enabled) {
        markFallbackUpsells();
      }
    },
    { once: true }
  );
}
