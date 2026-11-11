import { Bot } from "mineflayer"
import StatManager from "../../../util/statManager.js"

const bits = /\+(.*) Bits from Cookie Buff!/

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    StatManager.register("bits")

    //track amount of message as bits get sent 4 times (to remain longer in action bar)
    let bitsSent = 0

    bot.on("actionBar", message => {
        const m = bits.exec(message.toString())
        if (m == null) return

        bitsSent++

        if (bitsSent == 4) {
            bitsSent = 0

            const amount = m[1]
            const parsed = parseInt(amount.replace(/,/g, ""))
            if (Number.isNaN(parsed)) return

            const total = StatManager.add("bits", parsed)
            bot.log(`+${amount} bits (total: ${total.toLocaleString()})`)
        }
    })
}