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
const allowance = /ALLOWANCE! You earned (.*) coins!/
const interest = /You have just received (.*) coins as interest in your personal bank account!/
const bits = /\+(.*) Bits from Cookie Buff!/

//watch chat
bot.addChatPattern("allowance", allowance)
bot.addChatPattern("interest", interest)

bot.once("login", () => {
    console.log(`awaybot[${bot.username}] - Logged in.`)

    //state polling
    setInterval(() => { if (!inSkyblock()) bot.chat("/play sb") }, 5000)
    setInterval(() => { if (inSkyblock() && !inPrivateIsland()) bot.chat("/warp home") }, 5000)
})

bot.on("spawn", () => {
    if (inSkyblock()) console.log(`awaybot[${bot.username}] - In Skyblock.`)
    if (inPrivateIsland()) console.log(`awaybot[${bot.username}] - In Private Island.`)
})

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})

//bits get sent 4 times to remain longer in action bar
let bitsSent = 0

bot.on("actionBar", message => {
    let m;

    if ((m = bits.exec(message.toString())) !== null) {
        bitsSent++
        if (bitsSent == 4) {
            bitsSent = 0

            const amount = m[1]
            stats.bits += parseInt(amount)
            console.log(`Got ${amount} bits.`)
        }
    }
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
bot.on("chat:allowance", (_, message: string) => {
    const coins = bits.exec(message)[1]
    stats.allowance += Number.parseInt(coins)
    console.log(`Got ${coins} coins from allowance.`)
})

//@ts-ignore
bot.on("chat:interest", (_, message: string) => {
    const coins = message.match(interest)[1]
    stats.interest += Number.parseInt(coins)
    console.log(`Got ${coins} coins from interest.`)
})