import chalk from "chalk"
import { bot } from "./botHandler.js"

export const log = (message: string, color: string = "white") => {
    console.log(`[${new Date(Date.now()).toLocaleString()}] - awaybot(${bot.username}) - ${chalk[color](message)}`)
}

export const logMessage = (message: string, color: string = "white") => {
    return `[${new Date(Date.now()).toLocaleString()}] - awaybot(${bot.username}) - ${chalk[color](message)}`
}

export const debug = (message: string) => {
    console.log(`[${new Date(Date.now()).toLocaleString()}] - awaybot - ${chalk.gray(message)}`)
}

export const debugMessage = (message: string): string => {
    return `[${new Date(Date.now()).toLocaleString()}] - awaybot - ${chalk.gray(message)}`
}

export const checkSidebarItemsIncludeString = (string: string) => {
    //clean weird emojis for some reason, possibly a bug with mineflayer
    return bot.scoreboard.sidebar.items.map(item => item.displayName).join("\n").replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").includes(string)
}

export const waitForeverUntil = (condition: () => Promise<boolean>, interval: number = 100): Promise<void> => {
    return new Promise(resolve => {
        const poller = setInterval(async () => {
            if (await condition()) {
                clearInterval(poller)
                resolve()
            }
        }, interval)
    })
}