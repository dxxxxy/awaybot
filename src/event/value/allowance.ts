//@ts-ignore
import { bot, stats } from "../../app.js"
import { log } from "../../util/utils.js"
import { allowance } from "../../util/patterns.js"

//@ts-ignore
bot.on("chat:allowance", (matches: string[]) => {
    const amount = allowance.exec(matches[0])[1]
    stats.allowance += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from allowance`, "yellow")
})