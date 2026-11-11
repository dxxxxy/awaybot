import { Bot } from "mineflayer"
import { start } from "../../bot.js"
import { waitForeverUntil } from "../../util/utils.js"

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    bot.on("kicked", async(reason, _) => {
        //look for this specifically (servers do not have a standard way of delivering kick/ban messages)
        if (reason == "{\"extra\":[{\"color\":\"red\",\"text\":\"You logged in from another location!\"}],\"text\":\"\"}") {
            bot.log("User logged in -> Entering hibernation")
            bot.quit()

            //wait until player logs off to start the bot
            await waitForeverUntil(async() => {
                const online = await fetch(`https://api.hypixel.net/v2/status?uuid=${bot.uuid}`, {
                    headers: {
                        "API-Key": bot.apiKey
                    }
                }).then(res => res.json() as Promise<{ session: { online: boolean } }>).then(data => data.session.online).catch(err => console.log(err))

                return !online
            }, 10000)

            bot.log("User logged out -> Exiting hibernation")
            start(bot.index, { email: bot.email, uuid: bot.uuid, apiKey: bot.apiKey, disabledModules: bot.disabledModules })
        }
    })
}