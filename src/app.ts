import { readFileSync } from "fs"
import { createBot } from "mineflayer"
import ModuleLoader from "./util/moduleLoader.js"
import State from "./util/state.js"
import StatManager from "./util/statManager.js"

StatManager.init()

for (const account of JSON.parse(readFileSync("accounts.json", "utf8"))) {
    const bot = createBot({
        host: "mc.hypixel.net",
        username: account.email,
        auth: "microsoft",
        version: "1.8.9"
    })
    bot.uuid = account.uuid
    bot.apiKey = account.apiKey
    bot.state = State.OFFLINE

    bot.once("spawn", async() => {
        bot.state = State.HYPIXEL

        bot.log = (message: string) => {
            console.log(`[${new Date().toLocaleString()}] - awaybot(${bot.username}) - ${message}`)
        }

        bot.log("Logged in to Hypixel")

        await ModuleLoader.loadModules(bot, account.disabledModules)
    })
}