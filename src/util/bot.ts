import { createBot } from "@dxxxxy/mineflayer"
import { bot } from "../app.js"
import axios from "axios"
import { log } from "./utils.js"
import ora from "ora"
import chalk from "chalk"

export const start = () => {
    return createBot({
        host: "mc.hypixel.net",
        username: process.env.EMAIL,
        auth: "microsoft",
        version: "1.8.9"
    })
}

export const stop = () => {
    bot.quit()
}

export const hibernate = () => {
    stop()
    log(`Going into hibernation`, "magenta")

    const spinner = ora({
        color: "magenta",
        spinner: "arc",
        text: chalk.magenta(`Sleeping...`)
    }).start()

    const retry = setInterval(async() => {
        try {
            const res = await axios.get(`https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=${process.env.UUID}`)

            if (!res.data.session.online) {
                spinner.stop()
                clearInterval(retry)

                log(`User logged out`, "magenta")
                log(`Restarting`, "magenta")

                process.exit(0) //force process to exit, pm2 will restart it
            }
        } catch (err) {
            //somethings wrong... cant check
            log(`Can't check session, cannot restart`, "red")
        }
    }, 20000)
}
