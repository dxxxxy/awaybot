import { Bot } from "mineflayer"
import { start } from "../../app.js"
import { waitForeverUntil } from "../../util/utils.js"

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    bot.on("kicked", async(reason, _) => {
        if (reason == "{\"extra\":[{\"color\":\"red\",\"text\":\"You logged in from another location!\"}],\"text\":\"\"}") {
            bot.log("User logged in -> Entering hibernation")
            bot.quit()

            //wait until player logs off to start the bot
            await waitForeverUntil(async() => {
                const online = await fetch(`https://api.hypixel.net/v2/status?uuid=${bot.uuid}`, {
                    headers: {
                        "API-Key": bot.apiKey
                    }
                }).then(res => res.json()).then(data => data.session.online).catch(err => console.log(err))

                return !online
            }, 10000)

            bot.log("User logged out -> Exiting hibernation")
            await start(bot.username, bot.uuid, bot.apiKey, bot.disabledModules)
        }
    })
}