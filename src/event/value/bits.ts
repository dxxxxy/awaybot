import { bot, stats } from "../../app"
import { bits } from "../../util/patterns"

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
            console.log(`Got ${amount} bits.`)
        }
    }
})