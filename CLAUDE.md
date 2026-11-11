# CLAUDE.md

Mineflayer bot that keeps one or more Microsoft accounts AFK on Hypixel Skyblock (private island) and tracks coin/bit gains. TypeScript, ESM (`"type": "module"`), Node 24.

## Commands

- `npm install`: also runs `patch-package` (postinstall), which applies `patches/`. Do not remove that script.
- `npx tsc --noEmit`: type-check. This is the main verification step. There are no tests or linter.
- `npm start`: cleans `dist/`, compiles, copies `accounts.json` into `dist/`, then runs `node app.js` **from inside `dist/`**. This logs into real accounts on Hypixel. Do not run it unless asked.
- `docker build .`: multi-stage Alpine build. The image runs `node app.js` from `/awaybot` (the contents of `dist/`).

## Layout

- `src/app.ts`: entry point. Reads `accounts.json` (cwd-relative) and calls `start()` for each enabled account.
- `src/bot.ts`: `start(index, account)` creates the bot, the viewer (port `3007 + index`), logging, and loads modules on first spawn. Hibernate calls `start()` again to bring a bot back, so keep `bot.ts` free of top-level side effects.
- `src/module/**`: auto-loaded modules. Any `.js` file under `dist/module/` whose default export is a non-class function is run as `(bot) => ...` after spawn. A module is disabled when its file base name (e.g. `hibernate`) appears in the account's `disabledModules`. Helpers that live in this tree (e.g. `simpleChatTracker.ts`) must not default-export a function.
- `src/util/statManager.ts`: global stat totals, shared across all accounts, persisted to `../stats.json` relative to cwd (the project root when using `npm start`).
- `src/types/mineflayer.d.ts`: augments mineflayer's `Bot` with the custom fields (`state`, `log`, `apiKey`, `viewer`, ...).

## Gotchas

- **TypeScript 7** (native compiler). `strict` is on, and `rootDir: "src"` plus `types: ["node"]` must stay explicit: TS 7 defaults `rootDir` to the tsconfig dir (output would move to `dist/src/` and break `npm start` and Docker) and `types` to `[]`. `skipLibCheck` is required because the prismarine-* typings don't pass strict checks.
- **Minecraft version** is pinned in `bot.ts` and must be one that `minecraft-data`/mineflayer support (check `node_modules/mineflayer/lib/version.js`). Unsupported versions fail at `createBot`.
- **Patches**: `prismarine-nbt` is patched to skip Hypixel's invalid NBT tags. `mineflayer` is patched to acknowledge resource packs with the real UUID (without it, transfers to Skyblock hang in the configuration phase). Patch filenames include the package version, so after bumping a patched package, regenerate the patch with `npx patch-package <pkg>` or delete it if the fix is upstream.
- **Mineflayer quirks**: the `kicked` reason is typed `string` but is an NBT object on 1.20.3+. `bot.waitForTicks` rejects when physics pauses (server switches, disconnects), so use `sleep()` from `util/utils.ts` for long-running loops. Any unhandled rejection kills the whole process, and with it every account.
- `prismarine-viewer` needs `canvas` (it requires it without declaring it as a dependency). The viewer must be closed on `end` (done in `bot.ts`) or a restarted bot hits `EADDRINUSE`.
- Module code is fire-and-forget. `ModuleLoader` catches errors per module, so a long-running async loop must exit on its own once `bot.state === State.OFFLINE`.

## Conventions

- 4-space indent, double quotes, no semicolons, `//comment` without a space.
- Relative imports use the `.js` extension (NodeNext resolution).
- Commits follow conventional style (`fix:`, `feat:`, `chore:`, `build:`, `refactor:`, `docs:`).
