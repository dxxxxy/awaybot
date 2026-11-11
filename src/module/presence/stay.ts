import { Bot } from "mineflayer"
import State from "../../util/state.js"
import { generateRandomNumberBetweenInclusive, sleep } from "../../util/utils.js"

//shape of Hypixel's /locraw reply, e.g. {"server":"mini29DC","gametype":"SKYBLOCK","mode":"dynamic","map":"Private Island"}
interface Locraw {
    server?: string
    gametype?: string
    mode?: string
    map?: string
}

const parseLocraw = (message: string): Locraw | null => {
    if (!message.startsWith("{")) return null

    try {
        const parsed: unknown = JSON.parse(message)
        return typeof parsed === "object" && parsed !== null && "server" in parsed ? parsed as Locraw : null
    } catch {
        return null
    }
}

const locrawToState = (locraw: Locraw) => {
    //limbo (AFK kicks, failed transfers) only reports {"server":"limbo"}
    if (locraw.server === "limbo") return State.LIMBO
    if (locraw.gametype !== "SKYBLOCK") return State.HYPIXEL
    return locraw.map === "Private Island" ? State.ISLAND : State.SKYBLOCK
}

// noinspection JSUnusedGlobalSymbols
export default async (bot: Bot) => {
    bot.on("end", () => {
        bot.state = State.OFFLINE
    })

    //listen for poll result to determine where we are
    bot.on("message", (jsonMsg, position) => {
        if (position != "system") return

        //check for official /locraw poll messages
        const locraw = parseLocraw(jsonMsg.toString())
        if (!locraw) return

        //save past state for state changes
        const pastState = bot.state
        bot.state = locrawToState(locraw)

        //log state changes
        if (bot.state != pastState) {
            switch (bot.state) {
                case State.LIMBO:
                    bot.log("Entered Limbo")
                    break
                case State.HYPIXEL:
                    bot.log(`Entered Hypixel Lobby (${locraw.gametype ?? "unknown"})`)
                    break
                case State.SKYBLOCK:
                    bot.log(`Entered Skyblock (${locraw.map ?? "unknown"})`)
                    break
                case State.ISLAND:
                    bot.log("Entered Island")
                    break
            }
        }

        //attempt to enter skyblock/island if not already in
        if (bot.state == State.LIMBO) {
            bot.log("In Limbo -> Attempting to Enter Lobby")
            bot.chat("/lobby")
        } else if (bot.state == State.HYPIXEL) {
            bot.log("Not in Skyblock -> Attempting to Enter Skyblock")
            bot.chat("/play sb")
        } else if (bot.state == State.SKYBLOCK) {
            bot.log("Not in Island -> Attempting to Enter Island")
            bot.chat("/is")
        }
    })

    while (bot.state != State.OFFLINE) {
        //poll where we are
        bot.chat("/locraw")

        //humanize wait time
        //(wall-clock sleep instead of bot.waitForTicks: physics ticks pause while switching servers and stop on disconnect,
        //which made waitForTicks reject and crash the process with an unhandled rejection)
        await sleep(1000 * generateRandomNumberBetweenInclusive(4, 10))
    }
}
