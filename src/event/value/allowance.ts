//@ts-ignore
import { bot, stats } from "../../app.js"
import { allowance } from "../../util/patterns.js"
import { log } from "../../util/utils.js"

//@ts-ignore
bot.on("chat:allowance", (_, message: string) => {
    const amount = allowance.exec(message)[1]
    stats.allowance += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from allowance`, "yellow")
})