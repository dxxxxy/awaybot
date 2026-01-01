import "dotenv/config"

import BotHandler from "./util/botHandler.js"
import ModuleLoader from "./util/moduleLoader.js"
import StatManager from "./util/statManager.js"

StatManager.init()

for (const email of process.env.EMAIL.split(",")) {
    const bot = BotHandler.start(email)

    bot.once("spawn", async() => {
        await ModuleLoader.loadModules(bot)
    })
}