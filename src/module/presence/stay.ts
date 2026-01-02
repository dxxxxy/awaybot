import { Bot } from "mineflayer"
import State from "../../util/state.js"
import { generateRandomNumberBetweenInclusive } from "../../util/utils.js"

// noinspection JSUnusedGlobalSymbols
export default async(bot: Bot) => {
    bot.on("end", () => {
        bot.state = State.OFFLINE
    })

    // @ts-ignore
    while (bot.state != State.OFFLINE) {
        //save past state for state changes
        const pastState = bot.state

        //get primary visible scoreboard
        const scoreboard = Object.values(bot.scoreboard)[0]

        //compute current location
        const inSkyblock = scoreboard.name == "SBScoreboard"
        const inIsland = scoreboard.items.some(item => item.displayName.toString().includes("Your Isla"))

        //set states
        if (!inSkyblock && !inIsland) bot.state = State.HYPIXEL
        if (inSkyblock) bot.state = State.SKYBLOCK
        if (inIsland) bot.state = State.ISLAND

        //log state changes
        if (bot.state != pastState) {
            switch (bot.state) {
                case State.HYPIXEL:
                    bot.log("Entered Hypixel Lobby")
                    break
                case State.SKYBLOCK:
                    bot.log("Entered Skyblock")
                    break
                case State.ISLAND:
                    bot.log("Entered Island")
                    break
            }
        }

        //attempt to enter skyblock/island if not already in
        if (bot.state == State.HYPIXEL) {
            bot.log("Not in Skyblock -> Attempting to Enter Skyblock")
            bot.chat("/play sb")
        } else if (bot.state == State.SKYBLOCK) {
            bot.log("Not in Island -> Attempting to Enter Island")
            bot.chat("/is")
        }

        //humanize wait time
        await bot.waitForTicks(20 * generateRandomNumberBetweenInclusive(4, 10)) //wait between 4-10 seconds
    }
}