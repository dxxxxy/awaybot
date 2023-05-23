import { createBot } from "@dxxxxy/mineflayer"
import Stats, { IStats } from "./util/stats"
import { allowance, interest } from "./util/patterns"

//setup
require("dotenv").config()

//instances
export const stats: IStats = new Stats()
export const bot = createBot({
    host: "mc.hypixel.net",
    username: process.env.USERNAME,
    auth: "microsoft",
    version: "1.8.9"
})

//patterns
bot.addChatPattern("allowance", allowance)
bot.addChatPattern("interest", interest)

//events
require("./event/index")