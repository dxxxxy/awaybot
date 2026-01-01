import { Bot } from "mineflayer"
import SimpleChatTracker from "../simpleChatTracker.js"

const allowance = /ALLOWANCE! You earned (.*) coins!/

// noinspection JSUnusedGlobalSymbols
export default (bot: Bot) => new SimpleChatTracker("allowance", allowance, "coins").start(bot)