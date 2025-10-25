# Phaser Platformer

A modular Phaser 3 platformer prototype showcasing advanced player movement, parallax backgrounds, checkpoints, AI enemies, collectibles, HUD overlay, pause menu, and local persistence. Bundled with Vite for rapid iteration.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   Open the provided URL (defaults to `http://localhost:5173`). The flow is `Boot → Preload → Menu → Level Select → Level`.
3. Build for production:
   ```bash
   npm run build
   ```
   The optimized output is emitted into `dist/` and can be previewed with `npm run preview`.

## Features

- Modular scene graph (Boot, Preload, Menu, Level Select, Game, Pause, UI overlay).
- Placeholder-generated art and audio so the prototype runs without binary assets.
- Advanced player traversal: configurable double jump, coyote time, jump buffer, short-hop control.
- Arcade physics tilemap collision, one-way and moving platforms, parallax camera, checkpoints.
- Collectibles with scoring, enemies with patrol AI, hazards, respawn loop, HUD updates.
- Pause menu with restart/exit plus live key remapping support persisted to `localStorage`.
- Save system storing unlocked levels, high score, and audio settings.
- ESLint (Standard) + Prettier formatting.

## Settings & Persistence

- Control remaps are stored under `phaser-platformer-controls` in `localStorage`.
- Progress is stored under `phaser-platformer-save` (see `src/systems/SaveSystem.js`). Delete these keys to fully reset state.

## TODOs / Future Enhancements

- Swap procedural placeholders with production-ready art/audio once available.
- Expand enemy behaviors (ranged attacks, vertical patrol, awareness cone).
- Extend pause settings to expose audio volumes and full keybinding UI.
- Add camera shake/FX feedback on damage and collectibles.
- Implement victory/summary scene when reaching level goals.

## Missing Assets

The game currently relies on procedurally generated placeholder textures and tones. Provide the following real assets for a production build:

| Path | Description | Suggested Spec |
| ---- | ----------- | -------------- |
| `public/assets/tiles/tileset.png` | Tile atlas referenced by `tileset.tsx` | 32×32px tiles, 3 columns (ground/one-way/hazard variants) |
| `public/assets/images/player.png` | Player sprite sheet | 32×48px, 4 columns × 2 rows (idle/run/jump) |
| `public/assets/images/enemy.png` | Enemy sprite sheet | 32×32px, 4 columns animation |
| `public/assets/images/collectible.png` | Coin pickup sprite | 20×20px, simple spin cycle |
| `public/assets/images/checkpoint.png` | Checkpoint flag | 24×48px, 2 frame animation |
| `public/assets/images/moving-platform.png` | Moving platform tile | 64×16px |
| `public/assets/audio/music-loop.ogg` | Background music loop | Stereo, 44.1 kHz, ≤ 60s seamless loop |
| `public/assets/audio/jump.wav` | Jump SFX | Mono, 44.1 kHz, ≤ 0.5s |
| `public/assets/audio/coin.wav` | Coin SFX | Mono, 44.1 kHz, ≤ 0.5s |
| `public/assets/audio/hit.wav` | Damage SFX | Mono, 44.1 kHz, ≤ 0.75s |

### Replacing Placeholders

- Update the files above and ensure keys in `src/config/assets.js` still point to the correct paths.
- Remove or adjust the procedural texture/audio generation in `BootScene` once real assets are bundled to avoid overriding imported files.
- Tweak collider sizes/offsets in entity constructors (`src/entities/*.js`) to fit the new sprites.

