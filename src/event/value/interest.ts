//@ts-ignore
import { bot, stats } from "../../app.js"
import { interest } from "../../util/patterns.js"

//@ts-ignore
bot.on("chat:interest", (_, message: string) => {
    const coins = interest.exec(message)[1]
    stats.interest += parseInt(coins)
    console.log(`Got ${coins} coins from interest.`)
})