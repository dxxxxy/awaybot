//@ts-ignore
import { bot, stats } from "../../app"
import { allowance } from "../../util/patterns"

//@ts-ignore
bot.on("chat:allowance", (_, message: string) => {
    const coins = allowance.exec(message)[1]
    stats.allowance += parseInt(coins)
    console.log(`Got ${coins} coins from allowance.`)
})