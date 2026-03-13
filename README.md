# Anti Ultra

A lightweight Chrome extension that hides the Gemini "Upgrade to Google AI Ultra" prompts shown in the sidebar, menus, and under the input box.

## Files

- `manifest.json`: Manifest V3 config
- `content.js`: Hides Gemini upsell elements and reacts to popup state changes
- `popup.html`, `popup.css`, `popup.js`: Popup UI with a show/hide toggle and support link

## Load it in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `C:\Users\moham\Desktop\Development\anti-ultra`

## Behavior

- Default state is enabled, so the targeted Gemini Ultra elements are hidden.
- The popup `Show` button reveals them again.
- The popup `Hide` button turns blocking back on.
# anti-ultra
