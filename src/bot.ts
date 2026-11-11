import { createBot } from "mineflayer"
import { mineflayer as mineflayerViewer } from "prismarine-viewer"
import ModuleLoader from "./util/moduleLoader.js"
import State from "./util/state.js"

export interface Account {
    email: string
    uuid: string
    apiKey: string
    disabledModules: string[]
}

export const start = (index: number, account: Account) => {
    const bot = createBot({
        host: "mc.hypixel.net",
        username: account.email,
        auth: "microsoft",
        version: "26.1",
        hideErrors: true,
        skipValidation: true
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

    bot.on("end", reason => {
        bot.log(`Disconnected (${reason})`)

        //free the viewer port, otherwise a restarted bot (see hibernate) crashes the process with EADDRINUSE
        bot.viewer?.close()
    })

    bot.once("spawn", async () => {
        bot.state = State.HYPIXEL

        bot.log("Logged in to Hypixel")

        mineflayerViewer(bot, { port: 3007 + index, firstPerson: false })
        await ModuleLoader.loadModules(bot)
    })

    return bot
}
