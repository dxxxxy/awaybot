import BotHandler, { bot } from "../../util/botHandler.js"
import { log } from "../../util/utils.js"

bot.on("kicked", (reason, _) => {
    if (reason == "{\"extra\":[{\"color\":\"red\",\"text\":\"You logged in from another location!\"}],\"text\":\"\"}") {
        log("Kicked for logging in from another location", "red")

        BotHandler.hibernate()
    }
})