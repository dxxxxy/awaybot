import { bot } from "../../util/botHandler.js"
import { interest } from "../../util/chatPatterns.js"
import StatManager from "../../util/statManager.js"
import { log } from "../../util/utils.js"

bot.addChatPattern("interest", interest)

//@ts-ignore
bot.on("chat:interest", (matches: string[]) => {
    const amount = interest.exec(matches[0])[1]
    StatManager.interest += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from interest`, "yellow")
})