import { Bot } from "mineflayer"
import { start } from "../../bot.js"
import { isLoggedInElsewhereKick, waitForeverUntil } from "../../util/utils.js"

//resolves to whether the player is online, or an error description if it could not be determined
const isPlayerOnline = async (uuid: string, apiKey: string): Promise<boolean | string> => {
    try {
        const res = await fetch(`https://api.hypixel.net/v2/status?uuid=${uuid}`, {
            headers: {
                "API-Key": apiKey
            }
        })
        const data = await res.json() as { success?: boolean, cause?: string, session?: { online?: boolean } }

        if (!res.ok || !data.success || typeof data.session?.online !== "boolean") {
            return `Unexpected Hypixel API response (${res.status}): ${data.cause ?? "unknown cause"}`
        }

        return data.session.online
    } catch (err) {
        return `Failed to query Hypixel API: ${err instanceof Error ? err.message : err}`
    }
}

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    if (!bot.apiKey) {
        bot.log("Hibernate is enabled but no apiKey is configured -> It will not be able to tell when the user logs out")
    }

    bot.on("kicked", async (reason) => {
        //look for this specifically (servers do not have a standard way of delivering kick/ban messages)
        //(bot.ts skips its automatic reconnect for this kick, so hibernate is in charge of bringing the bot back)
        if (!isLoggedInElsewhereKick(reason)) return

        bot.log("User logged in -> Entering hibernation")

        //wait until player logs off to start the bot (an unknown status keeps hibernating, so we never kick the user)
        //(the same error is only logged once instead of every poll)
        let lastError: string | null = null
        await waitForeverUntil(async () => {
            const online = await isPlayerOnline(bot.uuid, bot.apiKey)

            if (typeof online === "string") {
                if (online !== lastError) bot.log(`Hibernate: ${online} -> Still hibernating, retrying every 10s`)
                lastError = online
                return false
            }

            if (lastError !== null) bot.log("Hibernate: Hypixel API reachable again")
            lastError = null
            return !online
        }, 10000)

        bot.log("User logged out -> Exiting hibernation")
        start(bot.index, { email: bot.email, uuid: bot.uuid, apiKey: bot.apiKey, disabledModules: bot.disabledModules })
    })
}
