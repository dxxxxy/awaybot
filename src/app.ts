import { readFileSync } from "fs"
import { createBot } from "mineflayer"
import ModuleLoader from "./util/moduleLoader.js"
import State from "./util/state.js"
import StatManager from "./util/statManager.js"

export const start = async(email: string, uuid: string, apiKey: string, disabledModules: string[]) => {
    const bot = createBot({
        host: "mc.hypixel.net",
        username: email
    })
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

        await ModuleLoader.loadModules(bot)
    })
}

StatManager.init()

for (const account of JSON.parse(readFileSync("accounts.json", "utf8"))) {
    await start(account.email, account.uuid, account.apiKey, account.disabledModules)
}