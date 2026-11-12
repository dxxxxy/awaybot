# CLAUDE.md

Mineflayer bot that keeps one or more Microsoft accounts AFK on Hypixel Skyblock (private island) and tracks coin/bit gains. TypeScript, ESM (`"type": "module"`), Node 24.

## Commands

- `npm install`: also runs `patch-package` (postinstall), which applies `patches/`. Do not remove that script.
- `npx tsc --noEmit`: type-check. This is the main verification step. There are no tests or linter.
- `npm start`: cleans `dist/`, compiles, copies `accounts.json` into `dist/`, then runs `node app.js` **from inside `dist/`**. This logs into real accounts on Hypixel. Do not run it unless asked.
- `docker build .`: multi-stage Alpine build. The image runs `node app.js` from `/awaybot` (the contents of `dist/`).
- Releases: `npm version <patch|minor|major|x.y.z>` bumps `package.json`/`package-lock.json`, commits (`chore: release vX.Y.Z`, set in `.npmrc`) and tags. Then `git push --follow-tags`. The `v*` tag triggers `.github/workflows/release.yml`, which fails if the tag doesn't match `package.json` and otherwise pushes `ghcr.io/dxxxxy/awaybot` for amd64 and arm64. Never create release tags by hand or bump the version in CI.

## Layout

- `src/app.ts`: entry point. Reads `accounts.json` (cwd-relative) and calls `start()` for each enabled account.
- `src/bot.ts`: `start(index, account)` creates the bot, the viewer (port `3007 + index`), logging, and loads modules on first spawn. Every bot instance is single-use: on `end` it schedules a fresh `start()` with exponential backoff (10s doubling to 5min, reset after a session of 60s+). The exception is "You logged in from another location!", where hibernate calls `start()` once the user leaves. Keep `bot.ts` free of top-level side effects.
- `src/module/presence/stay.ts`: polls `/locraw` every 4-10s and steers limbo → `/lobby`, any lobby → `/play sb`, Skyblock → `/is`.
- `src/module/**`: auto-loaded modules. Any `.js` file under `dist/module/` whose default export is a non-class function is run as `(bot) => ...` after spawn. A module is disabled when its file base name (e.g. `hibernate`) appears in the account's `disabledModules`. Helpers that live in this tree (e.g. `simpleChatTracker.ts`) must not default-export a function.
- `src/util/statManager.ts`: global stat totals, shared across all accounts, persisted to `../stats.json` relative to cwd (the project root when using `npm start`). Override it with `STATS_FILE`. `AUTH_CACHE_DIR` overrides the Microsoft token cache. The Docker image sets both under the `/awaybot/data` volume.
- `src/types/mineflayer.d.ts`: augments mineflayer's `Bot` with the custom fields (`state`, `log`, `apiKey`, `viewer`, ...).

## Gotchas

- **TypeScript 7** (native compiler). `strict` is on, and `rootDir: "src"` plus `types: ["node"]` must stay explicit: TS 7 defaults `rootDir` to the tsconfig dir (output would move to `dist/src/` and break `npm start` and Docker) and `types` to `[]`. `skipLibCheck` is required because the prismarine-* typings don't pass strict checks.
- **Minecraft version** is pinned in `bot.ts` and must be one that `minecraft-data`/mineflayer support (check `node_modules/mineflayer/lib/version.js`). Unsupported versions fail at `createBot`.
- **Patches**: `prismarine-nbt` is patched to skip Hypixel's invalid NBT tags. `mineflayer` is patched to acknowledge resource packs with the real UUID (without it, transfers to Skyblock hang in the configuration phase), and to send `tick_end` every tick and answer pings at tick start like vanilla. Without that, Skyblock servers move the bot to the lobby ~20s after arrival with "badly behaving modifications". Patch filenames include the package version, so after bumping a patched package, regenerate the patch with `npx patch-package <pkg>` or delete it if the fix is upstream.
- **Live testing**: Hypixel rate-limits rapid reconnects and server switches ("You tried to rejoin too fast"), so space out test runs. Run debugging scripts with `hideErrors: false` and log `bot._client` packets. The configuration phase during transfers is where things break.
- **Mineflayer quirks**: the `kicked` reason is typed `string` but is an NBT object on 1.20.3+ (use `chatToPlainText()` from `util/utils.ts`). `bot.waitForTicks` rejects when physics pauses (server switches, disconnects), so use `sleep()` from `util/utils.ts` for long-running loops. Any unhandled rejection kills the whole process, and with it every account.
- `prismarine-viewer` needs `canvas` (it requires it without declaring it as a dependency). The viewer must be closed on `end` (done in `bot.ts`) or a restarted bot hits `EADDRINUSE`.
- Module code is fire-and-forget. `ModuleLoader` catches errors per module, so a long-running async loop must exit on its own once `bot.state === State.OFFLINE`.

## Conventions

- 4-space indent, double quotes, no semicolons, `//comment` without a space.
- Relative imports use the `.js` extension (NodeNext resolution).
- Commits follow conventional style (`fix:`, `feat:`, `chore:`, `build:`, `refactor:`, `docs:`).
