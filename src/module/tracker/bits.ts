import { bot } from "../../util/botHandler.js"
import { bits } from "../../util/chatPatterns.js"
import StatManager from "../../util/statManager.js"
import { log } from "../../util/utils.js"

//track amount of message as bits get sent 4 times to remain longer in action bar
let bitsSent = 0

bot.on("actionBar", message => {
    let m: string[] | null
    if ((m = bits.exec(message.toString())) != null) {
        bitsSent++

        if (bitsSent == 4) {
            bitsSent = 0

            //add bits
            const amount = m[1]
            StatManager.bits += parseInt(amount)
            log(`+${amount} bits`, "cyan")
        }
    }
})