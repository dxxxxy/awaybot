import { inPrivateIsland, inSkyblock, log } from "../../util/utils.js"
import { appendFileSync } from "fs"
import { bot } from "../../app.js"
import { background } from "../../util/bot.js"

const lastState = {
    inSkyblock: false,
    inPrivateIsland: false
}

bot.once("login", () => {
    console.log(`awaybot[${bot.username}] - Logged in.`)

    //state polling
    setInterval(() => {
        if (!inSkyblock()) bot.chat("/play sb") //if you're not in skyblock

        if (!inSkyblock() && lastState.inSkyblock) { //if you were in skyblock and now you're not
            console.log(`awaybot[${bot.username}] - Out Skyblock.`)
            lastState.inSkyblock = false
        }

        if (inSkyblock() && !lastState.inSkyblock) { //if you were not in skyblock and now you are
            console.log(`awaybot[${bot.username}] - In Skyblock.`)
            lastState.inSkyblock = true
        }
    }, 5000)

    setInterval(() => {
        if (inSkyblock()) {
            if (!inPrivateIsland()) bot.chat("/warp home") //if you're not in private island

            if (!inPrivateIsland() && lastState.inPrivateIsland) { //if you were in private island and now you're not
                console.log(`awaybot[${bot.username}] - Out Private Island.`)
                lastState.inPrivateIsland = false
            }

            if (inPrivateIsland() && !lastState.inPrivateIsland) { //if you were not in private island and now you are
                console.log(`awaybot[${bot.username}] - In Private Island.`)
                lastState.inPrivateIsland = true
            }
        }
    }, 5000)
})

bot.on("kicked", (reason, _) => {
    if (reason == "{\"extra\":[{\"color\":\"red\",\"text\":\"You logged in from another location!\"}],\"text\":\"\"}") {
        log(`awaybot[${bot.username}] - Someone logged in.`, "red")
        log(`awaybot[${bot.username}] - Switching to copilot mode.`, "yellow")

        background()
    }
})

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})