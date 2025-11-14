import { createBot, ScoreBoard } from "mineflayer"

export default class BotHandler {
    static start = () => {
        const bot = createBot({
            host: "mc.hypixel.net",
            username: process.env.EMAIL,
            auth: "microsoft",
            version: "1.8.9"
        })

        bot.inSkyblock = false
        bot.inIsland = false

        bot.online = true
        bot.on("end", () => {
            bot.online = false
        })

        bot.log = (message: string) => {
            console.log(`[${new Date().toLocaleString()}] - awaybot(${bot.username}) - ${message}`)
        }

        bot.on("scoreboardTitleChanged", (scoreboard: ScoreBoard) => {
            //checks for a part of the string as emojis mess with the displayName (mineflayer or hypixel bug)
            const inIsland = scoreboard.items.some(item => item.displayName.toString().includes("Your Isla"))
            if (!bot.inIsland && inIsland) bot.log("Entered Island")
            if (bot.inIsland && !inIsland) bot.log("Left Island")
            bot.inIsland = inIsland

            const inSkyblock = scoreboard.name == "SBScoreboard"
            if (!bot.inSkyblock && inSkyblock) bot.log("Entered Skyblock")
            if (bot.inSkyblock && !inSkyblock) bot.log("Left Skyblock")
            bot.inSkyblock = inSkyblock
        })

        bot.once("spawn", async() => {
            bot.log("Logged in to Hypixel")

            //every five seconds, while bot is online, check if in skyblock and island
            while (bot.online) {
                while (!bot.inSkyblock) { //every five seconds, try to enter skyblock if not already in
                    bot.log("Not in Skyblock -> Attempting to enter Skyblock")
                    bot.chat("/play sb")
                    await bot.waitForTicks(20 * 5)
                }

                while (!bot.inIsland) { //every five seconds, try to enter island if not already in
                    bot.log("Not in Island -> Attempting to enter Island")
                    bot.chat("/is")
                    await bot.waitForTicks(20 * 5)
                }

                await bot.waitForTicks(20 * 5)
            }
        })

        console.log("[BotHandler] OK")
        return bot
    }
}