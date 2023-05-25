import { inPrivateIsland, inSkyblock, log } from "../../util/utils.js"
import { appendFileSync } from "fs"
import { bot } from "../../app.js"
import { hibernate } from "../../util/bot.js"

const lastState = {
    inSkyblock: false,
    inPrivateIsland: false
}

const timers = {
    inSkyblock: null as NodeJS.Timer,
    inPrivateIsland: null as NodeJS.Timer
}

bot.once("login", () => {
    log("Logged in", "magenta")

    //state polling
    timers.inSkyblock = setInterval(() => {
        if (!inSkyblock()) bot.chat("/play sb") //if you're not in skyblock

        if (!inSkyblock() && lastState.inSkyblock) { //if you were in skyblock and now you're not
            log(`Left Skyblock`, "red")
            lastState.inSkyblock = false
        }

        if (inSkyblock() && !lastState.inSkyblock) { //if you were not in skyblock and now you are
            log(`Joined Skyblock`, "green")
            lastState.inSkyblock = true
        }
    }, 5000)

    timers.inPrivateIsland = setInterval(() => {
        if (inSkyblock()) {
            if (!inPrivateIsland()) bot.chat("/warp home") //if you're not in private island

            if (!inPrivateIsland() && lastState.inPrivateIsland) { //if you were in private island and now you're not
                log(`Left Private Island`, "red")
                lastState.inPrivateIsland = false
            }

            if (inPrivateIsland() && !lastState.inPrivateIsland) { //if you were not in private island and now you are
                log(`Joined Private Island`, "green")
                lastState.inPrivateIsland = true
            }
        }
    }, 5000)
})

bot.on("kicked", (reason, _) => {
    if (reason == "{\"extra\":[{\"color\":\"red\",\"text\":\"You logged in from another location!\"}],\"text\":\"\"}") {
        log("Kicked for logging in from another location", "red")

        timers.inSkyblock && clearInterval(timers.inSkyblock)
        timers.inPrivateIsland && clearInterval(timers.inPrivateIsland)

        hibernate()
    }
})

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})