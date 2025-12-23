import { Bot } from "mineflayer"
import StatManager from "./statManager.js"

export default class SimpleChatTracker {
    name: string
    pattern: RegExp
    currency: string

    constructor(name: string, pattern: RegExp, currency: string) {
        this.name = name
        this.pattern = pattern
        this.currency = currency
    }

    start(bot: Bot) {
        StatManager.register(this.name)

        bot.addChatPattern(this.name, this.pattern)

        // @ts-ignore
        bot.on(`chat:${this.pattern}`, (matches: string[]) => {
            const amount = this.pattern.exec(matches[0])[1]
            StatManager[this.name] += parseInt(amount.replace(/,/g, ""))
            bot.log(`+${amount} ${this.currency} from ${this.name} (total: ${StatManager[this.name]})`)
        })
    }
}