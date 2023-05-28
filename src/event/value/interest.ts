//@ts-ignore
import { bot, stats } from "../../app.js"
import { log } from "../../util/utils.js"
import { interest } from "../../util/patterns.js"

//@ts-ignore
bot.on("chat:interest", (matches: string[]) => {
    const amount = interest.exec(matches[0])[1]
    stats.interest += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from interest`, "yellow")
})