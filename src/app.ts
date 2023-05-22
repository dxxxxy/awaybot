import { createBot } from "mineflayer"
import { appendFileSync } from "fs"

//setup
require("dotenv").config()
const stats = new(require("./stats.js"))()
const bot = createBot({
    host: "mc.hypixel.net",
    username: process.env.USERNAME,
    auth: "microsoft",
    version: "1.8.9"
})

//patterns
const allowance = /ALLOWANCE! You earned (.*) coins!/g
const interest = /You have just received (.*) coins as interest in your personal bank account!/g

//watch chat
bot.addChatPattern("allowance", allowance)
bot.addChatPattern("interest", interest)

bot.on("login", () => {
    console.log(`awaybot[${bot.username}] - Logged in.`)
})

bot.on("spawn", () => {
    if (!inSkyblock()) {
        //the command is inconsistent, this ensures it works
        const retryTimer = setInterval(() => {
            if (inSkyblock()) clearInterval(retryTimer)
            else bot.chat("/play sb")
        }, 5000)
    } else console.log("Already in Skyblock")
})

bot.on("scoreboardTitleChanged", (title) => {
    console.log(bot.scoreboard.list.items)
})

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})

const inSkyblock = () => {
    return bot.scoreboard.sidebar.name.includes("SBScoreboard")
}

//chat patterns
// @ts-ignore
bot.on("chat:allowance", (_, message: String) => {
    const coins = message.match(allowance)[1]
    stats.allowance += coins
    console.log(`Got ${coins} coins from allowance.`)
})

// @ts-ignore
bot.on("chat:interest", (_, message: String) => {
    const coins = message.match(interest)[1]
    stats.interest += coins
    console.log(`Got ${coins} coins from interest.`)
})