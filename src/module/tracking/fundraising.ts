import { Bot } from "mineflayer"
import SimpleChatTracker from "../../util/simpleChatTracker.js"

const fundraising = /UNIVERSAL INCOME: You gained (.*) Coins\./

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => new SimpleChatTracker("fundraising", fundraising, "coins").start(bot)