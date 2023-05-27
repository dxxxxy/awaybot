//@ts-ignore
import { bot, stats } from "../../app.js"
import { log } from "../../util/utils.js"

//@ts-ignore
bot.on("chat:interest", (matches: String[]) => {
    const amount = matches[0]
    stats.interest += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from interest`, "yellow")
})