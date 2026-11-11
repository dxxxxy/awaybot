import { Bot } from "mineflayer"
import { start } from "../../bot.js"
import { waitForeverUntil } from "../../util/utils.js"

const LOGGED_IN_ELSEWHERE = "You logged in from another location!"

//the kick reason is typed as string, but it is a JSON chat string on old protocols and an NBT chat component object since 1.20.3
const kickReasonToString = (reason: unknown) => typeof reason === "string" ? reason : JSON.stringify(reason)

//resolves to whether the player is online, or null if it could not be determined
const isPlayerOnline = async (uuid: string, apiKey: string): Promise<boolean | null> => {
    try {
        const res = await fetch(`https://api.hypixel.net/v2/status?uuid=${uuid}`, {
            headers: {
                "API-Key": apiKey
            }
        })
        const data = await res.json() as { success?: boolean, cause?: string, session?: { online?: boolean } }

        if (!res.ok || !data.success || typeof data.session?.online !== "boolean") {
            console.log(`[Hibernate] Unexpected Hypixel API response (${res.status}): ${data.cause ?? "unknown cause"}`)
            return null
        }

        return data.session.online
    } catch (err) {
        console.log("[Hibernate] Failed to query Hypixel API:", err)
        return null
    }
}

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    if (!bot.apiKey) {
        bot.log("Hibernate is enabled but no apiKey is configured -> It will not be able to tell when the user logs out")
    }

    bot.on("kicked", async (reason) => {
        //look for this specifically (servers do not have a standard way of delivering kick/ban messages)
        if (!kickReasonToString(reason).includes(LOGGED_IN_ELSEWHERE)) return

        bot.log("User logged in -> Entering hibernation")

        //wait until player logs off to start the bot (an unknown status keeps hibernating, so we never kick the user)
        await waitForeverUntil(async () => await isPlayerOnline(bot.uuid, bot.apiKey) === false, 10000)

        bot.log("User logged out -> Exiting hibernation")
        start(bot.index, { email: bot.email, uuid: bot.uuid, apiKey: bot.apiKey, disabledModules: bot.disabledModules })
    })
}
