import { Bot } from "mineflayer"
import StatManager from "../../util/statManager.js"

const interest = /You have just received (.*) coins as bank interest!/

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    bot.addChatPattern("interest", interest)

    //@ts-ignore
    bot.on("chat:interest", (matches: string[]) => {
        const amount = interest.exec(matches[0])[1]
        StatManager.interest += parseInt(amount.replace(/,/g, ""))
        bot.log(`+${amount} coins from interest`)
    })
}