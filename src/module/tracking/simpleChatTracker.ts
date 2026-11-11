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

        //mineflayer emits "chat:<name>" with the matched message strings, but its typings do not declare dynamic event names
        // @ts-expect-error
        bot.on(`chat:${this.name}`, (matches: string[]) => {
            //capture matching group only ([0] is entire matched string)
            const amount = this.pattern.exec(matches[0])?.[1]
            if (amount === undefined) return

            const parsed = parseInt(amount.replace(/,/g, ""))
            if (Number.isNaN(parsed)) return

            //update stat
            const total = StatManager.add(this.name, parsed)

            //log tracking
            bot.log(`+${amount} ${this.currency} from ${this.name} (total: ${total.toLocaleString()})`)
        })
    }
}
