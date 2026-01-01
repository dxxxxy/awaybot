import { Bot } from "mineflayer"
import StatManager from "../../util/statManager.js"

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
        //register stat
        StatManager.register(this.name)

        //add chat pattern
        bot.addChatPattern(this.name, this.pattern)

        // @ts-ignore
        bot.on(`chat:${this.name}`, (matches: string[]) => {
            //capture matching group only ([0] is entire matched string)
            const amount = this.pattern.exec(matches[0])[1]

            //update stat
            StatManager[this.name] += parseInt(amount.replace(/,/g, ""))

            //log tracking
            bot.log(`+${amount} ${this.currency} from ${this.name} (total: ${StatManager[this.name].toLocaleString()})`)
        })
    }
}