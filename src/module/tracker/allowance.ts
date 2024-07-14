import { bot } from "../../util/botHandler.js"
import { allowance } from "../../util/chatPatterns.js"
import StatManager from "../../util/statManager.js"
import { log } from "../../util/utils.js"

bot.addChatPattern("allowance", allowance)

//@ts-ignore
bot.on("chat:allowance", (matches: string[]) => {
    const amount = allowance.exec(matches[0])[1]
    StatManager.allowance += parseInt(amount.replace(/,/g, ""))
    log(`+${amount} coins from allowance`, "yellow")
})