import { Bot } from "mineflayer"
import StatManager from "../../util/statManager.js"

const bits = /\+(.*) Bits from Cookie Buff!/

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => {
    StatManager.register("bits")

    //track amount of message as bits get sent 4 times (to remain longer in action bar)
    let bitsSent = 0

    bot.on("actionBar", message => {
        let m: string[] | null
        if ((m = bits.exec(message.toString())) != null) {
            bitsSent++

            if (bitsSent == 4) {
                bitsSent = 0

                const amount = m[1].replace(",", "")
                StatManager["bits"] += parseInt(amount.replace(/,/g, ""))
                bot.log(`+${amount} bits (total: ${StatManager["bits"]})`)
            }
        }
    })
}