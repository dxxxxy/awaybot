import "dotenv/config"
import { createBot } from "mineflayer"
import ModuleLoader from "./util/moduleLoader.js"
import State from "./util/state.js"
import StatManager from "./util/statManager.js"

StatManager.init()

for (const email of process.env.EMAIL.split(",")) {
    const bot = createBot({
        host: "mc.hypixel.net",
        username: email,
        auth: "microsoft",
        version: "1.8.9"
    })
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