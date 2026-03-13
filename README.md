# Anti Ultra

![Anti Ultra icon](icons/icon-128.png)

Anti Ultra is a small Chrome extension that removes Google AI Ultra upsell UI from Gemini, then lets you bring it back with a single toggle whenever you want.

## What it does

- Hides the Gemini Ultra upgrade card under the prompt area
- Hides Gemini Ultra upgrade buttons in menus and other upsell spots
- Keeps the page clean as Gemini updates the DOM
- Lets you quickly switch between hidden and visible from the popup
- Remembers your preference with Chrome sync

## Why it exists

Gemini keeps pushing Google AI Ultra in places where some people just want a clean interface. Anti Ultra focuses on one job only: removing those upgrade prompts on `gemini.google.com`.

## Privacy

Anti Ultra does not collect personal information, browsing history, or Gemini conversations.

The extension only:

- runs on `https://gemini.google.com/*`
- checks the page for specific upsell elements so it can hide them
- stores one synced setting in Chrome: whether hiding is enabled

It does not send data to a server, inject remote code, or use analytics.

See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

## Permissions

### `storage`

Used to save your hide/show preference so the extension remembers your choice.

### `https://gemini.google.com/*`

Used so the content script can find and hide Gemini Ultra upsell elements on Gemini pages only.

## Install locally

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `C:\Users\moham\Desktop\Development\anti-ultra`

## How it works

`content.js` injects hiding rules for known Gemini Ultra upsell selectors and watches for DOM changes so newly added upsell UI gets hidden too. The popup writes a single `chrome.storage.sync` value to turn the behavior on or off.

## Project structure

- `manifest.json` - Chrome extension manifest (MV3)
- `content.js` - Gemini page cleanup logic
- `popup.html` - popup markup
- `popup.css` - popup styling
- `popup.js` - popup toggle behavior
- `icons/` - extension icons, including the 128x128 store asset
- `PRIVACY.md` - privacy policy for users and the Chrome Web Store

## Notes

- Anti Ultra is not affiliated with, endorsed by, or sponsored by Google.
- The extension is intentionally narrow in scope so it stays simple and easy to review.

## License

MIT. See [LICENSE](LICENSE).
