import { Bot } from "mineflayer"
import State from "../../util/state.js"
import { generateRandomNumberBetweenInclusive } from "../../util/utils.js"

// noinspection JSUnusedGlobalSymbols
export default async(bot: Bot) => {
    bot.on("end", () => {
        bot.state = State.OFFLINE
    })

    //listen for poll result to determine where we are
    bot.on("message", (jsonMsg, position) => {
        if (position == "system") {
            if (jsonMsg.toString().includes("\"gametype\":\"SKYBLOCK\"")) {
                bot.state = State.SKYBLOCK

                if (jsonMsg.toString().includes("\"map\":\"Private Island\"")) {
                    bot.state = State.ISLAND
                }
            }
        }
    })

    while (bot.state != State.OFFLINE) {
        //poll where we are
        bot.chat("/locraw")

        //save past state for state changes
        const pastState = bot.state

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
        await bot.waitForTicks(20 * generateRandomNumberBetweenInclusive(4, 10))
    }
}