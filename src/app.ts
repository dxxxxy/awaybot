import { readFileSync } from "fs"
import { createBot } from "mineflayer"
import { mineflayer as mineflayerViewer } from "prismarine-viewer"
import ModuleLoader from "./util/moduleLoader.js"
import State from "./util/state.js"
import StatManager from "./util/statManager.js"

export const start = (index: number, email: string, uuid: string, apiKey: string, disabledModules: string[]) => {
    const bot = createBot({
        host: "mc.hypixel.net",
        username: email,
        auth: "microsoft",
        version: "1.21.11",
        hideErrors: true,
        skipValidation: true
    })
    bot.index = index
    bot.email = email
    bot.uuid = uuid
    bot.apiKey = apiKey
    bot.disabledModules = disabledModules
    bot.state = State.OFFLINE

    bot.once("spawn", async() => {
        bot.state = State.HYPIXEL

        bot.log = (message: string) => {
            console.log(`[${new Date().toLocaleString()}] - awaybot(${bot.username}) - ${message}`)
        }

        bot.log("Logged in to Hypixel")

        await mineflayerViewer(bot, { port: 3007 + index, firstPerson: false })
        await ModuleLoader.loadModules(bot)
    })
}

StatManager.init()

for (const [index, account] of (JSON.parse(readFileSync("accounts.json", "utf8"))).entries()) {
    if (account.disabled) continue
    start(index, account.email, account.uuid, account.apiKey, account.disabledModules)
}