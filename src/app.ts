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

bot.once("spawn", () => {
    console.log(`awaybot[${bot.username}] - Spawned.`)
    warpToSkyblock()
    warpToIsland()
})

const warpToSkyblock = () => {
    if (!inSkyblock()) {
        //the command is inconsistent, this ensures it works
        const retryTimer = setInterval(() => {
            if (inSkyblock()) {
                console.log("Joined skyblock.")
                clearInterval(retryTimer)
            }
            else bot.chat("/play sb")
        }, 5000)
    }
}

const warpToIsland = () => {
    if (!inPrivateIsland()) {
        //the command is inconsistent, this ensures it works
        const retryTimer = setInterval(() => {
            if (!inSkyblock()) return

            if (inPrivateIsland()) {
                console.log("Teleported to private island.")
                clearInterval(retryTimer)
            }
            else bot.chat("/warp home")
        }, 5000)
    }
}

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})

bot.on("actionBar", message => {
    console.log(message)
})

const inSkyblock = () => {
    return bot.scoreboard.sidebar.name.includes("SBScoreboard")
}

const inPrivateIsland = () => {
    //weird emojis for some reason, possibly a bug with mineflayer
    return bot.scoreboard.sidebar.items.map(item => item.displayName).join("\n").replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").includes("Your Island")
}

//chat patterns
//@ts-ignore
bot.on("chat:allowance", (_, message: String) => {
    const coins = message.match(allowance)[1]
    stats.allowance += Number.parseInt(coins)
    console.log(`Got ${coins} coins from allowance.`)
})

//@ts-ignore
bot.on("chat:interest", (_, message: String) => {
    const coins = message.match(interest)[1]
    stats.interest += Number.parseInt(coins)
    console.log(`Got ${coins} coins from interest.`)
})