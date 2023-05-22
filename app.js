require("dotenv").config()

const mineflayer = require("mineflayer")

const bot = mineflayer.createBot({
    host: "mc.hypixel.net",
    username: process.env.USERNAME,
    auth: "microsoft",
    version: "1.8.9"
})

bot.on("spawn", () => {
    console.log(bot.scoreboard.sidebar.title)
})

bot.on("chat", (message) => {
    console.log(message)
})

bot.on("error", err => {
    console.log(err)
})