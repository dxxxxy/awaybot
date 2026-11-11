import { createBot } from "mineflayer"
import { mineflayer as mineflayerViewer } from "prismarine-viewer"
import ModuleLoader from "./util/moduleLoader.js"
import State from "./util/state.js"
import { chatToPlainText, isLoggedInElsewhereKick } from "./util/utils.js"

export interface Account {
    email: string
    uuid: string
    apiKey: string
    disabledModules: string[]
}

//reconnect delay doubles with every consecutive failed attempt: 10s, 20s, 40s, ... capped at 5 minutes
const RECONNECT_BASE_DELAY = 10 * 1000
const RECONNECT_MAX_DELAY = 5 * 60 * 1000

//a session has to last this long to count as successful and reset the backoff (avoids hammering Hypixel on kick loops)
const STABLE_SESSION_DURATION = 60 * 1000

//reconnectAttempt counts consecutive reconnects (0 for a fresh start), it only resets after a stable session
export const start = (index: number, account: Account, reconnectAttempt = 0) => {
    const bot = createBot({
        host: "mc.hypixel.net",
        username: account.email,
        auth: "microsoft",
        version: "26.1",
        hideErrors: true,
        skipValidation: true,
        //AUTH_CACHE_DIR overrides where Microsoft tokens are cached (the Docker image points it into a volume)
        profilesFolder: process.env.AUTH_CACHE_DIR || undefined
    })
    bot.index = index
    bot.email = account.email
    bot.uuid = account.uuid
    bot.apiKey = account.apiKey
    bot.disabledModules = account.disabledModules
    bot.state = State.OFFLINE

    //defined before login so disconnects that happen before spawning can be logged too
    bot.log = (message: string) => {
        console.log(`[${new Date().toLocaleString()}] - awaybot(${bot.username ?? account.email}) - ${message}`)
    }

    let spawnedAt: number | null = null
    let loggedInElsewhere = false

    bot.on("kicked", reason => {
        bot.log(`Kicked: ${chatToPlainText(reason)}`)
        loggedInElsewhere = isLoggedInElsewhereKick(reason)
    })

    bot.on("end", reason => {
        bot.log(`Disconnected (${reason})`)

        //free the viewer port, otherwise a restarted bot crashes the process with EADDRINUSE
        bot.viewer?.close()

        //the user took over the account: reconnecting would kick them, hibernate (if enabled) restarts the bot once they leave
        if (loggedInElsewhere) {
            if (bot.disabledModules.includes("hibernate")) bot.log("User logged in -> Not reconnecting (enable hibernate to resume automatically)")
            return
        }

        const stable = spawnedAt !== null && Date.now() - spawnedAt >= STABLE_SESSION_DURATION
        const attempt = stable ? 1 : reconnectAttempt + 1
        const delay = Math.min(RECONNECT_BASE_DELAY * 2 ** (attempt - 1), RECONNECT_MAX_DELAY)

        bot.log(`Reconnecting in ${delay / 1000}s${attempt > 1 ? ` (attempt ${attempt})` : ""}`)
        setTimeout(() => start(index, account, attempt), delay)
    })

    bot.once("spawn", async () => {
        spawnedAt = Date.now()
        bot.state = State.HYPIXEL

        bot.log("Logged in to Hypixel")

        mineflayerViewer(bot, { port: 3007 + index, firstPerson: false })
        await ModuleLoader.loadModules(bot)
    })

    return bot
}
