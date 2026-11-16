# HOLO-XO

A local-first, browser-based holographic Tic-Tac-Toe game with hand-drawn moves. Works on a CPU; the game logic has no heavy runtime dependencies.

## Start

1. Install Node.js 18 or later.
2. From this directory run `npm start` (or `node server.js`).
3. Open `http://localhost:8080`.
4. Click **Enable camera** and grant camera permission for hand tracking. Or click **Use mouse / touch** to draw without a camera. Choose a mode and difficulty, then play.

For camera access from another device, serve this app on localhost/HTTPS: browsers generally block webcam access on insecure LAN HTTP origins. `server.js` binds to loopback by default. Set `HOST=0.0.0.0` only if you intentionally want LAN hosting; webcam permission may still require HTTPS. The app does not relay video to its server: MediaPipe loads in the browser from jsDelivr, and the camera stream is processed client-side.

## Controls

- A finger pinch (thumb tip to index tip) draws on the board. Open the pinch to stop. The virtual pen starts **disarmed**: aim at a cell and hold a pinch for about 0.6 seconds to arm a single move; when the cell preview turns green, release to commit. This dwell/release gate reduces accidental moves.
- **Mouse / touch:** click or drag in a cell to preview, release to commit. The click/tap fallback is available even without webcam permission.
- **Erase:** choose Eraser, then pinch-drag (or mouse/touch drag) over unwanted colored marks. Eraser mode never makes game moves.
- Use **Reset board** to clear the round. The scoreboard persists in this browser's local storage. New match starts fresh. Scores increment once per win; draws are not wins.
- Bot levels: Easy random legal play, Medium tactical block/win with randomized choices, Hard optimal Minimax. Friend mode alternates X and O locally.
- Sound can be muted; sounds are synthesized locally with Web Audio.

## How move detection works

On release, a stroke must stay inside one cell, have at least four meaningful path samples, span a minimum distance and have adequate bounding-box size. It is classified as an X when the two diagonal families of points are present and its endpoints are far apart; otherwise a sufficiently large closed loop is classified as O. A stroke cannot cross cell boundaries. Each accepted move is committed only once on release and only if the selected cell is empty and the game is in progress.

## Structure

- `server.js` — small dependency-free static HTTP server, loopback by default.
- `public/index.html`, `public/styles.css` — accessible responsive holographic interface.
- `public/js/` — isolated board/rules, bot policies, stroke recognizer, and UI/camera controller.
- `tests/` — Node built-in unit tests for rules, bot and stroke recognition.

## Testing

Run `npm test` (Node's built-in test runner). Automated tests cover legal turns, wins/draws, score-agnostic resets, bot decisions, and stroke recognition. Webcam hardware, browser permission prompts, actual hand-tracking accuracy, and cross-browser performance require manual device testing.

## Limitations

This is a local browser game, not a formally certified production service. It loads the MediaPipe Hands Tasks Vision WASM/model and browser library from a version-pinned CDN on first camera use (network required). The CDN code can process camera frames in-browser; the app server receives no camera frames. CDN/model availability, browser security policy, lighting, camera quality and device performance affect tracking. No network or browser can be fully validated without testing on the intended device.
