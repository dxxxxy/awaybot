import { bot, pollers, states } from "../../util/botHandler.js"
import { visitIsland } from "../../util/hypixel.js"
import { log } from "../../util/utils.js"

export const inSkyblock = () => {
    return bot.scoreboard.sidebar.name.includes("SBScoreboard")
}

bot.once("spawn", () => {
    pollers.skyblock = setInterval(() => {
        if (!inSkyblock()) bot.chat("/play sb") //if you're not in skyblock

        if (!inSkyblock() && states.inSkyblock) { //if you were in skyblock and now you're not
            log(`Left Skyblock`, "red")
            states.inSkyblock = false
        }

        if (inSkyblock() && !states.inSkyblock) { //if you were not in skyblock and now you are
            log(`Joined Skyblock`, "green")
            states.inSkyblock = true
            visitIsland()
        }
    }, 5000)
})