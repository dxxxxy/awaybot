import { Bot, createBot } from "@dxxxxy/mineflayer"
import { bot } from "../app.js"
import axios from "axios"
import { log } from "./utils.js"

export const start = (): Bot => {
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
                log(`awaybot[${bot.username}] - Switching to main mode.`, "yellow")
                // await import("../app.js")
                start()
            }
        } catch (err) {
            //somethings wrong... cant check
            clearInterval(retry) //program exits here
        }
    }, 20000)
}
