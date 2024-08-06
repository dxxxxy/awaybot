import { bot, pollers, states } from "../../util/botHandler.js"
import { visitIsland } from "../../util/hypixel.js"
import { checkSidebarItemsIncludeString, log } from "../../util/utils.js"
import { inSkyblock } from "./skyblock.js"

const visit = process.env.VISIT_NAME

export const inIsland = () => {
    return checkSidebarItemsIncludeString(visit ? visit : "Your Island")
}

bot.once("spawn", () => {
    pollers.island = setInterval(() => {
        if (inSkyblock()) {
            if (!inIsland()) visitIsland() //if you're not in private/visit island

            if (!inIsland() && states.inIsland) { //if you were in private/visit island and now you're not
                log(`Left ${visit ? `${visit}'s` : "Private"} Island`, "red")
                states.inIsland = false
            }

            if (inIsland() && !states.inIsland) { //if you were not in private/visit island and now you are
                log(`Joined ${visit ? `${visit}'s` : "Private"} Island`, "green")
                states.inIsland = true
            }
        }
    }, 5000)
})