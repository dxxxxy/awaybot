//@ts-ignore
import { bot, stats } from "../../app.js"
import { log } from "../../util/utils.js"

//@ts-ignore
bot.on("chat:allowance", (matches: String[]) => {
    const amount = matches[0]
    stats.allowance += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from allowance`, "yellow")
})