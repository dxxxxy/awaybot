import Stats, { IStats } from "./util/stats.js"
import { allowance, interest } from "./util/patterns.js"
import { start } from "./util/bot.js"

//setup
(await import("dotenv")).config()

//instances
export const stats: IStats = new Stats()
export const bot = start()

//patterns
bot.addChatPattern("allowance", allowance)
bot.addChatPattern("interest", interest)

//events
import("./event/index.js")