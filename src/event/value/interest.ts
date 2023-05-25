//@ts-ignore
import { bot, stats } from "../../app.js"
import { interest } from "../../util/patterns.js"
import { log } from "../../util/utils.js"

//@ts-ignore
bot.on("chat:interest", (_, message: string) => {
    const amount = interest.exec(message)[1]
    stats.interest += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from interest`, "yellow")
})