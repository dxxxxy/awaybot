import axios from "axios"
import { Bot, createBot } from "mineflayer"
import ora from "ora"
import { log, logMessage, waitForeverUntil } from "./utils.js"

export var bot: Bot = null
export const states = {
    inSkyblock: false,
    inIsland: false
}
export const pollers = {
    skyblock: null as NodeJS.Timer,
    island: null as NodeJS.Timer
}

export default class BotHandler {
    static start() {
        bot = createBot({
            host: "mc.hypixel.net",
            username: process.env.EMAIL,
            auth: "microsoft",
            version: "1.8.9"
        })

        bot.once("spawn", () => {
            log(`Logged in to hypixel as ${bot.username}`, "green")
        })
    }

    static stop() {
        //stop the bot
        bot.quit()

        //iterate over pollers and clear them if they are not null
        for (const poller in pollers) {
            if (pollers[poller]) {
                clearInterval(pollers[poller])
                pollers[poller] = null
            }
        }
    }

    static async hibernate() {
        this.stop()
        log(`Stopping bot`, "red")

        const spinner = ora({
            color: "magenta",
            spinner: "sand",
            text: logMessage(`Hibernating...`, "magenta")
        }).start()

        await waitForeverUntil(async () => {
            const res = await axios.get(`https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=${process.env.UUID}`)
            return !res.data.session.online
        }, 10000)

        spinner.succeed(logMessage(`User logged out`, "magenta"))

        log(`Restarting`, "magenta")
        process.exit(0) //force process to exit, pm2 will restart it
    }
}