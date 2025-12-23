import { Bot } from "mineflayer"
import SimpleChatTracker from "../../util/simpleChatTracker.js"

const interest = /You have just received (.*) coins as interest in your .*/

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => new SimpleChatTracker("interest", interest, "coins").start(bot)