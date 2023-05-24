import { createBot } from "@dxxxxy/mineflayer"
import { bot } from "../app.js"
import axios from "axios"
import { log } from "./utils.js"

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

export const background = () => {
    stop()

    const retry = setInterval(async() => {
        try {
            const res = await axios.get(`https://api.hypixel.net/status?key=${process.env.API_KEY}&uuid=${process.env.UUID}`)

            if (!res.data.session.online) {
                clearInterval(retry)
                log(`awaybot[${bot.username}] - Restarting.`, "yellow")
                process.exit(0) //force process to exit, pm2 will restart it
            }
        } catch (err) {
            //somethings wrong... cant check
            log(`awaybot[${bot.username}] - Can't check session, cannot restart.`, "red")
        }
    }, 20000)
}
