import { bot } from "../app.js"
import chalk from "chalk"

export const inSkyblock = () => {
    return bot.scoreboard.sidebar.name.includes("SBScoreboard")
}

export const inPrivateIsland = () => {
    //cleaning weird emojis for some reason, possibly a bug with mineflayer
    return bot.scoreboard.sidebar.items.map(item => item.displayName).join("\n").replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").includes("Your Island")
}

export const log = (message: string, color: string = "white") => console.log(chalk[color](message))