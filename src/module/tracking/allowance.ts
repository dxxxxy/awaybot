import { Bot } from "mineflayer"
import StatManager from "../../util/statManager.js"

const allowance = /ALLOWANCE! You earned (.*) coins!/

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    bot.addChatPattern("allowance", allowance)

    // @ts-ignore
    bot.on("chat:allowance", (matches: string[]) => {
        const amount = allowance.exec(matches[0])[1]
        StatManager.allowance += parseInt(amount.replace(/,/g, ""))
        bot.log(`+${amount} coins from allowance`)
    })
}