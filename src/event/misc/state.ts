import { inPrivateIsland, inSkyblock } from "../../util/utils"
import { appendFileSync } from "fs"
import { bot } from "../../app"

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

bot.on("spawn", () => {
    if (inSkyblock()) console.log(`awaybot[${bot.username}] - In Skyblock.`)
    if (inPrivateIsland()) console.log(`awaybot[${bot.username}] - In Private Island.`)
})

//logging
bot.on("error", err => {
    appendFileSync("error.log", `${new Date(Date.now()).toLocaleTimeString()} - ${err}`)
})