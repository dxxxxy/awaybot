import { createBot } from "@dxxxxy/mineflayer"
import { appendFileSync } from "fs"
import Stats, { IStats } from "./stats"

//setup
require("dotenv").config()
const stats: IStats = new Stats()
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

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})

const inSkyblock = () => {
    return bot.scoreboard.sidebar.name.includes("SBScoreboard")
}

const inPrivateIsland = () => {
    return bot.scoreboard.sidebar.items.map(item => item.displayName).join("\n").replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").includes("Your Island")
}

//chat patterns
// @ts-ignore
bot.on("chat:allowance", (_, message: String) => {
    const coins = message.match(allowance)[1]
    stats.allowance += Number.parseInt(coins)
    console.log(`Got ${coins} coins from allowance.`)
})

// @ts-ignore
bot.on("chat:interest", (_, message: String) => {
    const coins = message.match(interest)[1]
    stats.interest += Number.parseInt(coins)
    console.log(`Got ${coins} coins from interest.`)
})