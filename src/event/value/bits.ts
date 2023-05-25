import { bot, stats } from "../../app.js"
import { bits } from "../../util/patterns.js"
import { log } from "../../util/utils.js"

//bits get sent 4 times to remain longer in action bar
let bitsSent = 0

bot.on("actionBar", message => {
    let m;
    if ((m = bits.exec(message.toString())) != null) {
        bitsSent++
        if (bitsSent == 4) {
            bitsSent = 0

            //add bits
            const amount = m[1]
            stats.bits += parseInt(amount)
            log(`+${amount} bits`, "cyan")
        }
    }
})