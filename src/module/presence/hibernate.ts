import { Bot } from "mineflayer"
import BotHandler from "../../util/botHandler.js"
import { waitForeverUntil } from "../../util/utils.js"

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    bot.on("kicked", async(reason, _) => {
        if (reason == "{\"extra\":[{\"color\":\"red\",\"text\":\"You logged in from another location!\"}],\"text\":\"\"}") {
            bot.log("User logged in -> Entering hibernation")
            bot.quit()

            //wait until player logs off to start the bot
            await waitForeverUntil(async() => {
                const online = await fetch(`https://api.hypixel.net/v2/status?uuid=${process.env.UUID}`, {
                    headers: {
                        "API-Key": process.env.API_KEY
                    }
                }).then(res => res.json()).then(data => data.session.online)

                return !online
            }, 10000)

            bot.log("User logged out -> Exiting hibernation")
            BotHandler.start()
        }
    })
}