import "dotenv/config"

import StatManager from "./util/statManager.js"
StatManager.init()

import BotHandler from "./util/botHandler.js"
const bot = BotHandler.start()

import ModuleLoader from "./util/moduleLoader.js"
bot.once("spawn", async() => {
    await ModuleLoader.loadModules(bot)
})