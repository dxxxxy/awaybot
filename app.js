require("dotenv").config()

const mineflayer = require("mineflayer")
const fs = require("fs")

const bot = mineflayer.createBot({
    host: "mc.hypixel.net",
    username: process.env.USERNAME,
    auth: "microsoft",
    version: "1.8.9"
})

bot.once("login", () => {
    console.log(`awaybot[${bot.username}] - Logged in.`)

    //add chat patterns
    bot.addChatPattern("allowance", /ALLOWANCE! You earned (.*) coins!/g)
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
    // console.log(title)
    console.log(bot.scoreboard.sidebar.name)
    console.log(inSkyblock())
})

//logging
bot.on("error", err => {
    fs.appendFile("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`, (err) => {
        if (err) console.log(err)
    })
})

const inSkyblock = () => {
    return bot.scoreboard.sidebar.name.includes("SBScoreboard")
}

//chat patterns
bot.on("chat:allowance", (username, message) => {
    console.log(message)
})